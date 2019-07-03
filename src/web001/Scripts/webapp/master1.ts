import { SwBaseCtrl, ISwRecord, ISwPager, ISwLazyLoader, ISwResult, SwRecordState, ISwPageParameter, ISwPageIndex, ISwQryArg_OrderBy } from "./common";

class CStyle {

    /** 多重新增視窗 */
    IsMultiNews: boolean = false;

    /** 多重檢視視窗 */
    IsMultiViews: boolean = false;
}

/**
    * 主檔維護1(就地編輯)
    */
export class SwMaster1Ctrl extends SwBaseCtrl {

    /** 編輯風格 */
    Style: CStyle = new CStyle();

    /** 查詢紀錄集合 */
    Records: ISwRecord[] = [];

    /** 異動的紀錄 */
    RecordsLog: ISwRecord[] = [];

    /** 異動的紀錄增減的筆數 */
    RecordsLogAttachCount: number = 0;

    /** 新增紀錄集合 */
    NewRecords: ISwRecord[] = [];


    /**分頁設定*/
    Pager: ISwPager = {
        Source: null,
        Size: 20,
        Index: 0,
        Count: 0,
        Indexes: [
        ]
    }

    /** 延遲載入 */
    LazyLoader: ISwLazyLoader = {
        Source: null,
        InitCount: 20,
        MoreCount: 10,
        LoadedCount: 0,
        Loading: false,
        Complete: false
    }

    constructor(public $q: ng.IQService, public $scope: ng.IScope) {
        super($q, $scope);
    }

    /**
     * 查詢資料
     * @param config
     */
    query(config?: any): ng.IPromise<ISwResult> {
        this.createTab("List", tab => {
            tab.Title = "列表";
            tab.IsCloseEnable = false;
        }).focus();

        return this.exeHttpAction(this.onQuery(config), config)
            .then(x => {
                this.onQueryLoaded(x, config);
                this.Result = x;
                if (x.Result == "OK") {
                    this.Records = x.Records;
                }
                return x;
            });
    }

    /**
     * 取得查詢結果(後代需實作)
     * @param config
     */
    onQuery(config?: any): ng.IHttpPromise<any> {
        let result: ISwResult = { Result: "NG", Message: "Not Implement onQuery()" };
        return this.$q.resolve<any>({ data: result });
    }

    /**
     * 當查詢資料載入時
     * @param result
     */
    onQueryLoaded(result: ISwResult, config?: any) {
    }

    /**
     * 只更清單中的某一筆紀錄，但若不存在的話新增之。
     * @param record
     * @param origin_state (為什麼要更新只能是幾種原因 1.新增 2.異動 3.刪除)
     */
    queryOne(record: ISwRecord, origin_state: SwRecordState) {

        return this.exeHttpAction(this.onQueryOne(record))
            .then(x => {
                this.onQueryLoaded(x);
                this.Result = x;
                if (x.Result == "OK") {
                    let qrecord = x.Record;
                    if (!qrecord)
                        qrecord = x.Records[0];

                    //使用分頁時，紀錄異動紀錄
                    if (this.Pager.Source) {
                        let r: ISwRecord = this.clonedata(qrecord);
                        r.$State = origin_state;
                        r.$PageIndex = this.Pager.Index;
                        this.RecordsLog.push(r);
                        switch (r.$State) {
                            case SwRecordState.New:
                                this.RecordsLogAttachCount++;
                                break;
                        }
                    }

                    let idx = this.findRecordIdx(this.Records, qrecord.Id);

                    //新增的話那就新增之。
                    if (origin_state == SwRecordState.New) {
                        if (idx >= 0) {
                            this.Records.splice(idx, 1);
                        }
                        this.Records.unshift(qrecord);
                    }
                    //異動的話更新之
                    else {
                        if (idx >= 0) {
                            let qrecord_old = this.Records[idx];
                            for (let p in qrecord) {
                                if (p[0] == '$')
                                    continue;
                                qrecord_old[p] = qrecord[p];
                            }
                        }
                    }
                }

            });
    }

    /**
    * 取得查詢結果(後代需實作)
    * @param config
    */
    onQueryOne(record: ISwRecord): ng.IHttpPromise<any> {
        return this.$q.resolve<any>({            
            data: {
                Result: "OK",
                Message: "Success",
                Record: this.clonedata(record)
            }
        });
    }

    /**
     * 分頁查詢
     * @param pagesize 每頁的Size
     */
    pageQuery(pagesize?: number, config?: any): ng.IPromise<ISwResult> {
        this.createTab("List", tab => {
            tab.Title = "列表";
            tab.IsCloseEnable = false;
        }).focus();

        if (!pagesize)
            pagesize = this.Pager.Size;
        let qp: ISwPageParameter = {};
        qp.pg_idx = 0;
        qp.pg_count = pagesize;
        if (this.Pager.Source)
            qp.pg_oname = this.Pager.Source.Name;


        return this.exeHttpAction(this.onPageQuery(qp, config), config)
            .then(x => {
                this.onQueryLoaded(x, config);
                this.Result = x;
                //success
                if (x.Result == "OK") {
                    this.Records = x.Records;

                    let psource = this.Result.PSource;
                    this.Pager.Source = psource;
                    this.Pager.Size = pagesize;
                    this.Pager.Index = 0;
                    this.Pager.Count = Math.ceil(psource.Count / this.Pager.Size);


                    //清空異動紀錄
                    this.RecordsLog = [];
                    this.RecordsLogAttachCount = 0;

                    this.pageIndexRefresh();
                }
                else {
                    this.onHttpResultError(x, config);
                }
                return x;
            });
    }

    /**
    * 取得查詢結果(後代需實作)
    * @param config
    */
    onPageQuery(pager: ISwPageParameter, config?: any): ng.IHttpPromise<any> {
        let result: ISwResult = { Result: "NG", Message: "Not Implement onPageQuery()" };
        return this.$q.resolve(<any>{ data: result });
    }

    /**
    * 頁面索引更新
    */
    pageIndexRefresh() {

        //{ Name: "«", Index: 0, Enable: false, Active: false },
        //{ Name: "1", Index: 0, Enable: false, Active: true },
        //{ Name: "2", Index: 1, Enable: true, Active: false },
        //{ Name: "3", Index: 2, Enable: true, Active: false },
        //{ Name: "4", Index: 3, Enable: true, Active: false },
        //{ Name: "»", Index: 1, Enable: true, Active: false },          

        let idxs: ISwPageIndex[] = [];

        if (this.Pager.Index > 0) {
            let pidx: ISwPageIndex = { Name: "«", Index: this.Pager.Index - 1, Enable: true, Active: false };
            idxs.push(pidx);
        }
        else {
            let pidx: ISwPageIndex = { Name: "«", Index: 0, Enable: false, Active: false };
            idxs.push(pidx);
        }

        //每個分頁       
        {
            //每段的寬度
            let blockwidth = 3;

            //前段由頁0開始
            let idx = 0;
            for (var i = 0; i < blockwidth; i++) {
                if (idx >= this.Pager.Count)
                    break;

                let pidx: ISwPageIndex = { Name: "" + (idx + 1), Index: idx, Enable: this.Pager.Index != idx, Active: this.Pager.Index == idx };
                idxs.push(pidx);
                idx++;
            }

            //中段約由目前頁開始
            let block1_start = this.Pager.Index - Math.floor(blockwidth / 2);

            //尾段約由目頁尾開始
            let block2_start = (this.Pager.Count - 1) - (blockwidth - 1);

            //頁簽在尾段|段前出現,則中段重新設定
            //if (this.Pager.Index < blockwidth || this.Pager.Index >= block2_start) {
            //    block1_start = Math.floor(this.Pager.Count / 2) - Math.floor(blockwidth / 2);
            //}

            //焦點在前段出現
            if (this.Pager.Index < blockwidth) {
                block1_start = blockwidth + 1;
            }
            //焦點在尾段出現
            else if (this.Pager.Index >= block2_start) {
                block1_start = block2_start - blockwidth - 1;
            }

            //中段蓋到尾段的話,則中段重新設定
            if (block1_start + blockwidth >= block2_start) {
                block1_start = block2_start - blockwidth - 1;
            }

            //中段繪製
            if (idx < block1_start) {
                if (idx + 1 == block1_start) {
                    let pidx: ISwPageIndex = { Name: "" + (idx + 1), Index: idx, Enable: this.Pager.Index != idx, Active: this.Pager.Index == idx };
                    idxs.push(pidx);
                    idx = block1_start;
                }
                else {
                    idx = block1_start;
                    let pidx: ISwPageIndex = { Name: "...", Index: 0, Enable: false, Active: false };
                    idxs.push(pidx);
                }
            }

            for (var i = 0; i < blockwidth; i++) {
                if (idx >= this.Pager.Count)
                    break;

                let pidx: ISwPageIndex = { Name: "" + (idx + 1), Index: idx, Enable: this.Pager.Index != idx, Active: this.Pager.Index == idx };
                idxs.push(pidx);
                idx++;
            }

            //尾段繪製                
            if (idx < block2_start) {
                if (idx + 1 == block2_start) {
                    let pidx: ISwPageIndex = { Name: "" + (idx + 1), Index: idx, Enable: this.Pager.Index != idx, Active: this.Pager.Index == idx };
                    idxs.push(pidx);
                    idx = block2_start;
                }
                else {
                    idx = block2_start;
                    let pidx: ISwPageIndex = { Name: "...", Index: 0, Enable: false, Active: false };
                    idxs.push(pidx);
                }
            }

            for (var i = 0; i < blockwidth; i++) {
                if (idx >= this.Pager.Count)
                    break;

                let pidx: ISwPageIndex = { Name: "" + (idx + 1), Index: idx, Enable: this.Pager.Index != idx, Active: this.Pager.Index == idx };
                idxs.push(pidx);
                idx++;
            }
        }

        if (this.Pager.Index < this.Pager.Count - 1) {
            let pidx: ISwPageIndex = { Name: "»", Index: this.Pager.Index + 1, Enable: true, Active: false };
            idxs.push(pidx);
        }
        else {
            let pidx: ISwPageIndex = { Name: "»", Index: this.Pager.Count - 1, Enable: false, Active: false };
            idxs.push(pidx);
        }
        this.Pager.Indexes = idxs;
    }

    /**
  * 排序欄位
  * @param column
  */
    pageOrderBy(column: string, desc: boolean = false, config?: any) {
        let v = this.QryArgs.OrderBy as ISwQryArg_OrderBy;
        //初始設定
        if (v == null) {
            v = {
                Value: { Column: column, Desc: desc },
                Checked: true
            };
            this.QryArgs.OrderBy = v;
        }
        //已初始
        else {
            //同欄位
            if (v.Value.Column == column) {
                v.Value.Desc = !v.Value.Desc;
            }
            //不同欄位
            else {
                v.Value.Column = column;
                v.Value.Desc = desc;
            }
        }

        //還沒有執行查詢的話就不做任何事
        if (this.Pager.Source == null)
            return;

        //如果有異動資料的話，排序必須重新查詢
        if (this.RecordsLog.length > 0) {
            this.pageQuery(this.Pager.Size, config);
        }
        //沒異動的話由Cache來排序就好
        else {
            let qp: ISwPageParameter = {};
            qp.pg_idx = 0;
            qp.pg_count = this.Pager.Size;
            qp.pg_name = this.Pager.Source.Name;
            qp['OrderBy'] = this.QryArgs.OrderBy.Value;

            //已經有查詢過的話直接要求排序資料即可
            this.exeHttpAction(this.onPageOrderBy(qp, config), config)
                .then(x => {
                    this.onQueryLoaded(x, config);
                    //cache data be cleared
                    if (x.Result == "QP01") {
                        this.Result = { Result: 'OK', Message: '' };
                        this.pageQuery(this.Pager.Size, config);
                        return;
                    }
                    if (x.Result == "OK") {
                        this.Records = x.Records;
                        let psource = this.Result.PSource;
                        this.Pager.Source = psource;
                        this.Pager.Index = 0;
                        this.Pager.Count = Math.ceil(psource.Count / this.Pager.Size);
                        //清空異動紀錄
                        this.RecordsLog = [];
                        this.RecordsLogAttachCount = 0;
                        this.pageIndexRefresh();
                    }
                })
                ;
        }
    }

    /**
    * 取得排序結果(後代需實作)
    * @param config
    */
    onPageOrderBy(qp: ISwPageParameter, config?: any): ng.IHttpPromise<any> {
        let result: ISwResult = { Result: "NG", Message: "Not Implement onPageOrderBy()" };
        return this.$q.resolve<any>({ data: result });
    }

    /**
     * 移動到哪一頁
     * @param pageindex
     */
    pageMove(pageindex: number, config?: any) {

        let qp: ISwPageParameter = {};
        qp.pg_idx = pageindex;
        qp.pg_name = this.Pager.Source.Name;

        return this.exeHttpAction(this.onPageQuery(qp, config), config)
            .then(x => {
                this.onQueryLoaded(x, config);
                this.Result = x;
                //page data been clear
                if (x.Result == "QP01") {
                    //auto requery
                    this.Result = { Result: 'OK', Message: '' };
                    this.pageQuery(this.Pager.Size, config);
                    return;
                }
                //success
                if (x.Result == "OK") {
                    this.Records = x.Records;
                    this.Pager.Index = pageindex;
                    this.pageIndexRefresh();

                    //套用異動的紀錄
                    {
                        for (let r1 of this.RecordsLog) {
                            switch (r1.$State) {
                                case SwRecordState.New:
                                    {
                                        if (r1.$PageIndex == this.Pager.Index) {
                                            let r2: ISwRecord = this.clonedata(r1);
                                            this.Records.unshift(r2);
                                        }
                                    }
                                    break;
                                case SwRecordState.Update:
                                    {
                                        let r2: ISwRecord = this.clonedata(r1);
                                        let idx = this.findRecordIdx(this.Records, r2.Id);
                                        if (idx >= 0) {
                                            this.Records.splice(idx, 1, r2);
                                        }
                                    }
                                    break;
                                case SwRecordState.Delete:
                                    {
                                        let idx = this.findRecordIdx(this.Records, r1.Id);
                                        if (idx >= 0) {
                                            this.Records.splice(idx, 1);
                                        }
                                    }
                                    break;
                            }
                        }
                    }
                }
            });
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
     * 檢視-紀錄內容
     * @param record
     */
    recordView(record: ISwRecord, config?: any): ng.IPromise<ISwRecord> {

        let deffer = this.$q.defer<ISwRecord>();

        let qrecord = this.findRecord(this.Records, record.Id);

        //如果限制只能有一個View的話,Close Others
        if (!this.Style.IsMultiViews) {
            let cv = null;
            for (let v of this.Records) {
                if (v.$SubRecord) {
                    v.$SubRecord = null;
                    cv = v;
                }
            }
            //同一列已顯示中，再按一次表示關閉
            if (cv == qrecord) {
                deffer.reject("direct close it");
                return;
            }
        }

        this.exeHttpAction(this.onRecordView(qrecord, config), config)
            .then(x => {
                this.onRecordLoaded(x, config);
                this.Result = x;
                if (x.Result == "OK") {
                    qrecord.$SubRecord = x.Record;
                    x.Record.$State = SwRecordState.None;
                    this.onRecordStateChange(x.Record, SwRecordState.View);
                    if (x.Record.$State as any == SwRecordState.Update) {
                        x.Record.$ViewBak = this.clonedata(x.Record);
                    }
                    deffer.resolve(x.Record);
                }
                else
                    deffer.reject(qrecord);
            })
            ;

        return deffer.promise;
    }

    /**
     * 重新檢視View
    * @param record
    */
    recordRefresh(record: ISwRecord, config?: any): ng.IPromise<ISwRecord> {

        let defer = this.$q.defer<ISwRecord>();

        //query record
        let qrecord = this.findRecord(this.Records, record.Id);

        //find the record current view             
        let vrecord: ISwRecord = null;
        for (let v of this.Records) {
            if (v.Id == record.Id)
                vrecord = v.$SubRecord;
        }

        //並沒有檢視紀錄，那就只是queryone()即可
        if (vrecord == null) {
            //更新Grid紀錄
            this.queryOne(qrecord, SwRecordState.Update);
            defer.resolve();
        }
        //有檢視紀錄，更新查詢項目與View
        else {
            this.exeHttpAction(this.onRecordView(qrecord, config), config)
                .then(x => {
                    this.onRecordLoaded(x, config);
                    this.Result = x;
                    if (x.Result == "OK") {
                        qrecord.$SubRecord = x.Record;
                        x.Record.$State = SwRecordState.None;
                        this.onRecordStateChange(x.Record, SwRecordState.View);
                        if (x.Record.$State as any == SwRecordState.Update) {
                            x.Record.$ViewBak = this.clonedata(x.Record);
                        }
                        defer.resolve(x.Record);

                        //更新Grid紀錄
                        this.queryOne(qrecord, SwRecordState.Update);
                    }
                    else {
                        defer.reject(qrecord);
                    }
                })
                ;
        }
        return defer.promise;
    }

    /**
     * 取得紀錄內容(後代需實作)
     * @param config
     */
    onRecordView(record: ISwRecord, config?: any): ng.IHttpPromise<any> {
        let newr = angular.copy(record);
        for (let n in newr) {
            if (n[0] == "$")
                newr[n] = null;
        }
        return this.$q.resolve<any>({
            data: {
                Result: "OK",
                Message: "Success",
                Record: newr
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

        //不允許多重新增
        if (this.NewRecords.length > 0 && !this.Style.IsMultiNews) {
            defer.reject('不允許多重新增');
            return defer.promise;
        }

        this.exeHttpAction(this.onRecordNew(config), config)
            .then(x => {
                this.onRecordLoaded(x, config);
                this.Result = x;
                if (x.Result == "OK") {
                    x.Record.$State = SwRecordState.New;
                    this.NewRecords.unshift(x.Record);
                    this.Tabs[0].focus();
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
    * 當資料新增時(後代給予初始值)        
    * @param config
    */
    onRecordNew(config?: any): ng.IHttpPromise<any> {
        let record: ISwRecord = { Id: 0 };
        return this.$q.resolve<any>({
            data: {
                Result: "OK",
                Message: "Success",
                Record: record
            }
        });
    }

    /**
     * 關閉紀錄
     * @param record
     */
    recordClose(record: ISwRecord): ng.IPromise<ISwRecord> {

        let defer = this.$q.defer<ISwRecord>();

        //新增狀態
        if (record.$State == SwRecordState.New) {
            let newidx = this.NewRecords.indexOf(record);
            if (newidx >= 0) {
                this.NewRecords.splice(newidx, 1);
            }
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
        }

        //取消檢視狀態
        if (!record.$State) {
            let qrecord = this.findRecord(this.Records, record.Id);
            if (qrecord)
                qrecord.$SubRecord = null;
        }

        defer.resolve(record);
        return defer.promise;
    }

    /**
    * 紀錄儲存(新增或修改儲存)
    * @param record
    * @param config
    */
    recordSave(record: ISwRecord, config?: any): ng.IPromise<ISwRecord> {
        let defer = this.$q.defer<ISwRecord>();

        let origin_state = record.$State;

        this.exeHttpAction(this.onRecordSave(this.clonedata(record), config), config)
            .then(x => {
                this.onRecordLoaded(x, config);
                this.Result = x;
                if (x.Result != "OK") {
                    defer.reject(x.Result);
                }
                else {
                    let record_new = x.Record;
                    let newidx = this.NewRecords.indexOf(record);
                    //新增
                    if (newidx >= 0) {
                        this.NewRecords.splice(newidx, 1);
                        //放到清單裡面去
                        this.queryOne(record_new, origin_state);
                    }
                    //維護
                    else {
                        //放到清單裡面去
                        this.queryOne(record_new, origin_state)
                            .then(() => {
                                let qrecord = this.findRecord(this.Records, record.Id);
                                qrecord.$SubRecord = record_new;
                                x.Record.$State = record.$State;
                                this.onRecordStateChange(record_new, SwRecordState.View);
                                if (!record_new.$State) {
                                    qrecord.$SubRecord = null;
                                }
                            })
                            ;
                    }
                    defer.resolve(record_new);
                }
            })
            ;
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
                    let idx = this.findRecordIdx(this.Records, record.Id);
                    if (idx >= 0) {
                        this.Records.splice(idx, 1);
                    }
                    //使用分頁時，紀錄異動紀錄
                    if (this.Pager.Source) {
                        let r: ISwRecord = this.clonedata(record);
                        r.$State = SwRecordState.Delete;
                        r.$PageIndex = this.Pager.Index;
                        this.RecordsLog.push(r);
                        this.RecordsLogAttachCount--;
                    }
                    defer.resolve(record);
                }
                else {
                    defer.reject(record);
                }
            })
            ;
        return defer.promise;
    }

    /**
    * 執行資料刪除(後代實作)        
    * @param config
    */
    onRecordDeleteDo(record: ISwRecord, config?: any): ng.IHttpPromise<any> {
        let result: ISwResult = { Result: "NG", Message: "Not Implement onRecordDeleteDo()" };
        return this.$q.resolve<any>({ data: result });
    }

    /**
     * 取得紀錄標題
     * @param record
     */
    onGetRecordTitle(record: ISwRecord) {
        if (record["Name"])
            return record["Name"];
        return "NotImplement onGetRecordTitle()";
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
     * 開始延遲查詢
     */
    lazyQuery(config?: any): ng.IPromise<any> {

        let defer = this.$q.defer<any>();

        this.LazyLoader.Loading = true;

        this.createTab("List", tab => {
            tab.Title = "列表";
            tab.IsCloseEnable = false;
        }).focus();

        let qp: ISwPageParameter = {};
        if (this.LazyLoader.Source) {
            qp.pg_oname = this.LazyLoader.Source.Name;
        }
        qp.pg_idx = 0;
        qp.pg_count = this.LazyLoader.InitCount;

        this.exeHttpAction(this.onLazyQuery(qp, config), config)
            .then(x => {
                this.LazyLoader.Loading = false;
                this.Result = x;
                if (x.Result == "OK") {
                    this.LazyLoader.Source = x.PSource;
                    this.LazyLoader.LoadedCount = x.Records.length;
                    this.LazyLoader.Complete = this.LazyLoader.LoadedCount == this.LazyLoader.Source.Count;
                    this.Records = x.Records;
                    defer.resolve();
                }
                else
                    defer.reject();
            });

        return defer.promise;
    }

    /**
    * 執行資料查詢(後代實作)        
    * @param config
    */
    onLazyQuery(pager: ISwPageParameter, config?: any): ng.IHttpPromise<any> {
        let result: ISwResult = { Result: "NG", Message: "Not Implement onLazyQuery()" };
        return this.$q.resolve<any>({ data: result });
    }

    /**
    * 繼續延遲載入      
    */
    lazyQueryMore(config?: any): ng.IPromise<any> {
        let defer = this.$q.defer<any>();

        if (this.LazyLoader.Loading || this.LazyLoader.Complete) {
            defer.resolve();
            return defer.promise;
        }

        this.LazyLoader.Loading = true;

        this.findTab("List").focus();

        let qp: ISwPageParameter = {};
        qp.pg_name = this.LazyLoader.Source.Name
        qp.pg_idx = this.LazyLoader.LoadedCount;
        qp.pg_count = this.LazyLoader.MoreCount;


        this.exeHttpAction(this.onLazyQueryMore(qp, config), config)
            .then(x => {
                this.LazyLoader.Loading = false;
                this.Result = x;
                //cache data be cleared
                if (x.Result == "QP01") {
                    this.Result = { Result: 'OK', Message: '' };
                    this.lazyQuery(config)
                        .then(() => defer.resolve(), () => defer.reject());
                    return;
                }

                if (x.Result == "OK") {
                    this.LazyLoader.LoadedCount += x.Records.length;
                    this.LazyLoader.Complete = this.LazyLoader.LoadedCount == this.LazyLoader.Source.Count;

                    //add more records
                    for (let r of x.Records) {
                        this.Records.push(r);
                    }
                    defer.resolve();
                }
                else {
                    defer.reject(x.Result);
                }
            });
        return defer.promise;
    }

    /**
   * 執行資料查詢(後代實作)        
   * @param config
   */
    onLazyQueryMore(pager: ISwPageParameter, config?: any): ng.IHttpPromise<any> {
        let result: ISwResult = { Result: "NG", Message: "Not Implement onLazyQueryMore()" };
        return this.$q.resolve<any>({ data: result });
    }


    /**
   延遲載入監聽事件
   */
    private lazyLoaderListener: EventListener = null;

    /**
     * 設定自動延遲載入按鈕
     * @param selector
     * @param delayTime
     */
    lazySetAutoLoadButton(selector: string, delayTime: number = 0) {

        if (this.lazyLoaderListener) {
            window.removeEventListener("scroll", this.lazyLoaderListener);
            this.lazyLoaderListener = null;
        }

        this.lazyLoaderListener = (evt) => {
            if (this.LazyLoader.Complete || this.LazyLoader.Loading)
                return;
            let el: any = document.querySelector(selector);
            if (!el)
                return;
            let elemTop = el.getBoundingClientRect().top;
            let elemBottom = el.getBoundingClientRect().bottom;
            let isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
            if (isVisible) {
                if (!delayTime) {
                    this.lazyQueryMore();
                }
                else {
                    window.setTimeout(this.lazyQueryMore, delayTime);
                }
            }
        };

        //設定事件
        window.addEventListener("scroll", this.lazyLoaderListener);
    }
}