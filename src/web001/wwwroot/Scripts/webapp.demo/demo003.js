define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
    * Tab
    */
    var MainCtrl = /** @class */ (function () {
        function MainCtrl($scope, $q) {
            this.$scope = $scope;
            this.$q = $q;
            this.Tabs = [{ Title: "List", Active: true }, { Title: "Item" }];
        }
        MainCtrl.prototype.tabClick = function (tab) {
            for (var _i = 0, _a = this.Tabs; _i < _a.length; _i++) {
                var t = _a[_i];
                t.Active = (t == tab);
            }
        };
        MainCtrl.prototype.tabAdd = function (title) {
            if (!title) {
                window.alert("title is required");
                return;
            }
            var n = { Title: title };
            this.Tabs.push(n);
            this.tabClick(n);
        };
        return MainCtrl;
    }());
    var MainCtrl2 = /** @class */ (function () {
        function MainCtrl2($scope, $q) {
            this.$scope = $scope;
            this.$q = $q;
            this.Tabs = [];
        }
        MainCtrl2.prototype.tabClick = function (tab) {
            for (var _i = 0, _a = this.Tabs; _i < _a.length; _i++) {
                var t = _a[_i];
                t.Active = (t == tab);
            }
        };
        MainCtrl2.prototype.tabAdd = function (title, kind) {
            if (!title) {
                window.alert("title is required");
                return;
            }
            var n = { Title: title, Kind: kind };
            if (kind == "item") {
                n.Content = {
                    Id: '1', No: '001', Name: 'david'
                };
            }
            else if (kind == "list") {
                n.Content = [
                    {
                        Id: '1', No: '001', Name: 'david'
                    },
                    {
                        Id: '2', No: '002', Name: 'kevin'
                    },
                ];
            }
            this.Tabs.push(n);
            this.tabClick(n);
        };
        return MainCtrl2;
    }());
    /**
     * start angular app
     */
    function startApp() {
        angular.module("app", []);
        angular.module("app")
            .controller('MainCtrl', MainCtrl)
            .controller('MainCtrl2', MainCtrl2);
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=demo003.js.map