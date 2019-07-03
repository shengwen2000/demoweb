using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace WebApp.Data
{
    /// <summary>
    /// if task notify for one user has any change,
    /// it will add a record on this table
    /// </summary>
    public class TnUserNotify
    {
        /// <summary>
        /// key
        /// </summary>
        [Key]
        public long Id { get; set; }

        /// <summary>
        /// user PK
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// user
        /// </summary>
        public ApplicationUser User { get; set; }

        /// <summary>
        /// 建立日
        /// </summary>
        public DateTime Created { get; set; } = DateTime.Now;
    }
}
