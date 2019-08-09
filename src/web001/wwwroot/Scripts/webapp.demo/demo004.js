define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
    * crud
    */
    var MainCtrl = /** @class */ (function () {
        function MainCtrl($scope, $q) {
            this.$scope = $scope;
            this.$q = $q;
            /** array of records */
            this.Records = [];
            this.NextId = 1;
            var r = { Id: this.NextId++, No: "001", Name: "David" };
            this.Records.push(r);
            r = { Id: this.NextId++, No: "002", Name: "Mary" };
            this.Records.push(r);
        }
        MainCtrl.prototype.add = function () {
            var r = { Id: this.NextId++ };
            this.Records.push(r);
            this.edit(r);
        };
        MainCtrl.prototype.edit = function (record) {
            record.$EditRow = angular.copy(record);
        };
        MainCtrl.prototype.save = function (record) {
            var rnew = record.$EditRow;
            record.$EditRow = null;
            Object.assign(record, rnew);
        };
        MainCtrl.prototype.cancel = function (record) {
            record.$EditRow = null;
        };
        MainCtrl.prototype.remove = function (record) {
            var idx = this.Records.indexOf(record);
            this.Records.splice(idx, 1);
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
//# sourceMappingURL=demo004.js.map