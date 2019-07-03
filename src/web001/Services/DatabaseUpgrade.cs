using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WebApp.Data;
using WebApp.Helper;

namespace WebApp.Services
{
    /// <summary>
    /// 資料庫升級
    /// </summary>
    public class DatabaseUpgrade
    {
        private ApplicationDbContext _ctx;
        private RoleManager<AppRole> _roleManager;
        private UserManager<ApplicationUser> _userManager;
        private ILogger<Startup> _logger;
        private IHostingEnvironment _env;

        public DatabaseUpgrade(ApplicationDbContext ctx, UserManager<ApplicationUser> userManager, RoleManager<AppRole> roleManager, ILogger<Startup> logger, IHostingEnvironment env)
        {
            _ctx = ctx;
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
            _env = env;
        }

        public async Task Upgrade()
        {
            var ver = _ctx.Set<DbVersion>().OrderByDescending(x => x.Id).FirstOrDefault();

            var verno = int.Parse((ver?.Name).NullOrEmptyAs("0"));

            while (true)
            {
                var go = true;
                switch (verno)
                {
                    case 0:
                        _logger.LogInformation($"prepare upgrade to {verno + 1}");
                        await Upgrade_to_1();
                        break;
                    default:
                        go = false;
                        break;
                }

                if (go)
                {
                    verno++;
                    ver = new DbVersion { Name = verno.ToString(), UpdateTime = DateTime.Now };
                    _ctx.Add(ver);
                    _ctx.SaveChanges();
                }
                else
                    break;
            }
        }        

        private async Task Upgrade_to_1()
        {
            #region [Admin註冊]
            {
                const string name = "admin@gmail.com";
                const string password = "123456";
                const string username = "Admin";
                const string phone = "00";
                string remark = $"default admin password is {password}";
                const string roleName = "Admin";

                //Create Role Admin if it does not exist
                var role = await _roleManager.FindByNameAsync(roleName);
                if (role == null)
                {
                    role = new AppRole();
                    role.Name = roleName;
                    role.Title = "系統管理";
                    role.Desc = "可使用所有的功能";
                    await _roleManager.CreateAsync(role);
                }

                var user = await _userManager.FindByNameAsync(name);
                if (user == null)
                {
                    user = new ApplicationUser { UserName = name, Email = name, EmailConfirmed=true, EX_Name = username, Remark = remark, PhoneNumber = phone  };
                    await _userManager.CreateAsync(user, password);
                    await _userManager.SetLockoutEnabledAsync(user, false);       
                }             

                // Add user admin to Role Admin if not already added
                var rolesForUser = await _userManager.GetRolesAsync(user);
                if (!rolesForUser.Contains(role.Name))
                {                    
                    await _userManager.AddToRoleAsync(user, role.Name);
                }
            }
            #endregion

            //Create Role COPD if it does not exist
            {
                var roleName = "COPD";
                var role = await _roleManager.FindByNameAsync(roleName);
                if (role == null)
                {
                    //	醫護人員：可使用本專案中醫護人員所應可以使用的功能
                    role = new AppRole();
                    role.Name = roleName;
                    role.Title = "醫護人員";
                    role.Desc = "可使用COPD專案中醫護人員所應可以使用的功能";
                    await _roleManager.CreateAsync(role);
                }
            }
        }
    }
}
