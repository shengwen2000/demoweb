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
     * 旺北帳號對映表
     */
    var NORTH002Ctrl = /** @class */ (function (_super) {
        __extends(NORTH002Ctrl, _super);
        function NORTH002Ctrl($http, Config, $q, $scope) {
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
        NORTH002Ctrl.prototype.formInit = function () {
            var _this = this;
            var a = this.exeHttpAction(this.$http.post(this.Config.AppPath + "/formInit", null));
            a.then(function (x) {
                if (x.Result == "OK") {
                    _this.FormInit = x.Record;
                }
            });
            return a;
        };
        NORTH002Ctrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/data_pageorderby", null, { params: qp });
        };
        NORTH002Ctrl.prototype.onPageQuery = function (pager) {
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
        NORTH002Ctrl.prototype.onQueryOne = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_query", null, { params: { Id: record.Id } });
        };
        NORTH002Ctrl.prototype.onRecordNew = function () {
            return this.$http.post(this.Config.AppPath + "/data_new", null);
        };
        NORTH002Ctrl.prototype.onRecordView = function (record, config) {
            return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { Id: record.Id } });
        };
        NORTH002Ctrl.prototype.onRecordLoaded = function (result, config) {
            if (result.Result == "OK") {
            }
        };
        NORTH002Ctrl.prototype.onRecordSave = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_save", record);
        };
        NORTH002Ctrl.prototype.onGetRecordTitle = function (record) {
            if (record.Id == 0)
                return "新帳號對應";
            return record.TargetNo + "@" + record.SourceNo;
        };
        NORTH002Ctrl.prototype.onRecordDeleteDo = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_delete", null, { params: { Id: record.Id } });
        };
        return NORTH002Ctrl;
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
            .controller('MainCtrl', NORTH002Ctrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=north002.js.map