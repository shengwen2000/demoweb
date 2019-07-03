using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Services
{
    /// <summary>
    /// SendGrid寄件服務設定
    /// </summary>
    public class SendGridConfig
    {
        /// <summary>
        /// 寄件人姓名
        /// </summary>
        public string SenderName { get; set; }

        /// <summary>
        /// 寄件人Email
        /// </summary>
        public string SenderEmail { get; set; }

        /// <summary>
        /// (測試用)統一接收人
        /// </summary>
        public string ReceiveEmail { get; set; }

        /// <summary>
        /// (測試用)郵件標題前置名稱
        /// </summary>
        public string SubjectPrefix { get; set; }

        /// <summary>
        /// SendGrid's Api Key
        /// </summary>
        public string ApiKey { get; set; }
    }
}
