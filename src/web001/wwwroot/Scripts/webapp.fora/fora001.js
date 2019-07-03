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
     * 泰博生理訊號
     */
    var FORA001Ctrl = /** @class */ (function (_super) {
        __extends(FORA001Ctrl, _super);
        function FORA001Ctrl($http, Config, $q, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$scope = $scope;
            _this.QryArgs.Date1 = { Value: _this.getToday(-1), Checked: true };
            _this.pageQuery(50);
            return _this;
        }
        FORA001Ctrl.prototype.onPageQuery = function (pager) {
            for (var v in this.QryArgs) {
                var v1 = this.QryArgs[v];
                if (v1.Checked) {
                    pager[v] = v1.Value;
                }
            }
            return this.$http.post(this.Config.AppPath + "/data_pagequery", null, { params: pager });
        };
        FORA001Ctrl.prototype.onRecordView = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { id: record.Id } });
        };
        FORA001Ctrl.prototype.onGetRecordTitle = function (record) {
            return "\u7D00\u9304-" + record.Id;
        };
        FORA001Ctrl.prototype.setStateClass = function (state) {
            if (state == 0)
                return 'warning';
            if (state == 1)
                return '';
            if (state == 2)
                return 'danger';
        };
        return FORA001Ctrl;
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
            .controller('MainCtrl', FORA001Ctrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=fora001.js.map