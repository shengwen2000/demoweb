import { ISwRecord, ISwConfig, ISwPageParameter, ISwQryArg, ISwResult, SwBaseCtrl } from "../webapp/common";
import { SwMaster1Ctrl } from "../webapp/master1";
/*
      Record
   */
interface IRecord extends ISwRecord {
    Title: string;
    Status: string;
}

interface IResult extends ISwResult {

    VerId: number;
}


/**
 * For test
 */
class Test001Ctrl extends SwBaseCtrl {

    VerId = -1;

    Records: IRecord[] = [];

    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $scope: ng.IScope, public $timeout: ng.ITimeoutService) {
        super($q, $scope);
        this.queryNotifys();
    } 

    queryNotifys() {
        this.$http.post(this.Config.AppPath + "/QueryNotifys", null, { params: { verid: this.VerId } })
            .then(resp => {
                return resp.data as ISwResult;
            }, err => {
                return { Result: "NG", Message: 'Error ' + err.statusText }
            })
            .then(x => {
                if (x.Result == "OK") {
                    this.VerId = (<IResult>x).VerId;
                    this.Records = <IRecord[]>x.Records;
                }

                this.$timeout(100).then(() => {
                    this.queryNotifys();
                });
            });
    }

    addNotify() {
        this.exeHttpAction(this.$http.post(this.Config.AppPath + "/AddNotify", null));
    }

    cancelNotify(record: IRecord) {
        this.exeHttpAction(this.$http.post(this.Config.AppPath + "/CancelNotify", null, { params: { id: record.Id } }));
    }

}

/**
 * App Start
 */
export function startApp(sitepath, apppath) {
    angular.module("app", ['common']).constant('Config', {
        SitePath: sitepath,
        AppPath: apppath
    })
    angular.module("app")
        .config(($qProvider) => {
            $qProvider.errorOnUnhandledRejections(false);
        })
        .controller('MainCtrl', Test001Ctrl)
        .run(() => {
        })
        ;

    angular.bootstrap(document, ['app']);
};
