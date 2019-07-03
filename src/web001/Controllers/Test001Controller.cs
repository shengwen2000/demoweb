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
    public class Test001Controller : BaseController
    {
        private DefaultQueueContext _qcontext;
        private TaskNotifyService _notifysrv;

        public Test001Controller(DefaultQueueContext qcontext, TaskNotifyService notifysrv)
        {
            _qcontext = qcontext;
            _notifysrv = notifysrv;
        }

        public IActionResult Index()
        {
            return View("Test001");
        }

        [HttpGet]
        [HttpPost]
        public string Add()
        {
            _qcontext.AddHelloMessage($"Hello {DateTime.Now.ToString("HH:mm:ss.fff")}");           
            return $"Add to queue at {DateTime.Now}";
        }

        [HttpGet]
        [HttpPost]
        public async Task<string> Add2()
        {
            var result = await _qcontext.AddHelloMessage($"Hello {DateTime.Now.ToString("HH:mm:ss.fff")}");
            return $"queue {DateTime.Now} result={result}";
        }


        [Authorize()]
        public async Task<JsonResult> AddNotify()
        {
            var notifyid = await _notifysrv.AddNotifyAsync(GetUserId(), $"Long Report @{ DateTime.Now.ToString("mm:ss")}");
            var ctoken = _notifysrv.GetNotifyCancelToken(notifyid);

            var t = Task.Run(async () => {

                await Task.Delay(new TimeSpan(0, 0, 3), ctoken);

                await _notifysrv.SetNotifyRuningAsync(notifyid);

                for (var i=0; i<10; i++)
                {
                    if (ctoken.IsCancellationRequested)
                    {
                        return;
                    }
                    await Task.Delay(1000, ctoken);
                }
                await _notifysrv.SetNotifyCompleteAsync(notifyid, new TaskNotifyResult { Result = "OK", Message = "Success", Kind = TaskNotifyResultKind.Download, Content = "http://www.google.com" });
            });
            return Json(new { Result = "OK", Message = $"notify={notifyid} is append" });
        }

        [Authorize()]
        public async Task<JsonResult> CancelNotify(int id)
        {
            await _notifysrv.SetNotifyCancelAndRemoveAsync(id);
            return Json(new { Result = "OK", Message = $"notify={id} is cancel" });
        }


        [Authorize()]
        public async Task<JsonResult> QueryNotifys(int verid)
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