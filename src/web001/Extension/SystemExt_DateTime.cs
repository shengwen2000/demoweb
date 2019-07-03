
using System.Globalization;
namespace System
{
    /// <summary>
    /// 日期擴充函數
    /// </summary>
    public static partial class SystemExt
    {   
        /// <summary>
        /// 移除毫秒數值
        /// </summary>
        /// <param name="time"></param>
        /// <returns></returns>
        public static DateTime TruncateMillisecond(this DateTime time)
        {
            return new DateTime(time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
        }

        /// <summary>
        /// 算出生日的年紀,實歲 最小為1歲
        /// </summary>        
        public static int AgeNow(this DateTime birthdate)
        {
            var today = DateTime.Today;
            var monthDiff = ((today.Year - birthdate.Year) * 12) + (today.Month - birthdate.Month);
            if (birthdate.Day > today.Day)
                monthDiff--;
            var year = monthDiff / 12;
            if (monthDiff % 12 != 0)
                year++;
            return year;
        }

        /// <summary>
        /// 算出生日的年紀,實歲 最小為1歲
        /// </summary>        
        public static int AgeNow(this DateTime birthdate, DateTime nowdate)
        {
            var today = nowdate;
            var monthDiff = ((today.Year - birthdate.Year) * 12) + (today.Month - birthdate.Month);
            if (birthdate.Day > today.Day)
                monthDiff--;
            var year = monthDiff / 12;
            if (monthDiff % 12 != 0)
                year++;
            return year;
        }


        /// <summary>
        /// start of date
        /// </summary>        
        public static DateTime? SOD(this DateTime? theDate)
        {
            if (theDate == null)
                return null;
            return theDate.Value.Date;
        }


        /// <summary>
        /// start of date
        /// </summary>        
        public static DateTime SOD(this DateTime theDate)
        { 
            return theDate.Date;
        }

        /// <summary>
        /// (next day)'s start of day
        /// </summary>        
        public static DateTime? NSOD(this DateTime? theDate)
        {
            if (theDate == null)
                return null;
            return theDate.Value.SOD().AddDays(1);            
        }

        /// <summary>
        /// (next day)'s start of day
        /// </summary>        
        public static DateTime NSOD(this DateTime theDate)
        {
            return theDate.SOD().AddDays(1); 
        }

        /// <summary>
        /// start of month
        /// </summary>        
        public static DateTime? SOM(this DateTime? theDate)
        {
            if (theDate == null)
                return null;
            var d = theDate.Value.Date;
            return new DateTime(d.Year, d.Month, 1, 0, 0, 0);
        }

        /// <summary>
        /// start of month
        /// </summary>        
        public static DateTime SOM(this DateTime theDate)
        {
            var d = theDate.Date;
            return new DateTime(d.Year, d.Month, 1, 0, 0, 0);
        }

        /// <summary>
        /// next month's (start of month)
        /// </summary>        
        public static DateTime? NSOM(this DateTime? theDate)
        {
            if (theDate == null)
                return null;
            return theDate.Value.SOM().AddMonths(1);
        }

        /// <summary>
        /// next month's (start of month)
        /// </summary>        
        public static DateTime NSOM(this DateTime theDate)
        {
            return theDate.SOM().AddMonths(1);
        }

        /// <summary>
        /// start of year
        /// </summary>        
        public static DateTime? SOY(this DateTime? theDate)
        {
            if (theDate == null)
                return null;
            var d = theDate.Value.Date;
            return new DateTime(d.Year, 1, 1, 0, 0, 0);
        }

        /// <summary>
        /// start of year        
        /// </summary>        
        public static DateTime SOY(this DateTime theDate)
        {   
            var d = theDate.Date;
            return new DateTime(d.Year, 1, 1, 0, 0, 0);
        }

        /// <summary>
        /// next year's (start of year)
        /// </summary>        
        public static DateTime? NSOY(this DateTime? theDate)
        {
            if (theDate == null)
                return null;
            return theDate.Value.SOY().AddYears(1);
        }

        /// <summary>
        /// next year's (start of year)
        /// </summary>        
        public static DateTime NSOY(this DateTime theDate)
        {
            return theDate.SOY().AddYears(1);
        }

        /// <summary>
        /// start of week(星期一)
        /// </summary>        
        public static DateTime SOW(this DateTime theDate)
        {
            var w = (int)CultureInfo.InvariantCulture.Calendar.GetDayOfWeek(theDate);
            //0 1 2 3  4  5  6 
            //6 7 8 9 10 11 12 
            //6 0 1 2  3  4  5
            var diff = (w + 6) % 7;
            return theDate.AddDays(diff * -1);
        }

        
        /// <summary>
        /// start of week(星期一)
        /// </summary>        
        public static DateTime? SOW(this DateTime? theDate)
        {
            if (theDate == null)
                return null;
            return SOW(theDate.Value);
        }

        /// <summary>
        /// next week start of week(星期一)
        /// </summary>        
        public static DateTime NSOW(this DateTime theDate)
        {
            return SOW(theDate).AddDays(7);
        }

        /// <summary>
        /// next week start of week(星期一)
        /// </summary>        
        public static DateTime? NSOW(this DateTime? theDate)
        {
            if (theDate == null)
                return null;
            return NSOW(theDate.Value);
        }

        /// <summary>
        /// previous week start of week(星期一)
        /// </summary>        
        public static DateTime PSOW(this DateTime theDate)
        {
            return SOW(theDate).AddDays(-7);
        }

        /// <summary>
        /// previous week start of week(星期一)
        /// </summary>        
        public static DateTime? PSOW(this DateTime? theDate)
        {
            if (theDate == null)
                return null;
            return PSOW(theDate.Value);
        }
    }
}
