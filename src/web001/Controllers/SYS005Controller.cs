using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Shengwen.Primary;
using Shengwen.Scheduler;
using Shengwen.Scheduler.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApp.Data;
using WebApp.Services;

namespace WebApp.Controllers
{
    /// <summary>
    /// 系統排程任務
    /// </summary>
    [Authorize(Policy = "SYS005")]
    public class SYS005Controller : Controller
    {
        private ApplicationDbContext _ctx;
        private QueryPagerService _pager;
        private SchedulerService _srv;

        /// <summary>
        /// ctor
        /// </summary>
        /// <param name="ctx"></param>
        public SYS005Controller(ApplicationDbContext ctx, QueryPagerService pager, SchedulerService lvhol)
        {
            _ctx = ctx;
            _pager = pager;
            _srv = lvhol;
        }

        public ActionResult Index()
        {
            return View("SYS005");
        }

        /// <summary>
        /// 初始資料
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult FormInit()
        {
            try
            {
                //var vv1 = _ctx.Set<AsusSrv>()
                //    .OrderBy(x => x.Id)
                //    .Select(x => new { x.Id, Name = x.Title })
                //    .OrderBy(x => x.Name)
                //    .ToList()
                //    ;

                return Json(new { Result = "OK", Message = "Success", Record = new { _srv.Primary.IsPrimary, _srv.Options.IsEnable } });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "NG", Message = ex.Message });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="name"></param>     
        /// <returns></returns>
        [HttpPost]
        public JsonResult Data_Query(int? id)
        {
            try
            {   
                var records = _srv.GetJobInfos(_ctx)
                    .AsNoTracking()
                    .WhereIf(id.HasValue, x => x.Id == id)                    
                    .AsEnumerable()
                    .Select(x => new Data_Record
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Title = x.Title,                        
                        NextRun = x.NextRun,
                        IsEnable = x.IsDisable == false,
                        LastRun = x.LastRun,
                        State = Enum.GetName(typeof(JobState), x.State),
                    })                   
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
                    var qry = _srv.GetJobInfos(_ctx)
                        .AsNoTracking()
                        .WhereIf(name.IsNullOrEmpty() == false, x => x.Name.Contains(name) || x.Title.Contains(name))
                        .AsEnumerable()
                        .Select(x => new Data_Record
                        {
                            Id = x.Id,
                            Name = x.Name,
                            Title = x.Title,                            
                            NextRun = x.NextRun,
                            IsEnable = x.IsDisable == false,
                            LastRun = x.LastRun,
                            State = Enum.GetName(typeof(JobState), x.State),
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
                    case "啟用":
                        if (desc)
                            qry = qry.OrderByDescending(x => x.IsEnable);
                        else
                            qry = qry.OrderBy(x => x.IsEnable);
                        break;
                    case "名稱":
                        if (desc)
                            qry = qry.OrderByDescending(x => x.Name);
                        else
                            qry = qry.OrderBy(x => x.Name);
                        break;
                    case "狀態":
                        if (desc)
                            qry = qry.OrderByDescending(x => x.State);
                        else
                            qry = qry.OrderBy(x => x.State);
                        break;
                    case "最後執行":
                        if (desc)
                            qry = qry.OrderByDescending(x => x.LastRun);
                        else
                            qry = qry.OrderBy(x => x.LastRun);
                        break;
                    case "下次執行":
                        if (desc)
                            qry = qry.OrderByDescending(x => x.NextRun);
                        else
                            qry = qry.OrderBy(x => x.NextRun);
                        break;                   
                }
            }
        }

        /// <summary>
        /// 觸發任務
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<JsonResult> Task_InvokeNow(int id)
        {
            var name = await _srv.GetJobInfos(_ctx).AsNoTracking()
                .Where(x => x.Id == id)
                .Select(x => x.Name)
                .FirstOrDefaultAsync()
                ;

            var t = Task.Run(async () => await _srv.RunJobNowAsync(name));
            return Json(new { Result = "OK", Message = "Success" });
        }

        [HttpPost]
        public async Task<JsonResult> Task_Enable(int id, bool enable)
        {
            try
            {
                var job = await _srv.GetJobInfos(_ctx)
                    .Where(x => x.Id == id)
                    .FirstOrDefaultAsync()
                    ;
                job.IsDisable = !enable;
                await _ctx.SaveChangesAsync();
                return Json(new { Result = "OK", Message = "Success" });
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

        [HttpPost]
        public JsonResult Data_Get(int id)
        {
            var record = _srv.GetJobInfos(_ctx)
                .AsNoTracking()
                .Where(x => x.Id == id)
                .Include(x => x.Crons)
                .Include(x => x.Results)
                .AsEnumerable()
                .Select(x => new Data_Record
                {
                    Id = x.Id,
                    Name = x.Name,
                    Title = x.Title,                   
                    NextRun = x.NextRun,
                    IsEnable = x.IsDisable == false,
                    LastRun = x.LastRun,
                    State = Enum.GetName(typeof(JobState), x.State),
                })         
                .FirstOrDefault()
                ;
          
            if (record == null)
                return Json(new { Result = "NG", Message = "No This Task" });
            return Json(new { Result = "OK", Record = record, Message = "Success" });
        }

        public class Data_Record
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public DateTime? NextRun { get; set; }
            public DateTime? LastRun { get; set; }           
            public bool IsEnable { get; set; }
            public string Title { get; set; }
            public string State { get; set; }
        }
    }
}
