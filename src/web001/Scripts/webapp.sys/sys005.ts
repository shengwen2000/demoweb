import { ISwRecord, ISwConfig, ISwPageParameter, ISwQryArg, ISwResult, CommonModule } from "../webapp/common";
import { SwMaster1Ctrl } from "../webapp/master1";
import { Sys010Module } from "./sys010";
/*
      Record
   */
interface IRecord extends ISwRecord {
    Title: string;
    Name?: string;
}


/**
 * 排程任務
 */
class Sys005Ctrl extends SwMaster1Ctrl {


    /** The Init Data*/
    FormInit = {


    };

    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $scope: ng.IScope, public $timeout: ng.ITimeoutService) {
        super($q, $scope);

        this.formInit();

        //let a = new Date();

        //初始排序設定
        this.pageOrderBy('名稱', false);

        this.pageQuery(10000);

        //this.createTab("help", tab => {
        //    tab.Title = "設定";
        //    tab.IsCloseEnable = false;
        //});
    }


    isFuture(date): boolean {
        return new Date(date) > new Date();
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

    //onLazyQuery(pager: webapp.ISwPageParameter): ng.IHttpPromise<any> {
    //    return this.$http.post(this.Config.AppPath + "/data_querymore", null, { params: pager });
    //}

    //onLazyQueryMore(pager: webapp.ISwPageParameter): ng.IHttpPromise<any> {
    //    return this.$http.post(this.Config.AppPath + "/data_querymore", null, { params: pager });
    //}                

    //onQuery(): ng.IHttpPromise<any> {
    //    return this.$http.post(this.Config.AppPath + "/data_query", null);
    //} 

    onQueryOne(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_query", null, { params: { Id: record.Id } });
    }


    onRecordView(record: IRecord, config?: any): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { id: record.Id } });
    }

    /**
     * 當資料載入時
     * @param result
     */
    onRecordViewResult(result: ISwResult, config?: any) {

    }

    //onRecordSave(record: ISwRecord): ng.IHttpPromise<any> {
    //    return this.$http.post(this.Config.AppPath + "/data_save", record);
    //}

    /**
       立即執行排程
    */
    invokeTaskNow(record: IRecord) {

        this.showConfirm(`要立即啟動${this.onGetRecordTitle(record)}?`, "送出確認", "確定", "取消")
            .then(x => {
                this.exeHttpAction(this.$http.post(this.Config.AppPath + "/Task_InvokeNow", null, { params: { id: record.Id } }))
                    .then(x => {
                        if (x.Result == "OK") {
                            this.$timeout(500)
                                .then(x => {
                                    this.showMessage("已送出");
                                })
                                ;
                        }
                    })
                    ;
            });
    }

    /**
     * 任務啟用/停用
     * @param record
     * @param enable
     */
    taskSetEnable(record: IRecord, enable: boolean) {
        this.exeHttpAction(this.$http.post(this.Config.AppPath + "/Task_Enable", null, { params: { id: record.Id, enable: enable } }))
            .then(x => {
                if (x.Result == "OK") {
                    this.recordRefresh(record);
                    this.$timeout(500)
                        .then(x => {
                            if (enable)
                                this.showMessage(`${this.onGetRecordTitle(record)}-設定啟用`);
                            else
                                this.showMessage(`${this.onGetRecordTitle(record)}-設定停用`);
                        })
                        ;
                }
            })
            ;
    }

    onGetRecordTitle(record: IRecord) {
        if (record.Id == 0)
            return "新增";
        if (record.Title)
            return record.Title;
        return `${record.Name}`;
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

    //onRecordDeleteDo(record: IRecord): ng.IHttpPromise<any> {
    //    return this.$http.post(this.Config.AppPath + "/data_delete", null, { params: { Id: record.Id } });
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
        .controller('MainCtrl', Sys005Ctrl)
        .run(() => {
        })
        ;

    angular.bootstrap(document, ['app']);
};
