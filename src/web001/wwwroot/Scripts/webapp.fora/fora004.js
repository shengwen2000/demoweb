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
define(["require", "exports", "../webapp/common", "../webapp/master2", "../webapp.sys/sys010"], function (require, exports, common_1, master2_1, sys010_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 泰博帳號對映表
     */
    var FORA004Ctrl = /** @class */ (function (_super) {
        __extends(FORA004Ctrl, _super);
        function FORA004Ctrl($http, Config, $q, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$scope = $scope;
            /** The Init Data*/
            _this.FormInit = {
                Gateways: [{ Id: 1, Name: "ASUS" }],
            };
            _this.formInit();
            _this.QryArgs.Enable = { Value: '1', Checked: true };
            //初始排序條件
            _this.pageOrderBy('建立日', true);
            _this.pageQuery(50);
            return _this;
        }
        /**
         * 取得初始資料
         */
        FORA004Ctrl.prototype.formInit = function () {
            var _this = this;
            var a = this.exeHttpAction(this.$http.post(this.Config.AppPath + "/formInit", null));
            a.then(function (x) {
                if (x.Result == "OK") {
                    _this.FormInit = x.Record;
                }
            });
            return a;
        };
        FORA004Ctrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/data_pageorderby", null, { params: qp });
        };
        FORA004Ctrl.prototype.onPageQuery = function (pager) {
            for (var v in this.QryArgs) {
                var v1 = this.QryArgs[v];
                if (v1.Checked) {
                    pager[v] = v1.Value;
                }
            }
            return this.$http.post(this.Config.AppPath + "/data_pagequery", null, { params: pager });
        };
        //onQuery(): ng.IHttpPromise<{}> {
        //    return this.$http.post(this.Config.AppPath + "/data_query", null);
        //} 
        FORA004Ctrl.prototype.onQueryOne = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_query", null, { params: { Id: record.Id } });
        };
        FORA004Ctrl.prototype.onRecordNew = function () {
            return this.$http.post(this.Config.AppPath + "/data_new", null);
        };
        FORA004Ctrl.prototype.onRecordView = function (record, config) {
            return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { Id: record.Id } });
        };
        FORA004Ctrl.prototype.onRecordLoaded = function (result, config) {
            if (result.Result == "OK") {
            }
        };
        FORA004Ctrl.prototype.onRecordSave = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_save", record);
        };
        FORA004Ctrl.prototype.onGetRecordTitle = function (record) {
            if (record.Id == 0)
                return "新帳號對應";
            return record.TargetNo + "@" + record.SourceNo;
        };
        FORA004Ctrl.prototype.onRecordDeleteDo = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_delete", null, { params: { Id: record.Id } });
        };
        return FORA004Ctrl;
    }(master2_1.SwMaster2Ctrl));
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
            .controller('MainCtrl', FORA004Ctrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=fora004.js.map