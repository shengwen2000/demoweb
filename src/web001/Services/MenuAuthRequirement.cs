using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;

using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using WebApp.Data;
using WebApp.Services.Menu;

namespace WebApp.Services
{
    /// <summary>
    /// 功能表權限要求
    /// </summary>
    public class MenuAuthRequirement : IAuthorizationRequirement
    {
        public MenuAuthRequirement(string code)
        {
            AuthCode = code;
        }

        public string AuthCode { get; private set; }
        
    }

    /// <summary>
    /// 功能表權限要求限制實作
    /// </summary>
    public class MenuAuthHandler : AuthorizationHandler<MenuAuthRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, MenuAuthRequirement requirement)
        {
            var mvcContext = context.Resource as Microsoft.AspNetCore.Mvc.Filters.AuthorizationFilterContext;
            var ms = mvcContext.HttpContext.RequestServices.GetService<MenuService>();
            if (ms.IsAuth(context.User, requirement.AuthCode))
            {
                context.Succeed(requirement);
            }
            //else
            //{
            //    context.Fail();
            //}
            return Task.CompletedTask;
        }
    }
}
