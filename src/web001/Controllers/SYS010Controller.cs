using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Shengwen.QueueTask;
using WebApp.Controllers;
using WebApp.Services;

namespace cruxweb.Controllers
{
    /// <summary>
    /// 通知服務後台
    /// </summary>
    [Authorize]
    public class SYS010Controller : BaseController
    {
        //private DefaultQueueContext _qcontext;
        private TaskNotifyService _notifysrv;

        public SYS010Controller(DefaultQueueContext qcontext, TaskNotifyService notifysrv)
        {
            //_qcontext = qcontext;
            _notifysrv = notifysrv;
        }

        public IActionResult Index()
        {
            return View("SYS010");
        }       
       
        public async Task<JsonResult> CancelNotify(int id)
        {
            await _notifysrv.SetNotifyCancelAndRemoveAsync(id);
            return Json(new { Result = "OK", Message = $"notify={id} is cancel" });
        }
      
        public async Task<JsonResult> QueryNotifies(long verid)
        {
            var rr = await _notifysrv.GetNotifiesAsync(verid, GetUserId());
            return Json(new {
                Result ="OK",
                Message ="Succes",
                VerId = rr.Item1,
                Records = rr.Item2.Select(x => new {x.Id, x.Title, State = x.State.ToString(),
                    Result = x.Result.IsFalse() ? null : JObject.Parse(x.Result)
                    , x.Created })
            });
        }
    }
}