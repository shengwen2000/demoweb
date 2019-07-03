using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApp.Data;
using WebApp.Services;
using WebApp.Services.Menu;

namespace WebApp.Controllers
{
    /// <summary>
    /// 登入帳號管理
    /// </summary>
    [Authorize(Policy = "SYS002")]
    public class SYS002Controller : Controller
    {
        private UserManager<ApplicationUser> _userManager;
        private RoleManager<AppRole> _roleManager;
        private QueryPagerService _pager;
        private IdentityOptions _identityOpt;
        private ApplicationDbContext _ctx;

        public SYS002Controller(UserManager<ApplicationUser> userManager, RoleManager<AppRole> roleManager, QueryPagerService pager, IOptions<IdentityOptions> identityOpt, ApplicationDbContext ctx)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _pager = pager;
            _identityOpt = identityOpt.Value;
            _ctx = ctx;
        }


        public ActionResult Index()
        {
            return View("SYS002");
        }

        /// <summary>
        /// 註冊的初始資料
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        public IActionResult FormInit()
        {
            try
            {
                //var vv1 = _ctx.Set<EfDept>()
                //    .OrderBy(x => x.Id)
                //    .Select(x => new { x.Id, x.Name })
                //    .ToList()
                //    ;

                return Json(new { Result = "OK", Message = "Success", Record = new { } });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "NG", Message = ex.Message });
            }
        }

        /// <summary>
        /// 登入帳號-列出
        /// </summary>
        /// <returns></returns>
        [HttpPost]      
        public JsonResult Data_Query(int id)
        {
            try
            {
                var usrm = _userManager;
                var rolem = _roleManager;               
                var roles = rolem.Roles
                    .AsNoTracking()
                    .Select(x1 => new { x1.Title, x1.Id })
                    .ToList();

                var records = usrm.Users
                    .AsNoTracking()
                    .WhereIf(id > 0, x => x.Id == id)
                    .Include(x => x.Roles)
                    //.Include(x => x.Dept)
                    //.OrderBy(x => x.Dept.Name)
                    .OrderBy(x => x.EX_Name)
                    .AsEnumerable()
                    .Select(x => new
                    {
                        x.Id,
                        x.Email,
                        x.EX_Name,
                        x.Remark,
                        x.PhoneNumber,
                        Roles = roles
                            .Select(x1 => new { x1.Title, IsEnable = x.Roles.Any(x2 => x2.RoleId == x1.Id) })
                    })
                    ;
                return Json(new { Result = "OK", Message = "Success", Records = records });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "NG", Message = ex.Message });
            }
        }

        /// <summary>
        /// 分頁查詢
        /// </summary>
        /// <param name="pg_name"></param>
        /// <param name="pg_oname"></param>
        /// <param name="pg_idx"></param>
        /// <param name="pg_count"></param>
        /// <param name="name"></param>       
        /// <returns></returns>
        [HttpPost]
        public JsonResult Data_PageQuery(string pg_name = "", string pg_oname = "", int pg_idx = 0, int pg_count = 20, string name = null, string orderby = null)
        {
            try
            {
                //remove old data
                if (!pg_oname.IsNullOrEmpty())
                    _pager.Remove(pg_oname);


                //新建查詢
                if (pg_name.IsNullOrEmpty())
                {
                    var roles = _roleManager.Roles
                    .AsNoTracking()
                    .Select(x1 => new { x1.Title, x1.Id })
                    .ToList();

                    var qry = _userManager.Users
                        .AsNoTracking()
                        .WhereIf(_identityOpt.SignIn.RequireConfirmedEmail, x => x.EmailConfirmed)
                        .WhereIf(name.IsTrue(), x => x.EX_Name.Contains(name) || x.Email.Contains(name) || x.PhoneNumber.Contains(name))          
                        .Include(x => x.Roles)
                        //.Include(x => x.Dept)
                        //.OrderBy(x => x.Dept.Name)
                        .OrderBy(x => x.EX_Name)
                        .AsEnumerable()
                        .Select(x =>  new Data_Record
                        {
                            Id = x.Id,
                            Email = x.Email,
                            EX_Name = x.EX_Name,
                            Remark = x.Remark,
                            //DeptName = x.Dept != null ? x.Dept.Name : "",
                            PhoneNumber =x.PhoneNumber,
                            Roles = roles
                                .Select(x1 => new Data_Record.Role {
                                    Title =x1.Title,
                                    IsEnable = x.Roles.Any(x2 => x2.RoleId == x1.Id)
                                })
                                .ToList()
                        })
                        ;
                    Data_Orderby(ref qry, orderby);
                    var qr = _pager.Add(qry, pg_count);
                    var records = qr.GetPage(pg_idx);
                    return Json(new { Result = "OK", Message = "Success", Records = records, PSource = qr.Source });
                }
                //既有的查詢
                else
                {
                    var qr = _pager.Find(pg_name);
                    if (qr == null)
                        return Json(new { Result = "QP01", Message = "資料已被清除，請重新查詢。" });
                    var records = qr.GetPage(pg_idx);
                    return Json(new { Result = "OK", Message = "Success", Records = records });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "NG", Message = ex.Message });
            }
        }       


        void Data_Orderby(ref IEnumerable<Data_Record> qry, string orderby)
        {
            if (orderby.IsNullOrEmpty())
                return;   
            {
                var v = JObject.Parse(orderby);
                var col = v.Value<string>("Column");
                var desc = v.Value<bool>("Desc");


                switch (col)
                {
                    case "Email":
                        if (desc)
                            qry = qry.OrderByDescending(x => x.Email);
                        else
                            qry = qry.OrderBy(x => x.Email);
                        break;
                    //case "任職單位":
                    //    if (desc)
                    //        qry = qry.OrderByDescending(x => x.DeptName);
                    //    else
                    //        qry = qry.OrderBy(x => x.DeptName);
                    //    break;

                    case "姓名":
                        if (desc)
                            qry = qry.OrderByDescending(x => x.EX_Name);
                        else
                            qry = qry.OrderBy(x => x.EX_Name);
                        break;
                    case "電話":
                        if (desc)
                            qry = qry.OrderByDescending(x => x.PhoneNumber);
                        else
                            qry = qry.OrderBy(x => x.PhoneNumber);
                        break;                    
                }
            }
        }

        /// <summary>
        /// 分頁排序
        /// </summary>
        /// <param name="pg_name"></param>
        /// <param name="pg_oname"></param>
        /// <param name="pg_idx"></param>
        /// <param name="pg_count"></param>
        /// <param name="orderby"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Data_PageOrderby(string pg_name = "", string pg_oname = "", int pg_idx = 0, int pg_count = 20, string orderby = null)
        {
            try
            {
                //既有的查詢              
                {
                    var qr = _pager.Find(pg_name);
                    if (qr == null)
                        return Json(new { Result = "QP01", Message = "資料已被清除，請重新查詢。" });

                    var qry = qr.GetRecords<Data_Record>(0, qr.Source.Count).AsEnumerable();

                    //sort
                    this.Data_Orderby(ref qry, orderby);

                    //remove old data
                    _pager.Remove(pg_name);
                    //create new order data
                    qr = _pager.Add(qry, pg_count);
                    var records = qr.GetPage(pg_idx);
                    return Json(new { Result = "OK", Message = "Success", Records = records, PSource = qr.Source });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "NG", Message = ex.Message });
            }
        }

        /// <summary>
        /// 登入帳號-GET
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Data_Get(int id)
        {
            try
            {
                var usrm = _userManager;
                var rolem = _roleManager;
                var roles = rolem.Roles
                    .AsNoTracking()
                    .Select(x1 => new { x1.Title, x1.Name, x1.Id })
                    .ToList();

                var record = usrm.Users
                    .AsNoTracking()                
                    .Where(x => x.Id == id)
                    .Include(x => x.Roles)
                    //.Include(x => x.Dept)
                    //.OrderBy(x => x.Dept.Name)
                    .OrderBy(x => x.EX_Name)
                    .AsEnumerable()
                    .Select(x => new Data_Record
                    {
                        Id =x.Id,
                        Email=x.Email,
                        EX_Name = x.EX_Name,
                        Remark = x.Remark,
                        //DeptId = x.DeptId,
                        //DeptName = x.Dept != null ? x.Dept.Name : "",
                        PhoneNumber = x.PhoneNumber,
                        Roles = roles
                            .Select(x1 => new Data_Record.Role { Name= x1.Name, Title = x1.Title, IsEnable = x.Roles.Any(x2 => x2.RoleId == x1.Id) })
                            .ToList()
                    })
                    .FirstOrDefault()
                    ;
                return Json(new { Result = "OK", Message = "Success", Record = record });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "NG", Message = ex.Message });
            }
        }


        /// <summary>
        /// 登入帳號-刪除
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<JsonResult> Data_Delete(int id)
        {
            try
            {
                var usrm = _userManager;
                var usr = await usrm.FindByIdAsync(id.ToString());
                if (usr == null)
                {
                    return Json(new { Result = "NG", Message = "無此帳號" });
                }
                //至少必須保留一個管理者帳號
                var roles1 = await usrm.GetRolesAsync(usr);                
                if (roles1.Any(x => x.EqualIgnoreCase("Admin")))
                {
                    var admins = await usrm.GetUsersInRoleAsync("Admin");
                    if (admins.Count() ==1)
                    {
                        return Json(new { Result = "NG", Message = "管理者至少須留一人" });
                    }
                }
                var result = await usrm.DeleteAsync(usr);
                if (result.Succeeded)
                {
                    return Json(new { Result = "OK", Message = "Success" });
                }
                return Json(new { Result = "NG", Message = result.Errors.First().Description });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "NG", Message = ex.Message });
            }
        }

        /// <summary>
        /// 登入帳號-儲存
        /// </summary>
        /// <returns></returns>
        [HttpPost]        
        public async Task<JsonResult> Data_Save([FromBody] Data_Record entity)
        {
            try
            {
                var usrm = _userManager;
                var usr = await usrm.FindByIdAsync(entity.Id.ToString());
                var roles1 = await usrm.GetRolesAsync(usr);
                var roles2 = entity.Roles
                    .Where(x => x.IsEnable)
                    .Select(x => x.Name)
                    .ToList()
                    ;

                var rolem = _roleManager;
                //新增
                await usrm.AddToRolesAsync(usr, roles2.Except(roles1).ToArray());

                //移除
                await usrm.RemoveFromRolesAsync(usr, roles1.Except(roles2).ToArray());

                usr.EX_Name = entity.EX_Name;
                //usr.DeptId = entity.DeptId;
                usr.PhoneNumber = entity.PhoneNumber;
                usr.Remark = entity.Remark;
                await usrm.UpdateAsync(usr);
                return this.Data_Get(entity.Id);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "NG", Message = ex.Message });
            }
        }


        public class Data_Record
        {
            public class Role
            {               
                public string Title { get; set; }
                public bool IsEnable { get; set; }
                public string Name { get; set; }
            }

            public int Id { get; set; }
            public string Email { get; set; }
           

            public string PhoneNumber { get; set; }
            public string EX_Name { get; set; }

            public List<Role> Roles { get; set; }
            //public string DeptName { get; set; }
            public int? DeptId { get; set; }
            public string Remark { get; set; }
        }

    }
}
