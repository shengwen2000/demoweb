using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace WebApp.Services
{
    /// <summary>
    /// 目錄服務
    /// 1.建立必要的目錄
    /// 2.負責建立與回收暫時資料
    /// </summary>
    public class FolderService : IDisposable
    {
        CancellationTokenSource _cts;

        public FolderService(IHostingEnvironment env, IOptions<FolderOption> folderopt)
        {
            this._env = env;
            _cts = new CancellationTokenSource();
            _folderopt = folderopt.Value;
            Start();
        }

        bool _disposed = false;
        private IHostingEnvironment _env;       
        private FolderOption _folderopt;

        List<CTempFolder> _tmpfolders = new List<CTempFolder>();
        
        private Task _LoopTask;

        public void Dispose()
        {
            if (!_disposed)
            {
                _disposed = true;
                Stop();
            }
        }

        void Start()
        {
            //make sure directory exists, if not created.
            foreach(var f1 in _folderopt.Presences)
            {
                try
                {
                    var folder = f1;
                    if (folder.StartsWith("."))
                    {
                        folder = Path.Combine(_env.ContentRootPath, folder);
                    }
                    var dir = new DirectoryInfo(folder);
                    if (!dir.Exists)
                    {
                        dir.Create();
                    }
                }
                catch
                {

                }
            }

            //make sure direcoty exists(not exists will created it)
            foreach (var opt in _folderopt.Temps)
            {
                try
                {
                    var folder = opt.Folder;
                    if (folder.StartsWith("."))
                    {
                        folder = Path.Combine(_env.ContentRootPath, folder);
                    }

                    var dir = new DirectoryInfo(folder);
                    if (!dir.Exists)
                    {
                        dir.Create();
                    }
                    var item = new CTempFolder();
                    item.Folder = dir;
                    item.SaveMinute = opt.SaveMinute;
                    _tmpfolders.Add(item);
                }
                catch
                {

                }                
            }

            if(_tmpfolders.Count > 0)
            {
                _LoopTask = Task.Run(this.LoopAsync);              
            }
            
        }

        async Task LoopAsync()
        {
            var ctoken = _cts.Token;
            while(!ctoken.IsCancellationRequested)
            {
                //wait one minute;
                await Task.Delay(60000, ctoken);           
                if (ctoken.IsCancellationRequested)
                    return;
                foreach(var folder in _tmpfolders)
                {
                    var min = DateTime.Now.AddMinutes(-folder.SaveMinute);

                    foreach (var x in folder.Folder.GetDirectories()
                        .Where(x => x.CreationTime < min)
                        .ToArray()
                        )
                    {
                        try { x.Delete(true); } catch { }
                    }

                    foreach (var x in folder.Folder.GetFiles()
                        .Where(x => x.CreationTime < min)
                        .ToArray()
                        )
                    {
                        try { x.Delete(); } catch { }
                    }
                }                
            }
        }

        void Stop()
        {
            _cts.Cancel();
        }
    }
    
    /// <summary>
    /// 目錄選項
    /// </summary>
    public class FolderOption
    {
        /// <summary>
        /// 必定要存在的目錄
        /// </summary>
        public List<string> Presences { get; set; } = new List<string>();

        /// <summary>
        /// 暫時目錄設定
        /// </summary>
        public List<TempFolderOption> Temps { get; set; } = new List<TempFolderOption>();

    }


    /// <summary>
    /// 暫時目錄設定
    /// </summary>
    public class TempFolderOption
    {
        //public List <TmpFolderSetting>
        /// <summary>
        /// 目錄 .代表ContentRoot
        /// </summary>
        public string Folder { get; set; }

        /// <summary>
        /// 資料保留分鐘數
        /// </summary>
        public int SaveMinute { get; set; } = 10;        
    }

    class CTempFolder
    {
        public DirectoryInfo Folder { get; set; }

        /// <summary>
        /// 資料保留分鐘數
        /// </summary>
        public int SaveMinute { get; set; } = 10;

    }
}
