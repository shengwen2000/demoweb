using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WebApp.Helper
{
    /// <summary>
    /// 網路函數
    /// </summary>
    static public class NetHelper
    {
        /// <summary>
        /// HttpPost
        /// </summary>
        /// <param name="url"></param>
        /// <param name="json"></param>
        /// <param name="timeout">Timeout微秒</param>
        /// <param name="ssl_error_pass">忽略SSL憑證錯誤</param>
        /// <returns></returns>
        public static string HttpJsonPost(string url, string json, int timeout, Encoding encode, Action<HttpClient> init = null, bool ssl_error_pass = false)
        {
            var r = HttpJsonPostAsync(url, json, timeout, encode, CancellationToken.None, init, ssl_error_pass);
            r.Wait();
            return r.Result;
        }

        /// <summary>
        /// HttpPost
        /// </summary>
        /// <param name="url"></param>
        /// <param name="json"></param>
        /// <param name="timeout">Timeout微秒</param>
        /// <param name="ctoken">Cancel Token</param>
        /// <param name="ssl_error_pass">忽略SSL憑證錯誤</param>
        /// <returns></returns>
        static public async Task<string> HttpJsonPostAsync(string url, string json, int timeout, Encoding encode, CancellationToken ctoken, Action<HttpClient> init = null, bool ssl_error_pass = false)
        {
            if (ssl_error_pass)
            {
                using (var handler = new HttpClientHandler())
                {
                    handler.ClientCertificateOptions = ClientCertificateOption.Manual;
                    handler.ServerCertificateCustomValidationCallback = (a, b, c, d) => true;

                    using (var client = new HttpClient(handler))
                    {
                        client.Timeout = new TimeSpan(0, 0, 0, 0, timeout);
                        if (init != null)
                            init(client);
                        var resp = await client.PostAsync(url, new StringContent(json, encode, "application/json"), ctoken);
                        var s = await resp.Content.ReadAsStreamAsync();
                        using (var sr = new StreamReader(s, encode))
                        {
                            var txt = await sr.ReadToEndAsync();
                            return txt;
                        }
                    }
                }
            }
            else
            {
                using (var client = new HttpClient())
                {
                    client.Timeout = new TimeSpan(0, 0, 0, 0, timeout);
                    if (init != null)
                        init(client);
                    var resp = await client.PostAsync(url, new StringContent(json, encode, "application/json"), ctoken);
                    var s = await resp.Content.ReadAsStreamAsync();
                    using (var sr = new StreamReader(s, encode))
                    {
                        var txt = await sr.ReadToEndAsync();
                        return txt;
                    }
                }
            }
        }

        /// <summary>
        /// HttpPost
        /// </summary>     
        /// <param name="json"></param>
        /// <param name="timeout">Timeout微秒</param>
        /// <returns></returns>
        static public string HttpJsonGet(string url, int timeout, Encoding encode, Action<HttpClient> init = null, bool ssl_error_pass = false)
        {
            var a = HttpJsonGetAsync(url, timeout, encode, CancellationToken.None, init, ssl_error_pass);
            a.Wait();
            return a.Result;
        }

        /// <summary>
        /// HttpPost
        /// </summary>     
        /// <param name="json"></param>
        /// <param name="timeout">Timeout微秒</param>
        /// <returns></returns>
        static public async Task<string> HttpJsonGetAsync(string url, int timeout, Encoding encode, CancellationToken ctoken, Action<HttpClient> init = null, bool ssl_error_pass = false)
        {
            if (ssl_error_pass)
            {
                using (var handler = new HttpClientHandler())
                {
                    handler.ClientCertificateOptions = ClientCertificateOption.Manual;
                    handler.ServerCertificateCustomValidationCallback = (a, b, c, d) => true;

                    using (var client = new HttpClient(handler))
                    {
                        init?.Invoke(client);

                        client.Timeout = new TimeSpan(0, 0, 0, 0, timeout);
                        var resp = await client.GetAsync(url, ctoken);

                        var s = await resp.Content.ReadAsStreamAsync();
                        using (var sr = new StreamReader(s, encode))
                        {
                            var txt = await sr.ReadToEndAsync();
                            return txt;
                        }
                    }
                }
            }
            else
            {
                using (var client = new HttpClient())
                {
                    client.Timeout = new TimeSpan(0, 0, 0, 0, timeout);
                    var resp = await client.GetAsync(url, ctoken);

                    var s = await resp.Content.ReadAsStreamAsync();
                    using (var sr = new StreamReader(s, encode))
                    {
                        var txt = await sr.ReadToEndAsync();
                        return txt;
                    }
                }
            }
        }

        /// <summary>
        /// 取得資源Stream
        /// </summary>      
        /// <returns></returns>
        public static void HttpGetStream(string url, int timeout, Action<Stream> onStream, bool ssl_error_pass = false)
        {
            var r = HttpGetStreamAsync(url, timeout, CancellationToken.None, onStream, ssl_error_pass);
            r.Wait();
        }

        /// <summary>
        /// 取得資源Stream
        /// </summary>       
        /// <returns></returns>
        static public async Task HttpGetStreamAsync(string url, int timeout, CancellationToken ctoken, Action<Stream> onStream, bool ssl_error_pass = false)
        {
            if (ssl_error_pass)
            {
                using (var handler = new HttpClientHandler())
                {
                    handler.ClientCertificateOptions = ClientCertificateOption.Manual;
                    handler.ServerCertificateCustomValidationCallback = (a, b, c, d) => true;

                    using (var client = new HttpClient(handler))
                    {
                        client.Timeout = new TimeSpan(0, 0, 0, 0, timeout);
                        var resp = await client.GetAsync(url, ctoken);

                        using (var s = await resp.Content.ReadAsStreamAsync())
                        {
                            onStream(s);
                        }
                    }
                }
            }
            else
            {
                using (var client = new HttpClient())
                {
                    client.Timeout = new TimeSpan(0, 0, 0, 0, timeout);
                    var resp = await client.GetAsync(url, ctoken);
                    using (var s = await resp.Content.ReadAsStreamAsync())
                    {
                        onStream(s);
                    }
                }
            }
        }

        /// <summary>
        /// Http Post 
        /// </summary>
        /// <param name="url"></param>
        /// <param name="content">
        /// FormUrlEncodedContent or StringContent(json, encode, "application/json")
        /// </param>
        /// <param name="timeout"></param>
        /// <param name="encode"></param>
        /// <param name="ctoken"></param>
        /// <param name="init"></param>
        /// //FormUrlEncodedContent
        /// <returns></returns>
        async static public Task<string> HttpPostAsync(string url, HttpContent content, int timeout, Encoding encode, CancellationToken ctoken, Action<HttpClient> init = null, bool ssl_error_pass = false)
        {
            if (ssl_error_pass)
            {
                using (var handler = new HttpClientHandler())
                {
                    handler.ClientCertificateOptions = ClientCertificateOption.Manual;
                    handler.ServerCertificateCustomValidationCallback = (a, b, c, d) => true;

                    using (var client = new HttpClient(handler))
                    {
                        client.Timeout = new TimeSpan(0, 0, 0, 0, timeout);
                        if (init != null)
                            init(client);
                        var resp = await client.PostAsync(url, content, ctoken);
                        var s = await resp.Content.ReadAsStreamAsync();
                        using (var sr = new StreamReader(s, encode))
                        {
                            var txt = await sr.ReadToEndAsync();
                            return txt;
                        }
                    }
                }
            }
            else
            {
                using (var client = new HttpClient())
                {
                    client.Timeout = new TimeSpan(0, 0, 0, 0, timeout);
                    if (init != null)
                        init(client);
                    //new StringContent(json, encode, "application/json")
                    var resp = await client.PostAsync(url, content, ctoken);
                    var s = await resp.Content.ReadAsStreamAsync();
                    using (var sr = new StreamReader(s, encode))
                    {
                        var txt = await sr.ReadToEndAsync();
                        return txt;
                    }
                }
            }
        }
    }
}
