import { SwBaseCtrl, ISwRecord, ISwPager, ISwLazyLoader, ISwResult, SwRecordState, ISwPageParameter, ISwPageIndex, ISwQryArg_OrderBy } from "./common";

/**
       * 主檔維護2I(頁簽式單一紀錄)
       */
export class SwMaster2ICtrl extends SwBaseCtrl {

    constructor(public $q: ng.IQService, public $scope: ng.IScope) {
        super($q, $scope);
    }

    /**
     * 狀態變更時
     * @param record
     * @param target
     */
    onRecordStateChange(record: ISwRecord, state: SwRecordState) {
        record.$State = state;
    }

    /**
     * 檢視紀錄
     * @param record
     */
    recordView(record?: ISwRecord, config?: any): ng.IPromise<ISwRecord> {

        let defer = this.$q.defer<ISwRecord>();

        this.exeHttpAction(this.onRecordView(record, config), config)
            .then(x => {
                let tab = this.getFocusTab();
                this.onRecordLoaded(x, config);
                this.Result = x;
                if (x.Result == "OK") {

                    x.Record.$State = SwRecordState.None;
                    this.onRecordStateChange(x.Record, SwRecordState.View);
                    if (x.Record.$State as any == SwRecordState.Update) {
                        x.Record.$ViewBak = this.clonedata(x.Record);
                    }
                    tab.Title = this.onGetRecordTitle(x.Record);
                    tab.Content = x.Record;
                    tab.focus();
                    defer.resolve(x.Record);
                }
                else {
                    defer.reject();
                }
            })
            ;
        return defer.promise;
    }

    /**
    * 取得紀錄內容(後代需實作)
    * @param config
    */
    onRecordView(record?: ISwRecord, config?: any): ng.IHttpPromise<any> {

        return this.$q.resolve<any>({
            data: {
                Result: "NG",
                Message: "Not Implement onRecordView()"
            }
        });
    }

    /**
      * 資料項目單筆編輯或檢視項目由Server端載入時
      * @param result
      * @param config
      */
    onRecordLoaded(result: ISwResult, config?: any) {
    }

    /**
     * 要求編輯紀錄
     * @param record
     * @param config
     */
    recordEdit(record: ISwRecord, config?: any) {
        this.onRecordStateChange(record, SwRecordState.Update);
        if (record.$State != SwRecordState.Update)
            return;

        //backeup state
        record.$ViewBak = this.clonedata(record);

        //event
        this.onRecordEdit(record, config);
    }

    /**
    * 當資料編輯時(通知後代)
    * @param record
    * @param config
    */
    onRecordEdit(record: ISwRecord, config?: any) {
    }

    /**
     * 新增紀錄
     */
    recordNew(config?: any): ng.IPromise<ISwRecord> {

        let defer = this.$q.defer<ISwRecord>();

        let tab = this.getFocusTab();
        tab.Title = "新增";
        this.exeHttpAction(this.onRecordNew(config), config)
            .then(x => {
                this.onRecordLoaded(x, config);
                this.Result = x;
                if (x.Result == "OK") {
                    x.Record.$State = SwRecordState.New;
                    tab.Content = x.Record;
                    defer.resolve(x.Record);
                }
                else {
                    defer.reject();
                }
            })
            .then(x => {
                tab.focus();
            });
        ;

        return defer.promise;
    }

    /**
    * 當資料新增時(後代給予初始值)        
    * @param config
    */
    onRecordNew(config?: any): ng.IHttpPromise<any> {
        let record: ISwRecord = { Id: 0 };
        let result: ISwResult = {
            Result: "OK",
            Message: "Success",
            Record: record
        };
        return this.$q.resolve<any>({ data: result });
    }

    /**
     * 關閉紀錄
     * @param record
     */
    recordClose(record: ISwRecord): ng.IPromise<ISwRecord> {
        let defer = this.$q.defer<ISwRecord>();

        //新增狀態直接關閉
        if (record.$State == SwRecordState.New) {
            this.getFocusTab().close();
            defer.resolve(record);
            return defer.promise;
        }

        let s1 = record.$State;

        //回歸檢視狀態
        if (record.$State == SwRecordState.Update) {
            this.onRecordStateChange(record, SwRecordState.View);
        }

        //檢視回歸關閉
        else if (record.$State == SwRecordState.View) {
            this.onRecordStateChange(record, SwRecordState.None);
        }

        let s2 = record.$State;
        //如果有編輯變回檢視的狀態必須要重新載入資料
        if (s1 == SwRecordState.Update && s2 == SwRecordState.View) {

            if (record.$ViewBak) {
                for (let n in record.$ViewBak) {
                    if (n[0] != '$') {
                        record[n] = record.$ViewBak[n];
                    }
                }
                delete record.$ViewBak;
            }
            defer.resolve(record);
            return defer.promise;
        }

        //取消檢視狀態
        if (!record.$State) {
            this.getFocusTab().close();
            defer.resolve(record);
        }

        return defer.promise;
    }

    /**
     * 紀錄儲存(新增或修改儲存)
     * @param record
     * @param config
     */
    recordSave(record: ISwRecord, config?: any): ng.IPromise<ISwRecord> {
        let defer = this.$q.defer<ISwRecord>();

        this.exeHttpAction(this.onRecordSave(this.clonedata(record), config), config)
            .then(x => {
                this.onRecordLoaded(x, config);
                this.Result = x;
                if (x.Result != "OK") {
                    defer.reject(x.Result);
                }
                else {
                    let record_new = x.Record;

                    let tab = this.getFocusTab();
                    let origin_state = record.$State;
                    //新增
                    if (record.$State == SwRecordState.New) {
                        record_new.$State = record.$State;
                        tab.Content = record_new;
                        tab.Id = "Item#" + record_new.Id;
                        tab.Title = this.onGetRecordTitle(record_new);
                    }
                    //維護
                    else {
                        tab.Content = record_new;
                        record_new.$State = record.$State;
                    }

                    //邊更為檢視狀態
                    this.onRecordStateChange(record_new, SwRecordState.View);

                    //不檢視的話，直接關閉之回清單頁簽
                    if (record_new.$State == SwRecordState.None) {
                        tab.close();
                        this.findTab("List").focus();
                    }
                }
            });

        return defer.promise;
    }

    /**
    * 當資料儲存時(後代實作)        
    * @param config
    */
    onRecordSave(record: ISwRecord, config?: any): ng.IHttpPromise<any> {
        return this.$q.resolve<any>({
            data: {
                Result: "NG",
                Message: "no implement onRecordSave()"
            }
        });
    }

    /**
    * 刪除紀錄
    * @param record
    * @param config
    */
    recordDelete(record: ISwRecord, config: any): ng.IPromise<ISwRecord> {
        let defer = this.$q.defer<ISwRecord>();
        this.showConfirm("確定刪除-" + this.onGetRecordTitle(record) + "嗎?")
            .then(() => {
                this.recordDeleteDo(record, config)
                    .then(x => defer.resolve(record)
                    , () => defer.reject(record)
                    );
            },
            () => {
                defer.reject(record);
            })
            ;
        return defer.promise;
    }

    /**
    * 刪除紀錄執行
    * @param record
    * @param config
    */
    recordDeleteDo(record: ISwRecord, config: any): ng.IPromise<ISwRecord> {
        let defer = this.$q.defer<ISwRecord>();

        this.exeHttpAction(this.onRecordDeleteDo(this.clonedata(record), config), config)
            .then(x => {
                this.Result = x;
                if (x.Result == 'OK') {
                    this.getFocusTab().close();
                    defer.resolve(record);
                }
                else {
                    defer.reject(record);
                }
            });
        return defer.promise;
    }

    /**
    * 執行資料刪除(後代實作)        
    * @param config
    */
    onRecordDeleteDo(record: ISwRecord, config?: any): ng.IHttpPromise<any> {
        return this.$q.resolve<any>({
            data: {
                Result: "NG",
                Message: "no implement onRecordDeleteDo()"
            }
        });
    }

    /**
     * 取得紀錄標題
     * @param record
     */
    onGetRecordTitle(record: ISwRecord) {
        if (record["Name"])
            return record["Name"];
        return "NotImplement onGetRecordTitle() ";
    }

    findRecord(records: ISwRecord[], id: string | number): ISwRecord {
        for (let v of records) {
            if (v.Id == id)
                return v;
        }
        return null;
    }

    findRecordIdx(records: ISwRecord[], id: string | number): number {
        for (let i = 0; i < records.length; i++) {
            if (records[i].Id == id)
                return i;
        }
        return -1;
    }

    /**
   * 重新檢視View
   * @param record
   */
    recordRefresh(record: ISwRecord, config?: any): ng.IPromise<ISwRecord> {

        let defer = this.$q.defer<ISwRecord>();
        let tab = this.getFocusTab();

        this.exeHttpAction(this.onRecordView(record, config), config)
            .then(x => {
                this.onRecordLoaded(x, config);
                this.Result = x;
                if (x.Result == "OK") {

                    x.Record.$State = SwRecordState.None;
                    this.onRecordStateChange(x.Record, SwRecordState.View);
                    if (x.Record.$State as any == SwRecordState.Update) {
                        x.Record.$ViewBak = this.clonedata(x.Record);
                    }
                    tab.Content = x.Record;
                    tab.focus();
                    defer.resolve(x.Record);
                }
                else {
                    tab.close();
                }
            })
            ;
        return defer.promise;
    }
}