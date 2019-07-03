using System.Collections.Generic;
using System.Collections;

using System.Linq;

namespace System
{
    public static partial class SystemExt
    {      
        /// <summary>
        /// IN 
        /// </summary>
        public static bool InAny<T>(this T obj, params T [] values) 
        {
            return InAny<T>(obj, (IList<T>)values);
        }

        /// <summary>
        /// 注意 null in (null) 為True
        /// </summary>
        public static bool InAny<T>(this T obj, IList<T> values) 
        {            
            foreach (var v in values)
            {
                if (object.Equals(obj, v))                
                    return true;
            }
            return false;
        }

        /// <summary>
        /// 集合成員
        /// </summary>
        public static bool ElementsInAny<T>(this IList<T> objs, IList<T> values)
        {
            foreach (var obj in objs)
            {
                if (obj.InAny(values))
                    return true;
            }
            return false;           
        }

        /// <summary>
        /// 集合成員
        /// </summary>
        public static bool ElementsInAny<T>(this IList<T> objs, params T[] values)
        {
            foreach (var obj in objs)
            {
                if (obj.InAny(values))
                    return true;
            }
            return false;
        }

        /// <summary>
        /// IndexOf 不存在為-1
        /// </summary>
        public static int IndexOf<T>(this T obj, params T[] values)
        {
            return IndexOf<T>(obj, (IList<T>)values);
        }

        /// <summary>
        /// IndexOf 不存在為-1
        /// </summary>
        public static int IndexOf<T>(this T obj, IList<T> values)
        {
            var selectIdx = -1;
            var idx = 0;
            foreach (var v in values)
            {
                if (object.Equals(obj, v))
                {
                    selectIdx = idx;
                    break;
                }

                idx++;
            }
            return selectIdx;
        }

        #region [decode]
        /// <summary>
        /// key.decode(key1,value1,key2,value2,elseValue{選擇性})
        /// </summary>
        internal static TV SysDecode<TK, TV>(this TK key, TK key1, TV value1, params object[] keyValues)
        {
            if (object.Equals(key, key1))
                return value1;
            var c = keyValues.Length / 2;
            for (var i = 0; i < c; i++)
            {
                if (object.Equals(key, keyValues[i * 2]))
                    return (TV)keyValues[i * 2 + 1];
            }
            //有Else
            if (keyValues.Length % 2 == 1)
                return (TV)keyValues[keyValues.Length - 1];
            return default(TV);
        }

        public static TV SysDecode<TK, TV>(this TK key, TK key1, TV value1, TK key2, TV value2)
        {
            return key.SysDecode(key1, value1, new object[] { key2, value2 });
        }

        public static TV SysDecode<TK, TV>(this TK key, TK key1, TV value1, TK key2, TV value2, TK key3, TV value3)
        {
            return key.SysDecode(key1, value1, new object[] { key2, value2, key3, value3 });
        }

        public static TV SysDecode<TK, TV>(this TK key, TK key1, TV value1, TK key2, TV value2, TK key3, TV value3, TK key4, TV value4)
        {
            return key.SysDecode(key1, value1, new object[] { key2, value2, key3, value3, key4, value4 });
        }

        public static TV SysDecode<TK, TV>(this TK key, TK key1, TV value1, TK key2, TV value2, TK key3, TV value3, TK key4, TV value4, TK key5, TV value5)
        {
            return key.SysDecode(key1, value1, new object[] { key2, value2, key3, value3, key4, value4, key5, value5 });
        }

        public static TV SysDecode<TK, TV>(this TK key, TK key1, TV value1, TK key2, TV value2, TK key3, TV value3, TK key4, TV value4, TK key5, TV value5, TK key6, TV value6)
        {
            return key.SysDecode(key1, value1, new object[] { key2, value2, key3, value3, key4, value4, key5, value5, key6, value6 });
        }

        public static TV SysDecode<TK, TV>(this TK key, TK key1, TV value1, TK key2, TV value2, TK key3, TV value3, TK key4, TV value4, TK key5, TV value5, TK key6, TV value6, TK key7, TV value7)
        {
            return key.SysDecode(key1, value1, new object[] { key2, value2, key3, value3, key4, value4, key5, value5, key6, value6, key7, value7 });
        }

        public static TV SysDecode<TK, TV>(this TK key, TK key1, TV value1, TK key2, TV value2, TK key3, TV value3, TK key4, TV value4, TK key5, TV value5, TK key6, TV value6, TK key7, TV value7, TK key8, TV value8)
        {
            return key.SysDecode(key1, value1, new object[] { key2, value2, key3, value3, key4, value4, key5, value5, key6, value6, key7, value7, key8, value8 });
        }

        public static TV SysDecode<TK, TV>(this TK key, TK key1, TV value1, TK key2, TV value2, TK key3, TV value3, TK key4, TV value4, TK key5, TV value5, TK key6, TV value6, TK key7, TV value7, TK key8, TV value8, TK key9, TV value9)
        {
            return key.SysDecode(key1, value1, new object[] { key2, value2, key3, value3, key4, value4, key5, value5, key6, value6, key7, value7, key8, value8, key9, value9 });
        }

        public static TV SysDecode<TK, TV>(this TK key, TK key1, TV value1, TK key2, TV value2, TK key3, TV value3, TK key4, TV value4, TK key5, TV value5, TK key6, TV value6, TK key7, TV value7, TK key8, TV value8, TK key9, TV value9, TK keya, TV valuea)
        {
            return key.SysDecode(key1, value1, new object[] { key2, value2, key3, value3, key4, value4, key5, value5, key6, value6, key7, value7, key8, value8, key9, value9, keya, valuea });
        }

        public static TV SysDecode<TK, TV>(this TK key, TK key1, TV value1, TK key2, TV value2, TK key3, TV value3, TK key4, TV value4, TK key5, TV value5, TK key6, TV value6, TK key7, TV value7, TK key8, TV value8, TK key9, TV value9, TK keya, TV valuea, TK keyb, TV valueb)
        {
            return key.SysDecode(key1, value1, new object[] { key2, value2, key3, value3, key4, value4, key5, value5, key6, value6, key7, value7, key8, value8, key9, value9, keya, valuea, keyb, valueb });
        }

        public static TV SysDecode<TK, TV>(this TK key, TK key1, TV value1, TK key2, TV value2, TK key3, TV value3, TK key4, TV value4, TK key5, TV value5, TK key6, TV value6, TK key7, TV value7, TK key8, TV value8, TK key9, TV value9, TK keya, TV valuea, TK keyb, TV valueb, TK keyc, TV valuec)
        {
            return key.SysDecode(key1, value1, new object[] { key2, value2, key3, value3, key4, value4, key5, value5, key6, value6, key7, value7, key8, value8, key9, value9, keya, valuea, keyb, valueb, keyc, valuec });
        }

        public static TV SysDecode<TK, TV>(this TK key, TK key1, TV value1, TK key2, TV value2, TK key3, TV value3, TK key4, TV value4, TK key5, TV value5, TK key6, TV value6, TK key7, TV value7, TK key8, TV value8, TK key9, TV value9, TK keya, TV valuea, TK keyb, TV valueb, TK keyc, TV valuec, TK keyd, TV valued)
        {
            return key.SysDecode(key1, value1, new object[] { key2, value2, key3, value3, key4, value4, key5, value5, key6, value6, key7, value7, key8, value8, key9, value9, keya, valuea, keyb, valueb, keyc, valuec, keyd, valued });
        }

        /// <summary>
        /// 尋找並取得Code對應的名稱
        /// </summary>        
        public static R SysDecode<T,R>(this T code, IList<T> codes, IList<R> names, R defaultName)
        {
            var codeIdx = code.IndexOf(codes);
            //findmiss
            if (codeIdx < 0)            
                return defaultName;
            return names[codeIdx];
        }        


        #endregion     

        /// <summary>
        /// Null當成
        /// </summary>
        public static T NullAs<T>(this T obj, T asValue)
        {
            if (object.Equals(obj, null))
                return asValue;
            else
                return obj;
        }

        /// <summary>
        /// 是否為NULL
        /// </summary>
        public static bool IsNull(this object obj)
        {
            return object.Equals(obj, null);
        }
        

        /// <summary>
        /// 數值轉換
        /// ex. (X>1).toval((x > 1) => "true", "false")
        /// </summary>
        public static R ToVal<T, R>(this T obj, Func<T, R> func)
        {
            return func(obj);
        }

       

       



        //enum Name { A1, A2 };

        //public static void Test()
        //{
        //    string nsm = "Yes";
        //    var newnode = nsm.In(new[] { "nsm", "nodes_3" });

        //    var i = 456;
        //    newnode = i.In(new[] { 1, 2, 3, 4 });

        //    newnode = i.In(1, 2, 3);

        //    Name a1 = Name.A1;
        //    a1.In(Name.A1, Name.A2);
        //}
    }
}
