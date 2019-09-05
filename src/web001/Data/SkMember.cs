using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Data
{
    /// <summary>
    /// 會員
    /// </summary>
    public class SkMember
    {
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// 上線Id
        /// </summary>
        public int? ParentId { get; set; }

        /// <summary>
        /// 上線
        /// </summary>
        public SkMember Parent { get; set; }

        /// <summary>
        /// 一階下線會員
        /// </summary>
        public List<SkMember> Childs { get; set; }

        /// <summary>
        /// 加入日
        /// </summary>
        public DateTime EntryDate { get; set; } = DateTime.Today;

        /// <summary>
        /// 退出日(最後退出日)
        /// </summary>
        public DateTime? LeaveDate { get; set; }   

        /// <summary>
        /// 編号
        /// </summary>
        [MaxLength(10)]
        public string No { get; set; }

        /// <summary>
        /// 姓名
        /// </summary>
        [MaxLength(20)]
        public string Name { get; set; }

        /// <summary>
        /// 生日
        /// </summary>
        public DateTime? Birth { get; set; }       

        /// <summary>
        /// 地址(JSON)
        /// </summary>
        [MaxLength(500)]
        public string Addr { get; set; }

        /// <summary>
        /// Email
        /// </summary>
        [MaxLength(100)]
        public string Email { get; set; }

        /// <summary>
        /// LineNo
        /// </summary>
        [MaxLength(100)]
        public string LineNo { get; set; }

        /// <summary>
        /// 市內電話(JSON)
        /// </summary>
        [MaxLength(100)]
        public string Phone { get; set; }

        /// <summary>
        /// 行動電話(JSON)
        /// </summary>
        [MaxLength(500)]
        public string Mobile { get; set; }

        /// <summary>
        /// 備註
        /// </summary>
        [MaxLength(500)]
        public string Note { get; set; }     

        /// <summary>
        /// 帳號
        /// </summary>
        public ApplicationUser AppUser { get; set; }

        /// <summary>
        /// 我的產品訂單
        /// </summary>
        public List<SkOrder> Orders { get; set; }          
    }
}
