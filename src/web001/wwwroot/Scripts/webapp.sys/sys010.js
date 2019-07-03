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
define(["require", "exports", "../webapp/common"], function (require, exports, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** 任務通知模組 */
    exports.Sys010Module = "sys010";
    /**
     * notify service
     */
    var Sys010Ctrl = /** @class */ (function (_super) {
        __extends(Sys010Ctrl, _super);
        function Sys010Ctrl($http, Config, $q, $scope, $timeout) {
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
        Sys010Ctrl.prototype.getAnotherCtrl = function () {
            var div = document.getElementById("Sys010TCtrl");
            var ctl = angular.element(div).scope().ctl;
            return ctl;
        };
        Sys010Ctrl.prototype.queryNotifys = function () {
            var _this = this;
            this.$http.post("/Sys010/QueryNotifies", null, { params: { verid: this.VerId } })
                .then(function (resp) {
                return resp.data;
            }, function (err) {
                return { Result: "NETERR", Message: 'Error ' + err.statusText };
            })
                .then(function (x) {
                if (x.Result == "OK") {
                    _this.VerId = x.VerId;
                    _this.Records = x.Records;
                }
                if (x.Result == "NETERR") {
                    _this.$timeout(10000).then(function () {
                        _this.queryNotifys();
                    });
                }
                else if (x.Result == "OK") {
                    _this.$timeout(100).then(function () {
                        _this.queryNotifys();
                    });
                }
                else {
                    _this.$timeout(3000).then(function () {
                        _this.queryNotifys();
                    });
                }
            });
        };
        Sys010Ctrl.prototype.ClickRecord = function (record) {
            var _this = this;
            //cancel record
            if (record.State == "Append" || record.State == "Run") {
                this.getAnotherCtrl().showConfirm("\u53D6\u6D88-" + record.Title + "?", "任務取消").then(function () {
                    _this.exeHttpAction(_this.$http.post("/Sys010/CancelNotify", null, { params: { id: record.Id } }));
                });
            }
            if (record.State == "Finish") {
                if (record.Result.Result == 'OK') {
                    //url
                    if (record.Result.Kind == 1) {
                        //remove
                        this.$http.post("/Sys010/CancelNotify", null, { params: { id: record.Id } });
                        //download file
                        var ctl = new common_1.SwDownloadFile();
                        ctl.getFile2(record.Result.Content);
                    }
                }
                else {
                    //remove
                    this.$http.post("/Sys010/CancelNotify", null, { params: { id: record.Id } });
                    this.getAnotherCtrl().showMessage(record.Result.Message, "錯誤訊息");
                }
            }
        };
        return Sys010Ctrl;
    }(common_1.SwBaseCtrl));
    exports.Sys010Ctrl = Sys010Ctrl;
    /** 負責顯示對話盒，因為Sys010的位置會被封鎖 */
    var Sys010TCtrl = /** @class */ (function (_super) {
        __extends(Sys010TCtrl, _super);
        function Sys010TCtrl($http, Config, $q, $scope, $timeout) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$scope = $scope;
            _this.$timeout = $timeout;
            return _this;
        }
        return Sys010TCtrl;
    }(common_1.SwBaseCtrl));
    exports.Sys010TCtrl = Sys010TCtrl;
    angular.module(exports.Sys010Module, [common_1.CommonModule])
        .controller('Sys010Ctrl', Sys010Ctrl)
        .controller('Sys010TCtrl', Sys010TCtrl);
});
//# sourceMappingURL=sys010.js.map