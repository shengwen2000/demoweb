var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./common"], function (require, exports, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CStyle = /** @class */ (function () {
        function CStyle() {
            /** 多重新增視窗 */
            this.IsMultiNews = false;
            /** 多重檢視視窗 */
            this.IsMultiViews = false;
        }
        return CStyle;
    }());
    /**
        * 主檔維護1(就地編輯)
        */
    var SwMaster1Ctrl = /** @class */ (function (_super) {
        __extends(SwMaster1Ctrl, _super);
        function SwMaster1Ctrl($q, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$q = $q;
            _this.$scope = $scope;
            /** 編輯風格 */
            _this.Style = new CStyle();
            /** 查詢紀錄集合 */
            _this.Records = [];
            /** 異動的紀錄 */
            _this.RecordsLog = [];
            /** 異動的紀錄增減的筆數 */
            _this.RecordsLogAttachCount = 0;
            /** 新增紀錄集合 */
            _this.NewRecords = [];
            /**分頁設定*/
            _this.Pager = {
                Source: null,
                Size: 20,
                Index: 0,
                Count: 0,
                Indexes: []
            };
            /** 延遲載入 */
            _this.LazyLoader = {
                Source: null,
                InitCount: 20,
                MoreCount: 10,
                LoadedCount: 0,
                Loading: false,
                Complete: false
            };
            /**
           延遲載入監聽事件
           */
            _this.lazyLoaderListener = null;
            return _this;
        }
        /**
         * 查詢資料
         * @param config
         */
        SwMaster1Ctrl.prototype.query = function (config) {
            var _this = this;
            this.createTab("List", function (tab) {
                tab.Title = "列表";
                tab.IsCloseEnable = false;
            }).focus();
            return this.exeHttpAction(this.onQuery(config), config)
                .then(function (x) {
                _this.onQueryLoaded(x, config);
                _this.Result = x;
                if (x.Result == "OK") {
                    _this.Records = x.Records;
                }
                return x;
            });
        };
        /**
         * 取得查詢結果(後代需實作)
         * @param config
         */
        SwMaster1Ctrl.prototype.onQuery = function (config) {
            var result = { Result: "NG", Message: "Not Implement onQuery()" };
            return this.$q.resolve({ data: result });
        };
        /**
         * 當查詢資料載入時
         * @param result
         */
        SwMaster1Ctrl.prototype.onQueryLoaded = function (result, config) {
        };
        /**
         * 只更清單中的某一筆紀錄，但若不存在的話新增之。
         * @param record
         * @param origin_state (為什麼要更新只能是幾種原因 1.新增 2.異動 3.刪除)
         */
        SwMaster1Ctrl.prototype.queryOne = function (record, origin_state) {
            var _this = this;
            return this.exeHttpAction(this.onQueryOne(record))
                .then(function (x) {
                _this.onQueryLoaded(x);
                _this.Result = x;
                if (x.Result == "OK") {
                    var qrecord = x.Record;
                    if (!qrecord)
                        qrecord = x.Records[0];
                    //使用分頁時，紀錄異動紀錄
                    if (_this.Pager.Source) {
                        var r = _this.clonedata(qrecord);
                        r.$State = origin_state;
                        r.$PageIndex = _this.Pager.Index;
                        _this.RecordsLog.push(r);
                        switch (r.$State) {
                            case common_1.SwRecordState.New:
                                _this.RecordsLogAttachCount++;
                                break;
                        }
                    }
                    var idx = _this.findRecordIdx(_this.Records, qrecord.Id);
                    //新增的話那就新增之。
                    if (origin_state == common_1.SwRecordState.New) {
                        if (idx >= 0) {
                            _this.Records.splice(idx, 1);
                        }
                        _this.Records.unshift(qrecord);
                    }
                    //異動的話更新之
                    else {
                        if (idx >= 0) {
                            var qrecord_old = _this.Records[idx];
                            for (var p in qrecord) {
                                if (p[0] == '$')
                                    continue;
                                qrecord_old[p] = qrecord[p];
                            }
                        }
                    }
                }
            });
        };
        /**
        * 取得查詢結果(後代需實作)
        * @param config
        */
        SwMaster1Ctrl.prototype.onQueryOne = function (record) {
            return this.$q.resolve({
                data: {
                    Result: "OK",
                    Message: "Success",
                    Record: this.clonedata(record)
                }
            });
        };
        /**
         * 分頁查詢
         * @param pagesize 每頁的Size
         */
        SwMaster1Ctrl.prototype.pageQuery = function (pagesize, config) {
            var _this = this;
            this.createTab("List", function (tab) {
                tab.Title = "列表";
                tab.IsCloseEnable = false;
            }).focus();
            if (!pagesize)
                pagesize = this.Pager.Size;
            var qp = {};
            qp.pg_idx = 0;
            qp.pg_count = pagesize;
            if (this.Pager.Source)
                qp.pg_oname = this.Pager.Source.Name;
            return this.exeHttpAction(this.onPageQuery(qp, config), config)
                .then(function (x) {
                _this.onQueryLoaded(x, config);
                _this.Result = x;
                //success
                if (x.Result == "OK") {
                    _this.Records = x.Records;
                    var psource = _this.Result.PSource;
                    _this.Pager.Source = psource;
                    _this.Pager.Size = pagesize;
                    _this.Pager.Index = 0;
                    _this.Pager.Count = Math.ceil(psource.Count / _this.Pager.Size);
                    //清空異動紀錄
                    _this.RecordsLog = [];
                    _this.RecordsLogAttachCount = 0;
                    _this.pageIndexRefresh();
                }
                else {
                    _this.onHttpResultError(x, config);
                }
                return x;
            });
        };
        /**
        * 取得查詢結果(後代需實作)
        * @param config
        */
        SwMaster1Ctrl.prototype.onPageQuery = function (pager, config) {
            var result = { Result: "NG", Message: "Not Implement onPageQuery()" };
            return this.$q.resolve({ data: result });
        };
        /**
        * 頁面索引更新
        */
        SwMaster1Ctrl.prototype.pageIndexRefresh = function () {
            //{ Name: "«", Index: 0, Enable: false, Active: false },
            //{ Name: "1", Index: 0, Enable: false, Active: true },
            //{ Name: "2", Index: 1, Enable: true, Active: false },
            //{ Name: "3", Index: 2, Enable: true, Active: false },
            //{ Name: "4", Index: 3, Enable: true, Active: false },
            //{ Name: "»", Index: 1, Enable: true, Active: false },          
            var idxs = [];
            if (this.Pager.Index > 0) {
                var pidx = { Name: "«", Index: this.Pager.Index - 1, Enable: true, Active: false };
                idxs.push(pidx);
            }
            else {
                var pidx = { Name: "«", Index: 0, Enable: false, Active: false };
                idxs.push(pidx);
            }
            //每個分頁       
            {
                //每段的寬度
                var blockwidth = 3;
                //前段由頁0開始
                var idx = 0;
                for (var i = 0; i < blockwidth; i++) {
                    if (idx >= this.Pager.Count)
                        break;
                    var pidx = { Name: "" + (idx + 1), Index: idx, Enable: this.Pager.Index != idx, Active: this.Pager.Index == idx };
                    idxs.push(pidx);
                    idx++;
                }
                //中段約由目前頁開始
                var block1_start = this.Pager.Index - Math.floor(blockwidth / 2);
                //尾段約由目頁尾開始
                var block2_start = (this.Pager.Count - 1) - (blockwidth - 1);
                //頁簽在尾段|段前出現,則中段重新設定
                //if (this.Pager.Index < blockwidth || this.Pager.Index >= block2_start) {
                //    block1_start = Math.floor(this.Pager.Count / 2) - Math.floor(blockwidth / 2);
                //}
                //焦點在前段出現
                if (this.Pager.Index < blockwidth) {
                    block1_start = blockwidth + 1;
                }
                //焦點在尾段出現
                else if (this.Pager.Index >= block2_start) {
                    block1_start = block2_start - blockwidth - 1;
                }
                //中段蓋到尾段的話,則中段重新設定
                if (block1_start + blockwidth >= block2_start) {
                    block1_start = block2_start - blockwidth - 1;
                }
                //中段繪製
                if (idx < block1_start) {
                    if (idx + 1 == block1_start) {
                        var pidx = { Name: "" + (idx + 1), Index: idx, Enable: this.Pager.Index != idx, Active: this.Pager.Index == idx };
                        idxs.push(pidx);
                        idx = block1_start;
                    }
                    else {
                        idx = block1_start;
                        var pidx = { Name: "...", Index: 0, Enable: false, Active: false };
                        idxs.push(pidx);
                    }
                }
                for (var i = 0; i < blockwidth; i++) {
                    if (idx >= this.Pager.Count)
                        break;
                    var pidx = { Name: "" + (idx + 1), Index: idx, Enable: this.Pager.Index != idx, Active: this.Pager.Index == idx };
                    idxs.push(pidx);
                    idx++;
                }
                //尾段繪製                
                if (idx < block2_start) {
                    if (idx + 1 == block2_start) {
                        var pidx = { Name: "" + (idx + 1), Index: idx, Enable: this.Pager.Index != idx, Active: this.Pager.Index == idx };
                        idxs.push(pidx);
                        idx = block2_start;
                    }
                    else {
                        idx = block2_start;
                        var pidx = { Name: "...", Index: 0, Enable: false, Active: false };
                        idxs.push(pidx);
                    }
                }
                for (var i = 0; i < blockwidth; i++) {
                    if (idx >= this.Pager.Count)
                        break;
                    var pidx = { Name: "" + (idx + 1), Index: idx, Enable: this.Pager.Index != idx, Active: this.Pager.Index == idx };
                    idxs.push(pidx);
                    idx++;
                }
            }
            if (this.Pager.Index < this.Pager.Count - 1) {
                var pidx = { Name: "»", Index: this.Pager.Index + 1, Enable: true, Active: false };
                idxs.push(pidx);
            }
            else {
                var pidx = { Name: "»", Index: this.Pager.Count - 1, Enable: false, Active: false };
                idxs.push(pidx);
            }
            this.Pager.Indexes = idxs;
        };
        /**
      * 排序欄位
      * @param column
      */
        SwMaster1Ctrl.prototype.pageOrderBy = function (column, desc, config) {
            var _this = this;
            if (desc === void 0) { desc = false; }
            var v = this.QryArgs.OrderBy;
            //初始設定
            if (v == null) {
                v = {
                    Value: { Column: column, Desc: desc },
                    Checked: true
                };
                this.QryArgs.OrderBy = v;
            }
            //已初始
            else {
                //同欄位
                if (v.Value.Column == column) {
                    v.Value.Desc = !v.Value.Desc;
                }
                //不同欄位
                else {
                    v.Value.Column = column;
                    v.Value.Desc = desc;
                }
            }
            //還沒有執行查詢的話就不做任何事
            if (this.Pager.Source == null)
                return;
            //如果有異動資料的話，排序必須重新查詢
            if (this.RecordsLog.length > 0) {
                this.pageQuery(this.Pager.Size, config);
            }
            //沒異動的話由Cache來排序就好
            else {
                var qp = {};
                qp.pg_idx = 0;
                qp.pg_count = this.Pager.Size;
                qp.pg_name = this.Pager.Source.Name;
                qp['OrderBy'] = this.QryArgs.OrderBy.Value;
                //已經有查詢過的話直接要求排序資料即可
                this.exeHttpAction(this.onPageOrderBy(qp, config), config)
                    .then(function (x) {
                    _this.onQueryLoaded(x, config);
                    //cache data be cleared
                    if (x.Result == "QP01") {
                        _this.Result = { Result: 'OK', Message: '' };
                        _this.pageQuery(_this.Pager.Size, config);
                        return;
                    }
                    if (x.Result == "OK") {
                        _this.Records = x.Records;
                        var psource = _this.Result.PSource;
                        _this.Pager.Source = psource;
                        _this.Pager.Index = 0;
                        _this.Pager.Count = Math.ceil(psource.Count / _this.Pager.Size);
                        //清空異動紀錄
                        _this.RecordsLog = [];
                        _this.RecordsLogAttachCount = 0;
                        _this.pageIndexRefresh();
                    }
                });
            }
        };
        /**
        * 取得排序結果(後代需實作)
        * @param config
        */
        SwMaster1Ctrl.prototype.onPageOrderBy = function (qp, config) {
            var result = { Result: "NG", Message: "Not Implement onPageOrderBy()" };
            return this.$q.resolve({ data: result });
        };
        /**
         * 移動到哪一頁
         * @param pageindex
         */
        SwMaster1Ctrl.prototype.pageMove = function (pageindex, config) {
            var _this = this;
            var qp = {};
            qp.pg_idx = pageindex;
            qp.pg_name = this.Pager.Source.Name;
            return this.exeHttpAction(this.onPageQuery(qp, config), config)
                .then(function (x) {
                _this.onQueryLoaded(x, config);
                _this.Result = x;
                //page data been clear
                if (x.Result == "QP01") {
                    //auto requery
                    _this.Result = { Result: 'OK', Message: '' };
                    _this.pageQuery(_this.Pager.Size, config);
                    return;
                }
                //success
                if (x.Result == "OK") {
                    _this.Records = x.Records;
                    _this.Pager.Index = pageindex;
                    _this.pageIndexRefresh();
                    //套用異動的紀錄
                    {
                        for (var _i = 0, _a = _this.RecordsLog; _i < _a.length; _i++) {
                            var r1 = _a[_i];
                            switch (r1.$State) {
                                case common_1.SwRecordState.New:
                                    {
                                        if (r1.$PageIndex == _this.Pager.Index) {
                                            var r2 = _this.clonedata(r1);
                                            _this.Records.unshift(r2);
                                        }
                                    }
                                    break;
                                case common_1.SwRecordState.Update:
                                    {
                                        var r2 = _this.clonedata(r1);
                                        var idx = _this.findRecordIdx(_this.Records, r2.Id);
                                        if (idx >= 0) {
                                            _this.Records.splice(idx, 1, r2);
                                        }
                                    }
                                    break;
                                case common_1.SwRecordState.Delete:
                                    {
                                        var idx = _this.findRecordIdx(_this.Records, r1.Id);
                                        if (idx >= 0) {
                                            _this.Records.splice(idx, 1);
                                        }
                                    }
                                    break;
                            }
                        }
                    }
                }
            });
        };
        /**
         * 狀態變更時
         * @param record
         * @param target
         */
        SwMaster1Ctrl.prototype.onRecordStateChange = function (record, state) {
            record.$State = state;
        };
        /**
         * 檢視-紀錄內容
         * @param record
         */
        SwMaster1Ctrl.prototype.recordView = function (record, config) {
            var _this = this;
            var deffer = this.$q.defer();
            var qrecord = this.findRecord(this.Records, record.Id);
            //如果限制只能有一個View的話,Close Others
            if (!this.Style.IsMultiViews) {
                var cv = null;
                for (var _i = 0, _a = this.Records; _i < _a.length; _i++) {
                    var v = _a[_i];
                    if (v.$SubRecord) {
                        v.$SubRecord = null;
                        cv = v;
                    }
                }
                //同一列已顯示中，再按一次表示關閉
                if (cv == qrecord) {
                    deffer.reject("direct close it");
                    return;
                }
            }
            this.exeHttpAction(this.onRecordView(qrecord, config), config)
                .then(function (x) {
                _this.onRecordLoaded(x, config);
                _this.Result = x;
                if (x.Result == "OK") {
                    qrecord.$SubRecord = x.Record;
                    x.Record.$State = common_1.SwRecordState.None;
                    _this.onRecordStateChange(x.Record, common_1.SwRecordState.View);
                    if (x.Record.$State == common_1.SwRecordState.Update) {
                        x.Record.$ViewBak = _this.clonedata(x.Record);
                    }
                    deffer.resolve(x.Record);
                }
                else
                    deffer.reject(qrecord);
            });
            return deffer.promise;
        };
        /**
         * 重新檢視View
        * @param record
        */
        SwMaster1Ctrl.prototype.recordRefresh = function (record, config) {
            var _this = this;
            var defer = this.$q.defer();
            //query record
            var qrecord = this.findRecord(this.Records, record.Id);
            //find the record current view             
            var vrecord = null;
            for (var _i = 0, _a = this.Records; _i < _a.length; _i++) {
                var v = _a[_i];
                if (v.Id == record.Id)
                    vrecord = v.$SubRecord;
            }
            //並沒有檢視紀錄，那就只是queryone()即可
            if (vrecord == null) {
                //更新Grid紀錄
                this.queryOne(qrecord, common_1.SwRecordState.Update);
                defer.resolve();
            }
            //有檢視紀錄，更新查詢項目與View
            else {
                this.exeHttpAction(this.onRecordView(qrecord, config), config)
                    .then(function (x) {
                    _this.onRecordLoaded(x, config);
                    _this.Result = x;
                    if (x.Result == "OK") {
                        qrecord.$SubRecord = x.Record;
                        x.Record.$State = common_1.SwRecordState.None;
                        _this.onRecordStateChange(x.Record, common_1.SwRecordState.View);
                        if (x.Record.$State == common_1.SwRecordState.Update) {
                            x.Record.$ViewBak = _this.clonedata(x.Record);
                        }
                        defer.resolve(x.Record);
                        //更新Grid紀錄
                        _this.queryOne(qrecord, common_1.SwRecordState.Update);
                    }
                    else {
                        defer.reject(qrecord);
                    }
                });
            }
            return defer.promise;
        };
        /**
         * 取得紀錄內容(後代需實作)
         * @param config
         */
        SwMaster1Ctrl.prototype.onRecordView = function (record, config) {
            var newr = angular.copy(record);
            for (var n in newr) {
                if (n[0] == "$")
                    newr[n] = null;
            }
            return this.$q.resolve({
                data: {
                    Result: "OK",
                    Message: "Success",
                    Record: newr
                }
            });
        };
        /**
        * 資料項目單筆編輯或檢視項目由Server端載入時
        * @param result
        * @param config
        */
        SwMaster1Ctrl.prototype.onRecordLoaded = function (result, config) {
        };
        /**
         * 要求編輯紀錄
         * @param record
         * @param config
         */
        SwMaster1Ctrl.prototype.recordEdit = function (record, config) {
            this.onRecordStateChange(record, common_1.SwRecordState.Update);
            if (record.$State != common_1.SwRecordState.Update)
                return;
            //backeup state
            record.$ViewBak = this.clonedata(record);
            //event
            this.onRecordEdit(record, config);
        };
        /**
         * 當資料編輯時(通知後代)
         * @param record
         * @param config
         */
        SwMaster1Ctrl.prototype.onRecordEdit = function (record, config) {
        };
        /**
        * 新增紀錄
        */
        SwMaster1Ctrl.prototype.recordNew = function (config) {
            var _this = this;
            var defer = this.$q.defer();
            //不允許多重新增
            if (this.NewRecords.length > 0 && !this.Style.IsMultiNews) {
                defer.reject('不允許多重新增');
                return defer.promise;
            }
            this.exeHttpAction(this.onRecordNew(config), config)
                .then(function (x) {
                _this.onRecordLoaded(x, config);
                _this.Result = x;
                if (x.Result == "OK") {
                    x.Record.$State = common_1.SwRecordState.New;
                    _this.NewRecords.unshift(x.Record);
                    _this.Tabs[0].focus();
                    defer.resolve(x.Record);
                }
                else {
                    defer.reject();
                }
            });
            return defer.promise;
        };
        /**
        * 當資料新增時(後代給予初始值)
        * @param config
        */
        SwMaster1Ctrl.prototype.onRecordNew = function (config) {
            var record = { Id: 0 };
            return this.$q.resolve({
                data: {
                    Result: "OK",
                    Message: "Success",
                    Record: record
                }
            });
        };
        /**
         * 關閉紀錄
         * @param record
         */
        SwMaster1Ctrl.prototype.recordClose = function (record) {
            var defer = this.$q.defer();
            //新增狀態
            if (record.$State == common_1.SwRecordState.New) {
                var newidx = this.NewRecords.indexOf(record);
                if (newidx >= 0) {
                    this.NewRecords.splice(newidx, 1);
                }
                defer.resolve(record);
                return defer.promise;
            }
            var s1 = record.$State;
            //回歸檢視狀態
            if (record.$State == common_1.SwRecordState.Update) {
                this.onRecordStateChange(record, common_1.SwRecordState.View);
            }
            //檢視回歸關閉
            else if (record.$State == common_1.SwRecordState.View) {
                this.onRecordStateChange(record, common_1.SwRecordState.None);
            }
            var s2 = record.$State;
            //如果有編輯變回檢視的狀態必須要重新載入資料
            if (s1 == common_1.SwRecordState.Update && s2 == common_1.SwRecordState.View) {
                if (record.$ViewBak) {
                    for (var n in record.$ViewBak) {
                        if (n[0] != '$') {
                            record[n] = record.$ViewBak[n];
                        }
                    }
                    delete record.$ViewBak;
                }
            }
            //取消檢視狀態
            if (!record.$State) {
                var qrecord = this.findRecord(this.Records, record.Id);
                if (qrecord)
                    qrecord.$SubRecord = null;
            }
            defer.resolve(record);
            return defer.promise;
        };
        /**
        * 紀錄儲存(新增或修改儲存)
        * @param record
        * @param config
        */
        SwMaster1Ctrl.prototype.recordSave = function (record, config) {
            var _this = this;
            var defer = this.$q.defer();
            var origin_state = record.$State;
            this.exeHttpAction(this.onRecordSave(this.clonedata(record), config), config)
                .then(function (x) {
                _this.onRecordLoaded(x, config);
                _this.Result = x;
                if (x.Result != "OK") {
                    defer.reject(x.Result);
                }
                else {
                    var record_new_1 = x.Record;
                    var newidx = _this.NewRecords.indexOf(record);
                    //新增
                    if (newidx >= 0) {
                        _this.NewRecords.splice(newidx, 1);
                        //放到清單裡面去
                        _this.queryOne(record_new_1, origin_state);
                    }
                    //維護
                    else {
                        //放到清單裡面去
                        _this.queryOne(record_new_1, origin_state)
                            .then(function () {
                            var qrecord = _this.findRecord(_this.Records, record.Id);
                            qrecord.$SubRecord = record_new_1;
                            x.Record.$State = record.$State;
                            _this.onRecordStateChange(record_new_1, common_1.SwRecordState.View);
                            if (!record_new_1.$State) {
                                qrecord.$SubRecord = null;
                            }
                        });
                    }
                    defer.resolve(record_new_1);
                }
            });
            return defer.promise;
        };
        /**
        * 當資料儲存時(後代實作)
        * @param config
        */
        SwMaster1Ctrl.prototype.onRecordSave = function (record, config) {
            return this.$q.resolve({
                data: {
                    Result: "NG",
                    Message: "no implement onRecordSave()"
                }
            });
        };
        /**
         * 刪除紀錄
         * @param record
         * @param config
         */
        SwMaster1Ctrl.prototype.recordDelete = function (record, config) {
            var _this = this;
            var defer = this.$q.defer();
            this.showConfirm("確定刪除-" + this.onGetRecordTitle(record) + "嗎?")
                .then(function () {
                _this.recordDeleteDo(record, config)
                    .then(function (x) { return defer.resolve(record); }, function () { return defer.reject(record); });
            }, function () {
                defer.reject(record);
            });
            return defer.promise;
        };
        /**
        * 刪除紀錄執行
        * @param record
        * @param config
        */
        SwMaster1Ctrl.prototype.recordDeleteDo = function (record, config) {
            var _this = this;
            var defer = this.$q.defer();
            this.exeHttpAction(this.onRecordDeleteDo(this.clonedata(record), config), config)
                .then(function (x) {
                _this.Result = x;
                if (x.Result == 'OK') {
                    var idx = _this.findRecordIdx(_this.Records, record.Id);
                    if (idx >= 0) {
                        _this.Records.splice(idx, 1);
                    }
                    //使用分頁時，紀錄異動紀錄
                    if (_this.Pager.Source) {
                        var r = _this.clonedata(record);
                        r.$State = common_1.SwRecordState.Delete;
                        r.$PageIndex = _this.Pager.Index;
                        _this.RecordsLog.push(r);
                        _this.RecordsLogAttachCount--;
                    }
                    defer.resolve(record);
                }
                else {
                    defer.reject(record);
                }
            });
            return defer.promise;
        };
        /**
        * 執行資料刪除(後代實作)
        * @param config
        */
        SwMaster1Ctrl.prototype.onRecordDeleteDo = function (record, config) {
            var result = { Result: "NG", Message: "Not Implement onRecordDeleteDo()" };
            return this.$q.resolve({ data: result });
        };
        /**
         * 取得紀錄標題
         * @param record
         */
        SwMaster1Ctrl.prototype.onGetRecordTitle = function (record) {
            if (record["Name"])
                return record["Name"];
            return "NotImplement onGetRecordTitle()";
        };
        SwMaster1Ctrl.prototype.findRecord = function (records, id) {
            for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
                var v = records_1[_i];
                if (v.Id == id)
                    return v;
            }
            return null;
        };
        SwMaster1Ctrl.prototype.findRecordIdx = function (records, id) {
            for (var i = 0; i < records.length; i++) {
                if (records[i].Id == id)
                    return i;
            }
            return -1;
        };
        /**
         * 開始延遲查詢
         */
        SwMaster1Ctrl.prototype.lazyQuery = function (config) {
            var _this = this;
            var defer = this.$q.defer();
            this.LazyLoader.Loading = true;
            this.createTab("List", function (tab) {
                tab.Title = "列表";
                tab.IsCloseEnable = false;
            }).focus();
            var qp = {};
            if (this.LazyLoader.Source) {
                qp.pg_oname = this.LazyLoader.Source.Name;
            }
            qp.pg_idx = 0;
            qp.pg_count = this.LazyLoader.InitCount;
            this.exeHttpAction(this.onLazyQuery(qp, config), config)
                .then(function (x) {
                _this.LazyLoader.Loading = false;
                _this.Result = x;
                if (x.Result == "OK") {
                    _this.LazyLoader.Source = x.PSource;
                    _this.LazyLoader.LoadedCount = x.Records.length;
                    _this.LazyLoader.Complete = _this.LazyLoader.LoadedCount == _this.LazyLoader.Source.Count;
                    _this.Records = x.Records;
                    defer.resolve();
                }
                else
                    defer.reject();
            });
            return defer.promise;
        };
        /**
        * 執行資料查詢(後代實作)
        * @param config
        */
        SwMaster1Ctrl.prototype.onLazyQuery = function (pager, config) {
            var result = { Result: "NG", Message: "Not Implement onLazyQuery()" };
            return this.$q.resolve({ data: result });
        };
        /**
        * 繼續延遲載入
        */
        SwMaster1Ctrl.prototype.lazyQueryMore = function (config) {
            var _this = this;
            var defer = this.$q.defer();
            if (this.LazyLoader.Loading || this.LazyLoader.Complete) {
                defer.resolve();
                return defer.promise;
            }
            this.LazyLoader.Loading = true;
            this.findTab("List").focus();
            var qp = {};
            qp.pg_name = this.LazyLoader.Source.Name;
            qp.pg_idx = this.LazyLoader.LoadedCount;
            qp.pg_count = this.LazyLoader.MoreCount;
            this.exeHttpAction(this.onLazyQueryMore(qp, config), config)
                .then(function (x) {
                _this.LazyLoader.Loading = false;
                _this.Result = x;
                //cache data be cleared
                if (x.Result == "QP01") {
                    _this.Result = { Result: 'OK', Message: '' };
                    _this.lazyQuery(config)
                        .then(function () { return defer.resolve(); }, function () { return defer.reject(); });
                    return;
                }
                if (x.Result == "OK") {
                    _this.LazyLoader.LoadedCount += x.Records.length;
                    _this.LazyLoader.Complete = _this.LazyLoader.LoadedCount == _this.LazyLoader.Source.Count;
                    //add more records
                    for (var _i = 0, _a = x.Records; _i < _a.length; _i++) {
                        var r = _a[_i];
                        _this.Records.push(r);
                    }
                    defer.resolve();
                }
                else {
                    defer.reject(x.Result);
                }
            });
            return defer.promise;
        };
        /**
       * 執行資料查詢(後代實作)
       * @param config
       */
        SwMaster1Ctrl.prototype.onLazyQueryMore = function (pager, config) {
            var result = { Result: "NG", Message: "Not Implement onLazyQueryMore()" };
            return this.$q.resolve({ data: result });
        };
        /**
         * 設定自動延遲載入按鈕
         * @param selector
         * @param delayTime
         */
        SwMaster1Ctrl.prototype.lazySetAutoLoadButton = function (selector, delayTime) {
            var _this = this;
            if (delayTime === void 0) { delayTime = 0; }
            if (this.lazyLoaderListener) {
                window.removeEventListener("scroll", this.lazyLoaderListener);
                this.lazyLoaderListener = null;
            }
            this.lazyLoaderListener = function (evt) {
                if (_this.LazyLoader.Complete || _this.LazyLoader.Loading)
                    return;
                var el = document.querySelector(selector);
                if (!el)
                    return;
                var elemTop = el.getBoundingClientRect().top;
                var elemBottom = el.getBoundingClientRect().bottom;
                var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
                if (isVisible) {
                    if (!delayTime) {
                        _this.lazyQueryMore();
                    }
                    else {
                        window.setTimeout(_this.lazyQueryMore, delayTime);
                    }
                }
            };
            //設定事件
            window.addEventListener("scroll", this.lazyLoaderListener);
        };
        return SwMaster1Ctrl;
    }(common_1.SwBaseCtrl));
    exports.SwMaster1Ctrl = SwMaster1Ctrl;
});
//# sourceMappingURL=master1.js.map