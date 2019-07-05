import { Helper } from "./helper";

/**
* a hello world
*/
class MainCtrl  {

    Message = "";

    constructor(public $scope: ng.IScope, public $q: ng.IQService, public user:string) {
    }

    sayHello() {
        this.Message = "Hello World " + this.user;
    }
}

/**
 * start angular app
 */
export function startApp() {

    angular.module("common", []) 
        .value("user", "david")
        ;

    angular.module("app", ["common"]);

    angular.module("app")      
        .controller('MainCtrl', MainCtrl)
        .value("user", Helper.GetUserName())
        ;

   
    angular.bootstrap(document, ['app']);
};
