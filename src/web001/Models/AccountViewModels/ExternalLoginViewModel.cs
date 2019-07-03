using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.AccountViewModels
{
    public class ExternalLoginViewModel
    {
        [Display(Name = "帳號")]
        [Required]
        [EmailAddress]
      
        public string Email { get; set; }

        [Required]
        [StringLength(20)]
        [Display(Name ="姓名")]
        public string EX_Name { get; set; }

        [Required]
        [StringLength(20)]
        [Display(Name = "電話")]
        public string PhoneNumber { get; set; }
    }
}
