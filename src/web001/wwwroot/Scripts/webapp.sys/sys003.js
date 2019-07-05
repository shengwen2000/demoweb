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
define(["require", "exports", "../webapp/common", "../webapp/master2", "./sys010"], function (require, exports, common_1, master2_1, sys010_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sys003Ctrl = /** @class */ (function (_super) {
        __extends(Sys003Ctrl, _super);
        function Sys003Ctrl($http, Config, $q, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$scope = $scope;
            _this.query();
            return _this;
        }
        Sys003Ctrl.prototype.onQuery = function () {
            return this.$http.post(this.Config.AppPath + "/role_query", null);
        };
        Sys003Ctrl.prototype.onQueryOne = function (record) {
            return this.$http.post(this.Config.AppPath + "/role_query", null, { params: { Id: record.Id } });
        };
        Sys003Ctrl.prototype.onRecordNew = function () {
            return this.$http.post(this.Config.AppPath + "/data_new", null);
        };
        Sys003Ctrl.prototype.onRecordView = function (record) {
            return this.$http.post(this.Config.AppPath + "/role_get", null, { params: { Id: record.Id } });
        };
        Sys003Ctrl.prototype.onRecordSave = function (record) {
            return this.$http.post(this.Config.AppPath + "/role_save", record);
        };
        Sys003Ctrl.prototype.onGetRecordTitle = function (record) {
            return record.Title;
        };
        Sys003Ctrl.prototype.test = function (scope) {
            console.log("log");
        };
        /**
         * 初始功能表，設定焦點Tab為第一個有功能的項目
         * @param scope
         * @param menus
         */
        Sys003Ctrl.prototype.initMenu = function (scope, menus) {
            if (menus) {
                scope.FMenu = null;
                for (var _i = 0, menus_1 = menus; _i < menus_1.length; _i++) {
                    var m = menus_1[_i];
                    if (m.ChkCount) {
                        scope.FMenu = m;
                        break;
                    }
                }
                console.log("hi you");
            }
        };
        /**
         * 勾選異動時，重新統計每個項目的數量
         * @param menus
         */
        Sys003Ctrl.prototype.refreshChkCount = function (menus) {
            if (!menus)
                return;
            function calc(m) {
                var total = 0;
                if (m.Id && m.Checked)
                    total = 1;
                for (var _i = 0, _a = m.Nodes; _i < _a.length; _i++) {
                    var n1 = _a[_i];
                    total += calc(n1);
                }
                m.ChkCount = total;
                return total;
            }
            ;
            for (var _i = 0, menus_2 = menus; _i < menus_2.length; _i++) {
                var m = menus_2[_i];
                calc(m);
            }
        };
        //onRecordStateChange(record: ISwRecord, state: SwRecordState)
        //{
        //    //檢視直接進編輯
        //    if (!record.$State && state == SwRecordState.View) {
        //        record.$State = SwRecordState.Update;
        //    }
        //    //編輯完成直接關閉
        //    else if (record.$State == SwRecordState.Update && state == SwRecordState.View) {
        //        record.$State = SwRecordState.None;
        //    }
        //    else
        //        record.$State = state;
        //}
        Sys003Ctrl.prototype.onRecordDeleteDo = function (record) {
            return this.$http.post(this.Config.AppPath + "/role_delete", null, { params: { Id: record.Id } });
        };
        return Sys003Ctrl;
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
            .controller('MainCtrl', Sys003Ctrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=sys003.js.map