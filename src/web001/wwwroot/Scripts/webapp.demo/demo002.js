define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
    * Add List
    */
    var MainCtrl = /** @class */ (function () {
        function MainCtrl($scope, $q) {
            this.$scope = $scope;
            this.$q = $q;
            this.Info = "";
            this.Infos = [];
        }
        MainCtrl.prototype.addInfo = function () {
            if (this.Info) {
                this.Infos.push(this.Info);
            }
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
//# sourceMappingURL=demo002.js.map