using WebApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using WebApp.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Microsoft.Extensions.Options;
using Shengwen.Primary;

namespace WebApp.Controllers
{
    /// <summary>
    /// 對外收集資料閘道
    /// </summary>
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class GatewayController : ControllerBase
    {
        public GatewayController()
        {
        }

        /// <summary>       
        /// Now
        /// </summary>            
        /// <returns></returns>
        [HttpPost]
        [HttpGet]
        [Route("[action]")]
        public IActionResult Now()
        {
            return Content(DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss", CultureInfo.InvariantCulture));
        }

        /// <summary>       
        /// Ping
        /// </summary>            
        /// <returns></returns>
        [HttpPost]
        [HttpGet]
        [Route("[action]")]
        public IActionResult Ping()
        {
            return Ok();
        }

        [HttpGet]
        public string Get()
        {
            return DateTime.Now.ToString();
        }       

        protected JsonResult Json(object obj)
        {
            var js = new JsonSerializerSettings();
            js.DateFormatHandling = Newtonsoft.Json.DateFormatHandling.IsoDateFormat;
            js.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Unspecified;
            js.ContractResolver = new DefaultContractResolver();            
            return new JsonResult(obj, js);
        }

        /// <summary>
        /// 要求立即重新判定主要伺服器
        /// </summary>
        /// <returns></returns>
        public IActionResult RefreshPrimary([FromServices] PrimaryService primary)
        {
            primary.Refresh();

            return Ok();
        }

        protected string GetClientIP()
        {
            return this.HttpContext.Connection.RemoteIpAddress.ToString();
        }
    }
}
