using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.AccountViewModels
{
    public class RegisterViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(20, ErrorMessage = "{0} 必須{2}~{1}字元", MinimumLength = 1)]
        [DataType(DataType.Text)]
        [Display(Name = "姓名")]
        public string EX_Name { get; set; }

        [Required]
        [StringLength(20, ErrorMessage = "{0} 必須{2}~{1}字元", MinimumLength = 5)]
        [DataType(DataType.Text)]
        [Display(Name = "電話")]
        public string PhoneNumber { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "密碼")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "密碼確認")]
        [Compare("Password", ErrorMessage = "密碼不一致，請重新輸入。")]
        public string ConfirmPassword { get; set; }

        /// <summary>
        /// 驗證郵件送出
        /// </summary>
        public bool IsEmailSend { get; set; }

        public string StatusMessage { get; set; }

    }
}
