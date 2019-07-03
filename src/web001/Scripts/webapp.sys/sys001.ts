import { ISwRecord, ISwConfig, ISwPageParameter, ISwQryArg, CommonModule } from "../webapp/common";
import { SwMaster2Ctrl } from "../webapp/master2";
import { Sys010Module } from "./sys010";

interface IRecord extends ISwRecord {
    Name?: string;
}

/**
 * Log Controller
 */
class Sys001Ctrl extends SwMaster2Ctrl {

    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $scope: ng.IScope) {
        super($q, $scope);
        this.QryArgs.Date1 = { Value: this.getToday(0), Checked: true } as ISwQryArg;

        //初始排序設定
        this.pageOrderBy('檔名', true);
        this.pageQuery(50);
    }

    onPageQuery(pager: ISwPageParameter): ng.IHttpPromise<any> {
        for (let v in this.QryArgs) {
            let v1 = this.QryArgs[v] as ISwQryArg;
            if (v1.Checked) {
                pager[v] = v1.Value;
            }
        }
        return this.$http.post(this.Config.AppPath + "/data_pagequery", null, { params: pager });
    }

    onPageOrderBy(qp: ISwPageParameter): ng.IPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_pageorderby", null, { params: qp });
    }

    onQueryOne(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_query", null, { params: { id: record.Id } });
    }

    onRecordView(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { id: record.Id } });
    }

    //reload(record: IRecord) {
    //    let tab = this.getFocusTab();
    //    this.exeHttpAction(this.onRecordView(record))
    //        .then(x => {
    //            if (x.Result == "OK") {
    //                tab.Content = x.Record;
    //            }                    
    //        });
    //}
}

/**
 * App Start
 */
export function startApp(sitepath, apppath) {
    angular.module("app", [CommonModule, Sys010Module]).constant('Config', {
        SitePath: sitepath,
        AppPath: apppath
    })
    angular.module("app")
        .config(($qProvider) => {
            $qProvider.errorOnUnhandledRejections(false);
        })
        .controller('MainCtrl', Sys001Ctrl)
        .run(() => {
        })
        ;

    angular.bootstrap(document, ['app']);
};
