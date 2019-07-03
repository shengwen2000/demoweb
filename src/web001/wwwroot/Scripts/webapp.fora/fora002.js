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
     * 泰博訊號模擬器
     */
    var FORA002Ctrl = /** @class */ (function (_super) {
        __extends(FORA002Ctrl, _super);
        function FORA002Ctrl($http, Config, $q, $filter, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$filter = $filter;
            _this.$scope = $scope;
            _this.Req = {
                IMSI: '9014110460006891',
                Content: null
            };
            _this.Results = [];
            return _this;
        }
        /**
         * load vs sample file
         * @param filename
         */
        FORA002Ctrl.prototype.loadSample = function (filename) {
            var _this = this;
            this.exeHttpAction(this.$http.post(this.Config.AppPath + "/loadSample", { File: filename, IMSI: this.Req.IMSI }))
                .then(function (x) {
                if (x.Result == "OK") {
                    _this.Req.Content = x.Record;
                }
            });
        };
        FORA002Ctrl.prototype.postReq = function (req) {
            var _this = this;
            this.exeAction(this.$http({
                method: 'POST',
                url: '/api/Gateway/GetGatewayData',
                headers: { 'Content-Type': 'text/plain' },
                data: this.Req.Content
            })
                .then(function (resp) {
                _this.Results.push(resp.data);
            }, function (resp) {
                var msg = "Connect Failure at " + _this.$filter("date")(new Date(), "HH:mm:ss");
                _this.Results.push("Connect Failure at " + msg);
            }));
        };
        FORA002Ctrl.prototype.postGetTime = function () {
            var _this = this;
            this.exeAction(this.$http({
                method: 'POST',
                url: '/api/Gateway/GatewayAPI',
                headers: { 'Content-Type': 'text/plain' },
                data: 'FunctionName=GetDateTime\r\nGatewayType=09014A\r\nGatewayID=9014110460000363\r\nDeviceType=3250\r\nDeviceID=325061031000116D\r\n'
            })
                .then(function (resp) {
                _this.Results.push(resp.data);
            }, function (resp) {
                var msg = "Connect Failure at " + _this.$filter("date")(new Date(), "HH:mm:ss");
                _this.Results.push("Connect Failure at " + msg);
            }));
        };
        return FORA002Ctrl;
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
            .controller('MainCtrl', FORA002Ctrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=fora002.js.map