var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
           * 主檔維護2I(頁簽式單一紀錄)
           */
    var SwMaster2ICtrl = /** @class */ (function (_super) {
        __extends(SwMaster2ICtrl, _super);
        function SwMaster2ICtrl($q, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$q = $q;
            _this.$scope = $scope;
            return _this;
        }
        /**
         * 狀態變更時
         * @param record
         * @param target
         */
        SwMaster2ICtrl.prototype.onRecordStateChange = function (record, state) {
            record.$State = state;
        };
        /**
         * 檢視紀錄
         * @param record
         */
        SwMaster2ICtrl.prototype.recordView = function (record, config) {
            var _this = this;
            var defer = this.$q.defer();
            this.exeHttpAction(this.onRecordView(record, config), config)
                .then(function (x) {
                var tab = _this.getFocusTab();
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
                    defer.reject();
                }
            });
            return defer.promise;
        };
        /**
        * 取得紀錄內容(後代需實作)
        * @param config
        */
        SwMaster2ICtrl.prototype.onRecordView = function (record, config) {
            return this.$q.resolve({
                data: {
                    Result: "NG",
                    Message: "Not Implement onRecordView()"
                }
            });
        };
        /**
          * 資料項目單筆編輯或檢視項目由Server端載入時
          * @param result
          * @param config
          */
        SwMaster2ICtrl.prototype.onRecordLoaded = function (result, config) {
        };
        /**
         * 要求編輯紀錄
         * @param record
         * @param config
         */
        SwMaster2ICtrl.prototype.recordEdit = function (record, config) {
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
        SwMaster2ICtrl.prototype.onRecordEdit = function (record, config) {
        };
        /**
         * 新增紀錄
         */
        SwMaster2ICtrl.prototype.recordNew = function (config) {
            var _this = this;
            var defer = this.$q.defer();
            var tab = this.getFocusTab();
            tab.Title = "新增";
            this.exeHttpAction(this.onRecordNew(config), config)
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
            return defer.promise;
        };
        /**
        * 當資料新增時(後代給予初始值)
        * @param config
        */
        SwMaster2ICtrl.prototype.onRecordNew = function (config) {
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
        SwMaster2ICtrl.prototype.recordClose = function (record) {
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
        SwMaster2ICtrl.prototype.recordSave = function (record, config) {
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
                }
            });
            return defer.promise;
        };
        /**
        * 當資料儲存時(後代實作)
        * @param config
        */
        SwMaster2ICtrl.prototype.onRecordSave = function (record, config) {
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
        SwMaster2ICtrl.prototype.recordDelete = function (record, config) {
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
        SwMaster2ICtrl.prototype.recordDeleteDo = function (record, config) {
            var _this = this;
            var defer = this.$q.defer();
            this.exeHttpAction(this.onRecordDeleteDo(this.clonedata(record), config), config)
                .then(function (x) {
                _this.Result = x;
                if (x.Result == 'OK') {
                    _this.getFocusTab().close();
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
        SwMaster2ICtrl.prototype.onRecordDeleteDo = function (record, config) {
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
        SwMaster2ICtrl.prototype.onGetRecordTitle = function (record) {
            if (record["Name"])
                return record["Name"];
            return "NotImplement onGetRecordTitle() ";
        };
        SwMaster2ICtrl.prototype.findRecord = function (records, id) {
            for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
                var v = records_1[_i];
                if (v.Id == id)
                    return v;
            }
            return null;
        };
        SwMaster2ICtrl.prototype.findRecordIdx = function (records, id) {
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
        SwMaster2ICtrl.prototype.recordRefresh = function (record, config) {
            var _this = this;
            var defer = this.$q.defer();
            var tab = this.getFocusTab();
            this.exeHttpAction(this.onRecordView(record, config), config)
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
                }
                else {
                    tab.close();
                }
            });
            return defer.promise;
        };
        return SwMaster2ICtrl;
    }(common_1.SwBaseCtrl));
    exports.SwMaster2ICtrl = SwMaster2ICtrl;
});
//# sourceMappingURL=master2i.js.map