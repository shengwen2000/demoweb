using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using WebApp.Services;

namespace WebApp.Controllers
{
    [RequireHttps]
    public class HomeController : Controller
    {        
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult New001()
        {
            //ViewData["Message"] = "Your contact page.";

            return View("New001");
        }

        public IActionResult Error()
        {
            return View();
        }

        public async Task<IActionResult> Upgrade([FromServices]DatabaseUpgrade srv)
        {
            try
            {
                await srv.Upgrade();
                return Content("Success Upgrade");
            }
            catch (Exception ex)
            {
                return Content(ex.ToString());
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult CommonHtml()
        {
            return View();
        }
    }
}
