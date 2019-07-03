using System.Collections.Generic;
using System.Web;

using System.Linq;

namespace System
{
    /// <summary>
    /// Number Extensions
    /// </summary>
    public static partial class SystemExt
    {
        /// <summary>
        /// int parse
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static int? IntParse(this string str)
        {
            if (str.IsNullOrEmpty())
                return null;
            return int.Parse(str);
        }

        /// <summary>
        /// Float parse
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static float? FloatParse(this string str)
        {
            if (str.IsNullOrEmpty())
                return null;
            return float.Parse(str);
        }

        /// <summary>
        /// double parse
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static double? DoubleParse(this string str)
        {
            if (str.IsNullOrEmpty())
                return null;
            return double.Parse(str);
        }
    }
}
