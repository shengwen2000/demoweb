using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApp.Models;

namespace web001.Controllers
{
    public class HelloController : Controller
    {
        public IActionResult Index()
        {
            var m = new HelloViewModel();
            m.Name = "Kevin";
            m.Note = "this is a note";
            return View(m);
        }

        [HttpPost]
        public IActionResult Index(HelloViewModel model)
        {
            //mode.Name 由於 view 綁定輸入Input 會有保護禁止修改。 下達 ModelState.Clear()才可異動。
            model.Name = DateTime.Now.ToString();
            ModelState.Clear(); 清除輸入保護

            //model.Note 由於 view 僅是輸出所以可隨時改
            model.Note = DateTime.Now.ToString();
            return View(model);
        }
    }
}