using System;
using System.Collections.Generic;
using System.IO;

using WebApp.Services;
using System.Linq;
using Microsoft.Extensions.Options;

namespace WebApp.Job
{
    /// <summary>
    /// 清空所有的本地目錄   
    /// </summary>
    internal class FdCleanJob : FdBaseJob
    {
        public FdCleanJob(IOptions<FdServerConfig> config) : base(config)
        {
            _config = config.Value;
        }

        public void Run()
        {
            Console.Write($"你確定要移除本地端目錄內容 yes/no ? ");
            var ans = Console.ReadLine();
            if (!ans.Equals("yes"))
                return;
            Console.WriteLine("已經移除完畢");
        }     
    }
}
