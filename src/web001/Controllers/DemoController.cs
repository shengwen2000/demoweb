using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApp.Data;

namespace WebApp.Controllers
{
    public class DemoController : BaseController
    {
        private ApplicationDbContext _ctx;

        public DemoController(
            ApplicationDbContext ctx
            )
        {
            _ctx = ctx;
        }

        public IActionResult Demo001()
        {
            return View();
        }

        public IActionResult Demo002()
        {
            return View();
        }

        public IActionResult Demo003()
        {
            return View();
        }

        public IActionResult Demo004()
        {
            return View("Demo006");
        }

        public IActionResult Demo005()
        {
            return RedirectToAction("Demo006");

           
            //return RedirectToAction( "Demo006");
            //return View();
        }

        public IActionResult Demo006()
        {
            return View();
        }

        //[HttpGet]
        public IActionResult Demo006Data()
        {
            var vv = _ctx.Set<ApplicationUser>().AsNoTracking()
                .Select(x => new CUser{ Id= x.Id, Name = x.EX_Name, Email = x.Email })
                .OrderBy(x => x.Id)
                ;

            return Json(new { Result="OK", Message="Succes", Users = vv } );
        }

        [HttpPost]
        public IActionResult Demo006Update2([FromBody]List<CUser> users)
        {
            return Json(new { Result = "OK", Message = "Succes", Users = users });
        }

        [HttpPost]
        public IActionResult Demo006Update([FromBody]CUser user)
        {
            try
            {
                var user1 = _ctx.Set<ApplicationUser>().FirstOrDefault(x => x.Id == user.Id);
                user1.EX_Name = user.Name;
                _ctx.SaveChanges();

                return Json(new { Result = "OK", Message = "Succes" });
            }
            catch(Exception ex)
            {
                return Json(new { Result = "EX", Message = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult Demo006Delete(int id)
        {
           
            try
            {
                //var user1 = _ctx.Set<ApplicationUser>().FirstOrDefault(x => x.Id == id);
                //_ctx.Remove(user1);
                //_ctx.SaveChanges();
                return Json(new { Result = "OK", Message = $"user id = {id} delete Succes" });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "EX", Message = ex.Message });
            }
        }

       

        public IActionResult Demo007()
        {
            return View();
        }

        public IActionResult Demo008()
        {
            return View();
        }

        public IActionResult Demo009()
        {
            return View();
        }

        public IActionResult Demo010()
        {
            return View();
        }

        public class CUser
        {
            public int Id { get; set; }

            public string Name { get; set; }

            public string Email { get; set; }
        }
    }
}
