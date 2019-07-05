interface ITab {
    Title: string;
    Active?: boolean;
    Content?: any;
    Kind?: TabKind;
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


type TabKind = "item" | "list";

interface IRecord {
    Id: string;
    No: string;
    Name: string;
}



class MainCtrl2 {

    Tabs: ITab[] = [];

    constructor(public $scope: ng.IScope, public $q: ng.IQService) {
    }

    tabClick(tab: ITab) {
        for (let t of this.Tabs) {
            t.Active = (t == tab);
        }
    }

    tabAdd(title: string, kind : TabKind) {
        if (!title) {
            window.alert("title is required");
            return;
        }
        
        let n: ITab = { Title: title, Kind: kind };
        if (kind == "item") {
            n.Content = {
                Id: '1', No:'001', Name: 'david'
            } as IRecord
        }
        else if (kind == "list") {
            n.Content = [
                {
                    Id: '1', No: '001', Name: 'david'
                },
                {
                    Id: '2', No: '002', Name: 'kevin'
                },
            ] as IRecord[];
        }

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
        .controller('MainCtrl2', MainCtrl2)        
        ;
    angular.bootstrap(document, ['app']);
};
