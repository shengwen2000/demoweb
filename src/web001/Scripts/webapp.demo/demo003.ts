interface ITab {
    Title: string;
    Active?: boolean;
    Content?: any;
}


/**
* Tab
*/
class MainCtrl  {

    Tabs: ITab[] = [{ Title: "List", Active: true }, {Title:"Item"}];

    constructor(public $scope: ng.IScope, public $q: ng.IQService) {
    }    

    tabClick(tab: ITab) {
        for (let t of this.Tabs) {
            t.Active = (t == tab);
        }
    }

    tabAdd(title: string) {
        if (!title) {
            window.alert("title is required");
            return;
        }
           
        let n: ITab = { Title: title };
        this.Tabs.push(n);
        this.tabClick(n);
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
