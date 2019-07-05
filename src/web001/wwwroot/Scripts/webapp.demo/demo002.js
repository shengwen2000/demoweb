define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
    * Add List
    */
    var Main2Ctrl = /** @class */ (function () {
        function Main2Ctrl($scope, $q) {
            this.$scope = $scope;
            this.$q = $q;
            this.Info = "";
            this.Infos = ["1", "2", "3"];
        }
        Main2Ctrl.prototype.addInfo = function () {
            if (this.Info) {
                this.Infos.push(this.Info);
            }
        };
        Main2Ctrl.prototype.removeInfo = function (idx) {
            this.Infos.splice(idx, 1);
        };
        return Main2Ctrl;
    }());
    /**
     * start angular app
     */
    function startApp() {
        angular.module("app", []);
        angular.module("app")
            .controller('MainCtrl', Main2Ctrl);
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=demo002.js.map