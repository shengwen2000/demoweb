import { ISwRecord, ISwConfig, ISwPageParameter, ISwQryArg, SwRecordState, ISwResult, CommonModule } from "../webapp/common";
import { SwMaster1Ctrl } from "../webapp/master1";
import { Sys010Module } from "./sys010";


/*
  Record
*/
interface IRecord extends ISwRecord {

    EX_Name?: string;
    Email?: string;
}

/**
 * 登入帳號管理
 */
class Sys002Ctrl extends SwMaster1Ctrl {

    /** The Init Data*/
    FormInit = {
        Depts: { Id: 1, Name: "Dept1" }
    };


    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $scope: ng.IScope) {
        super($q, $scope);

        this.formInit();

        //初始排序設定
        this.pageOrderBy('Email', false);

        this.pageQuery(30);
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

    //onQuery(): ng.IHttpPromise<any> {
    //    return this.$http.post(this.Config.AppPath + "/data_query", null);
    //} 

    onQueryOne(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_query", null, { params: { id: record.Id } });
    }

    onRecordView(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { id: record.Id } });
    }

    onRecordSave(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_save", record);
    }

    onGetRecordTitle(record: IRecord) {
        return record.EX_Name ? record.EX_Name : record.Email;
    }

    onRecordStateChange(record: ISwRecord, state: SwRecordState) {
        //檢視直接進編輯
        if (!record.$State && state == SwRecordState.View) {
            record.$State = SwRecordState.Update;
        }
        //編輯完成直接關閉
        else if (record.$State == SwRecordState.Update && state == SwRecordState.View) {
            record.$State = SwRecordState.None;
        }
        else
            record.$State = state;
    }

    onRecordDeleteDo(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_delete", null, { params: { id: record.Id } });
    }

    /**
     * 取得初始資料
     */
    formInit(): ng.IPromise<ISwResult> {
        let a = this.exeHttpAction(this.$http.post(this.Config.AppPath + "/formInit", null));
        a.then(x => {
            if (x.Result == "OK") {
                this.FormInit = x.Record as any;
            }
        });
        return a;
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
        .controller('MainCtrl', Sys002Ctrl)
        .run(() => {
        })
        ;

    angular.bootstrap(document, ['app']);
};
