using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Collections;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.IO;
using System.Globalization;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Hosting;
using System.Threading;

namespace WebApp.Services
{
    /// <summary>
    /// 分頁服務
    /// </summary>
    public class QueryPagerService : IDisposable
    {
        CancellationTokenSource _cts;
        private Task _LoopTask;

        /// <summary>
        /// 查詢結果集合
        /// </summary>
        Dictionary<string, QueryResult> Results { get; set; } = new Dictionary<string, QueryResult>();

        DirectoryInfo TempDir { get; set; }

        /// <summary>
        /// Lock For All
        /// </summary>
        readonly object _lock_all = new object();

        private IOptions<QueryPagerSetting> _setting;
        private IHostingEnvironment _env;      

        /// <summary>
        /// ctor
        /// </summary>
        public QueryPagerService(IOptions<QueryPagerSetting> setting, IHostingEnvironment env)
        {
            this._setting = setting;
            this._env = env;
            Start();
        }

        internal void Remove(string ds_name)
        {
            QueryResult qr = null;
            lock (_lock_all)
            {
                Results.TryGetValue(ds_name, out qr);
                if (qr != null)
                    Results.Remove(ds_name);
            }

            if (qr != null)
            {
                qr.Clear();
            }
        }

        public QueryResult Add<T>(IEnumerable<T> qry, int pagesize, int maxRecords)
        {
            var qr = new QueryResult();
            qr.Active = DateTime.Now;
            qr.Source.Name = GenerateName();
            var tcount = 0;
            var records = new List<T>();
            Action saveRecords = () =>
            {
                if (records.Count == 0)
                    return;
                var part = new QueryPage(Path.Combine(TempDir.FullName, $"{qr.Name}#{qr.Pages.Count}.json"));
                part.SetRecords(records);
                records = new List<T>();
                qr.Pages.Add(part);
            };

            using (var ee = qry.GetEnumerator())
            {
                while (ee.MoveNext())
                {
                    var v = ee.Current;
                    records.Add(v);
                    tcount++;

                    if (records.Count >= pagesize)
                    {
                        saveRecords();
                    }

                    if (tcount >= maxRecords)
                    {
                        saveRecords();
                        break;
                    }
                }
                saveRecords();

                //detect if is all of the data
                if (tcount < maxRecords)
                {
                    qr.Source.IsAll = true;
                }
                else
                {
                    qr.Source.IsAll = !ee.MoveNext();
                }
            }

            //saveRecords();
            qr.Source.Count = tcount;
            lock (_lock_all)
            {
                Results.Add(qr.Name, qr);
            }
            return qr;
        }

        public QueryResult Add<T>(IEnumerable<T> qry)
        {
            return Add<T>(qry, _setting.Value.DefaultPageSize, _setting.Value.DefaultMaxRecords);
        }

        public QueryResult Add<T>(IEnumerable<T> qry, int pagesize)
        {
            return Add<T>(qry, pagesize, _setting.Value.DefaultMaxRecords);
        }

        public QueryResult Find(string ds_name)
        {
            QueryResult qr = null;
            lock (_lock_all)
            {
                Results.TryGetValue(ds_name, out qr);
            }

            if (qr != null)
                qr.Active = DateTime.Now;
            return qr;
        }

        int _theno = 1;

        /// <summary>
        /// 產生唯一不重複的名稱
        /// </summary>       
        private string GenerateName()
        {
            var no = Interlocked.Increment(ref _theno);
            return string.Format("{0}#{1}", DateTime.Now.ToString("yMMddHHmmssfff", CultureInfo.InvariantCulture), no);
        }

        /// <summary>
        /// 啟動服務
        /// </summary>
        void Start()
        {
            var path = Path.Combine(_env.ContentRootPath, this._setting.Value.TempFolder);
            TempDir = new DirectoryInfo(path);
            if (!TempDir.Exists)
            {
                TempDir.Create();
            }
            foreach (var f in TempDir.GetFiles())
                f.Delete();

            _cts = new CancellationTokenSource();

            _LoopTask = Task.Run(LoopAsync);
        }

        void Stop()
        {
            _cts.Cancel();
        }

        bool _disposed = false;
        public void Dispose()
        {
            if (!_disposed)
            {
                _disposed = true;
                Stop();
            }
        }

        /// <summary>
        /// 資源回收
        /// </summary>
        async Task LoopAsync()
        {
            var ctoken = _cts.Token;

            while (!ctoken.IsCancellationRequested)
            {
                //sleep one minute
                await Task.Delay(60000, ctoken);;            
                if (ctoken.IsCancellationRequested)
                    return;

                try
                {
                    var tout = DateTime.Now.AddMinutes(-_setting.Value.SaveMinute);
                    var rr = null as List<QueryResult>;
                    //移除逾時的查詢
                    lock (_lock_all)
                    {
                        rr = Results.Where(x => x.Value.Active < tout)
                            .Select(x => x.Value)
                            .ToList();

                        foreach (var r in rr)
                            this.Results.Remove(r.Name);
                    }

                    //清除檔案
                    foreach (var r in rr)
                    {
                        try { r.Clear(); } catch { }
                    }
                }
                catch
                {
                    //sleep 30 seconds
                    await Task.Delay(30000, ctoken);
                }
            }
        }
    }

    /// <summary>
    /// 每一分頁紀錄
    /// </summary>

    public class QueryPage
    {
        public string FileName { get; set; }

        /// <summary>
        /// ctor
        /// </summary>
        /// <param name="fileName"></param>
        public QueryPage(string fileName)
        {
            this.FileName = fileName;
        }

        public int RecordCount { get; private set; } = 0;

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="records"></param>
        public void SetRecords<T>(List<T> records)
        {
            var serializer = new JsonSerializer();           
            serializer.DateTimeZoneHandling = DateTimeZoneHandling.Unspecified;
            serializer.NullValueHandling = NullValueHandling.Ignore;
            using (var writer = new JsonTextWriter(new StreamWriter(new FileStream(FileName, FileMode.Create))))
            {
                serializer.Serialize(writer, records);
            }
            RecordCount = records.Count;
        }

        public List<T> GetRecords<T>()
        {
            return this.GetRecords<T>(0, RecordCount);
        }

        public List<JObject> GetRecords()
        {
            return this.GetRecords(0, RecordCount);
        }

        public List<T> GetRecords<T>(int index, int count)
        {
            var serializer = new JsonSerializer();          
            serializer.DateTimeZoneHandling = DateTimeZoneHandling.Unspecified;
            serializer.NullValueHandling = NullValueHandling.Ignore;

            var rr = null as List<T>;
            using (var sr = new JsonTextReader(new StreamReader(new FileStream(FileName, FileMode.Open))))
            {
                rr = serializer.Deserialize<List<T>>(sr);
            }

            if (index == 0 && rr.Count == count)
                return rr;
            return rr.GetRange(index, count);
        }

        public List<JObject> GetRecords(int index, int count)
        {
            var serializer = new JsonSerializer();           
            serializer.DateTimeZoneHandling = DateTimeZoneHandling.Unspecified;
            serializer.NullValueHandling = NullValueHandling.Ignore;

            var rr = null as List<JObject>;
            using (var sr = new JsonTextReader(new StreamReader(new FileStream(FileName, FileMode.Open))))
            {
                rr = serializer.Deserialize<List<JObject>>(sr);
            }

            if (index == 0 && rr.Count == count)
                return rr;
            return rr.GetRange(index, count);
        }
    }

    public class QuerySource
    {
        /// <summary>
        /// 名稱
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 資料筆數
        /// </summary>
        public int Count { get; set; }

        /// <summary>
        /// 是否式全部的資料
        /// </summary>
        public bool IsAll { get; internal set; }
    }

    /// <summary>
    /// 查詢結果Base
    /// </summary>
    public class QueryResult
    {
        /// <summary>
        /// 活動時間
        /// </summary>
        public DateTime Active { get; set; }

        /// <summary>
        /// 紀錄名稱
        /// </summary>
        public string Name { get { return Source.Name; } }

        /// <summary>
        /// 資料來源描述
        /// </summary>
        public QuerySource Source { get; internal set; } = new QuerySource();

        /// <summary>
        /// 分批儲存檔案
        /// </summary>
        internal List<QueryPage> Pages { get; set; } = new List<QueryPage>();

        /// <summary>
        /// 清空資料
        /// </summary>
        public virtual void Clear()
        {
            foreach (var page in this.Pages)
            {
                File.Delete(page.FileName);
            }
            Pages.Clear();
        }

        /// <summary>
        /// 頁面資料更新
        /// </summary>
        /// <param name="pageidx"></param>
        /// <param name="records"></param>
        public void UpdatePage<T>(int pageidx, List<T> records)
        {
            var page = this.Pages[pageidx];
            var newcount = this.Source.Count - page.RecordCount + records.Count;
            page.SetRecords(records);
            this.Source.Count = newcount;
        }

        /// <summary>
        /// 取得紀錄(不限定於一個分頁中)
        /// </summary>
        /// <param name="row_idx"></param>
        /// <param name="row_count"></param>
        /// <returns></returns>
        public List<JObject> GetRecords(int row_idx, int row_count)
        {
            return this.GetRecords<JObject>(row_idx, row_count);
        }

        /// <summary>
        /// 取得紀錄(不限定於一個分頁中)
        /// </summary>
        /// <param name="row_idx"></param>
        /// <param name="row_count"></param>
        /// <returns></returns>
        public List<T> GetRecords<T>(int row_idx, int row_count)
        {
            if (this.Pages.Count == 0)
                return new List<T>();

            var v_idx = row_idx;
            var v_cnt = row_count;

            var idx1 = 0; // current page row start index
            var idx2 = 0; // current page row last index(no data position)

            var results = new List<T>();
            foreach (var part in Pages)
            {
                idx2 = idx1 + part.RecordCount;

                //when v_idx in page range
                if (v_idx >= idx1 && v_idx < idx2)
                {
                    var idx = v_idx - idx1; //local idx
                    var cnt = v_cnt; //local count
                    if (cnt > (idx2 - v_idx))
                        cnt = idx2 - v_idx;
                    results.AddRange(part.GetRecords<T>(idx, cnt));
                    v_idx += cnt;
                    v_cnt -= cnt;
                    if (v_cnt == 0)
                        break;
                }
                idx1 += part.RecordCount;                
            }
            return results;
        }


        public List<JObject> GetPage(int pageidx)
        {
            return this.GetPage<JObject>(pageidx);
        }

        /// <summary>
        /// 取得分頁紀錄
        /// </summary>
        /// <param name="pageidx"></param>
        /// <returns></returns>
        public List<T> GetPage<T>(int pageidx)
        {
            if (Pages.Count == 0)
                return new List<T>();

            var page = Pages[pageidx];
            var result = page.GetRecords<T>(0, page.RecordCount);
            return result;
        }

        /// <summary>
        /// 列舉資料
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public IEnumerable<T> AsEnumerable<T>()
        {
            //each page
            foreach (var page in this.Pages)
            {
                //each record of page
                foreach (var r in page.GetRecords<T>())
                {                    
                    yield return r;
                }
            }
        }
    }



    /// <summary>
    /// 設定
    /// </summary>
    public class QueryPagerSetting
    {
        /// <summary>
        /// 預設分頁大小
        /// </summary>
        public int DefaultPageSize { get; set; } = 100;


        /// <summary>
        /// 預設最大查詢筆數
        /// </summary>
        public int DefaultMaxRecords { get; set; } = 1000;

        /// <summary>
        /// 資料保留分鐘數
        /// </summary>
        public int SaveMinute { get; set; } = 10;

        /// <summary>
        /// 資料暫存目錄
        /// </summary>
        public string TempFolder { get; set; }
    }
}