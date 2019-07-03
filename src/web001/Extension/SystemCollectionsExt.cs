using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;
using System.Web;

namespace System.Collections
{
    public static class SystemCollectionsExt
    {
        /// <summary>
        /// 依健值搜尋指定的值，如不存在回傳預設值
        /// </summary>
        public static TV FindKey<TK, TV>(this Dictionary<TK, TV> dict, TK key)
        {
            TV tv;
            if (dict.TryGetValue(key, out tv))
                return tv;
            return default(TV);
        }

        /// <summary>
        /// 依健值搜尋指定的值是否存在，如不存在回傳false
        /// </summary>
        public static bool FindKeyExists<TK, TV>(this Dictionary<TK, TV> dict, TK key)
        {
            TV tv;
            if (dict.TryGetValue(key, out tv))
                return true;
            return false;
        }

        public static void ForEach<T>(this IEnumerable<T> list, Action<T> doAction)
        {
            foreach (var item in list)
                doAction(item);
            //return list;
        }     

        public static bool Exists<T>(this IEnumerable<T> list, Func<T, bool> isMatch)
        {
            foreach (var item in list)
            {
                if (isMatch(item))
                    return true;
            }
            return false;
        }        
       
        public static string StringJoin<T>(this IEnumerable<T> list, Func<T, string> getString, string separator)
        {
            var sb = new StringBuilder();
            var i = 0;
            try
            {
                foreach(var item in list)
                {
                    if (i > 0)
                        sb.Append(separator);
                    sb.Append(getString(item));
                    i++;
                }
                return sb.ToString();
            }
            finally
            {
                sb.Length = 0;
            }
        }

        /// <summary>
        /// 配對Join
        /// 例 ({'A','B','C'}, "()") => "(A)(B)(C)"
        /// </summary>
        public static string PairJoin(this IList<string> strs, string pair)
        {
            if (strs == null)
                return null;

            var prefix = pair[0];
            var suffix = pair[1];
            var sb = new StringBuilder();
            try
            {
                foreach (var str in strs)
                {
                    sb.Append(prefix);
                    sb.Append(str);
                    sb.Append(suffix);
                }
                return sb.ToString();
            }
            finally
            {
                sb.Length = 0;
            }
        }        
    }
}
