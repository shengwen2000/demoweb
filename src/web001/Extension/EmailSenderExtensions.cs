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
            return emailSender.SendEmailAsync(email, "�l�����ҫH",
                $"{user.EX_Name}-�A�n ���F���ҧA���l��Ы��U�s��: <a href='{HtmlEncoder.Default.Encode(link)}'>�l��T�{</a>");
        }
    }
}
