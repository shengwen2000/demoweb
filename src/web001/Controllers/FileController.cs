using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System;
using System.IO;
using System.Linq;
using WebApp.Data;

namespace WebApp.Controllers
{
    /// <summary>
    /// 檔案下載
    /// </summary>    
    [AllowAnonymous]
    public class FileController : Controller
    {
        private ApplicationDbContext _ctx;
        private IHostingEnvironment _env;

        /// <summary>
        /// ctor
        /// </summary>
        public FileController(ApplicationDbContext ctx, IHostingEnvironment env)
        {
            _ctx = ctx;
            _env = env;
        }

        /// <summary>
        /// 下載Download資料夾下的資料
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]        
        public IActionResult Download(string id, string display=null)
        {
            var dir = new DirectoryInfo(Path.Combine(_env.ContentRootPath, $"./temp/download"));
            var f1 = dir.GetFiles(id).FirstOrDefault();
            if (!f1.Exists)
            {
                return NotFound();
            }
            if(display.IsFalse())
            {
                display = f1.Name;
            }
            {
                var fs = new FileStream(f1.FullName, FileMode.Open, FileAccess.Read);
                var fresult = new FileStreamResult(fs, MimeKit.MimeTypes.GetMimeType(display))
                {
                    FileDownloadName = display
                };

                Response.Headers["Content-Disposition"] = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = display
                }.ToString();
                return fresult;
            }
        }
    }
}
