using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.AccountViewModels
{
    public class ExternalLoginViewModel
    {
        [Display(Name = "�b��")]
        [Required]
        [EmailAddress]
      
        public string Email { get; set; }

        [Required]
        [StringLength(20)]
        [Display(Name ="�m�W")]
        public string EX_Name { get; set; }

        [Required]
        [StringLength(20)]
        [Display(Name = "�q��")]
        public string PhoneNumber { get; set; }
    }
}
