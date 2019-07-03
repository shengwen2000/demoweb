using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Data
{
    /// <summary>
    /// 資料加密key檔
    /// </summary>
    public class SysIdEncode
    {
        /// <summary>
        /// 使用者Id
        /// </summary>    
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        /// <summary>
        /// Xor Num (10000-65535)
        /// </summary>        
        public int XorNum { get; set; }
    }
}
