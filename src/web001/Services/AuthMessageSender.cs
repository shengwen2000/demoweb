using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace WebApp.Services
{
    // This class is used by the application to send Email and SMS
    // when you turn on two-factor authentication in ASP.NET Identity.
    // For more details see this link http://go.microsoft.com/fwlink/?LinkID=532713
    public class AuthMessageSender : IEmailSender, ISmsSender
    {
        private SendGridConfig _sendgrid;
        private ILogger<AuthMessageSender> _log;

        public AuthMessageSender(IOptions<SendGridConfig> sendgrid, ILogger<AuthMessageSender> log)
        {
            _sendgrid = sendgrid.Value;
            _log = log;
        }

        public Task SendEmailAsync(string email, string subject, string message1)
        {
            return SendEmail(email, subject, message1);
        }

        private async Task SendEmail(string email, string subject, string message)
        {
            var msg = new SendGridMessage();
            msg.SetFrom(new EmailAddress(_sendgrid.SenderEmail, _sendgrid.SenderName));

            var emails = new List<EmailAddress>();
            if (!string.IsNullOrEmpty(_sendgrid.ReceiveEmail))
                emails.Add(new EmailAddress(_sendgrid.ReceiveEmail));
            else
                emails.Add(new EmailAddress(email));

            msg.AddTos(emails);
            var sujecttxt = $"{_sendgrid.SubjectPrefix}{subject}";
            msg.SetSubject(sujecttxt);
            msg.AddContent(MimeType.Html, message);

            var client = new SendGridClient(_sendgrid.ApiKey);

            var response = await client.SendEmailAsync(msg);

            var emailstxt = string.Join(";", emails.Select(x => string.IsNullOrEmpty(x.Name) ? $"{x.Email}" : $"{x.Email}<{x.Name}>"));

            _log.LogInformation($"Email Subject={sujecttxt} To={emailstxt} Response={response.StatusCode} {message}");
        }

        public Task SendSmsAsync(string number, string message)
        {
            // Plug in your SMS service here to send a text message.
            return Task.FromResult(0);
        }
    }
}
