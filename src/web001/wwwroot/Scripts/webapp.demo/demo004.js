define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
    *
    */
    var MainCtrl = /** @class */ (function () {
        function MainCtrl($scope, $q) {
            this.$scope = $scope;
            this.$q = $q;
        }
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
//# sourceMappingURL=demo004.js.map