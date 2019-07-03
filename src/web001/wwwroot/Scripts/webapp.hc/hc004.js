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
define(["require", "exports", "../webapp/common", "../webapp.sys/sys010"], function (require, exports, common_1, sys010_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 就醫紀錄匯出
     */
    var HC004Ctrl = /** @class */ (function (_super) {
        __extends(HC004Ctrl, _super);
        function HC004Ctrl($http, Config, $q, $scope, $filter) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$scope = $scope;
            _this.$filter = $filter;
            _this.Cols = [];
            /** The Init Data*/
            _this.FormInit = {
                Gateways: [{ Id: 1, Name: "ASUS" }],
            };
            _this.formInit();
            _this.QryArgs.Date1 = { Value: _this.getToday(-360), Checked: true };
            //this.QryArgs.Date2 = { Value: this.getToday(), Checked: true } as ISwQryArg;
            _this.exeHttpAction(_this.$http.post(_this.Config.AppPath + '/Data_Columns', null)).then(function (resp) {
                if (resp.Result == "OK") {
                    _this.Cols = resp.Records;
                    for (var _i = 0, _a = _this.Cols; _i < _a.length; _i++) {
                        var col = _a[_i];
                        col.Checked = true;
                    }
                }
            });
            return _this;
        }
        /**
         * 取得初始資料
         */
        HC004Ctrl.prototype.formInit = function () {
            var _this = this;
            var a = this.exeHttpAction(this.$http.post(this.Config.AppPath + "/formInit", null));
            a.then(function (x) {
                if (x.Result == "OK") {
                    _this.FormInit = x.Record;
                }
            });
            return a;
        };
        HC004Ctrl.prototype.autoCheckKinds = function () {
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
        HC004Ctrl.prototype.export = function () {
            var _this = this;
            var pager = {};
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
            //export cols
            {
                var cc = [];
                for (var _i = 0, _a = this.Cols; _i < _a.length; _i++) {
                    var c = _a[_i];
                    if (c.Checked)
                        cc.push(c.Id);
                }
                pager["cols"] = cc;
            }
            this.exeHttpAction(this.$http.post(this.Config.AppPath + '/Data_Export', null, { params: pager }))
                .then(function (x) {
                if (x.Result == "OK") {
                    _this.showMessage("任務已新增，並於背景執行中。");
                }
            });
        };
        return HC004Ctrl;
    }(common_1.SwBaseCtrl));
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
            .controller('MainCtrl', HC004Ctrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=hc004.js.map