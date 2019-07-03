using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Services
{
    /// <summary>
    /// 
    /// </summary>
    public class TaskNotifySetting
    {
        /// <summary>
        /// 使用者事件紀錄保留秒數(default 1 minute)
        /// </summary>
        public int UserEventKeepSecond { get; set; } = 60;

        /// <summary>
        /// 已完成通知保留秒數(default 10 minute)
        /// </summary>
        public int NotifyKeepSecond { get; set; } = 600;
    }
}
