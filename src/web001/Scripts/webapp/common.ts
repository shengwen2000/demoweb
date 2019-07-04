/**環境設定11*/
export interface ISwConfig {
    /** 網站根路徑 ex: /hc */
    SitePath: string;
    /** App路徑 (溝通Controller)ex: /hc/client */
    AppPath: string;   
}

/**
  紀錄目前的編輯狀態
*/
export enum SwRecordState {
    None = 0,
    View = 1,
    Update = 2,
    New = 3,
    Delete = 4,
}

/**
    Record
*/
export interface ISwRecord {

    Id: number | string;

    /**
    子紀錄:通常是編輯的紀錄
    */
    $SubRecord?: ISwRecord;

    /**
    編輯狀態
    */
    $State?: SwRecordState;

    /** 紀錄所屬的分頁 */
    $PageIndex?: number;

    /** 編輯時的備份狀態 **/
    $ViewBak?: any;
}

/**
回應結果
*/
export interface ISwResult {
    /** 回應代號 OK:成功 */
    Result: string;
    /** 回應訊息 */
    Message: string;
    /** 紀錄-單筆 */
    Record?: ISwRecord;
    /** 紀錄-多筆 */
    Records?: ISwRecord[];
    /** 分頁資料來源 */
    PSource?: ISwPageSource;
    /**其他類型的資料回傳*/
    Data?: any;
}

/**
分頁查詢參數
*/
export interface ISwPageParameter {
    /**資料名稱*/
    pg_name?: string;

    /**舊資料名稱*/
    pg_oname?: string;

    /** Page's Index or Row's Index */
    pg_idx?: number;

    /** Each Page Of RowCount or RowCount*/
    pg_count?: number;
}

/**描述分頁資料來源 */
export interface ISwPageSource {
    /** Page Data Source Name */
    Name: string;
    /** Total Row Count */
    Count: number;
    /**是否有更多的資料*/
    IsAll: boolean;
}

/** 分頁控制器 */
export interface ISwPager {
    /** Each Page's Record Count */
    Size: number;
    /** Current Page's Index(Start from 0)*/
    Index: number;
    /** Page Count */
    Count: number;
    /**分頁資料來源 */
    Source?: ISwPageSource;
    /** Page Index(For User Choice Page)*/
    Indexes: ISwPageIndex[];
}

/**
延遲載入的控制器
*/
export interface ISwLazyLoader {

    /**分頁資料來源 */
    Source?: ISwPageSource;

    /** 首次載入的紀錄數 */
    InitCount: number;

    /** 每次追加的紀錄數 */
    MoreCount: number;

    /** 已載入的紀錄數 */
    LoadedCount: number;

    /** 資料載入中? */
    Loading: boolean;

    /** 已載入完成? */
    Complete: boolean;
}


/** 頁面索引 */
export interface ISwPageIndex {
    /** 頁面名稱 */
    Name: string;
    /** 頁面索引 */
    Index: number;
    /** 可點選? */
    Enable: boolean;
    /** 目前頁面? */
    Active: boolean;
}

/**
 對話內容
*/
export class SwMessageConfirm {
    Title: string = "動作確認";
    Message: string;
    Yes: string = "確定";
    No: string = "取消";
}

/** 查詢參數 */
export interface ISwQryArg {
    /** 參數值 */
    Value: any;
    /** 有無被選取 */
    Checked: boolean;
}

/** 查詢參數(排序) */
export interface ISwQryArg_OrderBy extends ISwQryArg {
    /** 參數值 */
    Value: {
        /**欄位名稱*/
        Column: string,
        /**反向排序?*/
        Desc: boolean
    };
}

/**
* TabPage
*/
export class SwTab {
    /** UniqueID */
    Id: string;
    /** 顯示標題 */
    Title: string;
    /** 焦點? */
    IsFocus: boolean = false;
    /** 顯示關閉按鈕(預設開) */
    IsCloseEnable: boolean = false;
    /** 內容 */
    Content: any;
    /** Tab's Controller */
    Controller: SwBaseCtrl;

    /** tab group 相同群組會顯示在一起 */
    GroupNo: number = 0;

    /**
     * 取得焦點
     */
    focus(): SwTab {

        if (this.IsFocus)
            return;

        for (let x of this.Controller.Tabs) {
            if (x != this)
                x.IsFocus = false;
        }
        this.IsFocus = true;
        this.Controller.onTabFocused(this);

        return this;
    }

    /**
     * 關閉頁簽       
     */
    close(): void {
        let idx = this.Controller.Tabs.indexOf(this);
        if (idx >= 0)
            this.Controller.Tabs.splice(idx, 1);

        //if has one selected return
        for (let x of this.Controller.Tabs) {
            if (x.IsFocus)
                return;
        }

        //select First as Selected
        if (this.Controller.Tabs.length > 0)
            this.Controller.Tabs[0].IsFocus = true;
    }
}

/**
   對話盒模型
*/
export interface ISwDialogModel {

    /** 對話盒名稱 */
    Name: string;

    /** 標題 */
    Title: string;

    /** 參數值*/
    Config?: any;

    /** 呼叫者 Controller */
    CallCtrl?: any;

    /** 非同步回呼通知 */
    Defer?: ng.IDeferred<any>;
}


/**
 * Base Of Controller
 */
export class SwBaseCtrl {

    /** Result */
    Result: ISwResult = { Result: 'OK', Message: 'Success' };


    /** Tabs */
    Tabs: SwTab[] = [];


    //查詢參數
    QryArgs: any = {
        /**名稱參數*/
        Name: { Value: '', Checked: false } as ISwQryArg
    };

    /**The Dialog Model Who want to show */
    //DialogModel: ISwDialogModel = null;

    DialogCaller: ISwDialogModel = null;

    /**(廢止)The Dialog Model of the Dialog received */
    //DialogModelReceive: ISwDialogModel = null;

    constructor(public $q: ng.IQService, public $scope: ng.IScope) {

    }

    /**
    * 建立頁簽(if id not exists)
    * @param id 唯一代號      
    * @param initCallback 回呼內容
    */
    createGroupTab(id: string, groupno: number, initCallback?: (tab: SwTab) => void): SwTab {
        for (let x of this.Tabs) {
            if (x.Id == id)
                return x;
        }

        //find the the group's last index
        let idx = -1;
        for (let i = 0; i < this.Tabs.length; i++) {
            let x = this.Tabs[i];
            if (x.GroupNo <= groupno)
                idx = i;
        }
        idx++;

        let tab = new SwTab();
        tab.Id = id;
        tab.Title = "NEW";
        tab.IsCloseEnable = true;
        tab.Controller = this;
        tab.GroupNo = groupno;

        if (initCallback)
            initCallback(tab);

        this.Tabs.splice(idx, 0, tab);

        //首個自動取得焦點
        if (this.Tabs.length == 1) {
            tab.focus();
        }
        return tab;
    }


    /**
    * 建立頁簽(if id not exists)
    * @param id 唯一代號      
    * @param initCallback 回呼內容
    */
    createTab(id: string, initCallback?: (tab: SwTab) => void): SwTab {
        return this.createGroupTab(id, 0, initCallback);
    }

    /**
     * Combin Two Url Paht
     * @param path1
     * @param path2
     */
    combineUrlPath(path1: string, path2: string): string {
        if (path1.endsWith('/') && path2.startsWith("/")) {
            return `${path1}.${path2}`;
        }

        if (!path1.endsWith('/') && !path2.startsWith("/")) {
            return `${path1}/${path2}`;
        }
        return `${path1}${path2}`;
    }

    /**
     * 當Tab焦點變動時
     * @param tab
     */
    onTabFocused(tab: SwTab) {
    }

    /**
     * 關閉頁簽
     * @param id
     */
    closeTab(id: string) {
        let tab = this.findTab(id);
        if (tab)
            tab.close();
    }

    /**
     * 尋找頁簽
     * @param id
     */
    findTab(id: string): SwTab {
        for (let x of this.Tabs) {
            if (x.Id == id)
                return x;
        }
        return null;
    }

    /**
     * 尋找焦點頁簽
     */
    getFocusTab(): SwTab {
        for (let x of this.Tabs) {
            if (x.IsFocus)
                return x;
        }
        return null;
    }

    /**
     * 取得今天日期(不含時間)
     * @param diff_days 0 是當日 1是明天 -1是昨天以此類推
     */
    getToday(diff_days?: number): Date {
        let now = new Date();
        let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (diff_days) {
            today = new Date(today.getTime() + 86400000 * diff_days);
        }
        return today;
    }

    /**
    * 顯示對話盒。由Caller呼叫。
    */
    //dialogShow(model: ISwDialogModel) {
    //    model.CallCtrl = this;
    //    this.DialogModel = model;
    //}

    /**對畫盒 Caller Information*/
    getDialogCaller(): ISwDialogModel {
        let a = <ISwDialogModel>(<any>this.$scope).DialogCaller;
        return a;
    }

    /**
     * 開啟對話盒
     * @param name 對話盒名稱
     * @param title 標題
     * @param config 其他參數
     */
    dialogOpen(name: string, title: string, config?: any): ng.IPromise<any> {
        let a = <ISwDialogModel>{};
        a.CallCtrl = this;
        a.Name = name;
        a.Config = config;
        a.Title = title;
        a.Defer = this.$q.defer<any>();
        this.DialogCaller = a;
        return a.Defer.promise;
    }

    /**
     * When a Dialog be Opened, First Call this Mehtod.
     */
    onDialogOpen() {
        let name = `#dlg_${this.getDialogCaller().Name}`;
        $(name).modal({ show: true });
    }

    /**
     * User Choice Ok and Close
     * @param value
     */
    dialogCloseYes(value?: any) {
        let caller = this.getDialogCaller();
        let name = `#dlg_${caller.Name}`;
        $(name).modal('hide');        
        caller.Defer.promise.finally(() => this.getDialogCaller().CallCtrl.DialogCaller = null);
        setTimeout(() => caller.Defer.resolve(value), 500);
    }

    /**
   * User Choice No and Close
   * @param value
   */
    dialogCloseNo(reason?: any) {
        let caller = this.getDialogCaller();
        let name = `#dlg_${caller.Name}`;
        $(name).modal('hide');
        caller.Defer.promise.finally(() => this.getDialogCaller().CallCtrl.DialogCaller = null);
        setTimeout(() => caller.Defer.reject(reason), 500);               
    }

    /**
     * 對話盒成功結束。由對話盒自身呼叫來告至Caller結束。
     */
    //dialogSuccessEnd(scope: ng.IScope, result?: any) {
    //    this.dialogCaller(scope).SuccssCallback(result);           
    //}

    /**
     * Dialog Caller
     * @param scope
     */
    //dialogCaller(scope: ng.IScope) {
    //    return <ISwDialogModel>scope.DialogModel;
    //}

    /**
     * 等待對話盒建立完成         
     * (廢止)
     * @param scope
     */
    //onDialogCreate($scope: ng.IScope, $q: ng.IQService): ng.IPromise<ISwDialogModel> {
    //    let defer = $q.defer<any>();
    //    $scope.$watch('DialogModel', (ov, nv) => {
    //        this.DialogModelReceive = nv as ISwDialogModel;
    //        defer.resolve(nv);
    //    });
    //    return defer.promise;
    //}

    /**
 * 執行有網路通訊的動作
 * @param httprequest
 */
    exeHttpAction(request: ng.IHttpPromise<any>, config?: any): ng.IPromise<ISwResult> {
        $('#loading').show();
        let a = request
            .then(resp => {
                return resp.data as ISwResult;
            }, err => {
                return { Result: "NG", Message: 'Error ' + err.statusText }
            })
            .then(x => {
                this.Result = x;
                $('#loading').hide();
                return x;
            });

        a.then(x => {
            if (x.Result != "OK") {
                this.onHttpResultError(x, config);
            }
        });

        return a;
    }

    /**
    * 執行長時間動作       
    */
    exeAction(promise: ng.IPromise<any>) {
        $('#loading').show();
        promise.then(
            x => {
                $('#loading').hide();
            }
            , x => {
                $('#loading').hide();
            }
        );
    }

    /**
    * 深層CopyData
    * @param data
    */
    protected clonedata(data: any): any {
        let data2 = {};
        {
            for (let n in data) {
                if (n[0] == '$')
                    continue;

                if (data[n] instanceof Array) {
                    let vv = [];
                    for (let v of data[n])
                        vv.push(this.clonedata(v));
                    data2[n] = vv;
                }
                else {
                    data2[n] = data[n];
                }
            }
        }
        return data2;
    }


    /**
     * 顯示對話訊息
     * @param confirm
     */
    public showConfirm(message: string, title?: string, yes?: string, no?: string): ng.IPromise<any> {

        let config = {
            Message: message,
            Yes: "確定",
            No: "取消"
        };
        let title1 = "動作確認"
        if (title)
            title1 = title;
        if (yes)
            config.Yes = yes;
        if (no)
            config.No = no;

        let task = this.dialogOpen("DialogMessageCtrl", title1, config);
        return task;

        //let dlg = new SwMessageConfirm();
        //dlg.Message = message;
        //if (title)
        //    dlg.Title = title;
        //if (yes)
        //    dlg.Yes = yes;
        //if (no)
        //    dlg.No = no;
        //this.DlgConfirm = dlg;
        //let df = this.$q.defer();
        //this.DlgDefer = df;
        //$('#dlg_confirm001').modal({ show: true });
        //return df.promise;
    }

    /**
    * 顯示訊息
    * @param confirm
    */
    public showMessage(message: string, title?: string, yes?: string): ng.IPromise<any> {

        let config = {
            Message: message,
            Yes: "確定"
        };
        let title1 = "訊息確認"
        if (title)
            title1 = title;
        if (yes)
            config.Yes = yes;

        let task = this.dialogOpen("DialogMessageCtrl", title1, config);
        return task;
    }

    /**
     * 當結果為錯誤
     * @param result 錯誤內容
     */
    onHttpResultError(result: ISwResult, config?: any): void {
        console.log('ResultError=' + angular.toJson(result));
    }
}

/**
*  對話盒確認|訊息
*/
export class SwDialogMessageCtrl extends SwBaseCtrl {

    Title: string = "動作確認";
    Message: string;
    Yes: string = "確定";
    No: string = "取消";

    /**
     * constructor
     * @param $q
     */
    constructor(public $q: ng.IQService, public $scope: ng.IScope) {
        super($q, $scope);

        this.onDialogOpen();
        let caller = this.getDialogCaller();
        this.Title = caller.Title;
        this.Message = caller.Config.Message;
        this.Yes = caller.Config.Yes;
        this.No = caller.Config.No;
    }

    /**
     * Dialog Click Yes
     */
    public clickYes() {
        this.dialogCloseYes();
    }

    /**
     * Diaog Click No
     */
    public clickNo() {
        this.dialogCloseNo();
    }
}

export let CommonModule = "common";

/**
* 檔案下載服務
*/
export class SwDownloadFile {

    /**
     * 下載檔案
     * @param url 下載檔案路徑
     * @param params 下載檔案參數 ex {a:123, b:456}
     * @param method HTTP Method: post
     */
    getFile(url: string, params: Object, method?: string): void {
        var form1 = $("<form>")
            .attr("action", url)
            .attr("method", (method || 'post'))
            ;
        for (var key in params) {
            form1.append(
                $("<input>")
                    .attr("type", "hidden")
                    .attr("name", key)
                    .val(params[key])
            );
        }
        form1.appendTo('body').submit().remove();
    }

    /**
    * 下載檔案
    * @param url 下載檔案路徑
    * @param params 下載檔案參數 ex {a:123, b:456}
    * @param method HTTP Method: post
    */
    getFile2(url: string): void {

        let link = document.createElement('a');
        link.href = url;
        //link.target = "_blank";
        document.body.appendChild(link);
        link.click(); 
        link.remove();
    }
}

/**
 * 註冊共通函數模組
 */
{
    //Angular 註冊模組與Controller
    angular.module(CommonModule, [])
        .factory('DownloadFile', () => new SwDownloadFile())
        .controller('DialogMessageCtrl', SwDialogMessageCtrl)
        //日期自動轉換
        .directive('dateInput', () => {
            return {
                restrict: 'A',
                scope: {
                    ngModel: '='
                },
                link: (scope) => {
                    if (scope.ngModel)
                        scope.ngModel = new Date(scope.ngModel);
                }
            }
        })      
        ;
}


