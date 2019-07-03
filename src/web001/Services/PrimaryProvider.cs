using Shengwen.Primary;
using Shengwen.Scheduler;
using System;
using System.Collections.Generic;
using System.Text;

namespace WebApp.Services
{
    public class PrimaryProvider : IPrimaryProvider
    {
        private PrimaryService _primary;

        public PrimaryProvider(PrimaryService primary)
        {
            _primary = primary;
        }

        public bool IsPrimary => _primary.IsPrimary;
    }
}
