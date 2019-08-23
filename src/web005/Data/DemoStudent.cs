using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace web005.Data
{
    public class DemoStudent
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(15)]
        public string No { get; set; }

        [MaxLength(20)]
        public string Name { get; set; }
    }
}
