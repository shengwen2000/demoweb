using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace WebApp.Models.ManageViewModels
{
    public class IndexViewModel
    {
        [Display(Name ="帳號")]
        public string Username { get; set; }

        [Display(Name = "姓名")]
        [MaxLength(20)]
        [Required]
        public string EX_Name { get; set; }

        public bool IsEmailConfirmed { get; set; }

        //[Required]
        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        [Display(Name = "電話")]
        public string PhoneNumber { get; set; }

        public string StatusMessage { get; set; }
    }
}
