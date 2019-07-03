using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.ManageViewModels
{
    public class SetPasswordViewModel
    {
        [Required]
        [StringLength(100, ErrorMessage = " {0} 最少 {2}字元長度.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "新密碼")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "再次確認")]
        [Compare("NewPassword", ErrorMessage = "密碼輸入不一致")]
        public string ConfirmPassword { get; set; }

        public string StatusMessage { get; set; }
    }
}
