
/**
* 
*/
class MainCtrl  {

    constructor(public $scope: ng.IScope, public $q: ng.IQService) {
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
