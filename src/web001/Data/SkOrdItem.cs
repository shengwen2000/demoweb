using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Data
{
    /// <summary>
    /// 訂單明細
    /// </summary>
    public class SkOrdItem
    {
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// 訂單
        /// </summary>
        public int OrderId { get; set; }

        /// <summary>
        /// 訂單
        /// </summary>
        public SkOrder Order { get; set; }

        /// <summary>
        /// 產品
        /// </summary>
        public int ProductId { get; set; }

        /// <summary>
        /// 產品
        /// </summary>
        public SkProduct Product { get; set; }

        /// <summary>
        /// 數量
        /// </summary>
        public int Qty { get; set; }

        /// <summary>
        /// 單價
        /// </summary>
        public int UnitPrice { get; set; }

        /// <summary>
        /// 總價
        /// </summary>
        public int TotalPrice { get; set; }
    }
}
