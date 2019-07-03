using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.ManageViewModels
{
    public class ChangePasswordViewModel
    {

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "目前密碼")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "{0}最少{2}字元，最大{1}字元.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "新密碼")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "新密碼確認")]
        [Compare("NewPassword", ErrorMessage = "輸入密碼不相符，請重新輸入。")]
        public string ConfirmPassword { get; set; }

        public string StatusMessage { get; set; }
    }
}
