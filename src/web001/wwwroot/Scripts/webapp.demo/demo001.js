define(["require", "exports", "./helper"], function (require, exports, helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
    * a hello world
    */
    var MainCtrl = /** @class */ (function () {
        function MainCtrl($scope, $q, user) {
            this.$scope = $scope;
            this.$q = $q;
            this.user = user;
            this.Message = "";
        }
        MainCtrl.prototype.sayHello = function () {
            this.Message = "Hello World " + this.user;
        };
        return MainCtrl;
    }());
    /**
     * start angular app
     */
    function startApp() {
        angular.module("common", [])
            .value("user", "david");
        angular.module("app", ["common"]);
        angular.module("app")
            .controller('MainCtrl', MainCtrl)
            .value("user", helper_1.Helper.GetUserName());
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=demo001.js.map