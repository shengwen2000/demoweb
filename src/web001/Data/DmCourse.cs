using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Data
{
    /// <summary>
    /// 課程
    /// </summary>
    public class DmCourse
    {
        /// <summary>
        /// Primary Key
        /// </summary>
        [Key]
        public int Id { get; set; }

        [MaxLength(20)]
        public string Name { get; set; }

        /// <summary>
        /// 課程所屬學生
        /// </summary>
        public List<DmStuCour> Students { get; set; }
    }
}
