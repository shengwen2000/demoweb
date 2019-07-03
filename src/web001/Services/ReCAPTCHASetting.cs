using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Services
{
    /// <summary>
    /// 防止機器人的設定
    /// </summary>
    public class ReCAPTCHASetting
    {
        /// <summary>
        /// Enable?
        /// </summary>
        public bool IsEnable { get; set; }

        /// <summary>
        /// The Key
        /// </summary>
        public string Key { get; set; }

        /// <summary>
        /// The Secret
        /// </summary>
        public string Secret { get; set; }
    }
}
