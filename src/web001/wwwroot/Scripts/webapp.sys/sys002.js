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
define(["require", "exports", "../webapp/common", "../webapp/master1", "./sys010"], function (require, exports, common_1, master1_1, sys010_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 登入帳號管理
     */
    var Sys002Ctrl = /** @class */ (function (_super) {
        __extends(Sys002Ctrl, _super);
        function Sys002Ctrl($http, Config, $q, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$scope = $scope;
            /** The Init Data*/
            _this.FormInit = {
                Depts: { Id: 1, Name: "Dept1" }
            };
            _this.formInit();
            //初始排序設定
            _this.pageOrderBy('Email', false);
            _this.pageQuery(30);
            return _this;
        }
        Sys002Ctrl.prototype.onPageQuery = function (pager) {
            for (var v in this.QryArgs) {
                var v1 = this.QryArgs[v];
                if (v1.Checked) {
                    pager[v] = v1.Value;
                }
            }
            return this.$http.post(this.Config.AppPath + "/data_pagequery", null, { params: pager });
        };
        Sys002Ctrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/data_pageorderby", null, { params: qp });
        };
        //onQuery(): ng.IHttpPromise<any> {
        //    return this.$http.post(this.Config.AppPath + "/data_query", null);
        //} 
        Sys002Ctrl.prototype.onQueryOne = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_query", null, { params: { id: record.Id } });
        };
        Sys002Ctrl.prototype.onRecordView = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { id: record.Id } });
        };
        Sys002Ctrl.prototype.onRecordSave = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_save", record);
        };
        Sys002Ctrl.prototype.onGetRecordTitle = function (record) {
            return record.EX_Name ? record.EX_Name : record.Email;
        };
        Sys002Ctrl.prototype.onRecordStateChange = function (record, state) {
            //檢視直接進編輯
            if (!record.$State && state == common_1.SwRecordState.View) {
                record.$State = common_1.SwRecordState.Update;
            }
            //編輯完成直接關閉
            else if (record.$State == common_1.SwRecordState.Update && state == common_1.SwRecordState.View) {
                record.$State = common_1.SwRecordState.None;
            }
            else
                record.$State = state;
        };
        Sys002Ctrl.prototype.onRecordDeleteDo = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_delete", null, { params: { id: record.Id } });
        };
        /**
         * 取得初始資料
         */
        Sys002Ctrl.prototype.formInit = function () {
            var _this = this;
            var a = this.exeHttpAction(this.$http.post(this.Config.AppPath + "/formInit", null));
            a.then(function (x) {
                if (x.Result == "OK") {
                    _this.FormInit = x.Record;
                }
            });
            return a;
        };
        return Sys002Ctrl;
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
            .controller('MainCtrl', Sys002Ctrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=sys002.js.map