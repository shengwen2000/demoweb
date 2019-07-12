
interface IRecord {
    /** key */
    Id : number;
    /** 編號 */
    No?: string;
    /** 姓名 */
    Name?: string;

    /**編輯列 */
    $EditRow?: IRecord;
}


/**
* crud
*/
class MainCtrl  {

    /** array of records */
    Records: IRecord[] = [];

    NextId = 1;


    constructor(public $scope: ng.IScope, public $q: ng.IQService) {
        let r = { Id: this.NextId++, No: "001", Name: "David" } as IRecord;
        this.Records.push(r);

        r = { Id: this.NextId++, No: "002", Name: "Mary" } as IRecord;
        this.Records.push(r);
    }     

    add() {
        let r = { Id: this.NextId++ } as IRecord;
        this.Records.push(r);
        this.edit(r);
    }

    edit(record: IRecord) {
        record.$EditRow = angular.copy(record);    
    }

    save(record: IRecord) {

        let rnew = record.$EditRow;
        record.$EditRow = null;
        Object.assign(record, rnew);
    }

    cancel(record: IRecord) {
        record.$EditRow = null;
    }

    remove(record: IRecord) {
        let idx = this.Records.indexOf(record);
        this.Records.splice(idx, 1);
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
