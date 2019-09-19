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

                var app = host.Services.GetService<FdConsole>();
                var app2 = host.Services.GetService<FdConsole>();
                var thesame = app == app2;

                //await Task.Run(() => Test02(host.Services));

                //new Thread(() => Test02(host.Services)).Start();

                {
                    var srvprovider = host.Services;

                    var a = srvprovider.GetService<FdNewJob>();
                    var b = srvprovider.GetService<FdNewJob>();
                    var ok = a == b;


                    var scopef = srvprovider.GetRequiredService<IServiceScopeFactory>();
                    using (scopef.CreateScope())
                    {
                        var c = srvprovider.GetService<FdNewJob>();
                        var ok2 = a == c;
                    }

                    using (scopef.CreateScope())
                    {
                        var c = srvprovider.GetService<FdNewJob>();
                        var ok2 = a == c;
                    }




                }

                {
                    var srv = host.Services.GetRequiredService<TimeService>();

                }


                //var config = host.Services.GetService<IOptions<FdServerConfig>>();

                await app.StartAsync();



                Console.ReadKey();

                await host.StopAsync();
            }

           
        }


        static  void Test02(IServiceProvider srvprovider)
        {
            var a = srvprovider.GetService<FdNewJob>();
            var b = srvprovider.GetService<FdNewJob>();
            var ok = a == b;
        }


    }
}
