using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
namespace WebApp.Data
{
    /// <summary>
    /// 資料庫版本
    /// </summary>
    public class DbVersion
    {
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// 名稱
        /// </summary>
        [MaxLength(20)]
        public string Name { get; set; }

        /// <summary>
        /// 更新日期
        /// </summary>
        public DateTime? UpdateTime { get; set; }
    }
}
