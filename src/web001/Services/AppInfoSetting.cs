using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Services
{
    /// <summary>
    /// 應用程式資訊
    /// </summary>
    public class AppInfoSetting
    {
        /// <summary>
        /// 網站名稱
        /// </summary>
        public string SiteName { get; set; }

        /// <summary>
        /// 網站簡稱
        /// </summary>
        public string SiteAbbrName { get; set; }

        /// <summary>
        /// 公司名稱
        /// </summary>
        public string Company { get; set; }

        /// <summary>
        /// 系統版本
        /// </summary>
        public string Version { get; set; }

        /// <summary>
        /// 最後更新日
        /// </summary>
        public string Updated { get; set; }

        /// <summary>
        /// 版權宣告
        /// </summary>
        public string CopyRight { get; set; }
    }
}
