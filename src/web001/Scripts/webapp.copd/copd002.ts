import { SwMaster2Ctrl } from "../webapp/master2";
import { ISwRecord, ISwConfig, ISwQryArg, ISwResult, ISwPageParameter, SwDownloadFile, CommonModule } from "../webapp/common";
import { Sys010Module } from "../webapp.sys/sys010";

/*
     Record
  */
interface IRecord extends ISwRecord {
    TheDate?: Date;
    MemberNo?: string;
    MemberName?: string;
    Content?: any;
}

/**
 * copd評量表清冊
 */
class COPD002Ctrl extends SwMaster2Ctrl {

    /** The Init Data*/
    FormInit = {
        Gateways: [{ Id: 1, Name: "ASUS" }],
    };

    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $filter: ng.IFilterService, public $scope: ng.IScope) {
        super($q, $scope);

        this.formInit();

        this.QryArgs.Date1 = <ISwQryArg>{ Value: this.getToday(-7), Checked: true };

        //初始排序條件
        this.pageOrderBy('日期', true);

        this.pageQuery(50);
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

    onPageOrderBy(qp: ISwPageParameter): ng.IPromise<{}> {
        return this.$http.post(this.Config.AppPath + "/data_pageorderby", null, { params: qp });
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

    //onQuery(): ng.IHttpPromise<{}> {
    //    return this.$http.post(this.Config.AppPath + "/data_query", null);
    //} 

    //onQueryOne(record: IRecord): ng.IHttpPromise<any> {
    //    return this.$http.post(this.Config.AppPath + "/data_query", null, { params: { Id: record.Id } });
    //}

    //onRecordNew(): ng.IHttpPromise<any> {
    //    return this.$http.post(this.Config.AppPath + "/data_new", null);
    //} 

    onRecordView(record: IRecord, config?: any): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { Id: record.Id } });
    }

    onRecordLoaded(result: ISwResult, config?: any) {
        if (result.Result == "OK") {
            let record = <IRecord>result.Record;
            record.TheDate = new Date(<any>record.TheDate);
            record.Content = angular.fromJson(record.Content);
        }
    }

    onRecordSave(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_save", record);
    }

    onGetRecordTitle(record: IRecord) {
        return `${record.MemberName}@${this.$filter('date')(record.TheDate, 'yyyy/MM/dd')}`;
    }

    onRecordDeleteDo(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_delete", null, { params: { Id: record.Id } });
    }

    export() {
        this.exeHttpAction(this.$http.post(this.Config.AppPath + '/Export', null, { params: { pg_name: this.Pager.Source.Name } }))
            .then(x => {
                if (x.Result == "OK") {
                    var d = new SwDownloadFile();
                    d.getFile( '/File/download', x.Record, "GET");
                }
            });
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
        .controller('MainCtrl', COPD002Ctrl)
        .run(() => {
        })
        ;

    angular.bootstrap(document, ['app']);
};