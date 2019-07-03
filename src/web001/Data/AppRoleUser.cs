using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Data
{
    /// <summary>
    /// 群組與會員(M to M)
    /// </summary>
    public class AppRoleUser : IdentityUserRole<int>
    {
        /// <summary>
        /// 群組
        /// </summary>
        public AppRole Role { get; set; }

        /// <summary>
        /// 會員
        /// </summary>
        public ApplicationUser User { get; set; }
    }
}
