using System;
using System.Collections.Generic;
using System.Text;

namespace WebApp.Services
{
    /// <summary>
    /// Ftp Server List
    /// </summary>
    public class FdServerConfig
    {
        /// <summary>
        /// 禁止任何形式的上傳，通常為測試用。
        /// </summary>
        public bool IsDisableUpload { get; set; }

        /// <summary>
        /// 嘗試下載上傳的次數，當失敗時。
        /// </summary>
        public int TryUploadDownloadCount { get; set; } = 1;

        /// <summary>
        /// 忽略上傳下載的錯誤繼續執行?
        /// </summary>
        public bool IgnoreUploadDownloadNG { get; set; } = true;

        /// <summary>
        /// Ftp Server List
        /// </summary>
        public List<FdServer> Servers { get; set; } = new List<FdServer>();
    }

    /// <summary>
    /// Ftp Server
    /// </summary>
    public class FdServer
    {
        public string Name { get; set; }

        public string Host { get; set; }

        public int Port { get; set; }

        public string Account { get; set; }

        public string Password { get; set; }

        public string RemoteDir { get; set; }

        public string Comment { get; set; }
      

        public bool IsUploadEnable { get; set; }
    }
}
