using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Data
{
    /// <summary>
    /// 學生與課程多對多
    /// </summary>
    public class DmStuCour
    {
        public int StudentId { get; set; }
        
        public DmStudent Student { get; set; }

        public int CourseId { get; set; }

        public DmCourse Course { get; set; }
    }
}
