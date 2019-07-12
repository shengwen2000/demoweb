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
define(["require", "exports", "../webapp/master2", "../webapp/common", "../webapp.sys/sys010"], function (require, exports, master2_1, common_1, sys010_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * copd評量表清冊
     */
    var COPD002Ctrl = /** @class */ (function (_super) {
        __extends(COPD002Ctrl, _super);
        function COPD002Ctrl($http, Config, $q, $filter, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$filter = $filter;
            _this.$scope = $scope;
            /** The Init Data*/
            _this.FormInit = {
                Gateways: [{ Id: 1, Name: "ASUS" }],
            };
            _this.formInit();
            _this.QryArgs.Date1 = { Value: _this.getToday(-7), Checked: true };
            //初始排序條件
            _this.pageOrderBy('日期', true);
            _this.pageQuery(50);
            return _this;
        }
        /**
         * 取得初始資料
         */
        COPD002Ctrl.prototype.formInit = function () {
            var _this = this;
            var a = this.exeHttpAction(this.$http.post(this.Config.AppPath + "/formInit", null));
            a.then(function (x) {
                if (x.Result == "OK") {
                    _this.FormInit = x.Record;
                }
            });
            return a;
        };
        COPD002Ctrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/data_pageorderby", null, { params: qp });
        };
        COPD002Ctrl.prototype.onPageQuery = function (pager) {
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
        //onQueryOne(record: IRecord): ng.IHttpPromise<any> {
        //    return this.$http.post(this.Config.AppPath + "/data_query", null, { params: { Id: record.Id } });
        //}
        //onRecordNew(): ng.IHttpPromise<any> {
        //    return this.$http.post(this.Config.AppPath + "/data_new", null);
        //} 
        COPD002Ctrl.prototype.onRecordView = function (record, config) {
            return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { Id: record.Id } });
        };
        COPD002Ctrl.prototype.onRecordLoaded = function (result, config) {
            if (result.Result == "OK") {
                var record = result.Record;
                record.TheDate = new Date(record.TheDate);
                record.Content = angular.fromJson(record.Content);
            }
        };
        COPD002Ctrl.prototype.onRecordSave = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_save", record);
        };
        COPD002Ctrl.prototype.onGetRecordTitle = function (record) {
            return record.MemberName + "@" + this.$filter('date')(record.TheDate, 'yyyy/MM/dd');
        };
        COPD002Ctrl.prototype.onRecordDeleteDo = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_delete", null, { params: { Id: record.Id } });
        };
        COPD002Ctrl.prototype.export = function () {
            this.exeHttpAction(this.$http.post(this.Config.AppPath + '/Export', null, { params: { pg_name: this.Pager.Source.Name } }))
                .then(function (x) {
                if (x.Result == "OK") {
                    var d = new common_1.SwDownloadFile();
                    d.getFile('/File/download', x.Record, "GET");
                }
            });
        };
        return COPD002Ctrl;
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
            .controller('MainCtrl', COPD002Ctrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=copd002.js.map