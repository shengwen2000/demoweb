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
    /**
           * 主檔維護2(頁簽式)
           */
    var SwMaster2Ctrl = /** @class */ (function (_super) {
        __extends(SwMaster2Ctrl, _super);
        function SwMaster2Ctrl($q, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$q = $q;
            _this.$scope = $scope;
            /** 查詢紀錄集合 */
            _this.Records = [];
            /** 異動的紀錄 */
            _this.RecordsLog = [];
            /**分頁設定*/
            _this.Pager = {
                Source: null,
                Size: 20,
                Index: 0,
                Count: 0,
                Indexes: []
            };
            return _this;
        }
        /**
         * 查詢資料
         * @param config
         */
        SwMaster2Ctrl.prototype.query = function (config) {
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
        SwMaster2Ctrl.prototype.onQuery = function (config) {
            var result = { Result: "NG", Message: "Not Implement onQuery()" };
            return this.$q.resolve({ data: result });
        };
        /**
         * 當查詢資料載入時
         * @param result
         */
        SwMaster2Ctrl.prototype.onQueryLoaded = function (result, config) {
        };
        /**
         * 只更清單中的某一筆紀錄
         * 原狀態為新增:新增之。
         * 原狀態為修改:更新之。
         * @param record
         * @param origin_state 原本狀態新增|更新
         */
        SwMaster2Ctrl.prototype.queryOne = function (record, origin_state) {
            var _this = this;
            //使用分頁時，紀錄異動紀錄
            if (this.Pager.Source) {
                var r = this.clonedata(record);
                r.$State = origin_state;
                r.$PageIndex = this.Pager.Index;
                this.RecordsLog.push(r);
            }
            return this.exeHttpAction(this.onQueryOne(record))
                .then(function (x) {
                _this.onQueryLoaded(x);
                _this.Result = x;
                if (x.Result == "OK") {
                    var qrecord = x.Record;
                    if (!qrecord)
                        qrecord = x.Records[0];
                    var idx = _this.findRecordIdx(_this.Records, qrecord.Id);
                    //新增的話那就新增之。
                    if (origin_state == common_1.SwRecordState.New) {
                        if (idx >= 0) {
                            _this.Records.splice(idx, 1);
                        }
                        _this.Records.unshift(qrecord);
                    }
                    //其他的如果存在更新之
                    else {
                        if (idx >= 0)
                            _this.Records.splice(idx, 1, qrecord);
                    }
                }
            });
        };
        /**
        * 取得查詢結果(後代需實作)
        * @param config
        */
        SwMaster2Ctrl.prototype.onQueryOne = function (record) {
            return this.$q.resolve({
                data: {
                    Result: "OK",
                    Message: "Success",
                    Record: record
                }
            });
        };
        /**
         * 分頁查詢
         * @param pagesize 每頁的Size
         */
        SwMaster2Ctrl.prototype.pageQuery = function (pagesize, config) {
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
                if (x.Result == "OK") {
                    _this.Records = x.Records;
                    var psource = _this.Result.PSource;
                    _this.Pager.Source = psource;
                    _this.Pager.Size = pagesize;
                    _this.Pager.Index = 0;
                    _this.Pager.Count = Math.ceil(psource.Count / _this.Pager.Size);
                    //清空異動紀錄
                    _this.RecordsLog = [];
                    _this.pageIndexRefresh();
                }
                return x;
            });
        };
        /**
         * 取得查詢結果(後代需實作)
         * @param config
         */
        SwMaster2Ctrl.prototype.onPageQuery = function (pager, config) {
            var result = { Result: "NG", Message: "Not Implement onPageQuery()" };
            return this.$q.resolve({ data: result });
        };
        /**
         * 頁面索引更新
         */
        SwMaster2Ctrl.prototype.pageIndexRefresh = function () {
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
        SwMaster2Ctrl.prototype.pageOrderBy = function (column, desc, config) {
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
                this.pageQuery(this.Pager.Size);
            }
            //沒異動的話由Cache來排序就好
            else {
                var qp = {};
                qp.pg_idx = 0;
                qp.pg_count = this.Pager.Size;
                qp.pg_name = this.Pager.Source.Name;
                qp['OrderBy'] = this.QryArgs.OrderBy.Value;
                //已經有查詢過的話直接要求排序資料即可
                this.exeHttpAction(this.onPageOrderBy(qp, config))
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
                        _this.pageIndexRefresh();
                    }
                });
            }
        };
        /**
         * 取得排序結果(後代需實作)
         * @param config
         */
        SwMaster2Ctrl.prototype.onPageOrderBy = function (qp, config) {
            var result = { Result: "NG", Message: "Not Implement onPageOrderBy()" };
            return this.$q.resolve({ data: result });
        };
        /**
         * 移動到哪一頁
         * @param pageindex
         */
        SwMaster2Ctrl.prototype.pageMove = function (pageindex, config) {
            var _this = this;
            var qp = {};
            qp.pg_idx = pageindex;
            qp.pg_name = this.Pager.Source.Name;
            return this.exeHttpAction(this.onPageQuery(qp, config), config)
                .then(function (x) {
                _this.onQueryLoaded(x, config);
                _this.Result = x;
                //cache data be cleared
                if (x.Result == "QP01") {
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
        SwMaster2Ctrl.prototype.onRecordStateChange = function (record, state) {
            record.$State = state;
        };
        /**
         * 檢視紀錄
         * @param record
         */
        SwMaster2Ctrl.prototype.recordView = function (record, config) {
            var _this = this;
            var defer = this.$q.defer();
            var qrecord = this.findRecord(this.Records, record.Id);
            //alread open, refocus it only.
            {
                var tab = this.findTab('Item#' + record.Id);
                if (tab != null) {
                    tab.focus();
                    defer.resolve(tab.Content);
                    return defer.promise;
                }
            }
            this.createTab('Item#' + record.Id, function (tab) {
                _this.exeHttpAction(_this.onRecordView(qrecord, config), config)
                    .then(function (x) {
                    _this.onRecordLoaded(x, config);
                    _this.Result = x;
                    if (x.Result == "OK") {
                        x.Record.$State = common_1.SwRecordState.None;
                        _this.onRecordStateChange(x.Record, common_1.SwRecordState.View);
                        if (x.Record.$State == common_1.SwRecordState.Update) {
                            x.Record.$ViewBak = _this.clonedata(x.Record);
                        }
                        tab.Title = _this.onGetRecordTitle(x.Record);
                        tab.Content = x.Record;
                        tab.focus();
                        defer.resolve(x.Record);
                    }
                    else {
                        tab.close();
                        defer.reject(qrecord);
                    }
                });
            });
            return defer.promise;
        };
        /**
        * 取得紀錄內容(後代需實作)
        * @param config
        */
        SwMaster2Ctrl.prototype.onRecordView = function (record, config) {
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
        SwMaster2Ctrl.prototype.onRecordLoaded = function (result, config) {
        };
        /**
         * 要求編輯紀錄
         * @param record
         * @param config
         */
        SwMaster2Ctrl.prototype.recordEdit = function (record, config) {
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
        SwMaster2Ctrl.prototype.onRecordEdit = function (record, config) {
        };
        /**
         * 新增紀錄
         */
        SwMaster2Ctrl.prototype.recordNew = function (config) {
            var _this = this;
            var defer = this.$q.defer();
            //不允許多重新增，如有一個開啟自動傳回這一個。
            {
                var tab = this.findTab("Item#New");
                if (tab != null) {
                    tab.focus();
                    defer.resolve(tab.Content);
                    return defer.promise;
                }
            }
            this.createTab("Item#New", function (tab) {
                tab.Title = "新增";
                _this.exeHttpAction(_this.onRecordNew(config), config)
                    .then(function (x) {
                    _this.onRecordLoaded(x, config);
                    _this.Result = x;
                    if (x.Result == "OK") {
                        x.Record.$State = common_1.SwRecordState.New;
                        tab.Content = x.Record;
                        defer.resolve(x.Record);
                    }
                    else {
                        defer.reject();
                    }
                })
                    .then(function (x) {
                    tab.focus();
                });
                ;
            });
            return defer.promise;
        };
        /**
        * 當資料新增時(後代給予初始值)
        * @param config
        */
        SwMaster2Ctrl.prototype.onRecordNew = function (config) {
            var record = { Id: 0 };
            var result = {
                Result: "OK",
                Message: "Success",
                Record: record
            };
            return this.$q.resolve({ data: result });
        };
        /**
         * 關閉紀錄
         * @param record
         */
        SwMaster2Ctrl.prototype.recordClose = function (record) {
            var defer = this.$q.defer();
            //新增狀態直接關閉
            if (record.$State == common_1.SwRecordState.New) {
                this.getFocusTab().close();
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
                defer.resolve(record);
                return defer.promise;
            }
            //取消檢視狀態
            if (!record.$State) {
                this.getFocusTab().close();
                defer.resolve(record);
            }
            return defer.promise;
        };
        /**
         * 紀錄儲存(新增或修改儲存)
         * @param record
         * @param config
         */
        SwMaster2Ctrl.prototype.recordSave = function (record, config) {
            var _this = this;
            var defer = this.$q.defer();
            this.exeHttpAction(this.onRecordSave(this.clonedata(record), config), config)
                .then(function (x) {
                _this.onRecordLoaded(x, config);
                _this.Result = x;
                if (x.Result != "OK") {
                    defer.reject(x.Result);
                }
                else {
                    var record_new = x.Record;
                    var tab = _this.getFocusTab();
                    var origin_state = record.$State;
                    //新增
                    if (record.$State == common_1.SwRecordState.New) {
                        record_new.$State = record.$State;
                        tab.Content = record_new;
                        tab.Id = "Item#" + record_new.Id;
                        tab.Title = _this.onGetRecordTitle(record_new);
                    }
                    //維護
                    else {
                        tab.Content = record_new;
                        record_new.$State = record.$State;
                    }
                    //邊更為檢視狀態
                    _this.onRecordStateChange(record_new, common_1.SwRecordState.View);
                    //不檢視的話，直接關閉之回清單頁簽
                    if (record_new.$State == common_1.SwRecordState.None) {
                        tab.close();
                        _this.findTab("List").focus();
                    }
                    //更新清單
                    _this.queryOne(record_new, origin_state);
                }
            });
            return defer.promise;
        };
        /**
        * 當資料儲存時(後代實作)
        * @param config
        */
        SwMaster2Ctrl.prototype.onRecordSave = function (record, config) {
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
        SwMaster2Ctrl.prototype.recordDelete = function (record, config) {
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
        SwMaster2Ctrl.prototype.recordDeleteDo = function (record, config) {
            var _this = this;
            var defer = this.$q.defer();
            this.exeHttpAction(this.onRecordDeleteDo(this.clonedata(record), config), config)
                .then(function (x) {
                _this.Result = x;
                if (x.Result == 'OK') {
                    var idx = _this.findRecordIdx(_this.Records, record.Id);
                    if (idx >= 0) {
                        _this.Records.splice(idx, 1);
                        _this.getFocusTab().close();
                    }
                    //使用分頁時，紀錄異動紀錄
                    if (_this.Pager.Source) {
                        var r = _this.clonedata(record);
                        r.$State = common_1.SwRecordState.Delete;
                        r.$PageIndex = _this.Pager.Index;
                        _this.RecordsLog.push(r);
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
        SwMaster2Ctrl.prototype.onRecordDeleteDo = function (record, config) {
            return this.$q.resolve({
                data: {
                    Result: "NG",
                    Message: "no implement onRecordDeleteDo()"
                }
            });
        };
        /**
         * 取得紀錄標題
         * @param record
         */
        SwMaster2Ctrl.prototype.onGetRecordTitle = function (record) {
            if (record["Name"])
                return record["Name"];
            return "NotImplement onGetRecordTitle() ";
        };
        SwMaster2Ctrl.prototype.findRecord = function (records, id) {
            for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
                var v = records_1[_i];
                if (v.Id == id)
                    return v;
            }
            return null;
        };
        SwMaster2Ctrl.prototype.findRecordIdx = function (records, id) {
            for (var i = 0; i < records.length; i++) {
                if (records[i].Id == id)
                    return i;
            }
            return -1;
        };
        /**
       * 重新檢視View
       * @param record
       */
        SwMaster2Ctrl.prototype.recordRefresh = function (record, config) {
            var _this = this;
            var defer = this.$q.defer();
            var qrecord = this.findRecord(this.Records, record.Id);
            var tab = this.findTab('Item#' + record.Id);
            this.exeHttpAction(this.onRecordView(qrecord, config), config)
                .then(function (x) {
                _this.onRecordLoaded(x, config);
                _this.Result = x;
                if (x.Result == "OK") {
                    x.Record.$State = common_1.SwRecordState.None;
                    _this.onRecordStateChange(x.Record, common_1.SwRecordState.View);
                    if (x.Record.$State == common_1.SwRecordState.Update) {
                        x.Record.$ViewBak = _this.clonedata(x.Record);
                    }
                    tab.Content = x.Record;
                    tab.focus();
                    defer.resolve(x.Record);
                    //更新Grid紀錄
                    _this.queryOne(qrecord, common_1.SwRecordState.Update);
                }
                else {
                    tab.close();
                    defer.reject(qrecord);
                }
            });
            return defer.promise;
        };
        return SwMaster2Ctrl;
    }(common_1.SwBaseCtrl));
    exports.SwMaster2Ctrl = SwMaster2Ctrl;
});
//# sourceMappingURL=master2.js.map