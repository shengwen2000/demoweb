using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WebApp.Data;
using WebApp.Helper;

namespace WebApp.Services.Menu
{
    /// <summary>
    /// 功能表與授權查詢服務
    /// </summary>
    public class MenuService
    {
        private IServiceScopeFactory _scoped;   

        public MenuServiceSetting MenuSetting { get; private set; }

        public MenuService(IOptions<MenuServiceSetting> settings, IServiceScopeFactory scoped)
        {
            _scoped = scoped;
            
            var v = settings.Value;
            v.Init();
            MenuSetting = v;

            using (var scope = _scoped.CreateScope())
            {
                var _ctx = scope.ServiceProvider.GetService<ApplicationDbContext>();
                var rr = _ctx.Set<AppRole>()
                    .Select(x => new { x.Name, x.AuthMenus })
                    .ToList()
                    ;

                foreach (var r in rr)
                {
                    if (r.AuthMenus.IsTrue())
                    {
                        var aa = r.AuthMenus.FromJsonText<List<string>>();
                        this.RefreshRoleAuth(r.Name, aa);
                    }
                }
            }
        }


        /// <summary>
        ///　檢查有沒有授權-使用者
        /// </summary>
        /// <param name="usr">使用者</param>
        /// <param name="authcode"></param>
        /// <returns></returns>
        public bool IsAuth(ClaimsPrincipal usr, string authcode)
        {
            var s = MenuSetting;
            //不需要授權即可使用？
            if (authcode.IsNullOrEmpty())
                return true;

            //屬於EveryOne都可使用
            if (s.EveryOneAuths.Contains(authcode))
                return true;

            //未登入以下必定沒有
            if (usr == null || !usr.Identity.IsAuthenticated)
                return false;

            //登入者都可以使用的功能嗎？
            if (s.LoginAuths.Contains(authcode))
                return true;

            //角色可用且隸屬此角色
            foreach (var role in s.RoleAuths)
            {
                if (role.Auths.Contains(authcode))
                {
                    if (usr.IsInRole(role.Name))
                        return true;
                }
            }

            //無此權限可使用
            return false;
        }

        /// <summary>
        ///　檢查有沒有授權-群組
        /// </summary>
        /// <param name="rolename">群組名稱</param>
        /// <param name="authcode"></param>
        /// <returns></returns>
        public bool IsAuthRole(string rolename, string authcode)
        {
            var s = MenuSetting;
            //不需要授權即可使用？
            if (authcode.IsNullOrEmpty())
                return true;

            //屬於EveryOne都可使用
            if (s.EveryOneAuths.Contains(authcode))
                return true;

            //登入者都可以使用的功能嗎？
            if (s.LoginAuths.Contains(authcode))
                return true;

            //角色可用且隸屬此角色
            foreach (var role in s.RoleAuths)
            {
                if (role.Auths.Contains(authcode))
                {
                    if (rolename == role.Name)
                        return true;
                }
            }

            //無此權限可使用
            return false;
        }


        /// <summary>
        /// 取得登入者可用的功能
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public List<ViewableNode> GetUserMenu(ClaimsPrincipal user)
        {
            var s = MenuSetting;
            var nn = new List<ViewableNode>();

            //copy nodes
            {
                bool f_hasData(ViewableNode n)
                {
                    if (!n.Node.Entry.IsNullOrEmpty())
                        return true;
                    if (n.Nodes.Count > 0)
                        return true;
                    return false;
                }

                ViewableNode f_cp(MenuNode n)
                {
                    var v = new ViewableNode();
                    v.Node = n;
                    foreach (var c in n.Nodes)
                    {
                        if (IsAuth(user, c.Auth))
                        {
                            var x = f_cp(c);
                            if (f_hasData(x))
                                v.Nodes.Add(x);
                        }
                    }
                    return v;
                }

                foreach (var n in s.Menu)
                {
                    if (IsAuth(user, n.Auth))
                    {
                        var x = f_cp(n);
                        if (f_hasData(x))
                            nn.Add(x);
                    }

                }
            }
            return nn;
        }

        /// <summary>
        /// 取得群組可用的功能
        /// </summary>
        /// <param name="rolename">群組</param>
        /// <returns></returns>
        public List<ViewableNode> GetRoleMenu(string rolename)
        {
            var s = MenuSetting;
            var nn = new List<ViewableNode>();

            //copy nodes
            {
                bool f_hasData(ViewableNode n)
                {
                    if (!n.Node.Entry.IsNullOrEmpty())
                        return true;
                    if (n.Nodes.Count > 0)
                        return true;
                    return false;
                }

                ViewableNode f_cp(MenuNode n)
                {
                    var v = new ViewableNode();
                    v.Node = n;
                    foreach (var c in n.Nodes)
                    {
                        if (IsAuthRole(rolename, c.Auth))
                        {
                            var x = f_cp(c);
                            if (f_hasData(x))
                                v.Nodes.Add(x);
                        }
                    }
                    return v;
                }

                foreach (var n in s.Menu)
                {
                    if (IsAuthRole(rolename, n.Auth))
                    {
                        var x = f_cp(n);
                        if (f_hasData(x))
                            nn.Add(x);
                    }
                }
            }
            return nn;
        }

        /// <summary>
        /// 取得目前網頁的Menu項目
        /// </summary>
        /// <returns></returns>
        public MenuNode GetCurrentMenuItem(HttpContext http)
        {
            //轉換目前網址為虛擬網址 ex:/home/hello => ~/home/hello
            var vpath = "";
            if (!http.Request.PathBase.HasValue)
                vpath = $"~{http.Request.Path.Value}";
            else
            {
                var len = http.Request.PathBase.Value.Length;
                vpath = $"~{http.Request.Path.Value.Substring(len) }";
            }

            //MenuAuthCode
            var authcodes = http.Items["##MenuAuthCode"] as List<string>;

            //判定路徑是否相同
            bool isPathMath(string regpath, string curpath)
            {
                if (regpath.IsNullOrEmpty() || curpath.IsNullOrEmpty())
                    return false;
                if (curpath.Length > regpath.Length)
                {
                    if (curpath[regpath.Length] != '/')
                        return false;
                    return curpath.Substring(0, regpath.Length).EqualIgnoreCase(regpath);
                }
                else if (curpath.Length == regpath.Length)
                    return regpath.EqualIgnoreCase(curpath);
                else
                    return false;
            }
                

            //尋找授權與路徑相符的項目
            MenuNode find(MenuNode m)
            {
                if (isPathMath(m.Entry, vpath))
                {
                    if(m.Auth.IsNullOrEmpty())
                        return m;
                    else
                    {
                        if(authcodes?.Contains(m.Auth)??false)
                            return m;
                    }
                }

                foreach(var snode in m.Nodes)
                {
                    var r = find(snode);
                    if (r != null)
                        return r;
                }
                return null;
            }

            var s = MenuSetting;
            foreach (var n in s.Menu)
            {
                var item = find(n);
                if (item != null)
                    return item;
            }
            return null;
        }

        /// <summary>
        /// 更新群組授權清單
        /// </summary>
        /// <param name="name"></param>
        /// <param name="auths">AuthCodes</param>
        public void RefreshRoleAuth(string name, List<string> auths)
        {
            var m = MenuSetting.RoleAuths.FirstOrDefault(x => x.Name == name);
            if (m == null)
            {
                m = new RoleAuth { Name = name, Auths = auths };
                MenuSetting.RoleAuths.Add(m);
            }
            else
            {
                m.Auths = auths;
            }
        }
    }

    /// <summary>
    /// 功能表節點
    /// </summary>
    public class MenuNode
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
        /// 設定項目
        /// </summary>
        public Dictionary<string, object> Config { get; set; } = new Dictionary<string, object>();

        /// <summary>
        /// 網頁路徑 若無表示是個目錄
        /// </summary>
        public string Entry { get; set; }

        /// <summary>
        /// 授權代號 若有值表示需取得該值的權代號才能使用
        /// 若無設定表示為公開功能
        /// </summary>
        public string Auth { get; set; }

        /// <summary>
        /// Child Nodes
        /// </summary>
        public List<MenuNode> Nodes { get; set; } = new List<MenuNode>();

    }


    /// <summary>
    /// 功能表節點-某個使用者可見的
    /// </summary>
    public class ViewableNode
    {
        /// <summary>
        /// 節點
        /// </summary>
        public MenuNode Node { get; set; }

        /// <summary>
        /// 可見的子節點
        /// </summary>
        public List<ViewableNode> Nodes { get; set; } = new List<ViewableNode>();
    }

    /// <summary>
    /// 角色的授權
    /// </summary>
    public class RoleAuth
    {
        public string Name { get; set; }

        public List<string> Auths { get; set; } = new List<string>();
    }

    /// <summary>
    /// 功能表與授權設定
    /// </summary>
    public class MenuServiceSetting
    {
        /// <summary>
        /// 功能表結構
        /// </summary>
        public List<MenuNode> Menu { get; set; } = new List<MenuNode>();

        /// <summary>
        /// 群組可使用那些功能
        /// </summary>
        public List<RoleAuth> RoleAuths { get; set; } = new List<RoleAuth>();


        /// <summary>
        /// 登入者可使用那些功能
        /// </summary>
        public List<string> LoginAuths { get; set; } = new List<string>();

        /// <summary>
        /// 每個人都可使用那些功能
        /// </summary>
        public List<string> EveryOneAuths { get; set; } = new List<string>();


        /// <summary>
        /// Find All of Authorize Code
        /// </summary>
        /// <returns></returns>
        public List<string> FindAllAuthCodes()
        {
            var auths = new List<string>();
            void ff(List<MenuNode> mm)
            {
                foreach (var m in mm)
                {
                    if (m.Auth.IsTrue())
                        auths.Add(m.Auth);

                    if (m.Nodes.Count > 0)
                        ff(m.Nodes);
                }
            }

            ff(this.Menu);

            foreach (var m in this.EveryOneAuths)
            {
                auths.Add(m);
            }

            foreach (var m in this.LoginAuths)
            {
                auths.Add(m);
            }

            foreach (var m1 in this.RoleAuths)
            {
                foreach (var m in m1.Auths)
                {
                    auths.Add(m);
                }
            }

            return auths.Distinct().ToList();
        }

        /// <summary>
        /// 初始功能表結構、自動給予每個節點(樹葉) a unique id         
        /// /// </summary>
        public void Init()
        {
            void setNode(MenuNode node, string nodeid)
            {
                if (node.Nodes.Count == 0)
                {
                    node.Id = nodeid;
                    return;
                }
                else
                {
                    var start = 1;
                    foreach (var snode in node.Nodes)
                    {
                        setNode(snode, $"{nodeid}.{start}");
                        start++;
                    }
                }
            }

            var i = 1;
            foreach (var node in this.Menu)
            {
                setNode(node, $"{i}");
                i++;                
            }
        }
    }
}
