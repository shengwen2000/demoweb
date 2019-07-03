using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApp.Services;

namespace WebApp.Helper
{
    public static class IdeHelper
    {
        /// <summary>
        /// 使用者別的Id編碼
        /// </summary>
        /// <param name="num">id's num</param>
        /// <param name="ide"></param>
        /// <param name="userid">user's id</param>
        /// <returns></returns>
        public static long IdEncode(this int num, IdEncodeService ide, int userid)
        {
            return ide.Encode(num, userid);
        }

        
        /// <summary>
        /// 使用者別的Id編碼
        /// </summary>
        /// <param name="num">id's num</param>
        /// <param name="ide"></param>
        /// <param name="userid">user's id</param>
        /// <returns></returns>
        public static long IdEncode(this long num, IdEncodeService ide, int userid)
        {
            return ide.Encode((int)num, userid);
        }

        /// <summary>
        /// 使用者別的Id解碼
        /// </summary>
        /// <param name="num"></param>
        /// <param name="ide"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static int IdDecode(this long num, IdEncodeService ide, int userid)
        {
            return ide.Decode(num, userid);
        }


        /// <summary>
        /// 使用者別的Id解碼
        /// </summary>
        /// <param name="num"></param>
        /// <param name="ide"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static int? IdDecode(this long? num, IdEncodeService ide, int userid)
        {
            if (num.HasValue)
                return ide.Decode(num.Value, userid);
            return null;
        }
    }
}
