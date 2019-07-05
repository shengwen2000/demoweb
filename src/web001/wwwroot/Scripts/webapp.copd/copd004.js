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
define(["require", "exports", "../webapp/common", "../webapp/master2", "../webapp.sys/sys010"], function (require, exports, common_1, master2_1, sys010_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * copd video new income
     */
    var Copd004Ctrl = /** @class */ (function (_super) {
        __extends(Copd004Ctrl, _super);
        function Copd004Ctrl($http, Config, $q, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$scope = $scope;
            _this.query();
            return _this;
        }
        Copd004Ctrl.prototype.onQuery = function () {
            return this.$http.get(this.Config.AppPath + "/data_query");
        };
        /**
         * 選擇會員
         * @param record
         */
        Copd004Ctrl.prototype.memberChoice = function (record) {
            var _this = this;
            this.dialogOpen("FindMemberCtrl", "選擇會員")
                .then(function (result) {
                _this.memberChoiceSuccess(record, result);
            });
        };
        /**
        * 選擇會員OK
        * @param record
        */
        Copd004Ctrl.prototype.memberChoiceSuccess = function (record, result) {
            var _this = this;
            record.MemberId = result.Id;
            this.exeHttpAction(this.$http.post(this.Config.AppPath + "/data_save", record))
                .then(function (x) {
                if (x.Result == "OK") {
                    _this.getFocusTab().close();
                    var idx = _this.findRecordIdx(_this.Records, record.Id);
                    _this.Records.splice(idx, 1);
                }
            });
        };
        return Copd004Ctrl;
    }(master2_1.SwMaster2Ctrl));
    /**
        * 歷史項目
        */
    var HistoryCtrl = /** @class */ (function (_super) {
        __extends(HistoryCtrl, _super);
        function HistoryCtrl($http, Config, $q, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$scope = $scope;
            //初始排序條件
            _this.pageOrderBy('編號', true);
            _this.pageQuery(20);
            return _this;
        }
        HistoryCtrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/his_pageorderby", null, { params: qp });
        };
        HistoryCtrl.prototype.onPageQuery = function (pager) {
            for (var v in this.QryArgs) {
                var v1 = this.QryArgs[v];
                if (v1.Checked) {
                    pager[v] = v1.Value;
                }
            }
            return this.$http.post(this.Config.AppPath + "/his_pagequery", null, { params: pager });
        };
        HistoryCtrl.prototype.onQueryOne = function (record) {
            return this.$http.post(this.Config.AppPath + "/his_query", null, { params: { Id: record.Id } });
        };
        HistoryCtrl.prototype.onRecordView = function (record) {
            return this.$http.post(this.Config.AppPath + "/his_get", null, { params: { Id: record.Id } });
        };
        //onRecordSave(record: IRecord): ng.IHttpPromise<any> {
        //    return this.$http.post(this.Config.AppPath + "/his_save", record);
        //}
        HistoryCtrl.prototype.onGetRecordTitle = function (record) {
            return record.Id;
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
        HistoryCtrl.prototype.onRecordDeleteDo = function (record) {
            return this.$http.post(this.Config.AppPath + "/his_delete", null, { params: { Id: record.Id } });
        };
        return HistoryCtrl;
    }(master2_1.SwMaster2Ctrl));
    var FindMemberCtrl = /** @class */ (function (_super) {
        __extends(FindMemberCtrl, _super);
        function FindMemberCtrl($http, $scope, $q, Config) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.$scope = $scope;
            _this.$q = $q;
            _this.Config = Config;
            /**紀錄*/
            _this.Records = [];
            /**最多顯示紀錄數量*/
            _this.RecordsMaxLen = 20;
            _this.onDialogOpen();
            return _this;
        }
        FindMemberCtrl.prototype.query = function () {
            var _this = this;
            this.exeHttpAction(this.$http.post(this.Config.AppPath + '/member_query', null, { params: { name: this.Q_Name, maxcount: this.RecordsMaxLen } }))
                .then(function (x) {
                if (x.Result == "OK") {
                    _this.Records = x.Records;
                }
            });
        };
        FindMemberCtrl.prototype.selectRecord = function (record) {
            this.dialogCloseYes(record);
        };
        return FindMemberCtrl;
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
            .controller('MainCtrl', Copd004Ctrl)
            .controller('HistoryCtrl', HistoryCtrl)
            .controller('FindMemberCtrl', FindMemberCtrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=copd004.js.map