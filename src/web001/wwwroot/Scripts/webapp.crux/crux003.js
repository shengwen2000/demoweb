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
define(["require", "exports", "../webapp/common", "../webapp/master1", "../webapp.sys/sys010"], function (require, exports, common_1, master1_1, sys010_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
      * 訊息通知
      */
    var Crux003Ctrl = /** @class */ (function (_super) {
        __extends(Crux003Ctrl, _super);
        function Crux003Ctrl($http, $scope, $q, Config) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.$scope = $scope;
            _this.$q = $q;
            _this.Config = Config;
            _this.QryArgs.Date1 = { Value: _this.getToday(-30), Checked: true };
            //初始排序學號反向排序
            _this.pageOrderBy('發送時間', true);
            _this.pageQuery(50);
            return _this;
            //this.createTab("help", tab => {
            //    tab.Title = "說明";
            //    tab.IsCloseEnable = false;
            //});
        }
        Crux003Ctrl.prototype.onPageQuery = function (pager) {
            for (var v in this.QryArgs) {
                var v1 = this.QryArgs[v];
                if (v1.Checked) {
                    pager[v] = v1.Value;
                }
            }
            return this.$http.post(this.Config.AppPath + "/data_pagequery", null, { params: pager });
        };
        Crux003Ctrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/data_pageorderby", null, { params: qp });
        };
        //onQueryOne(record: IRecord): ng.IHttpPromise<{}> {
        //    return this.$http.post(this.Config.AppPath + "/data_query", null, { params: { Id: record.Id } });
        //}
        Crux003Ctrl.prototype.onRecordView = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { Id: record.Id } });
        };
        //onRecordNew(): ng.IHttpPromise<{}> {
        //    return this.$http.post(this.Config.AppPath + "/data_new", null);
        //}
        //onRecordSave(record: IRecord): ng.IHttpPromise<{}> {
        //    return this.$http.post(this.Config.AppPath + "/data_save", record);
        //}
        Crux003Ctrl.prototype.onGetRecordTitle = function (record) {
            //if (record.Id == 0)
            //    return "新設備";
            return "#" + record.Id;
        };
        return Crux003Ctrl;
    }(master1_1.SwMaster1Ctrl));
    /**
     * App Start
     */
    function startApp(sitepath, apppath) {
        angular.module("app", [common_1.CommonModule, sys010_1.Sys010Module, 'ngSanitize']).constant('Config', {
            SitePath: sitepath,
            AppPath: apppath
        });
        angular.module("app")
            .config(function ($qProvider) {
            $qProvider.errorOnUnhandledRejections(false);
        })
            .controller('MainCtrl', Crux003Ctrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=crux003.js.map