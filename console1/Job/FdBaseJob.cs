using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Services;

namespace WebApp.Job
{
    internal class FdBaseJob
    {
        protected FdServerConfig _config;

        public FdBaseJob(IOptions<FdServerConfig> config)
        {
            _config = config.Value;
        }
    }
}
