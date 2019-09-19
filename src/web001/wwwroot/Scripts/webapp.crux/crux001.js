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
      * 會員主檔
      */
    var Crux001Ctrl = /** @class */ (function (_super) {
        __extends(Crux001Ctrl, _super);
        function Crux001Ctrl($http, $scope, $q, Config) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.$scope = $scope;
            _this.$q = $q;
            _this.Config = Config;
            //初始排序學號反向排序
            _this.pageOrderBy('加入日', true);
            _this.pageQuery(50);
            return _this;
            //this.createTab("help", tab => {
            //    tab.Title = "說明";
            //    tab.IsCloseEnable = false;
            //});
        }
        Crux001Ctrl.prototype.onPageQuery = function (pager) {
            for (var v in this.QryArgs) {
                var v1 = this.QryArgs[v];
                if (v1.Checked) {
                    pager[v] = v1.Value;
                }
            }
            return this.$http.post(this.Config.AppPath + "/data_pagequery", null, { params: pager });
        };
        Crux001Ctrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/data_pageorderby", null, { params: qp });
        };
        Crux001Ctrl.prototype.onQueryOne = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_queryone", null, { params: { id: record.Id } });
        };
        Crux001Ctrl.prototype.onRecordView = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { Id: record.Id } });
        };
        //onRecordNew(): ng.IHttpPromise<{}> {
        //    return this.$http.post(this.Config.AppPath + "/data_new", null);
        //}
        Crux001Ctrl.prototype.onRecordLoaded = function (result, config) {
            if (result.Result == "OK") {
                var record = result.Record;
                record.Addrs = angular.fromJson(record.Addrs);
                record.Phones = angular.fromJson(record.Phones);
                record.NotifyEmails = angular.fromJson(record.NotifyEmails);
                record.Birth = new Date(record.Birth);
            }
        };
        Crux001Ctrl.prototype.onRecordSave = function (record) {
            record.Addrs = angular.toJson(record.Addrs);
            record.Phones = angular.toJson(record.Phones);
            record.NotifyEmails = angular.toJson(record.NotifyEmails);
            return this.$http.post(this.Config.AppPath + "/data_save", record);
        };
        Crux001Ctrl.prototype.onGetRecordTitle = function (record) {
            if (record.Id == 0)
                return "新會員";
            return record.Name;
        };
        Crux001Ctrl.prototype.onRecordStateChange = function (record, state) {
            if (!record.$State && state == common_1.SwRecordState.View)
                record.$State = common_1.SwRecordState.Update;
            else if (record.$State == common_1.SwRecordState.Update && state == common_1.SwRecordState.View)
                record.$State = common_1.SwRecordState.None;
            else
                record.$State = state;
        };
        /**
         * 新增一個空項目與指定項目的下方
         * @param array
         * @param item
         */
        Crux001Ctrl.prototype.arrayInsert = function (array, item, def) {
            var idx = array.indexOf(item);
            var val = {};
            if (def)
                val = def;
            array.splice(idx + 1, 0, val);
        };
        /**
        * 移除陣列中指定的項目
        * @param array
        * @param item
        */
        Crux001Ctrl.prototype.arrayRemove = function (array, item) {
            var idx = array.indexOf(item);
            array.splice(idx, 1);
        };
        return Crux001Ctrl;
    }(master1_1.SwMaster1Ctrl));
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
            .controller('MainCtrl', Crux001Ctrl)
            //iso日期自動轉換
            //.directive("input", () => {
            //    return {
            //        require: 'ngModel',
            //        link: function (scope, elem, attr, modelCtrl: any) {
            //            if (attr['type'] === 'date') {
            //                modelCtrl.$formatters.push(function (modelValue) {
            //                    if (modelValue) {
            //                        return new Date(modelValue);
            //                    } else {
            //                        return null;
            //                    }
            //                });
            //            }
            //        }
            //    }
            //})
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=crux001.js.map