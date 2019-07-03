import { ISwRecord, ISwConfig, CommonModule } from "../webapp/common";
import { SwMaster2Ctrl } from "../webapp/master2";
import { Sys010Module } from "./sys010";
/*
     Record
  */
interface IRecord extends ISwRecord {

    Name?: string;
    Title?: string;
    Desc?: string;
}

class Sys003Ctrl extends SwMaster2Ctrl {

    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $scope: ng.IScope) {
        super($q, $scope);
        this.query();
    }

    onQuery(): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/role_query", null);
    }

    onQueryOne(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/role_query", null, { params: { Id: record.Id } });
    }

    onRecordNew(): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_new", null);
    }

    onRecordView(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/role_get", null, { params: { Id: record.Id } });
    }

    onRecordSave(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/role_save", record);
    }

    onGetRecordTitle(record: IRecord) {
        return record.Title;
    }

    test(scope: any) {
        console.log("log");
    }

    /**
     * 初始功能表，設定焦點Tab為第一個有功能的項目
     * @param scope
     * @param menus
     */
    initMenu(scope: any, menus: any[]) {
        if (menus) {
            scope.FMenu = null;
            for (let m of menus) {
                if (m.ChkCount) {
                    scope.FMenu = m;
                    break;
                }
            }
            console.log("hi you");
        }
    }

    /**
     * 勾選異動時，重新統計每個項目的數量
     * @param menus
     */
    refreshChkCount(menus: any[]) {
        if (!menus)
            return;

        function calc(m): number {
            let total = 0;
            if (m.Id && m.Checked)
                total = 1;
            for (let n1 of m.Nodes) {
                total += calc(n1);
            }
            m.ChkCount = total;
            return total;
        };

        for (let m of menus) {
            calc(m);
        }
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
        return this.$http.post(this.Config.AppPath + "/role_delete", null, { params: { Id: record.Id } });
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
        .controller('MainCtrl', Sys003Ctrl)
        .run(() => {
        })
        ;

    angular.bootstrap(document, ['app']);
};
