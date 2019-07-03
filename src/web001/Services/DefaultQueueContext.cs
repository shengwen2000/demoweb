using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApp.Data;
using WebApp.Services;
using System.IO;
using SendGrid;
using System.Globalization;
using Shengwen.QueueTask;
using System.Threading;

namespace WebApp.Services
{
    /// <summary>
    /// a queue handler for test purpose
    /// </summary>
    public class DefaultQueueContext : QueueTaskContext
    {
        private ILogger<DefaultQueueContext> _logger;
        IServiceScopeFactory _scope;
        private SendGridConfig _sendgrid;

        public readonly string QName_Hello = "hello";

        public DefaultQueueContext(IServiceProvider serviceProvider, ILogger<DefaultQueueContext> logger, IServiceScopeFactory scope, IOptions<SendGridConfig> sendgrid) : base(serviceProvider)
        {
            _logger = logger;
            _scope = scope;
            _sendgrid = sendgrid.Value;

            //register queue
            AddQueueProcFunc(QName_Hello, ProcFunc_Hello);
          
            //demo subscribe 
            SubscribeEvent(QName_Hello, EventListener);
        }

        void EventListener(long task_id, QueueEventKind kind)
        {
            _logger.LogInformation($"receive event task={task_id} kind={kind} thread={Thread.CurrentThread.ManagedThreadId}");
        }

        public Task<string> AddHelloMessage(string info)
        {
            return AddTaskAsync(QName_Hello, new { Info = info });
        }


        /// <summary>
        /// for demo
        /// </summary>
        /// <param name="task_id"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        protected async Task ProcFunc_Hello(long task_id, string content)
        {
            try
            {
                var q = JsonConvert.DeserializeAnonymousType(content, new { Info = "" });
                //_logger.LogInformation($"{QName_Hello} taskid={task_id}, content={content} Starting");
                await Task.Delay(5000);
                //_logger.LogInformation($"{QName_Hello} taskid={task_id}, Info={q.Info} success");
                await SetTaskCompleteAsync(QName_Hello, task_id, new { Result = "OK", Message = "Success" });
            }
            catch (Exception ex)
            {
                await SetTaskCompleteAsync(QName_Hello, task_id, new { Result = "EX", Message = ex.Message });
            }
        }        
    }
}
