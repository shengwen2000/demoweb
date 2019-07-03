using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.AccessControl;
using System.Threading.Tasks;

namespace WebApp.Services
{
    /// <summary>
    /// 儲存體服務，提供服務執行中執行紀錄
    /// </summary>
    public class StorageService
    {
        private IHostingEnvironment _env;

        /// <summary>
        /// ctor
        /// </summary>
        /// <param name="env"></param>
        public StorageService(IHostingEnvironment env)
        {
            _env = env;
        }

        /// <summary>
        /// 取得儲存目錄位置
        /// </summary>
        private DirectoryInfo GetStorageDir()
        {
            //make sure directory exists
            var dir = new DirectoryInfo(Path.Combine(_env.ContentRootPath, "Storage"));
            if (!dir.Exists)
            {
                try{ dir.Create(); }
                catch{}
            }
            return dir;
        }

        /// <summary>
        /// 取得儲存體
        /// </summary>
        /// <param name="name">儲存體名稱</param>
        /// <returns>if never save it return null</returns>
        public JObject GetStorage(string name)
        {
            var dir = GetStorageDir();
            var fn = Path.Combine(dir.FullName, $"{name}.json");

            var serializer = new JsonSerializer();
            serializer.Converters.Add(new JavaScriptDateTimeConverter());
            serializer.NullValueHandling = NullValueHandling.Ignore;

            JObject result = null;
            using (var sr = new JsonTextReader(new StreamReader(new FileStream(fn, FileMode.Open))))
            {
                result = serializer.Deserialize<JObject>(sr);
            }
            return result;
        }

        /// <summary>
        /// 儲存資料
        /// </summary>
        /// <param name="name"></param>
        /// <param name="data"></param>
        public void SaveStorage(string name, JObject data)
        {
            var dir = GetStorageDir();
            var fn = Path.Combine(dir.FullName, $"{name}.json");

            var serializer = new JsonSerializer();
            serializer.Converters.Add(new JavaScriptDateTimeConverter());
            serializer.NullValueHandling = NullValueHandling.Ignore;
            using (var writer = new JsonTextWriter(new StreamWriter(new FileStream(fn, FileMode.Create))))
            {
                serializer.Serialize(writer, data);
            }
        }
    }
}
