using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Threading.Tasks;
using WebApp.Services;


namespace WebApp.Job
{
    /// <summary>
    /// 解析命令
    /// </summary>
    class FdConsole
    { 
        private FdServerConfig _config;
        private IServiceProvider _srvprovder;

        public FdConsole(IOptions<FdServerConfig> config, IServiceProvider srvprovder, IHostingEnvironment aa)
        {          
            _config = config.Value;
            _srvprovder = srvprovder;
        }

        public Task StartAsync()
        {
            var args = Environment.GetCommandLineArgs();

            void showHelp()
            {
                Console.WriteLine("高醫Winform程式部署腳本");
                Console.WriteLine("======支援的命令列表=======");
                Console.WriteLine("new 產生腳本樣本");
                Console.WriteLine("clean 清空所有本地目錄");             
            }
            try
            {
                var cmd = args.Skip(1).FirstOrDefault();

                if (string.IsNullOrEmpty(cmd))
                {
                    showHelp();                    
                }              
                else if (cmd.Equals("new", StringComparison.InvariantCultureIgnoreCase))
                {
                    _srvprovder.GetService<FdNewJob>().Run();                                 
                }
                else if (cmd.Equals("clean", StringComparison.InvariantCultureIgnoreCase))
                {
                    _srvprovder.GetService<FdCleanJob>().Run();                                 
                }                
                else
                {
                    showHelp();
                }
                return Task.CompletedTask;
            }           
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
            }
            finally
            {
                Console.ResetColor();               
            }
            return Task.CompletedTask;
        }      
    }
}
