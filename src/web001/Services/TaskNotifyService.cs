using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApp.Data;
using WebApp.Helper;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Options;
using WebApp.Internal;

namespace WebApp.Services
{
    /// <summary>
    /// 任務通知服務
    /// </summary>
    public class TaskNotifyService : IDisposable
    {
        CancellationTokenSource _cts = new CancellationTokenSource();

        DefaultQueueContext _qcontext;

        private TaskNotifySetting _setting;

        private IServiceScopeFactory _scopefactory;

        /// <summary>        
        /// 當有等待任務取消時，當任務備使用者取消時，會設定取消。
        /// </summary>
        Dictionary<int, CancellationTokenSource> _WaitCancels = new Dictionary<int, CancellationTokenSource>();

        /// <summary>
        /// 
        /// </summary>
        Dictionary<int, CUserInfo> _UserInfos = new Dictionary<int, CUserInfo>();

        const string queue_name = "tasknotify";

        public TaskNotifyService(DefaultQueueContext qcontext, IServiceScopeFactory scopefactory, IOptions<TaskNotifySetting> setting)
        {
            _qcontext = qcontext;           
            _scopefactory = scopefactory;
            _setting = setting.Value;

            _qcontext.AddQueueProcFunc(queue_name, QueueProcFunc);
            Start();
        }        

        /// <summary>
        /// 啟動服務
        /// </summary>
        void Start()
        {
            //event subscribe
            _qcontext.SubscribeEvent(queue_name, async (task_id, kind) => {
                if (kind == Shengwen.QueueTask.QueueEventKind.Append)
                {
                    var task = await _qcontext.GetTaskAsync(task_id);
                    var jo = JObject.Parse(task.Content);
                    var k = jo.Value<string>("K");
                    if (k == "U")
                    {
                        //notify the user that has new event
                        var id = jo.Value<int>("Id");
                        var user_info = GetOrCreateUserInfo(id);
                        user_info.NotifyChangeEvent.Set();
                    }
                    else if (k == "C")
                    {
                        //notify the user that has new event
                        var id = jo.Value<int>("Id");
                        lock(_WaitCancels)
                        {
                            if (_WaitCancels.TryGetValue(id, out CancellationTokenSource tcs))
                            {
                                tcs.Cancel();
                            }
                            _WaitCancels.Remove(id);
                        }                      
                    }
                }
            });

            Task.Run(this.RecycleLoopAsync);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        internal Task<string> SendEvt_UserChanged(int userId)
        {
            return _qcontext.AddTaskAsync(queue_name, new { K = "U", Id = userId });
        }

        internal Task<string> SendEvt_NotifyCancle(int notify_id)
        {
            return _qcontext.AddTaskAsync(queue_name, new { K = "C", Id = notify_id });
        }

        /// <summary>
        /// only use the queue's event, so do nothing
        /// </summary>
        /// <param name="task_id"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        protected async Task QueueProcFunc(long task_id, string content)
        {
            await _qcontext.SetTaskCompleteAsync(queue_name, task_id, "OK");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        async Task RecycleLoopAsync()
        {
            var ctoken = _cts.Token;
            while(!ctoken.IsCancellationRequested)
            {
                await Task.Delay(300000, ctoken);
                if (ctoken.IsCancellationRequested)
                    break;

                try
                {
                    //remove event notify
                    using (var scope = _scopefactory.CreateScope())
                    {
                        var ctx = scope.ServiceProvider.GetService<ApplicationDbContext>();
                        {
                            var min = DateTime.Now.AddSeconds(-_setting.UserEventKeepSecond);
                            var vv = await ctx.Set<TnUserNotify>()
                                .Where(x => x.Created <= min)
                                .ToArrayAsync()
                                ;
                            foreach (var v in vv)
                                ctx.Remove(v);

                            if (vv.Length > 0)
                                await ctx.SaveChangesAsync();
                        }

                        {
                            var min = DateTime.Now.AddSeconds(-_setting.NotifyKeepSecond);
                            var vv = await ctx.Set<TnTaskNotify>()
                               .Where(x => x.State == TaskNotifyState.Remove)
                               .Where(x => x.Complete < min)
                               .ToArrayAsync()
                               ;

                            foreach (var v in vv)
                                ctx.Remove(v);

                            if (vv.Length > 0)
                                await ctx.SaveChangesAsync();
                        }
                    }
                }
                catch
                {
                    await Task.Delay(2000, ctoken);
                }
            }

        }

        /// <summary>
        /// add new notify
        /// </summary>
        /// <param name="user_id"></param>
        /// <param name="title"></param>
        /// <returns>the notify' id</returns>
        public async Task<int> AddNotifyAsync(int user_id, string title)
        {
            using (var scope = _scopefactory.CreateScope())
            {
                var ctx = scope.ServiceProvider.GetService<ApplicationDbContext>();
                var record = new TnTaskNotify();
                record.UserId = user_id;
                record.Title = title;
                //record.Content = content;
                record.State = TaskNotifyState.Append;
                ctx.Add(record);

                var evt = new TnUserNotify();
                evt.UserId = user_id;
                ctx.Add(evt);

                await ctx.SaveChangesAsync();
              
                //add cancel token
                lock (_WaitCancels)
                {
                    _WaitCancels.Add(record.Id, new CancellationTokenSource());
                }

                //notify event
                var t = SendEvt_UserChanged(user_id);

                return record.Id;
            }
        }

        /// <summary>
        /// change the state of notify
        /// </summary>
        /// <param name="notify_id"></param>
        /// <param name="state"></param>
        public async Task<bool> SetNotifyRuningAsync(int notify_id)
        {
            using (var scope = _scopefactory.CreateScope())
            {
                var ctx = scope.ServiceProvider.GetService<ApplicationDbContext>();

                var record = await ctx.Set<TnTaskNotify>()
                    .FirstOrDefaultAsync(x => x.Id == notify_id);
                if (record == null)
                    throw new Exception($"notify {notify_id} not exits");

                if (record.State != TaskNotifyState.Append)
                    return false;

                record.State = TaskNotifyState.Run;

                var evt = new TnUserNotify();
                evt.UserId = record.UserId;
                ctx.Add(evt);

                await ctx.SaveChangesAsync();

                //raise event
                var t = SendEvt_UserChanged(evt.UserId);
                return true;
            }
        }

        /// <summary>
        /// notify complete
        /// </summary>
        /// <param name="notify_id"></param>
        /// <param name="state"></param>
        public async Task<bool> SetNotifyCompleteAsync(int notify_id, TaskNotifyResult result)
        {
            using (var scope = _scopefactory.CreateScope())
            {
                var ctx = scope.ServiceProvider.GetService<ApplicationDbContext>();
                var record = await ctx.Set<TnTaskNotify>()
                    .FirstOrDefaultAsync(x => x.Id == notify_id)
                    ;
                if (record.State != TaskNotifyState.Run)
                    return false;

                record.Result = result.ToJsonText();
                record.State = TaskNotifyState.Finish;
                record.Complete = DateTime.Now;

                var evt = new TnUserNotify();
                evt.UserId = record.UserId;
                ctx.Add(evt);

                await ctx.SaveChangesAsync();

                //notify event
                var t = SendEvt_UserChanged(record.UserId);

                //notify complete event
                var t2 = SendEvt_NotifyCancle(notify_id);

                return true;
            }
        }

        /// <summary>
        /// cancel and remove the notify
        /// </summary>
        /// <param name="notify_id"></param>      
        public async Task SetNotifyCancelAndRemoveAsync(int notify_id)
        {
            using (var scope = _scopefactory.CreateScope())
            {
                var ctx = scope.ServiceProvider.GetService<ApplicationDbContext>();
                var record = await ctx.Set<TnTaskNotify>()
                    .FirstOrDefaultAsync(x => x.Id == notify_id)
                    ;
                
                record.State = TaskNotifyState.Remove;
                record.Complete = DateTime.Now;

                var evt = new TnUserNotify();
                evt.UserId = record.UserId;
                ctx.Add(evt);

                await ctx.SaveChangesAsync();

                //notify user event
                var t1 = SendEvt_UserChanged(record.UserId);

                //notify cancel event
                var t2 = SendEvt_NotifyCancle(notify_id);
            }
        }

        /// <summary>
        /// change title of notify
        /// </summary>
        /// <param name="notify_id"></param>      
        public async Task SetNotifyTitleAsync(int notify_id, string title)
        {
            using (var scope = _scopefactory.CreateScope())
            {
                var ctx = scope.ServiceProvider.GetService<ApplicationDbContext>();
                var record = await ctx.Set<TnTaskNotify>()
                    .FirstOrDefaultAsync(x => x.Id == notify_id)
                    ;

                record.Title = title;

                var evt = new TnUserNotify();
                evt.UserId = record.UserId;
                ctx.Add(evt);

                await ctx.SaveChangesAsync();

                //notify user event
                var t1 = SendEvt_UserChanged(record.UserId);
            }
        }



        /// <summary>
        /// user can cancel the notify, if task need to know user has cancel
        /// </summary>
        /// <returns></returns>
        public CancellationToken GetNotifyCancelToken(int notify_id)
        {
            CancellationTokenSource tcs;
            lock (_WaitCancels)
            {
                _WaitCancels.TryGetValue(notify_id, out tcs);
            }
            if (tcs != null)
                return tcs.Token;

            using (var scope = _scopefactory.CreateScope())
            {
                var ctx = scope.ServiceProvider.GetService<ApplicationDbContext>();
                var record = ctx.Set<TnTaskNotify>()
                    .AsNoTracking()
                    .FirstOrDefault(x => x.Id == notify_id)
                    ;
                if (record == null)
                    return new CancellationToken(true);

                switch (record.State)
                {
                    case TaskNotifyState.Append:
                    case TaskNotifyState.Run:
                        lock (_WaitCancels)
                        {
                            if (!_WaitCancels.TryGetValue(notify_id, out tcs))
                            {
                                tcs = new CancellationTokenSource();
                                _WaitCancels.Add(notify_id, tcs);
                            }
                        }
                        return tcs.Token;               
                    default:
                        return new CancellationToken(true);
                }
            }
        }
        
        /// <summary>
        /// 取得使用者的通知清冊
        /// 若版本一致會等待新版本或時間逾時後傳回
        /// </summary>
        /// <param name="verno">上次清冊Verson's no 首次應帶入-1</param>
        /// <param name="user_id">使用者代號</param>
        /// <returns></returns>
        public async Task<(long, IList<TnTaskNotify>)> GetNotifiesAsync(long verno, int user_id)
        {
            var uinfo = GetOrCreateUserInfo(user_id);
            var cverno = uinfo.GetVersion();
            //different version
            if (cverno != verno)
            {
                //current user info
                using (var scope = _scopefactory.CreateScope())
                {
                    var states = new[] { TaskNotifyState.Append, TaskNotifyState.Run, TaskNotifyState.Finish };
                    var ctx = scope.ServiceProvider.GetService<ApplicationDbContext>();
                    var rr = ctx.Set<TnTaskNotify>()
                        .AsNoTracking()
                        .Where(x => x.UserId == user_id)
                        .Where(x => states.Contains(x.State))
                        .AsEnumerable()
                        .OrderByDescending(x => x.Id)
                        .ToArray()
                        ;
                    return (cverno, rr);
                }
            }
            //same version 
            else
            {
                var task = uinfo.CreateWaiterTask(verno);

                //wait new notify or timeout
                var task1 = await Task.WhenAny(task, Task.Delay(180000, _cts.Token));

                //沒有等到異動事件的話，要把等待Task移除免得一直佔記憶體
                if (task != task1)              
                    uinfo.TryRemoveWaiter(task);                   

                //if cancel return empty
                if (_cts.Token.IsCancellationRequested)
                    return (0, new TnTaskNotify[0]);

                //refresh version
                cverno = uinfo.GetVersion();

                //current user info
                var states = new[] { TaskNotifyState.Append, TaskNotifyState.Run, TaskNotifyState.Finish };
                using (var scope = _scopefactory.CreateScope())
                {
                    var ctx = scope.ServiceProvider.GetService<ApplicationDbContext>();
                    var rr = ctx.Set<TnTaskNotify>()
                        .AsNoTracking()
                        .Where(x => x.UserId == user_id)
                        .Where(x => states.Contains(x.State))
                        .AsEnumerable()
                        .OrderByDescending(x => x.Id)
                        .ToArray()
                        ;

                    return (cverno, rr);
                }
            }
        }    

        /// <summary>
        /// Get Current User Version info
        /// </summary>
        /// <param name="user_id"></param>
        /// <returns>(VersionId, WaitChangeTask)</returns>
        CUserInfo GetOrCreateUserInfo(int user_id)
        {
            CUserInfo usr;
            lock (_UserInfos)
            {
                if(!_UserInfos.TryGetValue(user_id, out usr))
                {
                    usr = new CUserInfo(user_id);                   
                    usr.LoopTask = Task.Run(async () => await LoopForDetectUserAsync(usr));
                    _UserInfos.Add(user_id, usr);
                }
            }
            return usr;
        }

        /// <summary>
        /// detect that if user's task notify has any changed.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        async Task LoopForDetectUserAsync(CUserInfo info)
        {
            var ctoken = _cts.Token;
            while(!ctoken.IsCancellationRequested)
            {
                await info.NotifyChangeEvent.WaitAsync(TimeSpan.FromMilliseconds(-1), ctoken);
                //await Task.WhenAny(info.NotifyChangeEvent.WaitOneAsync(), Task.Delay(-1, ctoken));
                if (ctoken.IsCancellationRequested)
                    return;

                try
                {
                    var cverno = info.GetVersion();

                    //get last version
                    using (var scope = _scopefactory.CreateScope())
                    {
                        var ctx = scope.ServiceProvider.GetService<ApplicationDbContext>();
                        var record = await ctx.Set<TnUserNotify>()
                            .AsNoTracking()
                            .Where(x => x.Id > cverno && x.UserId == info.UserId)
                            .OrderByDescending(x => x.Id)
                            .FirstOrDefaultAsync()
                            ;
                        //no change.
                        if (record == null)
                            continue;

                        //notify changed                       
                        info.SetVersion(record.Id);
                    }
                }
                catch
                {
                    await Task.Delay(2000, ctoken);
                }
            }
        }

        public void Dispose()
        {
            _cts.Cancel();
        }

        /// <summary>
        /// User's Information for Version
        /// </summary>
        class CUserInfo
        {
            public CUserInfo(int userid)
            {
                UserId = userid;
            }

            internal int UserId { get; private set; }

            /// <summary>
            /// Current User's Information Version Number
            /// </summary>
            private long VersionNo { get; set; } = 0;          

            /// <summary>
            /// notify the user's notify has changed
            /// </summary>
            internal AsyncAutoResetEvent NotifyChangeEvent { get; private set; } = new AsyncAutoResetEvent(true);

            /// <summary>
            /// Query Client waiting for user has any change
            /// </summary>
            private volatile List<TaskCompletionSource<bool>> _Waitters = new List<TaskCompletionSource<bool>>(); 

            internal Task LoopTask { get; set; }

            private readonly object _lck_version = new object();

            internal long GetVersion()
            {
                lock(_lck_version)
                {
                    return VersionNo;
                }
            }

            internal void SetVersion(long new_verno)
            {
                lock (_lck_version)
                {
                    VersionNo = new_verno;
                    foreach(var v in _Waitters)
                    {
                        Task.Run(() => v.TrySetResult(true));
                    }
                    _Waitters.Clear();
                }
            }

            internal Task CreateWaiterTask(long version_id)
            {
                lock (_lck_version)
                {
                    if (version_id != VersionNo)
                    {
                        return Task.FromResult(true);
                    }

                    var tcs = new TaskCompletionSource<bool>();
                    _Waitters.Add(tcs);
                    return tcs.Task;
                }
            }

            internal void TryRemoveWaiter(Task task)
            {
                lock (_lck_version)
                {
                    _Waitters.RemoveAll(x => x.Task == task);
                }
            }
        }
    }

    /// <summary>
    /// the result of notify
    /// </summary>
    public class TaskNotifyResult
    {
        /// <summary>
        /// OK for sucess
        /// </summary>
        public string Result { get; set; }

        /// <summary>
        /// result messge
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// result type
        /// </summary>
        public TaskNotifyResultKind Kind { get; set; }

        /// <summary>
        /// Url's Title
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Url's Href
        /// </summary>
        public string Content { get; set; }

    }

    public enum TaskNotifyResultKind
    {
        None=0, Download=1
    }       

    /// <summary>
    /// the state of task
    /// </summary>
    public enum TaskNotifyState
    {
        /// <summary>
        /// 新增
        /// </summary>
        Append=0,
        /// <summary>
        /// 執行中
        /// </summary>
        Run=1,
        /// <summary>
        /// 已完成
        /// </summary>
        Finish=2,       
        /// <summary>
        /// 已可刪除掉
        /// </summary>
        Remove
    }
}
