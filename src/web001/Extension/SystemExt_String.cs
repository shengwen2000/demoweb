using System.Collections.Generic;
using System.Web;

using System.Linq;

namespace System
{
    /// <summary>
    /// String 衍生函數
    /// </summary>
    public static partial class SystemExt
    {
        /// <summary>
        /// 字串非為null或空字串
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static bool IsTrue(this string str)
        {
            return !string.IsNullOrEmpty(str);
        }

        /// <summary>
        /// 字串為null或空字串
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static bool IsFalse(this string str)
        {
            return string.IsNullOrEmpty(str);
        }

        public static bool IsNullOrEmpty(this string str)
        {
            return string.IsNullOrEmpty(str);            
        }     

         /// <summary>
        /// 不分大小寫
        /// </summary>
        public static bool InAnyIgnoreCase(this string obj, params string[] values)
        {
            return InAnyIgnoreCase(obj, (IList<string>)values);
        }

        /// <summary>
        /// 不分大小寫
        /// </summary>
        public static bool InAnyIgnoreCase(this string obj, IList<string> values)
        {            
            foreach (var v in values)
            {
                if (obj.EqualIgnoreCase(v))
                    return true;
            }
            return false;
        }

        public static string NullOrEmptyAs(this string str, string asValue)
        {
            if (str.IsNullOrEmpty())
                return asValue;
            else
                return str;
        }

        /// <summary>
        /// 取得短字串
        /// </summary>   
        public static string ToShortString(this string message, int maxlength, string more_string)
        {
            if (message.IsNullOrEmpty()) 
                return message;
            if (message.Length > maxlength)
                return message.Substring(0, maxlength) + more_string;
            else
                return message;
        }       

        /// <summary>
        /// 不分大小比對
        /// </summary>
        public static bool EqualIgnoreCase(this string str_a, string str_b)
        {
            return string.Compare(str_a, str_b, StringComparison.OrdinalIgnoreCase) == 0;
        }

        public static string Right(this string str, int length)
        {
            if (length < 0)
                throw new NotSupportedException();
            if (str == null)
                return null;
            if (length >= str.Length)
                return str;
            return str.Substring(str.Length - length);
        }
    }
}
