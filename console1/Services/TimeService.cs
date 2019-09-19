using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WebApp.Services
{
    internal class TimeService : IDisposable
    {
        CancellationTokenSource cts = new CancellationTokenSource();

        public TimeService(IApplicationLifetime life)
        {
            life.ApplicationStopping.Register(() => {
                cts.Cancel();
            });
            Task.Run(MainLoopAsync);
        }

        async Task MainLoopAsync()
        {
            var ctoken = cts.Token;
            while(!ctoken.IsCancellationRequested)
            {
                Console.WriteLine($"NOw is {DateTime.Now}");

                await Task.Delay(TimeSpan.FromSeconds(3), ctoken);
            }
        }

        public void Dispose()
        {
            cts.Cancel();
            Console.WriteLine("end of di");
        }
    }
}
