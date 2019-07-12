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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
      紀錄目前的編輯狀態
    */
    var SwRecordState;
    (function (SwRecordState) {
        SwRecordState[SwRecordState["None"] = 0] = "None";
        SwRecordState[SwRecordState["View"] = 1] = "View";
        SwRecordState[SwRecordState["Update"] = 2] = "Update";
        SwRecordState[SwRecordState["New"] = 3] = "New";
        SwRecordState[SwRecordState["Delete"] = 4] = "Delete";
    })(SwRecordState = exports.SwRecordState || (exports.SwRecordState = {}));
    /**
     對話內容
    */
    var SwMessageConfirm = /** @class */ (function () {
        function SwMessageConfirm() {
            this.Title = "動作確認";
            this.Yes = "確定";
            this.No = "取消";
        }
        return SwMessageConfirm;
    }());
    exports.SwMessageConfirm = SwMessageConfirm;
    /**
    * TabPage
    */
    var SwTab = /** @class */ (function () {
        function SwTab() {
            /** 焦點? */
            this.IsFocus = false;
            /** 顯示關閉按鈕(預設開) */
            this.IsCloseEnable = false;
            /** tab group 相同群組會顯示在一起 */
            this.GroupNo = 0;
        }
        /**
         * 取得焦點
         */
        SwTab.prototype.focus = function () {
            if (this.IsFocus)
                return;
            for (var _i = 0, _a = this.Controller.Tabs; _i < _a.length; _i++) {
                var x = _a[_i];
                if (x != this)
                    x.IsFocus = false;
            }
            this.IsFocus = true;
            this.Controller.onTabFocused(this);
            return this;
        };
        /**
         * 關閉頁簽
         */
        SwTab.prototype.close = function () {
            var idx = this.Controller.Tabs.indexOf(this);
            if (idx >= 0)
                this.Controller.Tabs.splice(idx, 1);
            //if has one selected return
            for (var _i = 0, _a = this.Controller.Tabs; _i < _a.length; _i++) {
                var x = _a[_i];
                if (x.IsFocus)
                    return;
            }
            //select First as Selected
            if (this.Controller.Tabs.length > 0)
                this.Controller.Tabs[0].IsFocus = true;
        };
        return SwTab;
    }());
    exports.SwTab = SwTab;
    /**
     * Base Of Controller
     */
    var SwBaseCtrl = /** @class */ (function () {
        /**(廢止)The Dialog Model of the Dialog received */
        //DialogModelReceive: ISwDialogModel = null;
        function SwBaseCtrl($q, $scope) {
            this.$q = $q;
            this.$scope = $scope;
            /** Result */
            this.Result = { Result: 'OK', Message: 'Success' };
            /** Tabs */
            this.Tabs = [];
            //查詢參數
            this.QryArgs = {
                /**名稱參數*/
                Name: { Value: '', Checked: false }
            };
            /**The Dialog Model Who want to show */
            //DialogModel: ISwDialogModel = null;
            this.DialogCaller = null;
        }
        /**
        * 建立頁簽(if id not exists)
        * @param id 唯一代號
        * @param initCallback 回呼內容
        */
        SwBaseCtrl.prototype.createGroupTab = function (id, groupno, initCallback) {
            for (var _i = 0, _a = this.Tabs; _i < _a.length; _i++) {
                var x = _a[_i];
                if (x.Id == id)
                    return x;
            }
            //find the the group's last index
            var idx = -1;
            for (var i = 0; i < this.Tabs.length; i++) {
                var x = this.Tabs[i];
                if (x.GroupNo <= groupno)
                    idx = i;
            }
            idx++;
            var tab = new SwTab();
            tab.Id = id;
            tab.Title = "NEW";
            tab.IsCloseEnable = true;
            tab.Controller = this;
            tab.GroupNo = groupno;
            if (initCallback)
                initCallback(tab);
            this.Tabs.splice(idx, 0, tab);
            //首個自動取得焦點
            if (this.Tabs.length == 1) {
                tab.focus();
            }
            return tab;
        };
        /**
        * 建立頁簽(if id not exists)
        * @param id 唯一代號
        * @param initCallback 回呼內容
        */
        SwBaseCtrl.prototype.createTab = function (id, initCallback) {
            return this.createGroupTab(id, 0, initCallback);
        };
        /**
         * Combin Two Url Paht
         * @param path1
         * @param path2
         */
        SwBaseCtrl.prototype.combineUrlPath = function (path1, path2) {
            if (path1.endsWith('/') && path2.startsWith("/")) {
                return path1 + "." + path2;
            }
            if (!path1.endsWith('/') && !path2.startsWith("/")) {
                return path1 + "/" + path2;
            }
            return "" + path1 + path2;
        };
        /**
         * 當Tab焦點變動時
         * @param tab
         */
        SwBaseCtrl.prototype.onTabFocused = function (tab) {
        };
        /**
         * 關閉頁簽
         * @param id
         */
        SwBaseCtrl.prototype.closeTab = function (id) {
            var tab = this.findTab(id);
            if (tab)
                tab.close();
        };
        /**
         * 尋找頁簽
         * @param id
         */
        SwBaseCtrl.prototype.findTab = function (id) {
            for (var _i = 0, _a = this.Tabs; _i < _a.length; _i++) {
                var x = _a[_i];
                if (x.Id == id)
                    return x;
            }
            return null;
        };
        /**
         * 尋找焦點頁簽
         */
        SwBaseCtrl.prototype.getFocusTab = function () {
            for (var _i = 0, _a = this.Tabs; _i < _a.length; _i++) {
                var x = _a[_i];
                if (x.IsFocus)
                    return x;
            }
            return null;
        };
        /**
         * 取得今天日期(不含時間)
         * @param diff_days 0 是當日 1是明天 -1是昨天以此類推
         */
        SwBaseCtrl.prototype.getToday = function (diff_days) {
            var now = new Date();
            var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (diff_days) {
                today = new Date(today.getTime() + 86400000 * diff_days);
            }
            return today;
        };
        /**
        * 顯示對話盒。由Caller呼叫。
        */
        //dialogShow(model: ISwDialogModel) {
        //    model.CallCtrl = this;
        //    this.DialogModel = model;
        //}
        /**對畫盒 Caller Information*/
        SwBaseCtrl.prototype.getDialogCaller = function () {
            var a = this.$scope.DialogCaller;
            return a;
        };
        /**
         * 開啟對話盒
         * @param name 對話盒名稱
         * @param title 標題
         * @param config 其他參數
         */
        SwBaseCtrl.prototype.dialogOpen = function (name, title, config) {
            var a = {};
            a.CallCtrl = this;
            a.Name = name;
            a.Config = config;
            a.Title = title;
            a.Defer = this.$q.defer();
            this.DialogCaller = a;
            return a.Defer.promise;
        };
        /**
         * When a Dialog be Opened, First Call this Mehtod.
         */
        SwBaseCtrl.prototype.onDialogOpen = function () {
            var name = "#dlg_" + this.getDialogCaller().Name;
            $(name).modal({ show: true });
        };
        /**
         * User Choice Ok and Close
         * @param value
         */
        SwBaseCtrl.prototype.dialogCloseYes = function (value) {
            var _this = this;
            var caller = this.getDialogCaller();
            var name = "#dlg_" + caller.Name;
            $(name).modal('hide');
            caller.Defer.promise.finally(function () { return _this.getDialogCaller().CallCtrl.DialogCaller = null; });
            setTimeout(function () { return caller.Defer.resolve(value); }, 500);
        };
        /**
       * User Choice No and Close
       * @param value
       */
        SwBaseCtrl.prototype.dialogCloseNo = function (reason) {
            var _this = this;
            var caller = this.getDialogCaller();
            var name = "#dlg_" + caller.Name;
            $(name).modal('hide');
            caller.Defer.promise.finally(function () { return _this.getDialogCaller().CallCtrl.DialogCaller = null; });
            setTimeout(function () { return caller.Defer.reject(reason); }, 500);
        };
        /**
         * 對話盒成功結束。由對話盒自身呼叫來告至Caller結束。
         */
        //dialogSuccessEnd(scope: ng.IScope, result?: any) {
        //    this.dialogCaller(scope).SuccssCallback(result);           
        //}
        /**
         * Dialog Caller
         * @param scope
         */
        //dialogCaller(scope: ng.IScope) {
        //    return <ISwDialogModel>scope.DialogModel;
        //}
        /**
         * 等待對話盒建立完成
         * (廢止)
         * @param scope
         */
        //onDialogCreate($scope: ng.IScope, $q: ng.IQService): ng.IPromise<ISwDialogModel> {
        //    let defer = $q.defer<any>();
        //    $scope.$watch('DialogModel', (ov, nv) => {
        //        this.DialogModelReceive = nv as ISwDialogModel;
        //        defer.resolve(nv);
        //    });
        //    return defer.promise;
        //}
        /**
     * 執行有網路通訊的動作
     * @param httprequest
     */
        SwBaseCtrl.prototype.exeHttpAction = function (request, config) {
            var _this = this;
            $('#loading').show();
            var a = request
                .then(function (resp) {
                return resp.data;
            }, function (err) {
                return { Result: "NG", Message: 'Error ' + err.statusText };
            })
                .then(function (x) {
                _this.Result = x;
                $('#loading').hide();
                return x;
            });
            a.then(function (x) {
                if (x.Result != "OK") {
                    _this.onHttpResultError(x, config);
                }
            });
            return a;
        };
        /**
        * 執行長時間動作
        */
        SwBaseCtrl.prototype.exeAction = function (promise) {
            $('#loading').show();
            promise.then(function (x) {
                $('#loading').hide();
            }, function (x) {
                $('#loading').hide();
            });
        };
        /**
        * 深層CopyData
        * @param data
        */
        SwBaseCtrl.prototype.clonedata = function (data) {
            var data2 = {};
            {
                for (var n in data) {
                    if (n[0] == '$')
                        continue;
                    if (data[n] instanceof Array) {
                        var vv = [];
                        for (var _i = 0, _a = data[n]; _i < _a.length; _i++) {
                            var v = _a[_i];
                            vv.push(this.clonedata(v));
                        }
                        data2[n] = vv;
                    }
                    else {
                        data2[n] = data[n];
                    }
                }
            }
            return data2;
        };
        /**
         * 顯示對話訊息
         * @param confirm
         */
        SwBaseCtrl.prototype.showConfirm = function (message, title, yes, no) {
            var config = {
                Message: message,
                Yes: "確定",
                No: "取消"
            };
            var title1 = "動作確認";
            if (title)
                title1 = title;
            if (yes)
                config.Yes = yes;
            if (no)
                config.No = no;
            var task = this.dialogOpen("DialogMessageCtrl", title1, config);
            return task;
            //let dlg = new SwMessageConfirm();
            //dlg.Message = message;
            //if (title)
            //    dlg.Title = title;
            //if (yes)
            //    dlg.Yes = yes;
            //if (no)
            //    dlg.No = no;
            //this.DlgConfirm = dlg;
            //let df = this.$q.defer();
            //this.DlgDefer = df;
            //$('#dlg_confirm001').modal({ show: true });
            //return df.promise;
        };
        /**
        * 顯示訊息
        * @param confirm
        */
        SwBaseCtrl.prototype.showMessage = function (message, title, yes) {
            var config = {
                Message: message,
                Yes: "確定"
            };
            var title1 = "訊息確認";
            if (title)
                title1 = title;
            if (yes)
                config.Yes = yes;
            var task = this.dialogOpen("DialogMessageCtrl", title1, config);
            return task;
        };
        /**
         * 當結果為錯誤
         * @param result 錯誤內容
         */
        SwBaseCtrl.prototype.onHttpResultError = function (result, config) {
            console.log('ResultError=' + angular.toJson(result));
        };
        return SwBaseCtrl;
    }());
    exports.SwBaseCtrl = SwBaseCtrl;
    /**
    *  對話盒確認|訊息
    */
    var SwDialogMessageCtrl = /** @class */ (function (_super) {
        __extends(SwDialogMessageCtrl, _super);
        /**
         * constructor
         * @param $q
         */
        function SwDialogMessageCtrl($q, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$q = $q;
            _this.$scope = $scope;
            _this.Title = "動作確認";
            _this.Yes = "確定";
            _this.No = "取消";
            _this.onDialogOpen();
            var caller = _this.getDialogCaller();
            _this.Title = caller.Title;
            _this.Message = caller.Config.Message;
            _this.Yes = caller.Config.Yes;
            _this.No = caller.Config.No;
            return _this;
        }
        /**
         * Dialog Click Yes
         */
        SwDialogMessageCtrl.prototype.clickYes = function () {
            this.dialogCloseYes();
        };
        /**
         * Diaog Click No
         */
        SwDialogMessageCtrl.prototype.clickNo = function () {
            this.dialogCloseNo();
        };
        return SwDialogMessageCtrl;
    }(SwBaseCtrl));
    exports.SwDialogMessageCtrl = SwDialogMessageCtrl;
    exports.CommonModule = "common";
    /**
    * 檔案下載服務
    */
    var SwDownloadFile = /** @class */ (function () {
        function SwDownloadFile() {
        }
        /**
         * 下載檔案
         * @param url 下載檔案路徑
         * @param params 下載檔案參數 ex {a:123, b:456}
         * @param method HTTP Method: post
         */
        SwDownloadFile.prototype.getFile = function (url, params, method) {
            var form1 = $("<form>")
                .attr("action", url)
                .attr("method", (method || 'post'));
            for (var key in params) {
                form1.append($("<input>")
                    .attr("type", "hidden")
                    .attr("name", key)
                    .val(params[key]));
            }
            form1.appendTo('body').submit().remove();
        };
        /**
        * 下載檔案
        * @param url 下載檔案路徑
        * @param params 下載檔案參數 ex {a:123, b:456}
        * @param method HTTP Method: post
        */
        SwDownloadFile.prototype.getFile2 = function (url) {
            var link = document.createElement('a');
            link.href = url;
            //link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            link.remove();
        };
        return SwDownloadFile;
    }());
    exports.SwDownloadFile = SwDownloadFile;
    /**
     * 註冊共通函數模組
     */
    {
        //Angular 註冊模組與Controller
        angular.module(exports.CommonModule, [])
            .factory('DownloadFile', function () { return new SwDownloadFile(); })
            .controller('DialogMessageCtrl', SwDialogMessageCtrl)
            //日期自動轉換
            .directive('dateInput', function () {
            return {
                restrict: 'A',
                scope: {
                    ngModel: '='
                },
                link: function (scope) {
                    if (scope.ngModel)
                        scope.ngModel = new Date(scope.ngModel);
                }
            };
        });
    }
});
//# sourceMappingURL=common.js.map