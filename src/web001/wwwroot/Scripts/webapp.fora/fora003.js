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
     * 旺北系統日誌檔
     */
    var FORA003Ctrl = /** @class */ (function (_super) {
        __extends(FORA003Ctrl, _super);
        function FORA003Ctrl($http, Config, $q, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$scope = $scope;
            _this.query();
            return _this;
        }
        FORA003Ctrl.prototype.onQuery = function () {
            return this.$http.get(this.Config.AppPath + "/log_list");
        };
        FORA003Ctrl.prototype.onRecordView = function (record) {
            return this.$http.get(this.Config.AppPath + "/log_get/" + record.Name);
        };
        FORA003Ctrl.prototype.reload = function (record) {
            var tab = this.getFocusTab();
            this.exeHttpAction(this.onRecordView(record))
                .then(function (x) {
                if (x.Result == "OK") {
                    tab.Content = x.Record;
                }
            });
        };
        return FORA003Ctrl;
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
            .controller('MainCtrl', FORA003Ctrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=fora003.js.map