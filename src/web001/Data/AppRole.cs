using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Data
{
    /// <summary>
    /// 角色
    /// </summary>
    public class AppRole : IdentityRole<int>
    {
        /// <summary>
        /// 名稱
        /// </summary>
        [MaxLength(50)]
        public string Title { get; set; }

        /// <summary>
        /// 描述
        /// </summary>
        [MaxLength(100)]
        public string Desc { get; set; }

        /// <summary>
        /// 所屬使用者
        /// </summary>
        public List<AppRoleUser> Users { get; set; }

        /// <summary>
        /// 授權的功能表清單(Json Array)
        /// 如果這裡有值的話，優先性高於 appsettings.json
        /// </summary>
        public string AuthMenus { get; set; }
    }
}
