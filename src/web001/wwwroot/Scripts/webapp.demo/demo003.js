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
    /**
     * start angular app
     */
    function startApp() {
        angular.module("app", []);
        angular.module("app")
            .controller('MainCtrl', MainCtrl);
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=demo003.js.map