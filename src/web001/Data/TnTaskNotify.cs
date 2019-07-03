using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using WebApp.Services;

namespace WebApp.Data
{
    /// <summary>
    /// 任務進程通知
    /// </summary>
    public class TnTaskNotify
    {
        /// <summary>
        /// key
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// guid of key
        /// </summary>
        public Guid GId { get; set; }

        /// <summary>
        /// user
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// user
        /// </summary>
        public ApplicationUser User { get; set; }

        /// <summary>
        /// 標題
        /// </summary>
        [MaxLength(100)]
        public string Title { get; set; }

        /// <summary>
        ///  內容
        /// </summary>
        [MaxLength(2000)]
        public string Result { get; set; }

        /// <summary>
        /// 建立日
        /// </summary>
        public DateTime Created { get; set; } = DateTime.Now;

        /// <summary>
        /// Finish or Remove
        /// </summary>
        public DateTime? Complete { get; set; }

        /// <summary>
        /// the current state
        /// </summary>
        public TaskNotifyState State { get; set; }

       
    }
}
