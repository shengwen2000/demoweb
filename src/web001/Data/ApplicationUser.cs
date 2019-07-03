using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace WebApp.Data
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser<int>
    {      

        /// <summary>
        /// 建立日期
        /// </summary>
        public DateTime Created { get; set; } = DateTime.Now;

        /// <summary>
        /// 姓名
        /// </summary>
        [MaxLength(20)]
        public string EX_Name { get; set; }

        /// <summary>
        /// 備註
        /// </summary>
        [MaxLength(100)]
        public string Remark { get; set; }

        /// <summary>
        /// 所隸屬的群組
        /// </summary>
        public List<AppRoleUser> Roles { get; set; }
    }
}
