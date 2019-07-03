using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using WebApp.Data;
using WebApp.Helper;
using WebApp.Services.Menu;

namespace WebApp.Controllers
{
    /// <summary>
    /// 群組設定
    /// </summary>
    [Authorize(Policy = "SYS003")]
    public class SYS003Controller : Controller
    {
        private ApplicationDbContext _ctx;
        private RoleManager<AppRole> _rolem;       
        private MenuService _menusrv;

        /// <summary>
        /// ctor
        /// </summary>
        /// <param name="ctx"></param>
        public SYS003Controller(ApplicationDbContext ctx, RoleManager<AppRole> rolem, MenuService menusrv)
        {
            _ctx = ctx;
            _rolem = rolem;         
            _menusrv = menusrv;
        }


        public ActionResult Index()
        {
            return View("SYS003");
        }

        /// <summary>
        /// Role-列出
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Role_Query(int? id)
        {
            try
            {
                var records = _ctx.Roles
                    .AsNoTracking()
                    .WhereIf(id.HasValue, x => x.Id == id)
                    .Select(x => new { x.Id, x.Name, x.Title, x.Desc })
                    .OrderBy(x => x.Title)
                    ;
                return Json(new { Result = "OK", Message = "Success", Records = records });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "NG", Message = ex.Message });
            }
        }

        /// <summary>
        /// new
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Data_New()
        {
            try
            {
                var r = new Role_Record { Title="新群組" };
                var mm = GetMenus(null);
                r.Menus = mm;
                return Json(new { Result = "OK", Message = "Success", Record = r });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "NG", Message = ex.Message });
            }
        }

        /// <summary>
        /// Role-Get
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Role_Get(int id)
        {
            try
            {
                var record = _ctx.Roles
                    .AsNoTracking()
                    .Where(x => x.Id == id)
                    .Select(x => new Role_Record {
                        Id = x.Id,
                        Name = x.Name,
                        Title = x.Title,
                        Desc = x.Desc, 
                        CanDelete = x.Name.Length > 20
                    })
                    .FirstOrDefault()
                    ;


                var mm = GetMenus(record.Name);
                record.Menus = mm;
                return Json(new { Result = "OK", Message = "Success", Record = record });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "NG", Message = ex.Message });
            }
        }

        /// <summary>
        /// 取得群組的授權項目
        /// </summary>
        /// <param name="roleName"></param>
        /// <returns></returns>
        List<string> GetAuths(string roleName)
        {
            var auths2 = _ctx.Set<AppRole>().AsNoTracking()
                .Where(x => x.Name == roleName)
                .Select(x => x.AuthMenus)
                .FirstOrDefault()
                ;
            if (auths2.IsTrue())
                return JArray.Parse(auths2).Select(x => x.Value<string>()).ToList();

            var mauth = _menusrv.MenuSetting.RoleAuths.FirstOrDefault(x => x.Name == roleName);
            if (mauth == null)
                return new List<string>();
            return mauth.Auths;
        }

        /// <summary>
        /// 取得選取的項目
        /// </summary>
        /// <param name="menus"></param>
        /// <returns>選取的功能項目</returns>
        List<string> GetCheckAuths(List<CMenuNode> menus)
        {
            var mm = _menusrv.MenuSetting.Menu;

            string f2(string id, List<MenuNode> nodes)
            {
                if (nodes == null)
                    nodes = mm;

                foreach(var n in nodes)
                {
                    if (n.Id == id)
                        return n.Auth;
                    if (n.Nodes.Count > 0)
                    {
                        var r = f2(id, n.Nodes);
                        if (r.IsTrue())
                            return r;
                    }                        
                }
                return null;
            }

            var auths = new List<string>();
            void f(CMenuNode node)
            {
                if (node.Checked)
                {
                    var auth = f2(node.Id, mm);
                    if (auth.IsTrue())
                        auths.Add(auth);
                }
                else
                {
                    foreach (var c in node.Nodes)
                        f(c);
                }
            }

            foreach(var m in menus)
            {
                f(m);
            }
            return auths.Distinct().ToList();
        }

        /// <summary>
        /// 取的群組的功能表結構
        /// </summary>
        /// <param name="roleName"></param>
        /// <returns></returns>
        List<CMenuNode> GetMenus(string roleName)
        {
            var mm = new List<CMenuNode>();
            var auths = GetAuths(roleName);

            //copy menu struct to updateable struct
            void f_copynodes(List<MenuNode> nn2, List<CMenuNode> nn1)
            {
                foreach (var n2 in nn2)
                {
                    var n1 = new CMenuNode { Id = n2.Id, Text = n2.Text, Nodes = new List<CMenuNode>() };
                    nn1.Add(n1);

                    var chk = false;
                    if (n2.Auth.IsTrue())
                    {
                        chk = auths.Where(x => x.ToUpper() == n2.Auth.ToUpper()).FirstOrDefault() != null;
                    }
                    n1.Checked = chk;
                    if (n2.Nodes.Count > 0)
                        f_copynodes(n2.Nodes, n1.Nodes);
                }
            }

            //calculate the total of checked
            int f_chkcnt(CMenuNode node)
            {
                var total = 0;
                if (node.Checked)
                    total += 1;
                foreach (var snode in node.Nodes)
                    total += f_chkcnt(snode);
                node.ChkCount = total;
                return total;
            }

            f_copynodes(_menusrv.MenuSetting.Menu, mm);
            foreach (var n in mm)
                f_chkcnt(n);

            return mm;
        }

        /// <summary>
        /// Role-刪除
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Role_Delete(int id)
        {
            try
            {
                var role = _ctx.Roles.Find(id);
                if (role.Name.Length <= 20)
                    return Json(new { Result = "NG", Message = "此群組為內定群組不可刪除" });
                _ctx.Remove(role);
                _ctx.SaveChanges();

                _menusrv.RefreshRoleAuth(role.Name, new List<string>());
                return Json(new { Result = "OK", Message = "Success" });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "NG", Message = ex.Message });
            }
        }

        /// <summary>
        /// Role-儲存
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Role_Save([FromBody] Role_Record record)
        {
            try
            {
                //新增
                if (record.Id == 0)
                {
                    var role = new AppRole();
                    role.Title = record.Title;
                    role.Desc = record.Desc;                    
                    role.Name = Guid.NewGuid().ToString();

                    var aa = GetCheckAuths(record.Menus);
                    role.AuthMenus = aa.ToJsonText();
                    _rolem.CreateAsync(role).Wait();
                    _menusrv.RefreshRoleAuth(role.Name, aa);
                    return this.Role_Get(role.Id);
                }
                //修改
                else
                {
                    var role = _ctx.Roles.Find(record.Id);
                    var aa = GetCheckAuths(record.Menus);
                    role.Title = record.Title;
                    role.AuthMenus = aa.ToJsonText();
                    role.Desc = record.Desc;
                    _ctx.SaveChanges();

                    _menusrv.RefreshRoleAuth(role.Name, aa);
                    return this.Role_Get(role.Id);                
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "NG", Message = ex.Message });
            }
        }

        public class Role_Record
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Title { get; set; }
            public string Desc { get; set; }

            public List<CMenuNode> Menus { get; set; }
            public bool CanDelete { get; internal set; }
        }

        /// <summary>
        /// 勾選用的功能表
        /// </summary>
        public class CMenuNode
        {
            /// <summary>
            /// 項目ID
            /// </summary>
            public string Id { get; set; }

            /// <summary>
            /// 功能項目名稱
            /// </summary>
            public string Text { get; set; }

            /// <summary>
            /// 被選擇
            /// </summary>
            public bool Checked { get; set; }

            /// <summary>
            /// 已選擇的數量
            /// </summary>
            public int ChkCount { get; set; }

            /// <summary>
            /// 子節點清單
            /// </summary>
            public List<CMenuNode> Nodes { get; set; }
        }

    }
}
