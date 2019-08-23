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
define(["require", "exports", "../webapp/common", "../webapp.sys/sys010"], function (require, exports, common_1, sys010_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
        * 會員主檔
        */
    var Copd001Ctrl = /** @class */ (function (_super) {
        __extends(Copd001Ctrl, _super);
        function Copd001Ctrl($http, $scope, $q, Config) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.$scope = $scope;
            _this.$q = $q;
            _this.Config = Config;
            /**是否檢視*/
            _this.ScaleIsView = true;
            /**評量表*/
            _this.Scale = {
                CAT: {
                    Q1: 1,
                    Q2: 1,
                    Q3: 1,
                    Q4: 1,
                    Q5: 1,
                    Q6: 1,
                    Q7: 1,
                    Q8: 1,
                },
                mMRC: { Q1: 1 },
                COPD: {
                    Q1: 1,
                    Q2: 1,
                    Q3: 1,
                    Q4: 1
                }
            };
            /**會員*/
            _this.Member = {
                LoginNo: '12343343',
                Name: 'David',
                Sex: '男'
            };
            /**導覽*/
            _this.Navigator = {
                //可否新增
                Newable: false,
                //前一個
                PrvId: null,
                //下一個
                NextId: null
            };
            _this.Member = null;
            _this.Scale = null;
            _this.ScaleIsView = true;
            return _this;
        }
        /**
         * 登入帳號
         * @param login_no
         */
        Copd001Ctrl.prototype.login = function (login_no) {
            var _this = this;
            this.exeHttpAction(this.$http.post(this.Config.AppPath + '/MemberLogin', null, { params: { login_no: login_no } }))
                .then(function (x) {
                if (x.Result == "OK") {
                    _this.Member = x.Record;
                    _this.navigatorRefresh();
                }
            });
        };
        Copd001Ctrl.prototype.logout = function () {
            this.Member = null;
            this.Scale = null;
            this.Navigator = {};
        };
        Copd001Ctrl.prototype.navigatorRefresh = function (scaleId) {
            var _this = this;
            this.exeHttpAction(this.$http.post(this.Config.AppPath + '/NaviagorRefresh', null, { params: { login_no: this.Member.LoginNo, scaleId: scaleId } }))
                .then(function (x) {
                if (x.Result == "OK") {
                    var nav = x.Record;
                    _this.Navigator = {};
                    _this.Navigator.Newable = nav.Newable;
                    _this.Navigator.NextId = nav.NextId;
                    _this.Navigator.PrvId = nav.PrvId;
                    _this.Scale = angular.fromJson(nav.CurContent);
                    _this.ScaleIsView = true;
                }
            });
        };
        /**
         * 新增評量
         */
        Copd001Ctrl.prototype.scaleNew = function () {
            this.Scale = {};
            this.ScaleIsView = false;
        };
        /**
         * 看前一個評量
         */
        Copd001Ctrl.prototype.scalePrevious = function () {
            this.navigatorRefresh(this.Navigator.PrvId);
        };
        /**
        * 看下一個評量
        */
        Copd001Ctrl.prototype.scaleNext = function () {
            this.navigatorRefresh(this.Navigator.NextId);
        };
        Copd001Ctrl.prototype.scaleCancel = function () {
            this.navigatorRefresh();
        };
        Copd001Ctrl.prototype.scaleSave = function () {
            var _this = this;
            if (this.Scale.CAT == null || this.Scale.CAT.Q1 == null || this.Scale.CAT.Q2 == null || this.Scale.CAT.Q3 == null || this.Scale.CAT.Q4 == null || this.Scale.CAT.Q5 == null || this.Scale.CAT.Q6 == null || this.Scale.CAT.Q7 == null || this.Scale.CAT.Q8 == null) {
                this.showMessage("請先填寫-慢性阻塞性肺病評估測試");
                return;
            }
            if (this.Scale.mMRC == null || this.Scale.mMRC.Q1 == null) {
                this.showMessage("請先填寫-呼吸困難程度計分(mMRC)");
                return;
            }
            if (this.Scale.COPD == null || this.Scale.COPD.Q1 == null || this.Scale.COPD.Q2 == null || this.Scale.COPD.Q3 == null || this.Scale.COPD.Q4 == null) {
                this.showMessage("請先填寫-COPD惡化評估指標");
                return;
            }
            this.exeHttpAction(this.$http.post(this.Config.AppPath + '/ScaleSave', this.Scale, { params: { login_no: this.Member.LoginNo } }))
                .then(function (x) {
                if (x.Result == "OK") {
                    _this.navigatorRefresh();
                }
            });
        };
        return Copd001Ctrl;
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
            .controller('MainCtrl', Copd001Ctrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=copd001.js.map