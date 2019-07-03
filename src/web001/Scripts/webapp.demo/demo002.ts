
/**
* Add List
*/
class MainCtrl  {

    Info = "";

    Infos: string[] = [];

    constructor(public $scope: ng.IScope, public $q: ng.IQService) {
    }

    addInfo() {

        if (this.Info) {
            this.Infos.push(this.Info);
        }        
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
