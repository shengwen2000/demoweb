using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using WebApp.Data;

namespace WebApp.Services
{
    public static class EmailSenderExtensions
    {
        public static Task SendEmailConfirmationAsync(this IEmailSender emailSender, string email, string link, ApplicationUser user)
        {
            return emailSender.SendEmailAsync(email, "郵件驗證信",
                $"{user.EX_Name}-你好 為了驗證你的郵件請按下連結: <a href='{HtmlEncoder.Default.Encode(link)}'>郵件確認</a>");
        }
    }
}
