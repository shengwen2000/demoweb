using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebApp.Job;
using WebApp.Services;

namespace WebApp
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var host = new HostBuilder()
              
             //.UseContentRoot("C:\\001")
             .ConfigureAppConfiguration((ctx, builder) =>
             {
                 //自動產生設定檔                                 
                 builder.AddJsonFile("appsettings.json", false);
                 builder.AddJsonFile($"appsettings.{ctx.HostingEnvironment.EnvironmentName}.json", true);

                
             })
             //使用與Asp.net core 相同的 scope規定
            .UseServiceProviderFactory(new DefaultServiceProviderFactory(new ServiceProviderOptions() { ValidateScopes = true }))

            .ConfigureServices((ctx, services) =>
            {
                services.Configure<FdServerConfig>(ctx.Configuration.GetSection("FtpDeploy"));
                //services.Configure<FdServerConfig>(x => x.IsDisableUpload = true);

                services.AddTransient<FdCleanJob>();     
                
                services.AddScoped<FdNewJob>(); 
                
                services.AddSingleton<FdConsole>();

                services.AddSingleton<TimeService>();

                services.Configure<ConsoleLifetimeOptions>(x => { x.SuppressStatusMessages = true; });
            })
            
            .Build()
            ;

            //
            using (host)
            {
                await host.StartAsync();

                var srvprovider = host.Services.GetService<IServiceProvider>();

                //singleton
                var app = srvprovider.GetService<FdConsole>();
                var app2 = srvprovider.GetService<FdConsole>();
                var thesame = app == app2;

                //test scope
                {
                    try
                    {
                        var a = srvprovider.GetService<FdNewJob>();
                    }
                    catch(Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }                    

                    //必須創建Scope才能取得資料
                    var scopef = srvprovider.GetRequiredService<IServiceScopeFactory>();
                    using (var scope = scopef.CreateScope())
                    {
                        var c = scope.ServiceProvider.GetService<FdNewJob>();                      

                        using (var scope2 = scopef.CreateScope())
                        {
                            var d = scope2.ServiceProvider.GetService<FdNewJob>();
                            var ok3 = c == d; //false
                        }
                    }
                }

                {
                    var srv = host.Services.GetRequiredService<TimeService>();
                }

                {
                    var a1 = srvprovider.GetService<IServiceScopeFactory>();
                    var a2 = a1.CreateScope().ServiceProvider;                   
                }

                await app.StartAsync();

                Console.ReadKey();

                await host.StopAsync();
            }           
        }
    }
}
