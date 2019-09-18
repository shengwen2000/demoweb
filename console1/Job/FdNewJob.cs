using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using WebApp.Services;

namespace WebApp.Job
{
    /// <summary>
    /// 建立命令範本    
    /// </summary>
    internal class FdNewJob : FdBaseJob
    {
        public FdNewJob(IOptions<FdServerConfig> config) : base(config)
        {
            _config = config.Value;
        }

        public void Run()
        {
            Console.WriteLine($"腳本檔產生完成");
        }     
    }
}
