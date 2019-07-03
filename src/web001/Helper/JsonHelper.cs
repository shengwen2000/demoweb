using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApp.Helper
{
    /// <summary>
    /// Json Helper
    /// </summary>
    public static class JsonHelper
    {
        /// <summary>
        /// Serialize Object To Json
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        static public string ToJsonText(this object obj)
        {
            var js = new JsonSerializerSettings();
            js.DateFormatHandling = Newtonsoft.Json.DateFormatHandling.IsoDateFormat;
            js.DateTimeZoneHandling = DateTimeZoneHandling.Unspecified;
            js.ContractResolver = new DefaultContractResolver();
            var result = JsonConvert.SerializeObject(obj, js);
            return result;
        }

        /// <summary>
        /// Deserialize From Text
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="jsontxt"></param>
        /// <returns></returns>
        static public T FromJsonText<T>(this string jsontxt)
        {
            var js = new JsonSerializerSettings();
            js.DateFormatHandling = Newtonsoft.Json.DateFormatHandling.IsoDateFormat;
            js.DateTimeZoneHandling = DateTimeZoneHandling.Unspecified;
            js.ContractResolver = new DefaultContractResolver();
            var result = JsonConvert.DeserializeObject<T>(jsontxt);
            return result;
        }

        /// <summary>
        /// Populate From Text
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="jsontxt"></param>
        /// <returns></returns>
        static public T PopulateFromJsonText<T>(this string jsontxt) where T : class, new()
        {
            var result = new T();
            var js = new JsonSerializerSettings();
            js.DateFormatHandling = Newtonsoft.Json.DateFormatHandling.IsoDateFormat;
            js.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Unspecified;
            js.ContractResolver = new DefaultContractResolver();
            JsonConvert.PopulateObject(jsontxt, result);
            return result;
        }

        /// <summary>
        /// 儲存物件至json檔案
        /// </summary>
        /// <param name="obj">物件</param>
        /// <param name="filename">檔案名稱</param>
        static public void SaveToJson(this object obj, string filename)
        {
            var serializer = new JsonSerializer();
            serializer.DateTimeZoneHandling = DateTimeZoneHandling.Unspecified;
            serializer.NullValueHandling = NullValueHandling.Ignore;
            using (var writer = new JsonTextWriter(new StreamWriter(new FileStream(filename, FileMode.Create))))
            {
                serializer.Serialize(writer, obj);
            }
        }

        /// <summary>
        /// 讀取物件由json檔案
        /// </summary>
        /// <typeparam name="T">物件型別</typeparam>
        /// <param name="filename">檔案名稱</param>
        /// <returns></returns>
        static public T ReadFromJson<T>(this string filename)
        {
            var serializer = new JsonSerializer();
            serializer.DateTimeZoneHandling = DateTimeZoneHandling.Unspecified;
            serializer.NullValueHandling = NullValueHandling.Ignore;

            using (var sr = new JsonTextReader(new StreamReader(new FileStream(filename, FileMode.Open))))
            {
                var r = serializer.Deserialize<T>(sr);
                return r;
            }
        }
    }
}
