using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WebApp.Helper;
using WebApp.Services;

namespace WebApp.Controllers
{
    /// <summary>
    /// 基礎Controller
    /// </summary>
    abstract public class BaseController : Controller
    {
        int? _userid = null;
        /// <summary>
        /// 目前使用的's ID
        /// </summary>
        /// <returns></returns>
        protected int GetUserId()
        {
            if (_userid == null)
            {
                _userid = int.Parse(this.User.FindFirstValue(ClaimTypes.NameIdentifier));
            }
            return _userid ?? 0;
        }

        /// <summary>
        /// 目前使用的's Roles
        /// </summary>
        protected List<string> GetUserRoles()
        {
            var roles = this.User.Claims.Where(x => x.Type == ClaimTypes.Role).Select(x => x.Value).ToList();
            return roles;
        }

        /// <summary>
        /// 對物件ID屬性編碼
        /// </summary>
        /// <param name="data"></param>
        /// <param name="names">ID屬性名稱</param>
        /// <returns></returns>
        protected JsonResult JsonEncodeId(object data, params string[] names)
        {
            return Json(IdEncodeObj(data, names));
        }

        /// <summary>
        /// 對物件ID屬性編碼
        /// </summary>
        /// <param name="data"></param>
        /// <param name="names">ID屬性名稱</param>
        /// <returns></returns>
        protected JToken IdEncodeObj(object data, params string[] names)
        {
            var ide = this.HttpContext.RequestServices.GetService(typeof(IdEncodeService)) as IdEncodeService;
            var userid = GetUserId();

            void itorObject(JObject obj)
            {
                var pp = obj.Properties()
                    .Where(x => names.Contains(x.Name) && x.HasValues && x.Value.Type == JTokenType.Integer)
                    ;
                foreach (var p in obj.Properties())
                {
                    //finded
                    if (names.Contains(p.Name) && p.HasValues && p.Value.Type == JTokenType.Integer)
                    {
                        p.Value = ((int)p.Value).IdEncode(ide, userid);
                        continue;
                    }

                    if (p.HasValues)
                    {
                        if (p.Value.Type == JTokenType.Array)
                        {
                            itorArray(p.Value as JArray);
                            continue;
                        }
                        if (p.Value.Type == JTokenType.Object)
                        {
                            itorObject(p.Value as JObject);
                            continue;
                        }
                    }
                }
            }

            void itorArray(JArray vv)
            {
                foreach (var p in vv)
                {
                    if (p is JObject)
                        itorObject(p as JObject);
                    else if (p is JArray)
                        itorArray(p as JArray);
                }
            }

            //if null
            if (data == null)
                return null;

            //not json convert to json
            JToken jobj = null;
            if (data is JToken)
                jobj = data as JToken;
            else
                jobj = JToken.FromObject(data);

            if (names.Length == 0)
                return jobj;

            if (jobj is JObject)
                itorObject(jobj as JObject);
            else if (jobj is JArray)
                itorArray(jobj as JArray);

            return jobj;
        }

        /// <summary>
        /// 對物件ID屬性解碼
        /// </summary>
        /// <param name="data"></param>
        /// <param name="names">ID屬性名稱</param>
        /// <returns></returns>
        protected void IdDecodeObj(object data, params string[] names)
        {
            if (data == null)
                return;

            var ide = this.HttpContext.RequestServices.GetService(typeof(IdEncodeService)) as IdEncodeService;
            var userid = GetUserId();

            void itorObject(object obj)
            {
                foreach (var p in obj.GetType().GetProperties())
                {
                    //名稱符合的 long propery
                    if (names.Contains(p.Name))
                    {
                        //long
                        if (p.PropertyType == typeof(long)
                            && ((p.SetMethod.Attributes & System.Reflection.MethodAttributes.Public) == System.Reflection.MethodAttributes.Public)
                            && ((p.GetMethod.Attributes & System.Reflection.MethodAttributes.Public) == System.Reflection.MethodAttributes.Public)
                            )
                        {
                            var v = (long)p.GetValue(obj);
                            var v2 = (long)v.IdDecode(ide, userid);
                            p.SetValue(obj, v2);
                            continue;
                        }

                        //long?
                        if (p.PropertyType == typeof(long?)
                           && ((p.SetMethod.Attributes & System.Reflection.MethodAttributes.Public) == System.Reflection.MethodAttributes.Public)
                           && ((p.GetMethod.Attributes & System.Reflection.MethodAttributes.Public) == System.Reflection.MethodAttributes.Public)
                           )
                        {
                            var v = (long?)p.GetValue(obj);
                            if (v.HasValue)
                            {
                                var v2 = (long)v.IdDecode(ide, userid);
                                p.SetValue(obj, v2);
                            }
                            continue;
                        }
                    }

                    //陣列結構
                    if ((typeof(IEnumerable).IsAssignableFrom(p.PropertyType))
                        && ((p.GetMethod.Attributes & System.Reflection.MethodAttributes.Public) == System.Reflection.MethodAttributes.Public)
                        )
                    {
                        var array = p.GetValue(obj) as IEnumerable;
                        itorArray(array);
                        continue;
                    }

                    //類別
                    if (typeof(ValueType).IsAssignableFrom(p.PropertyType) == false
                        && ((p.GetMethod.Attributes & System.Reflection.MethodAttributes.Public) == System.Reflection.MethodAttributes.Public)
                        )
                    {
                        var obj1 = p.GetValue(obj);
                        itorObject(obj1);
                        continue;
                    }
                }
            }

            void itorArray(IEnumerable obj)
            {
                if (obj == null)
                    return;

                foreach (var v in obj)
                {
                    //arrry
                    if (typeof(IEnumerable).IsAssignableFrom(v.GetType()))
                    {
                        itorArray(v as IEnumerable);
                        continue;
                    }

                    //class
                    if (!typeof(ValueType).IsAssignableFrom(v.GetType()))
                        itorObject(v);
                }
            }

            itorObject(data);
        }

        /// <summary>
        /// 使用者別的Id編碼
        /// </summary>
        /// <param name="num"></param>
        /// <returns></returns>
        protected long IdEncode(int num)
        {
            return this.IdEncode(num, GetUserId());
        }

        /// <summary>
        /// 使用者別的Id編碼
        /// </summary>
        /// <param name="num"></param>
        /// <returns></returns>
        protected long IdEncode(int num, int userid)
        {
            var ide = this.HttpContext.RequestServices.GetService(typeof(IdEncodeService)) as IdEncodeService;
            return ide.Encode(num, userid);
        }

        /// <summary>
        /// 使用者別的Id解碼
        /// </summary>
        /// <param name="num"></param>
        /// <param name="ide"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        protected int IdDecode(long num)
        {
            return this.IdDecode(num, GetUserId());
        }

        /// <summary>
        /// 使用者別的Id解碼
        /// </summary>
        /// <param name="num"></param>
        /// <param name="ide"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        protected int IdDecode(long num, int userid)
        {
            var ide = this.HttpContext.RequestServices.GetService(typeof(IdEncodeService)) as IdEncodeService;
            return ide.Decode(num, userid);
        }

        /// <summary>
        /// 使用者別的Id解碼
        /// </summary>
        /// <param name="num"></param>
        /// <param name="ide"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        protected int? IdDecode(long? num)
        {
            if (num.HasValue)
                return IdDecode(num.Value);
            return null;
        }
    }
}
