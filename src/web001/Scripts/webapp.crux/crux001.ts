import { ISwRecord, ISwConfig, ISwPageParameter, ISwQryArg, ISwResult, SwRecordState, CommonModule } from "../webapp/common";
import { SwMaster1Ctrl } from "../webapp/master1";
import { Sys010Module } from "../webapp.sys/sys010";

/*
      Record
   */
interface IRecord extends ISwRecord {
    Name?: string;
    Addrs?: any;
    Phones?: any;
    NotifyEmails?: any;
    Birth?: Date
}

/**
  * 會員主檔
  */
class Crux001Ctrl extends SwMaster1Ctrl {


    constructor(public $http: ng.IHttpService, public $scope: ng.IScope, public $q: ng.IQService, public Config: ISwConfig) {
        super($q, $scope);

        //初始排序學號反向排序
        this.pageOrderBy('加入日', true);

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

    onQueryOne(record: IRecord): ng.IHttpPromise<{}> {
        return this.$http.post(this.Config.AppPath + "/data_queryone", null, { params: { id: record.Id } });
    }

    onRecordView(record: IRecord): ng.IHttpPromise<{}> {
        return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { Id: record.Id } });
    }

    //onRecordNew(): ng.IHttpPromise<{}> {
    //    return this.$http.post(this.Config.AppPath + "/data_new", null);
    //}

    onRecordLoaded(result: ISwResult, config?: any) {
        if (result.Result == "OK") {
            var record = result.Record as IRecord;
            record.Addrs = angular.fromJson(record.Addrs);
            record.Phones = angular.fromJson(record.Phones);
            record.NotifyEmails = angular.fromJson(record.NotifyEmails);
            record.Birth = new Date(record.Birth);
        }
    }

    onRecordSave(record: IRecord): ng.IHttpPromise<any> {
        record.Addrs = angular.toJson(record.Addrs);
        record.Phones = angular.toJson(record.Phones);
        record.NotifyEmails = angular.toJson(record.NotifyEmails);
        return this.$http.post(this.Config.AppPath + "/data_save", record);
    }

    onGetRecordTitle(record: IRecord) {
        if (record.Id == 0)
            return "新會員";
        return record.Name;
    }

    onRecordStateChange(record: ISwRecord, state: SwRecordState) {
        if (!record.$State && state == SwRecordState.View)
            record.$State = SwRecordState.Update;
        else if (record.$State == SwRecordState.Update && state == SwRecordState.View)
            record.$State = SwRecordState.None;
        else
            record.$State = state;
    }

    /**
     * 新增一個空項目與指定項目的下方
     * @param array
     * @param item
     */
    arrayInsert(array: any[], item: any, def?: any) {
        let idx = array.indexOf(item);
        let val = {};
        if (def)
            val = def;
        array.splice(idx + 1, 0, val);
    }

    /**
    * 移除陣列中指定的項目
    * @param array
    * @param item
    */
    arrayRemove(array: any[], item: any) {
        let idx = array.indexOf(item);
        array.splice(idx, 1);
    }


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
        .controller('MainCtrl', Crux001Ctrl)
        //iso日期自動轉換
        //.directive("input", () => {
        //    return {
        //        require: 'ngModel',
        //        link: function (scope, elem, attr, modelCtrl: any) {
        //            if (attr['type'] === 'date') {
        //                modelCtrl.$formatters.push(function (modelValue) {
        //                    if (modelValue) {
        //                        return new Date(modelValue);
        //                    } else {
        //                        return null;
        //                    }
        //                });
        //            }
        //        }
        //    }
        //})
        .run(() => {
        })
        ;

    angular.bootstrap(document, ['app']);
};

