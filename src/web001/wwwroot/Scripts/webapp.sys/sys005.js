var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../webapp/common", "../webapp/master1", "./sys010"], function (require, exports, common_1, master1_1, sys010_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 排程任務
     */
    var Sys005Ctrl = /** @class */ (function (_super) {
        __extends(Sys005Ctrl, _super);
        function Sys005Ctrl($http, Config, $q, $scope, $timeout) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$scope = $scope;
            _this.$timeout = $timeout;
            /** The Init Data*/
            _this.FormInit = {};
            _this.formInit();
            //let a = new Date();
            //初始排序設定
            _this.pageOrderBy('名稱', false);
            _this.pageQuery(10000);
            return _this;
            //this.createTab("help", tab => {
            //    tab.Title = "設定";
            //    tab.IsCloseEnable = false;
            //});
        }
        Sys005Ctrl.prototype.isFuture = function (date) {
            return new Date(date) > new Date();
        };
        Sys005Ctrl.prototype.onPageQuery = function (pager) {
            for (var v in this.QryArgs) {
                var v1 = this.QryArgs[v];
                if (v1.Checked) {
                    pager[v] = v1.Value;
                }
            }
            return this.$http.post(this.Config.AppPath + "/data_pagequery", null, { params: pager });
        };
        Sys005Ctrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/data_pageorderby", null, { params: qp });
        };
        /**
        * 取得初始資料
        */
        Sys005Ctrl.prototype.formInit = function () {
            var _this = this;
            var a = this.exeHttpAction(this.$http.post(this.Config.AppPath + "/formInit", null));
            a.then(function (x) {
                if (x.Result == "OK") {
                    _this.FormInit = x.Record;
                }
            });
            return a;
        };
        //onLazyQuery(pager: webapp.ISwPageParameter): ng.IHttpPromise<any> {
        //    return this.$http.post(this.Config.AppPath + "/data_querymore", null, { params: pager });
        //}
        //onLazyQueryMore(pager: webapp.ISwPageParameter): ng.IHttpPromise<any> {
        //    return this.$http.post(this.Config.AppPath + "/data_querymore", null, { params: pager });
        //}                
        //onQuery(): ng.IHttpPromise<any> {
        //    return this.$http.post(this.Config.AppPath + "/data_query", null);
        //} 
        Sys005Ctrl.prototype.onQueryOne = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_query", null, { params: { Id: record.Id } });
        };
        Sys005Ctrl.prototype.onRecordView = function (record, config) {
            return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { id: record.Id } });
        };
        /**
         * 當資料載入時
         * @param result
         */
        Sys005Ctrl.prototype.onRecordViewResult = function (result, config) {
        };
        //onRecordSave(record: ISwRecord): ng.IHttpPromise<any> {
        //    return this.$http.post(this.Config.AppPath + "/data_save", record);
        //}
        /**
           立即執行排程
        */
        Sys005Ctrl.prototype.invokeTaskNow = function (record) {
            var _this = this;
            this.showConfirm("\u8981\u7ACB\u5373\u555F\u52D5" + this.onGetRecordTitle(record) + "?", "送出確認", "確定", "取消")
                .then(function (x) {
                _this.exeHttpAction(_this.$http.post(_this.Config.AppPath + "/Task_InvokeNow", null, { params: { id: record.Id } }))
                    .then(function (x) {
                    if (x.Result == "OK") {
                        _this.$timeout(500)
                            .then(function (x) {
                            _this.showMessage("已送出");
                        });
                    }
                });
            });
        };
        /**
         * 任務啟用/停用
         * @param record
         * @param enable
         */
        Sys005Ctrl.prototype.taskSetEnable = function (record, enable) {
            var _this = this;
            this.exeHttpAction(this.$http.post(this.Config.AppPath + "/Task_Enable", null, { params: { id: record.Id, enable: enable } }))
                .then(function (x) {
                if (x.Result == "OK") {
                    _this.recordRefresh(record);
                    _this.$timeout(500)
                        .then(function (x) {
                        if (enable)
                            _this.showMessage(_this.onGetRecordTitle(record) + "-\u8A2D\u5B9A\u555F\u7528");
                        else
                            _this.showMessage(_this.onGetRecordTitle(record) + "-\u8A2D\u5B9A\u505C\u7528");
                    });
                }
            });
        };
        Sys005Ctrl.prototype.onGetRecordTitle = function (record) {
            if (record.Id == 0)
                return "新增";
            if (record.Title)
                return record.Title;
            return "" + record.Name;
        };
        return Sys005Ctrl;
    }(master1_1.SwMaster1Ctrl));
    /**
     * App Start
     */
    function startApp(sitepath, apppath) {
        angular.module("app", [common_1.CommonModule, sys010_1.Sys010Module]).constant('Config', {
            SitePath: sitepath,
            AppPath: apppath
        });
        angular.module("app")
            .config(function ($qProvider) {
            $qProvider.errorOnUnhandledRejections(false);
        })
            .controller('MainCtrl', Sys005Ctrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=sys005.js.map