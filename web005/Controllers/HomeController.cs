using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using web005.Data;
using web005.Models;

namespace web005.Controllers
{
    public class HomeController : Controller
    {
        private ApplicationDbContext _ctx;

        public HomeController(ApplicationDbContext ctx)
        {
            _ctx = ctx;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            var a = new DemoStudent();
            a.No = "124567";
            a.Name = "david";
            _ctx.Add(a);
            _ctx.SaveChanges();

            return Content("insert ok ");

            //ViewData["Message"] = "Your application description page.";

            //return View();
        }

        public IActionResult Contact()
        {
            var v = _ctx.Set<DemoStudent>()
                .OrderBy(x => x.No)
                .Take(1)
                .FirstOrDefault()
                ;
            
            return Content($"id={v.Id} no={v.No} name={v.Name}");
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
