using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Data
{
    /// <summary>
    /// 訂單
    /// </summary>
    public class SkOrder
    {
        /// <summary>
        /// Primary Key
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Order Number (unique)
        /// </summary>
        [MaxLength(20)]
        public string No { get; set; }

        /// <summary>
        /// 訂購日
        /// </summary>
        public DateTime OrderDate { get; set; }     

        /// <summary>
        /// 會員(為空值時，代表此為訪客購買)
        /// </summary>
        public int? MemberId { get; set; }

        /// <summary>
        /// 會員
        /// </summary>
        public SkMember Member { get; set; }

        /// <summary>
        /// 顧客姓名        
        /// </summary>
        [MaxLength(20)]
        public string CustName { get; set; }      

        /// <summary>
        /// 總價
        /// </summary>
        public int TotalPrice { get; set; }       

        /// <summary>
        /// 備註
        /// </summary>
        [MaxLength(500)]
        public string Note { get; set; }

        /// <summary>
        /// 產品明細
        /// </summary>
        public List<SkOrdItem> Items { get; set; } 

        /// <summary>
        /// Row Version
        /// </summary>
        public byte[] RowVersion { get; set; }
    }
   
}
