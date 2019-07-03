using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.StaticFiles;
using WebApp.Services;
using Newtonsoft.Json.Linq;

namespace WebApp.Controllers
{
    [Authorize(Policy = "SYS001")]    
    public class SYS001Controller : Controller
    {
        private QueryPagerService _pager;
        private IHostingEnvironment _env;

        public SYS001Controller(IHostingEnvironment env, QueryPagerService pager)
        {
            _env = env;
            _pager = pager;
        }
       
        public IActionResult Index()
        {
            return View("SYS001");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Data_Query(string id = null)
        {
            try
            {
                var folder = Path.Combine(_env.ContentRootPath, "log");
                var info = new DirectoryInfo(folder);
                if (!info.Exists)
                {
                    return Json(new { Result = "NG", Message = "Log Directory Not Exists." });
                }
                var records = info.GetFiles()
                    .Select(x => new
                    {
                        Id = x.Name,
                        x.Name,
                        x.LastWriteTime,                       
                        LengthK = (float)Math.Round(x.Length / 1024f, 1),
                        LengthM = (float)Math.Round(x.Length / 1048576f, 1),
                    })                    
                    .WhereIf(id.IsTrue(), x => x.Id == id)
                    .ToList()
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
        /// <param name="orderby">排序條件</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Data_PageQuery(string pg_name = "", string pg_oname = "", int pg_idx = 0, int pg_count = 20, string name = null, DateTime? date1 = null, string orderby = null)
        {
            
            try
            {
                //remove old data
                if (!pg_oname.IsNullOrEmpty())
                    _pager.Remove(pg_oname);

                //新建查詢
                if (pg_name.IsNullOrEmpty())
                {
                    var today = DateTime.Today;

                    var folder = Path.Combine(_env.ContentRootPath, "log");
                    var info = new DirectoryInfo(folder);
                    if (!info.Exists)
                    {
                        return Json(new { Result = "NG", Message = "Log Directory Not Exists." });
                    }
                    var qry = info.GetFiles()
                        .Select(x => new Data_Record
                        {
                            Id = x.Name,
                            Name = x.Name,
                            LastWriteTime = x.LastWriteTime,                            
                            LengthK = (float)Math.Round(x.Length / 1024f, 1),
                            LengthM = (float)Math.Round(x.Length / 1048576f, 1),
                        })
                        .AsEnumerable()
                        .WhereIf(name.IsTrue(), x => x.Name.IndexOf(name,StringComparison.OrdinalIgnoreCase) >=0)
                        .WhereIf(date1.HasValue, x => x.LastWriteTime >= date1.Value)                        
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

        void Data_Orderby(ref IEnumerable<Data_Record> qry, string orderby)
        {
            if (orderby.IsNullOrEmpty())
                return;

            {
                var v = JObject.Parse(orderby);
                var col = v.Value<string>("Column");
                var desc = v.Value<bool>("Desc");
                //檔名	日期	長度(byte)
                //['加入日', '編號', '姓名', '等級' ]"
                switch (col)
                {
                    case "檔名":
                        if (desc)
                            qry = qry.OrderByDescending(x => x.Name);
                        else
                            qry = qry.OrderBy(x => x.Name);
                        break;
                    case "日期":
                        if (desc)
                            qry = qry.OrderByDescending(x => x.LastWriteTime);
                        else
                            qry = qry.OrderBy(x => x.LastWriteTime);
                        break;
                    case "大小(k)":
                        if (desc)
                            qry = qry.OrderByDescending(x => x.LengthK);
                        else
                            qry = qry.OrderBy(x => x.LengthK);
                        break;
                }
            }
        }


        [HttpPost]
        public JsonResult Data_Get(string Id)
        {
            try
            {
                //檢查檔名沒有被附加路徑
                var file1 = Path.GetFileName(Id);
                if (file1 != Id)
                {
                    return Json(new { Result = "NG", Message = $"{Id} Not Exists." });
                }

                var file = Path.Combine(_env.ContentRootPath, "log", Id);
                var finfo = new FileInfo(file);

                var record = new Data_Record
                {
                    Id = finfo.Name,
                    Name = finfo.Name,
                    LastWriteTime = finfo.LastWriteTime,
                    //Length = blob.Properties.Length,
                    LengthK = (float)Math.Round(finfo.Length / 1024f, 1),
                    LengthM = (float)Math.Round(finfo.Length / 1048576f, 1),
                };

                //less or equ than 1m auto load content
                if ((int)finfo.Length <= 1048576)
                {
                    var txt = System.IO.File.ReadAllText(file);
                    record.Content = txt;
                }
                return Json(new { Result = "OK", Message = "Success", Record = record });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "NG", Message = ex.Message });
            }            
        }

        /// <summary>
        /// 下載檔案
        /// </summary>
        /// <param name="Id">The Log's FileName</param>
        /// <returns></returns>       
        [HttpGet]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Download(string Id)
        {
            //檢查檔名沒有被附加路徑
            var file1 = Path.GetFileName(Id);
            if (file1 != Id)
            {
                return this.Content($"{Id} Not Exists");
            }

            var fileabs = Path.Combine(_env.ContentRootPath, "log", Id);
            if (!System.IO.File.Exists(fileabs))
            {
                return this.Content($"{Id} Not Exists");
            }

            string contentType;
            new FileExtensionContentTypeProvider().TryGetContentType(Id, out contentType);
            if (string.IsNullOrEmpty(contentType))
                contentType = "application/octet-stream";

            var fs = new FileStream(fileabs, FileMode.Open, FileAccess.Read, FileShare.Read);
            Response.Headers["Content-Disposition"] = new ContentDispositionHeaderValue("attachment")
            {
                FileName = Id
            }.ToString();
            return this.File(fs, contentType);
        }

        private class Data_Record
        {
            public string Id { get; set; }
            public DateTimeOffset LastWriteTime { get; set; }
            public string Name { get; set; }
            //public long Length { get; set; }
            public float LengthK { get; set; }
            public float LengthM { get; set; }
            public string Content { get; set; }
        }
    }
}