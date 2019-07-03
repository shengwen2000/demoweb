using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Services
{
    /// <summary>
    /// Id編碼保護設定
    /// </summary>
    public class IdEncodeConfig
    {
        /// <summary>
        /// 當解碼失敗傳回哪個值代表
        /// </summary>
        public int NGNumber { get; set; }

        /// <summary>
        /// 變更位數順序值，兩兩為一對交換
        /// </summary>
        public int[] ExchangeOrders { get; set; }

        /// <summary>
        /// 亂數號碼 長度9碼(禁止有0) 填補長度用
        /// </summary>
        public string Random { get; set; }
    }
}
