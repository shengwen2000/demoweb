import { ISwRecord, ISwConfig, ISwPageParameter, ISwQryArg, ISwResult, SwBaseCtrl, SwDownloadFile, CommonModule } from "../webapp/common";


/*
      Record
   */
interface IRecord extends ISwRecord {
    Title: string;
    State: "Append" | "Run" | "Finish";
    Result: any;
}

interface IResult extends ISwResult {

    VerId: number;
}

/** 任務通知模組 */
export let Sys010Module = "sys010";

/**
 * notify service
 */
export class Sys010Ctrl extends SwBaseCtrl {

    VerId = -1;

    Records: IRecord[] = [];

    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $scope: ng.IScope, public $timeout: ng.ITimeoutService) {
        super($q, $scope);
        this.queryNotifys();
    } 

    getAnotherCtrl(): Sys010TCtrl {
        let div = document.getElementById("Sys010TCtrl");
        let ctl = angular.element(div).scope().ctl;
        return ctl as Sys010TCtrl;
    }    

    queryNotifys() {
        this.$http.post("/Sys010/QueryNotifies", null, { params: { verid: this.VerId } })
            .then(resp => {
                return resp.data as ISwResult;
            }, err => {
                return { Result: "NETERR", Message: 'Error ' + err.statusText }
            })
            .then(x => {
                if (x.Result == "OK") {
                    this.VerId = (<IResult>x).VerId;
                    this.Records = <IRecord[]>x.Records;
                }
                if (x.Result == "NETERR") {
                    this.$timeout(10000).then(() => {
                        this.queryNotifys();
                    });
                }
                else if (x.Result == "OK") {
                    this.$timeout(100).then(() => {
                        this.queryNotifys();
                    });
                }
                else {
                    this.$timeout(3000).then(() => {
                        this.queryNotifys();
                    });
                }
            });
    }

    ClickRecord(record: IRecord) {
        //cancel record
        if (record.State == "Append" || record.State == "Run") {
            this.getAnotherCtrl().showConfirm(`取消-${record.Title}?`, "任務取消").then(() => {
                this.exeHttpAction(this.$http.post("/Sys010/CancelNotify", null, { params: { id: record.Id } }))
            });
        }

        if (record.State == "Finish") {
            if (record.Result.Result == 'OK') {
                //url
                if (record.Result.Kind == 1) {
                    //remove
                    this.$http.post("/Sys010/CancelNotify", null, { params: { id: record.Id } });

                    //download file
                    let ctl = new SwDownloadFile();
                    ctl.getFile2(record.Result.Content);                   
                }
            }
            else {
                //remove
                this.$http.post("/Sys010/CancelNotify", null, { params: { id: record.Id } });
                this.getAnotherCtrl().showMessage(record.Result.Message, "錯誤訊息");
            }
        }

    }
}

/** 負責顯示對話盒，因為Sys010的位置會被封鎖 */
export class Sys010TCtrl extends SwBaseCtrl {
    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $scope: ng.IScope, public $timeout: ng.ITimeoutService) {
        super($q, $scope);        
    } 
}

angular.module(Sys010Module, [CommonModule])   
    .controller('Sys010Ctrl', Sys010Ctrl)
    .controller('Sys010TCtrl', Sys010TCtrl)
    ;