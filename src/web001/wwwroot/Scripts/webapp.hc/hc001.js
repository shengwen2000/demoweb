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
     * 就醫紀錄查詢
     */
    var HC001Ctrl = /** @class */ (function (_super) {
        __extends(HC001Ctrl, _super);
        function HC001Ctrl($http, Config, $q, $scope, $filter) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$scope = $scope;
            _this.$filter = $filter;
            /** The Init Data*/
            _this.FormInit = {
                Gateways: [{ Id: 1, Name: "ASUS" }],
            };
            _this.PageSizeNow = 20;
            _this.PageSizes = [20, 50, 100];
            _this.formInit();
            _this.QryArgs.Date1 = { Value: _this.getToday(-180), Checked: true };
            _this.QryArgs.Date2 = { Value: _this.getToday(), Checked: true };
            //this.createTab("List", tab => {
            //    tab.Title = "列表";
            //    tab.IsCloseEnable = false;
            //});
            //初始排序條件
            _this.pageOrderBy('日期', true);
            return _this;
            //this.pageQuery(50);
        }
        /**
         * 取得初始資料
         */
        HC001Ctrl.prototype.formInit = function () {
            var _this = this;
            var a = this.exeHttpAction(this.$http.post(this.Config.AppPath + "/formInit", null));
            a.then(function (x) {
                if (x.Result == "OK") {
                    _this.FormInit = x.Record;
                }
            });
            return a;
        };
        HC001Ctrl.prototype.autoCheckKinds = function () {
            var val = this.QryArgs.Kinds.Value;
            if (val) {
                for (var n in val) {
                    if (val[n]) {
                        this.QryArgs.Kinds.Checked = true;
                        return;
                    }
                }
                this.QryArgs.Kinds.Checked = false;
            }
        };
        HC001Ctrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/data_pageorderby", null, { params: qp });
        };
        HC001Ctrl.prototype.getTextClass = function (record) {
            switch (record.TheType) {
                case "門診":
                    return "text-primary";
                case "急診":
                    return "text-danger";
                case "預約":
                    return "";
                case "住院":
                    return "text-warning";
                case "出院":
                    return "text-warning";
            }
            return "";
        };
        HC001Ctrl.prototype.onPageQuery = function (pager) {
            for (var v in this.QryArgs) {
                var v1 = this.QryArgs[v];
                if (v1.Checked) {
                    pager[v] = v1.Value;
                }
            }
            //convert kinds
            {
                var kk = [];
                pager["Kinds"] = kk;
                if (this.QryArgs.Kinds) {
                    var val = this.QryArgs.Kinds.Value;
                    for (var n in val) {
                        if (val[n])
                            kk.push(n);
                    }
                }
            }
            return this.$http.post(this.Config.AppPath + "/data_pagequery", null, { params: pager });
        };
        HC001Ctrl.prototype.onRecordView = function (record, config) {
            return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { Id: record.Id } });
        };
        HC001Ctrl.prototype.onRecordLoaded = function (result, config) {
            if (result.Result == "OK") {
                //find view record
                var vrecord = this.findRecord(this.Records, result.Record.Id);
                result.Record["VRecord"] = vrecord;
            }
        };
        HC001Ctrl.prototype.exportResult = function () {
            this.exeHttpAction(this.$http.post(this.Config.AppPath + '/Data_Export', null, { params: { pg_name: this.Pager.Source.Name } }))
                .then(function (x) {
                if (x.Result == "OK") {
                    var d = new common_1.SwDownloadFile();
                    d.getFile('/File/download', x.Record, "GET");
                }
            });
        };
        HC001Ctrl.prototype.onGetRecordTitle = function (record) {
            if (record) {
                var vrecord = record["VRecord"];
                return vrecord.MemberName + "@" + this.$filter('date')(vrecord.TheDate, 'yyyy/MM/dd') + "(" + vrecord.TheType + ")";
            }
        };
        return HC001Ctrl;
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
            .controller('MainCtrl', HC001Ctrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=hc001.js.map