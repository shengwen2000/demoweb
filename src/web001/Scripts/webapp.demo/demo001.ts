/**
* a hello world
*/
class MainCtrl  {

    Message = "";

    constructor(public $scope: ng.IScope, public $q: ng.IQService) {
    }

    sayHello() {      
        this.Message = "HelloWorld";
    }
}

/**
 * start angular app
 */
export function startApp() {  

    angular.module("app", []);
    angular.module("app")             
        .controller('MainCtrl', MainCtrl)        
        ;
    angular.bootstrap(document, ['app']);
};
