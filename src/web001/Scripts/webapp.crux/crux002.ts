import { ISwRecord, ISwQryArg, ISwPageParameter, ISwConfig, CommonModule } from "../webapp/common";
import { SwMaster1Ctrl } from "../webapp/master1";
import { Sys010Module } from "../webapp.sys/sys010";

/*
       Record
    */
interface IRecord extends ISwRecord {

    No?: string;

    Name?: string;

    MemberName?: string;
}

/**
  * 生理訊號
  */
export class Crux002Ctrl extends SwMaster1Ctrl {

    constructor(public $http: ng.IHttpService, public $scope: ng.IScope, public $q: ng.IQService, public Config: ISwConfig) {
        super($q, $scope);

        this.QryArgs.Date1 = { Value: this.getToday(-14), Checked: true } as ISwQryArg;

        //初始排序學號反向排序
        this.pageOrderBy('接收時間', true);

        this.pageQuery(50);

        //this.createTab("help", tab => {
        //    tab.Title = "說明";
        //    tab.IsCloseEnable = false;
        //});
    }

    onPageQuery(pager: ISwPageParameter): ng.IHttpPromise<{}> {
        for (let v in this.QryArgs) {
            let v1 = this.QryArgs[v] as ISwQryArg;
            if (v1.Checked) {
                pager[v] = v1.Value;
            }
        }

        return this.$http.post(this.Config.AppPath + "/data_pagequery", null, { params: pager });
    }

    onPageOrderBy(qp: ISwPageParameter): ng.IPromise<{}> {
        return this.$http.post(this.Config.AppPath + "/data_pageorderby", null, { params: qp });
    }

    //onQueryOne(record: IRecord): ng.IHttpPromise<{}> {
    //    return this.$http.post(this.Config.AppPath + "/data_query", null, { params: { Id: record.Id } });
    //}

    onRecordView(record: IRecord): ng.IHttpPromise<{}> {
        return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { Id: record.Id } });
    }

    //onRecordNew(): ng.IHttpPromise<{}> {
    //    return this.$http.post(this.Config.AppPath + "/data_new", null);
    //}

    //onRecordSave(record: IRecord): ng.IHttpPromise<{}> {
    //    return this.$http.post(this.Config.AppPath + "/data_save", record);
    //}

    onGetRecordTitle(record: IRecord) {
        //if (record.Id == 0)
        //    return "新設備";
        return record.Id;
    }

    //onRecordStateChange(record: ISwRecord, state: SwRecordState) {
    //    if (!record.$State && state == SwRecordState.View)
    //        record.$State = SwRecordState.Update;
    //    else if (record.$State == SwRecordState.Update && state == SwRecordState.View)
    //        record.$State = SwRecordState.None;
    //    else            
    //        record.$State = state;
    //}     

    //onRecordDeleteDo(record: IRecord): ng.IHttpPromise<{}> {
    //    return this.$http.post(this.Config.AppPath + "/test_delete", null, { params: { id: record.Id } });
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
        .controller('MainCtrl', Crux002Ctrl)
        .run(() => {
        })
        ;

    angular.bootstrap(document, ['app']);
};
