using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
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
             //.UseContentRoot(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location))
             .ConfigureAppConfiguration((ctx, builder) =>
             {
                 //自動產生設定檔                                 
                 builder.AddJsonFile("appsettings.json", false);
                 builder.AddJsonFile($"appsettings.{ctx.HostingEnvironment.EnvironmentName}.json", true);
             })
            .ConfigureServices((ctx, services) =>
            {
                services.Configure<FdServerConfig>(ctx.Configuration.GetSection("FtpDeploy"));

                services.Configure<FdServerConfig>(x => x.IsDisableUpload = true);

                services.AddTransient<FdCleanJob>();            
                services.AddTransient<FdNewJob>();                
                services.AddTransient<FdConsole>();                

                services.Configure<ConsoleLifetimeOptions>(x => { x.SuppressStatusMessages = true; });
            })
            .Build()
            ;

            using (host)
            {
                await host.StartAsync();

                var app = host.Services.GetService<FdConsole>();
                await app.StartAsync();
            }
        }
    }
}
