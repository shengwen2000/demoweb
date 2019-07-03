using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net.Http;
using Microsoft.AspNetCore.WebUtilities;
using System.IO;

namespace WebApp.Services
{
    /// <summary>
    /// ReCaptcha Validate
    /// </summary>
    public class ReCAPTCHAValidate
    {
        [JsonProperty("success")]
        public bool Success { get; set; }

        [JsonProperty("error-codes")]
        public List<string> ErrorCodes { get; set; }

        /// <summary>
        /// 驗證
        /// </summary>
        /// <param name="secret">recaptcha's secret</param>
        /// <param name="response">form's g-recaptcha-response </param>
        /// <param name="remoteip">the client's ip</param>
        /// <returns></returns>
        public static async Task<bool> Validate(string secret, string response, string remoteip)
        {
            var url = "https://www.google.com/recaptcha/api/siteverify";
            var pp = new Dictionary<string, string> {
                { "secret",secret },
                { "response",response }               
            };

            //optional 
            if (!string.IsNullOrEmpty(remoteip))
            {
                pp.Add("remoteip", remoteip);
            }
          
            var url2 =QueryHelpers.AddQueryString(url, pp);

            var client = new HttpClient();
            client.Timeout = new TimeSpan(0, 0, 0, 10);            
            var resp = await client.PostAsync(url2, new StringContent(""));
            var s = await resp.Content.ReadAsStreamAsync();
            var sr = new StreamReader(s);
            var txt = await sr.ReadToEndAsync();
            sr.Dispose();
            var captchaResponse = JsonConvert.DeserializeObject<ReCAPTCHAValidate>(txt);
            return captchaResponse.Success;
        }

        
    }
}
