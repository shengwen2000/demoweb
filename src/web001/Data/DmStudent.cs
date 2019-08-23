using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Data
{
    /// <summary>
    /// 學生
    /// </summary>
    public class DmStudent
    {
        /// <summary>
        /// Primary Key
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string No { get; set; }

        [MaxLength(20)]
        public string Name { get; set; }

        /// <summary>
        /// 所上的課程
        /// </summary>
        public List<DmStuCour> Courses { get; set; }
    }
}
