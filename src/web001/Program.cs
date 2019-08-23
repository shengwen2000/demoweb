using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
namespace WebApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
           WebHost.CreateDefaultBuilder(args)
              .ConfigureAppConfiguration(builder => builder.SetBasePath(Directory.GetCurrentDirectory())
                  .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
                  .AddJsonFile("appsettings.server.json", optional: true, reloadOnChange: false)
                  //.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true)
                  .AddEnvironmentVariables()
                  )
              //.UseSetting("DesignTime", "0")
              .UseStartup<Startup>()
            ;

        ///// <summary>
        ///// Only for Ef tools
        ///// </summary>
        ///// <param name="args"></param>
        ///// <returns></returns>
        //public static IWebHost BuildWebHost(string[] args)
        //{
        //    return WebHost.CreateDefaultBuilder(args)
        //        .ConfigureAppConfiguration(builder => builder.SetBasePath(Directory.GetCurrentDirectory())
        //            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
        //            .AddJsonFile("appsettings.server.json", optional: true, reloadOnChange: true)
        //            //.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true)
        //            .AddEnvironmentVariables()
        //            )
        //        .ConfigureLogging((ctx, logging) => { }) // No logging
        //        .UseSetting("DesignTime", "1")
        //        .UseStartup<Startup>()
        //        .Build()
        //        ;
        //}
    }
}
