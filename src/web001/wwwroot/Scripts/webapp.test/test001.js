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
define(["require", "exports", "../webapp/common"], function (require, exports, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * For test
     */
    var Test001Ctrl = /** @class */ (function (_super) {
        __extends(Test001Ctrl, _super);
        function Test001Ctrl($http, Config, $q, $scope, $timeout) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$scope = $scope;
            _this.$timeout = $timeout;
            _this.VerId = -1;
            _this.Records = [];
            _this.queryNotifys();
            return _this;
        }
        Test001Ctrl.prototype.queryNotifys = function () {
            var _this = this;
            this.$http.post(this.Config.AppPath + "/QueryNotifys", null, { params: { verid: this.VerId } })
                .then(function (resp) {
                return resp.data;
            }, function (err) {
                return { Result: "NG", Message: 'Error ' + err.statusText };
            })
                .then(function (x) {
                if (x.Result == "OK") {
                    _this.VerId = x.VerId;
                    _this.Records = x.Records;
                }
                _this.$timeout(100).then(function () {
                    _this.queryNotifys();
                });
            });
        };
        Test001Ctrl.prototype.addNotify = function () {
            this.exeHttpAction(this.$http.post(this.Config.AppPath + "/AddNotify", null));
        };
        Test001Ctrl.prototype.cancelNotify = function (record) {
            this.exeHttpAction(this.$http.post(this.Config.AppPath + "/CancelNotify", null, { params: { id: record.Id } }));
        };
        return Test001Ctrl;
    }(common_1.SwBaseCtrl));
    /**
     * App Start
     */
    function startApp(sitepath, apppath) {
        angular.module("app", ['common']).constant('Config', {
            SitePath: sitepath,
            AppPath: apppath
        });
        angular.module("app")
            .config(function ($qProvider) {
            $qProvider.errorOnUnhandledRejections(false);
        })
            .controller('MainCtrl', Test001Ctrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=test001.js.map