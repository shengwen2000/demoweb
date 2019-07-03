using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using WebApp.Data;

using Microsoft.EntityFrameworkCore;
using System.Threading;
using Shengwen.Scheduler;
using System.Threading.Tasks;

namespace WebApp.Services
{
    /// <summary>
    /// Some of Database Resource Recycle
    /// </summary>
    public class DatabaseRecycleTask : IJob
    {
        private IServiceScopeFactory _scopeFactory;
        private ILogger<SchedulerService> _logger;

        public DatabaseRecycleTask(IServiceScopeFactory scopeFactory, ILogger<SchedulerService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        public async Task ExecuteAsync(IJobContext jobctx, CancellationToken cancellation)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var ctx = scope.ServiceProvider.GetService<ApplicationDbContext>();
                _logger.LogInformation("訊息通知(超過7天)");

                //var mindate = DateTime.Today.AddDays(-60);
                //var vv = ctx.Set<CruxMessage>()
                //    .Where(x => x.Created < mindate)                    
                //    ;
                //var c = 0;
                //foreach (var v in vv)
                //{
                //    ctx.Remove(v);
                //    c++;
                //}

                //if (c > 0)
                //{
                //    await ctx.SaveChangesAsync();
                //    _logger.LogInformation($"共{c}筆資料刪除");
                //}

                await Task.Delay(1000);

                _logger.LogInformation("Success");
            }
        }
    }
}
