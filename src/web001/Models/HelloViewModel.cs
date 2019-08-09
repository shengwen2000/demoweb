using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models
{
    public class HelloViewModel
    {
        [Required]
        [MaxLength(100)]
        [Display(Name ="Your Name")]
        public string Name { get; set; }

        public string Note { get; set; }
    }
}
