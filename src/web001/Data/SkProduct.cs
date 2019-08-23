using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Data
{
    /// <summary>
    /// 產品主檔
    /// </summary>
    public class SkProduct
    {
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// 品名
        /// </summary>
        [MaxLength(20)]
        public string Name { get; set; }

        /// <summary>
        /// 售價
        /// </summary>
        public int Price { get; set; }

        /// <summary>
        /// 會員售價
        /// </summary>
        public int MemberPrice { get; set; }

        /// <summary>
        /// 產品代碼
        /// </summary>
        [MaxLength(20)]
        public string Code { get; set; }

        /// <summary>
        /// 上架日
        /// </summary>
        public DateTime? EnableDate { get; set; }

        /// <summary>
        /// 下架日
        /// </summary>
        public DateTime? DisableDate { get; set; }

        /// <summary>
        /// 是否上架中
        /// </summary>
        public bool IsEnable { get; set; }
    }
}
