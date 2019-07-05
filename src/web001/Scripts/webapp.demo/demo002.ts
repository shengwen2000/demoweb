
/**
* Add List
*/
class Main2Ctrl  {

    Info = "";

    Infos: string[] = ["1", "2", "3"];

    constructor(public $scope: ng.IScope, public $q: ng.IQService) {

    }

    addInfo() {

        if (this.Info) {
            this.Infos.push(this.Info);
        }        
    }   

    removeInfo(idx: number) {
        this.Infos.splice(idx, 1);
    }
}

/**
 * start angular app
 */
export function startApp() {
    angular.module("app", []);
    angular.module("app")      
        .controller('MainCtrl', Main2Ctrl)        
        ;
    angular.bootstrap(document, ['app']);
};
