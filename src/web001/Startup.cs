using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;
using NLog.Extensions.Logging;
using NLog.Web;
using Shengwen.DistributedLock;
using Shengwen.Primary;
using Shengwen.Scheduler;
using Shengwen.QueueTask;
using System;
using System.IO;
using WebApp.Data;
using WebApp.Services;
using WebApp.Services.Menu;

namespace WebApp
{
    public class Startup
    {
        private ILogger<Startup> _logger;

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }       

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //add MadelsonDistributedLock           
            services.AddMadelsonDistributedLock();
            services.Configure<MadelsonDistributedLockOption>(Configuration.GetSection("DistributedLock"));

            //add primaryService
            services.AddPrimaryService(options => {
                options.UseDbContext<ApplicationDbContext>();
            });
            services.Configure<PrimaryConfig>(Configuration.GetSection("Primary"));

            //add Scheduler Service
            services.AddSchedulerService(options =>
            {
                options.UseDbContext<ApplicationDbContext>();

                options.UsePrimaryProvider<PrimaryProvider>();

                options.AddJob<DatabaseRecycleTask>()
                    .HasTitle("資料庫資源回收")
                    .AddEveryHour(6, 10)
                    ;                              
            });

            services.Configure<SchedulerOptions>(Configuration.GetSection("Scheduler"));

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            // Add framework services.
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"), x => x.MigrationsHistoryTable("__EFMigrationsHistory", "web001"))
                //options.UseSqlCe(Configuration.GetConnectionString("ApplicationDB"))               
                );

            services.AddIdentity<ApplicationUser, AppRole>(
                x => {
                    // 設定使用者名稱的驗證邏輯
                    x.User = new UserOptions
                    {
                        RequireUniqueEmail = true,
                    };

                    //Email驗證要求
                    x.SignIn = new SignInOptions
                    {
                        RequireConfirmedEmail = true,
                        RequireConfirmedPhoneNumber = false,
                    };

                    // 設定密碼的驗證邏輯
                    x.Password =
                        new PasswordOptions
                        {
                            RequiredLength = 6,
                            RequireNonAlphanumeric = false,
                            RequireDigit = false,
                            RequireLowercase = false,
                            RequireUppercase = false,
                        };

                    // 設定使用者鎖定詳細資料
                    x.Lockout = new LockoutOptions
                    {
                        AllowedForNewUsers = true,
                        DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5),
                        MaxFailedAccessAttempts = 5,
                    };
                }
            )
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders()
            ;

            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
                //Json序列化時不會開頭變小寫
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.DateFormatHandling = Newtonsoft.Json.DateFormatHandling.IsoDateFormat;
                    options.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Unspecified;
                    options.SerializerSettings.ContractResolver = new DefaultContractResolver();

                });

            // Add application services.
            services.Configure<SendGridConfig>(Configuration.GetSection("SendGrid"));
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();

            //custom service
            {
                //Basic
                {
                    services.AddTransient<DatabaseUpgrade>();

                    services.Configure<QueryPagerSetting>(Configuration.GetSection("QueryPager"));

                    services.Configure<FolderOption>(Configuration.GetSection("Folder"));                  

                    services.Configure<AppInfoSetting>(Configuration.GetSection("AppInfo"));

                    services.Configure<MenuServiceSetting>(Configuration.GetSection("MainMenu"));

                    services.Configure<ReCAPTCHASetting>(Configuration.GetSection("ReCAPTCHA"));                   

                    services.AddSingleton<QueryPagerService>();

                    services.AddSingleton<FolderService>();                 

                    services.AddSingleton<MenuService>();

                    services.AddSingleton<IAuthorizationHandler, MenuAuthHandler>();

                    services.AddTransient<StorageService>();
                }

                //註冊服務                
                services.AddQueueContext<DefaultQueueContext>(opt => {
                    opt.UseDbContext<ApplicationDbContext>()
                    ;
                });                               

                //task notify service
                {
                    services.AddOptions<TaskNotifySetting>();               
                    services.AddSingleton<TaskNotifyService>();
                }

                //id's encode and decode for user                
                services.Configure<IdEncodeConfig>(Configuration.GetSection("IdEncode"));
                services.AddTransient<IdEncodeService>();               
            }

            //自動將功能表的權限註冊 Authorize's Policy
            {
                //find all of auth code
                var msetting = Configuration.GetSection("MainMenu").Get<MenuServiceSetting>();
                var auths = msetting.FindAllAuthCodes();

                //register policy
                services.AddAuthorization(options =>
                {
                    foreach (var x in auths)
                    {
                        options.AddPolicy(x,
                           policy => policy.Requirements.Add(new MenuAuthRequirement(x)));
                    }
                });
            }

            //google 
            services.AddAuthentication().AddGoogle(googleOptions =>
            {
                googleOptions.ClientId = Configuration["Authentication:Google:AppId"];
                googleOptions.ClientSecret = Configuration["Authentication:Google:AppSecret"];
            });

            //log config
            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.AddConfiguration(Configuration.GetSection("Logging"));
                loggingBuilder.AddConsole();
                loggingBuilder.AddDebug();
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IApplicationLifetime applicationLifetime)
        {
            //add NLog to ASP.NET Core
            Environment.SetEnvironmentVariable("NLOG_FOLDER", env.ContentRootPath);
            NLog.LogManager.LoadConfiguration(Path.Combine(env.ContentRootPath, "./nlog.config"));
            loggerFactory
                .AddNLog()
                ;

            //Create WebApplication Log
            {
                _logger = loggerFactory.CreateLogger<Startup>();

                applicationLifetime.ApplicationStopping.Register(this.Stopping);
                applicationLifetime.ApplicationStarted.Register(() => this.Started(app.ApplicationServices));
            }

            {
                var a = app.ApplicationServices.GetService<ApplicationDbContext>();
            }

            //make sure database Migrate ready
            using (var scope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>()
                .CreateScope())
            {
                try
                {
                    var ctx = scope.ServiceProvider.GetService<ApplicationDbContext>();
                    ctx.Database.Migrate();

                    var dbu = scope.ServiceProvider.GetService<DatabaseUpgrade>();
                    dbu.Upgrade().GetAwaiter().GetResult();
                }
                catch (Exception ex)
                {
                    _logger.LogCritical($"Database Migrate Exception = {ex}");
                }
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
                //app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            // Add new mappings`enter code here`
            var provider = new FileExtensionContentTypeProvider();         
            provider.Mappings[".ts"] = "application/x-typescript";
            app.UseStaticFiles(new StaticFileOptions()
            {
                ContentTypeProvider = provider
            });

            //show typescrit source for debug
            if (env.IsDevelopment())
            {
                app.Use(async (context, next) =>
                {
                    if (context.Request.Path.Value.EndsWith(".ts"))
                    {
                        var file = Path.Combine(env.ContentRootPath, "." + context.Request.Path.Value);
                        await context.Response.SendFileAsync(file);
                    }
                    else
                        await next.Invoke();                  
                });
            }

            //add queue task
            app.UseQueueContext<DefaultQueueContext>();

            app.UseCookiePolicy();
            app.UseAuthentication()
                ;

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });            

            //auto start service           
            {
                using (var scope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>()
                .CreateScope())
                {
                    StartSevice<PrimaryService>(scope);                  

                    StartSevice<QueryPagerService>(scope);

                    StartSevice<FolderService>(scope);

                    StartSevice<SchedulerService>(scope);
                }
            }
        }

        /// <summary>
        /// 服務起始
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="scope"></param>
        /// <param name="initAction"></param>
        private void StartSevice<T>(IServiceScope scope, Action<T> initAction = null)
        {
            try
            {
                _logger.LogInformation($"Start Service {typeof(T).Name}");
                var srv = scope.ServiceProvider.GetService<T>();
                initAction?.Invoke(srv);
            }
            catch (Exception ex)
            {
                _logger.LogCritical($"Service {typeof(T).Name} Exception={ex}");

            }
        }

        /// <summary>
        /// 網站啟動事件
        /// </summary>
        private void Started(IServiceProvider services)
        {
            _logger?.LogInformation($"Web Started {AppDomain.CurrentDomain.FriendlyName}");

        }

        /// <summary>
        /// 網站停止事件
        /// </summary>
        private void Stopping()
        {
            _logger?.LogInformation($"Web Stopping {AppDomain.CurrentDomain.FriendlyName}");
        }
    }
}
