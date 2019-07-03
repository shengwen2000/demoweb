using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApp.Data;

namespace WebApp.Services
{
    /// <summary>
    /// Id 加解密的服務
    /// 為了不讓人可以隨意的輸入ID
    /// 每個使用者的編碼會不一樣，各使用者編碼無法互通。
    /// </summary>
    public class IdEncodeService
    { 
        private IServiceScopeFactory _scoped;
        private ApplicationDbContext _ctx;
        private Random _rnd;
        private IdEncodeConfig _config;
        Dictionary<int, int> _xormap = new Dictionary<int, int>();

        public IdEncodeService(IServiceScopeFactory scoped, ApplicationDbContext ctx, IOptions<IdEncodeConfig> config)
        {
            _scoped = scoped;
            _ctx = ctx;
            _rnd = new Random((int)DateTime.Now.Ticks);
            _config = config.Value;
        }

        /// <summary>
        /// 編碼後的長度固定為13碼
        /// </summary>
        /// <param name="userid">user's id</param>
        /// <param name="num">must be positive</param>
        /// <returns></returns>
        public long Encode(int num, int userid)
        {
            var xorn = GetXorNum(userid);
            return EncodeNum14(num, xorn, _config.Random);
        }

        /// <summary>
        /// 解碼
        /// </summary>
        /// <param name="userid">user's id</param>
        /// <param name="num14">the num encode</param>
        /// <returns>-1 is error format</returns>
        public int Decode(long num14, int userid)
        {
            var xorn = GetXorNum(userid);
            return DecodeNum14(num14, xorn);
        }

        private int GetXorNum(int userid)
        {
            int fGetOrCreateFromDb()
            {
                var record = _ctx.Set<SysIdEncode>().AsNoTracking()
                   .Where(x => x.Id == userid)
                   .FirstOrDefault()
                   ;

                if (record != null)
                    return record.XorNum;

                //create a new one
                using (var scope = _scoped.CreateScope())
                {
                    var ctx = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    record = new SysIdEncode();
                    record.Id = userid;
                    record.XorNum = _rnd.Next(100000, 1000000);
                    ctx.Add(record);
                    ctx.SaveChanges();

                    return record.XorNum;
                }
            }

            //from memory cache
            if (_xormap.TryGetValue(userid, out int xorn))
                return xorn;
            //from database
            xorn = fGetOrCreateFromDb();
            _xormap.Add(userid, xorn);
            return xorn;
        }

        private long EncodeNum14(int num, int xornum, string random)
        {
            //1CCLRRRXXXXXXX => number of digit is 14
            //C sumcheck(LRRRXXXXXXX) => 1-9
            //L the length of R
            //X the number ^ xornum
            var n1 = num ^ xornum;
            var xx = n1.ToString().ToCharArray();
            //亂數位數(0-9)
            var nd_r = 10 - xx.Length;
            //int pow10(int n)
            //{
            //    if (n > 1)
            //        return 10 * pow10(n - 1);
            //    else
            //        return 1;
            //}
            //var rr = new char[0];
            //if (nd_r > 0)
            //{
            //    rr = random.Next(pow10(nd_r), pow10(nd_r + 1)).ToString().ToCharArray();
            //}
            var rr = random.Substring(0, nd_r).ToCharArray();

            //checksum
            //L*1 + R*2 + R*3 ...
            var p = 1;
            var checksum = 0;
            checksum += nd_r * p++;
            foreach (var r in rr)
                checksum += (r - '0') * p++;
            foreach (var x in xx)
                checksum += (x - '0') * p++;
            checksum = checksum % 100; //0-99
            var nn = $"1{checksum.ToString().PadLeft(2, '0')}{nd_r}{new string(rr)}{new string(xx)}".ToCharArray();

            //change the order
            var count = _config.ExchangeOrders.Length / 2;
            for (var i = 0; i < count; i++)
            {
                var a = _config.ExchangeOrders[i * 2] % 13 + 1;
                var b = _config.ExchangeOrders[i * 2 + 1] % 13 + 1;
                if (a == b)
                    continue;

                var t = nn[a];
                nn[a] = nn[b];
                nn[b] = t;
            }
            return long.Parse(new string(nn));
        }

        private int DecodeNum14(long num14, int xornum)
        {
            //1CCLRRRXXXXXXX => number of digit is 14
            var nn = num14.ToString().ToCharArray();
            if (nn.Length != 14 || nn[0] != '1')
                return _config.NGNumber;

            //change the order back
            var count = _config.ExchangeOrders.Length / 2;
            var idx = (count - 1) * 2;
            for (var i = 0; i < count; i++)
            {
                var a = _config.ExchangeOrders[idx] % 13 + 1;
                var b = _config.ExchangeOrders[idx + 1] % 13 + 1;
                if (a != b)
                {
                    var t = nn[a];
                    nn[a] = nn[b];
                    nn[b] = t;
                }
                idx -= 2;
            }

            //checksum
            //L*1 + R*2 + R*3 ...         
            var p = 1;
            var checksum = 0;
            for (var i = 3; i <= 13; i++)
            {
                checksum += (nn[i] - '0') * p++;
            }
            checksum = checksum % 100; //0-99

            if (checksum != (nn[1] - '0') * 10 + (nn[2] - '0'))
                return _config.NGNumber;
            var nd_r = nn[3] - '0';
            var n1 = int.Parse(new string(nn, 4 + nd_r, nn.Length - 4 - nd_r));
            var num = n1 ^ xornum;
            return num;
        }
    }
}
