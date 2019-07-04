define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
    * a hello world
    */
    var MainCtrl = /** @class */ (function () {
        function MainCtrl($scope, $q) {
            this.$scope = $scope;
            this.$q = $q;
            this.Message = "";
        }
        MainCtrl.prototype.sayHello = function () {
            this.Message = "HelloWorld";
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
//# sourceMappingURL=demo001.js.map