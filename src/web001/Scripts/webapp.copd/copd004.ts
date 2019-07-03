import { ISwRecord, ISwConfig, ISwPageParameter, ISwQryArg, SwBaseCtrl, CommonModule } from "../webapp/common";
import { SwMaster2Ctrl } from "../webapp/master2";
import { Sys010Module } from "../webapp.sys/sys010";

interface IRecord extends ISwRecord {
    Name?: string;
    MemberId?: number;
}

/**
 * copd video new income
 */
class Copd004Ctrl extends SwMaster2Ctrl {


    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $scope: ng.IScope) {
        super($q, $scope);
        this.query();
    }

    onQuery() {
        return this.$http.get(this.Config.AppPath + "/data_query");
    }

    /**
     * 選擇會員
     * @param record
     */
    memberChoice(record: IRecord) {
        this.dialogOpen("FindMemberCtrl", "選擇會員")
            .then((result) => {
                this.memberChoiceSuccess(record, result);
            });
    }

    /**
    * 選擇會員OK
    * @param record
    */
    memberChoiceSuccess(record: IRecord, result: any) {
        record.MemberId = result.Id;
        this.exeHttpAction(this.$http.post(this.Config.AppPath + "/data_save", record))
            .then(x => {
                if (x.Result == "OK") {
                    this.getFocusTab().close();
                    let idx = this.findRecordIdx(this.Records, record.Id);
                    this.Records.splice(idx, 1);
                }
            });
    }
}

/**
    * 歷史項目
    */
class HistoryCtrl extends SwMaster2Ctrl {

    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $scope: ng.IScope) {
        super($q, $scope);

        //初始排序條件
        this.pageOrderBy('編號', true);

        this.pageQuery(20);
    }

    onPageOrderBy(qp: ISwPageParameter): ng.IPromise<{}> {
        return this.$http.post(this.Config.AppPath + "/his_pageorderby", null, { params: qp });
    }

    onPageQuery(pager: ISwPageParameter): ng.IHttpPromise<{}> {
        for (let v in this.QryArgs) {
            let v1 = this.QryArgs[v] as ISwQryArg;
            if (v1.Checked) {
                pager[v] = v1.Value;
            }
        }
        return this.$http.post(this.Config.AppPath + "/his_pagequery", null, { params: pager });
    }

    onQueryOne(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/his_query", null, { params: { Id: record.Id } });
    }

    onRecordView(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/his_get", null, { params: { Id: record.Id } });
    }

    //onRecordSave(record: IRecord): ng.IHttpPromise<any> {
    //    return this.$http.post(this.Config.AppPath + "/his_save", record);
    //}

    onGetRecordTitle(record: IRecord) {
        return record.Id;
    }

    //onRecordStateChange(record: ISwRecord, state: SwRecordState)
    //{
    //    //檢視直接進編輯
    //    if (!record.$State && state == SwRecordState.View) {
    //        record.$State = SwRecordState.Update;
    //    }
    //    //編輯完成直接關閉
    //    else if (record.$State == SwRecordState.Update && state == SwRecordState.View) {
    //        record.$State = SwRecordState.None;
    //    }
    //    else
    //        record.$State = state;
    //}

    onRecordDeleteDo(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/his_delete", null, { params: { Id: record.Id } });
    }
}

class FindMemberCtrl extends SwBaseCtrl {
    /**查尋條件-姓名*/
    Q_Name: string;

    /**紀錄*/
    Records = [];

    /**最多顯示紀錄數量*/
    RecordsMaxLen = 20;

    constructor(public $http: ng.IHttpService, public $scope: ng.IScope, public $q: ng.IQService, public Config: ISwConfig) {
        super($q, $scope);
        this.onDialogOpen();
    }

    query() {
        this.exeHttpAction(this.$http.post(this.Config.AppPath + '/member_query', null, { params: { name: this.Q_Name, maxcount: this.RecordsMaxLen } }))
            .then(x => {
                if (x.Result == "OK") {
                    this.Records = x.Records;
                }
            })
            ;
    }

    selectRecord(record) {
        this.dialogCloseYes(record);
    }
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
        .controller('MainCtrl', Copd004Ctrl)
        .controller('HistoryCtrl', HistoryCtrl)
        .controller('FindMemberCtrl', FindMemberCtrl)
        .run(() => {
        })
        ;

    angular.bootstrap(document, ['app']);
};
