import { ISwRecord, ISwConfig, ISwResult, ISwPageParameter, ISwQryArg, SwDownloadFile, SwRecordState, CommonModule } from "../webapp/common";
import { SwMaster2Ctrl } from "../webapp/master2";
import { Sys010Module } from "../webapp.sys/sys010";

/*
      Record
   */
interface IRecord extends ISwRecord {
    CreateDate?: Date;
    No?: string;
    Name?: string;
    Note?: string;
}

/**
 * copd個案摘要
 */
class Copd003Ctrl extends SwMaster2Ctrl {

    /** The Init Data*/
    FormInit = {
        Gateways: [{ Id: 1, Name: "ASUS" }],
    };

    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $filter: ng.IFilterService, public $scope: ng.IScope) {
        super($q, $scope);

        this.formInit();

        //this.QryArgs.Date1 = <ISwQryArg>{ Value: this.getToday(-7), Checked: true };

        //初始排序條件
        this.pageOrderBy('註冊日', true);

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

    onRecordView(record: IRecord, config?: any): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { Id: record.Id } });
    }

    onRecordLoaded(result: ISwResult, config?: any) {
        if (result.Result == "OK") {
            let record = <IRecord>result.Record;
            record.CreateDate = new Date(<any>record.CreateDate);
        }
    }

    onRecordSave(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_save", record);
    }

    onGetRecordTitle(record: IRecord) {
        return `${record.No}-${record.Name}`;
    }

    onRecordDeleteDo(record: IRecord): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/data_delete", null, { params: { Id: record.Id } });
    }
}

/*
     Record
  */
interface IRecord_Vs extends ISwRecord {
    //CreateDate?: Date;
    //No?: string;
    //Name?: string;
    //Note?: string;
}

/**
 * 生理訊號
 */
export class VsCtrl extends SwMaster2Ctrl {


    MemberId: string;

    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $filter: ng.IFilterService, public $scope: ng.IScope) {
        super($q, $scope);

        //初始排序條件
        this.pageOrderBy('量測時間', true);

        this.pageQuery(10);
    }

    onPageOrderBy(qp: ISwPageParameter): ng.IPromise<{}> {

        return this.$http.post(this.Config.AppPath + "/Vs_pageorderby", null, { params: qp });
    }

    onPageQuery(pager: ISwPageParameter): ng.IHttpPromise<{}> {
        for (let v in this.QryArgs) {
            let v1 = this.QryArgs[v] as ISwQryArg;
            if (v1.Checked) {
                pager[v] = v1.Value;
            }
        }
        pager["memberId"] = this.$scope.$parent.record.Id;

        return this.$http.post(this.Config.AppPath + "/Vs_pagequery", null, { params: pager });
    }
}

declare var Chart: {
    new(context: any, data: any): any;
    //defaults: {
    //    global: ChartSettings;
    //}
};

interface ITooltip {
    /** X value of tooltips as a string*/
    xLabel: string,

    /** Y value of the tooltip as a string*/
    yLabel: string,

    /* Index of the dataset the item comes from */
    datasetIndex: number,

    /** Index of this data item in the dataset*/
    index: number,

    /** X position of matching point*/
    x: number,

    /** Y position of matching point*/
    y: number,
}

/**
規劃
*/
class GraphConfig {

    /**滑動條*/
    Slider = {
        value: 0,
        options: {
            floor: 0,
            ceil: 20,
            step: 1,
            minLimit: 0,
            maxLimit: 20,
            onChange: null,
            //onChange: (a, b, c, d) => void
            //<rzslider rz-slider - model="ctl.Slider.value" rz- slider - options="ctl.Slider.options"></rzslider>
        }
    }

    /**圖表資料*/
    GraphData = {
        type: 'line',
        data: {
            //labels: ["12:11", "12:12", "12:13", "12:14", "12:15", "12:16", "12:17", "12:18", "12:19", "12:20", "12:21", "12:22"],
            datasets: [
                {
                    label: '血氧',
                    pointStyle: 'triangle',
                    data: [{ x: new Date(), y: 99 }],
                    backgroundColor: 'white',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 0.5,
                    fill: false,
                },
                {
                    label: '脈搏',
                    pointStyle: 'rectRounded',
                    data: [{ x: new Date(), y: 99 }],
                    backgroundColor: 'white',
                    borderColor: 'green',
                    borderWidth: 0.5,
                    fill: false,
                }
            ]
        },
        options: {
            title: {
                display: true,
                position: 'top',
                fontColor: 'black',
                text: 'Custom Chart Title'
            },
            legend: {
                display: true,
                position: 'top',
                labels: {
                    fontColor: 'black'
                }
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        displayFormats: {
                            second: 'mm:ss'
                        },
                        unit: 'second',
                        min: new Date(),
                        max: new Date()
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: <any>false
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    title: function (tooltipItems: ITooltip[], chart) {
                        return "";
                        //let item = tooltipItems[0];
                        //let date = <Date>chart.datasets[0].data[item.index].x;
                        //return (date.getMinutes() + 100).toString().substr(1, 2) + ":" + (date.getSeconds() + 100).toString().substr(1, 2);
                    },
                    label: function (item: ITooltip, chart) {
                        if (item.datasetIndex == 0)
                            return "血氧:" + chart.datasets[0].data[item.index].y + " 脈搏:" + chart.datasets[1].data[item.index].y;
                        else
                            return "脈博" + chart.datasets[1].data[item.index].y + " 血氧:" + chart.datasets[0].data[item.index].y;
                    }
                }
            }
        }
    };


    /** Graph Object*/
    Chart: any;

    /** 圖片放大為幾張 1=一張就看完 2 =兩張就看完 4=四張 6=六張**/
    Zoom: number = 1;

    /** 每張圖時間長度 **/
    ZoomTimeStep: number = 0;

    constructor(public record: IRecord_Bo) {
        this.GraphData.options.tooltips.callbacks.title = (tooltipItems: ITooltip[], chart) => {
            let item = tooltipItems[0];
            let date = <Date>chart.datasets[0].data[item.index].x;
            let date2 = new Date(record.VsTimeStart.getTime() + date.getMinutes() * 60000 + date.getSeconds() * 1000);
            return (date2.getHours() + 100).toString().substr(1, 2) + ":" + (date2.getMinutes() + 100).toString().substr(1, 2) + ":" + (date2.getSeconds() + 100).toString().substr(1, 2);
        };
    }
}

/*
  Record
*/
interface IRecord_Bo extends ISwRecord {

    VsTimeStart?: Date;
    $Graph?: GraphConfig;
    VV_TIME?: number[];
    VV_SOP2?: number[];
    VV_PULSE: number[];
}

/**
 * 旺北-血氧量測記錄
 */
class BoCtrl extends SwMaster2Ctrl {

    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $timeout: ng.ITimeoutService, public $scope: ng.IScope, public $filter: ng.IFilterService) {
        super($q, $scope);

        //初始排序設定
        this.pageOrderBy('量測時間', true);

        this.pageQuery(10);
    }

    onPageQuery(pager: ISwPageParameter): ng.IHttpPromise<{}> {
        for (let v in this.QryArgs) {
            let v1 = this.QryArgs[v] as ISwQryArg;
            if (v1.Checked) {
                pager[v] = v1.Value;
            }
        }
        pager["memberId"] = this.$scope.$parent.record.Id;
        return this.$http.post(this.Config.AppPath + "/Bo_pagequery", null, { params: pager });
    }

    onPageOrderBy(qp: ISwPageParameter): ng.IPromise<{}> {
        return this.$http.post(this.Config.AppPath + "/Bo_pageorderby", null, { params: qp });
    }

    recordView(record: ISwRecord, config?: any): ng.IPromise<ISwRecord> {
        let a = super.recordView(record, config);
        a.then(x => {
            let r1 = x as IRecord_Bo;

            r1.$Graph = new GraphConfig(r1);

            //graph data init
            {
                let vv1 = r1.$Graph.GraphData.data.datasets[0].data; //bo
                let vv2 = r1.$Graph.GraphData.data.datasets[1].data; //pulse
                vv1.splice(0, vv1.length);
                vv2.splice(0, vv2.length);

                let time = new Date();
                time = new Date(time.getFullYear(), time.getMonth(), time.getDate());

                let prv = -1;
                for (let idx = 0; idx < r1.VV_TIME.length; idx++) {
                    let t = r1.VV_TIME[idx];
                    if (t == prv)
                        continue;
                    prv = t;

                    let o = r1.VV_SOP2[idx];
                    let p = r1.VV_PULSE[idx];
                    vv1.push({ x: new Date(time.getTime() + 1000 * t), y: o });
                    vv2.push({ x: new Date(time.getTime() + 1000 * t), y: p });
                }

                let xAxes = r1.$Graph.GraphData.options.scales.xAxes[0];
                xAxes.time.min = vv1[0].x;
                xAxes.time.max = vv1[vv1.length - 1].x;

                r1.$Graph.GraphData.options.title.text = `${this.$filter('date')(r1.VsTimeStart, 'yyyy/MM/dd HH:mm')}`;
            }

            {
                r1.$Graph.Slider.options.onChange = (a, b, c, d) => this.onSliderChange(a, b, c, d);
            }

            this.$timeout(500).then(() => this.graphShow());

            //this.$scope.$watch(() => angular.element("#TheChart_" + r1.Id).is(':visible'),
            //    (nv, ov) => {
            //        if (nv == true && ov == false)
            //            this.graphShow();
            //    }
            //);

        });
        return a;
    }

    /**
    * 放大
    * @param record
    */
    zoomin(record: IRecord_Bo) {

        let zoom = record.$Graph.Zoom;
        let zoom0 = zoom;
        switch (zoom) {
            case 1:
                zoom = 5;
                break;
            case 5:
                zoom = 10;
                break;
        }

        let dataset = record.$Graph.GraphData.data.datasets[0];
        let min = dataset.data[0].x;
        let max = dataset.data[dataset.data.length - 1].x;
        let step = (max.getTime() - min.getTime() + 1) / zoom;

        record.$Graph.Zoom = zoom;
        record.$Graph.ZoomTimeStep = step;
        this.onSliderChange(null, record.$Graph.Slider.value, null, null);
    }

    /**
    * 縮小
    * @param record
    */
    zoomout(record: IRecord_Bo) {

        let zoom = record.$Graph.Zoom;
        if (zoom == 1)
            return;
        let zoom0 = zoom;
        switch (zoom) {
            case 5:
                zoom = 1;
                break;
            case 10:
                zoom = 5;
                break;
        }

        let dataset = record.$Graph.GraphData.data.datasets[0];
        let min = dataset.data[0].x;
        let max = dataset.data[dataset.data.length - 1].x;
        let step = (max.getTime() - min.getTime() + 1) / zoom;

        record.$Graph.Zoom = zoom;
        record.$Graph.ZoomTimeStep = step;
        this.onSliderChange(null, record.$Graph.Slider.value, null, null);
    }

    graphShow() {
        let r1 = this.getFocusTab().Content as IRecord_Bo;
        let c = <any>document.getElementById("TheChart_" + r1.Id);
        let ctx = c.getContext('2d');
        r1.$Graph.Chart = new Chart(ctx, r1.$Graph.GraphData);
    }

    onSliderChange(sliderId: string, modelValue: number, highValue: number, pointerType: string) {

        let r1 = this.getFocusTab().Content as IRecord_Bo;

        if (r1.$Graph.Zoom == 1) {
            let xAxes = r1.$Graph.GraphData.options.scales.xAxes[0];
            let vv1 = r1.$Graph.GraphData.data.datasets[0].data;
            xAxes.time.min = vv1[0].x;
            xAxes.time.max = vv1[vv1.length - 1].x;
            r1.$Graph.Chart.update({ lazy: false, duration: 0 });
        }
        else {
            let xAxes = r1.$Graph.GraphData.options.scales.xAxes[0];
            let vv1 = r1.$Graph.GraphData.data.datasets[0].data; //bo
            let len = r1.$Graph.ZoomTimeStep;
            let min = vv1[0].x.getTime();
            let max = vv1[vv1.length - 1].x.getTime();
            let start = (max - min + 1) * (modelValue / r1.$Graph.Slider.options.ceil) + min;
            if ((start + len) > max) {
                start = max - len;
            }
            xAxes.time.min = new Date(start);
            xAxes.time.max = new Date(start + len);
            r1.$Graph.Chart.update({ lazy: false, duration: 0 });
        }
    }

    onRecordView(record: IRecord_Bo): ng.IHttpPromise<{}> {
        return this.$http.post(this.Config.AppPath + "/bo_get", null, { params: { id: record.Id } });
    }

    onRecordLoaded(result: ISwResult, config?: any) {
        if (result.Result == "OK") {
            let record = <IRecord_Bo>result.Record;
            record.VsTimeStart = new Date(<any>record.VsTimeStart);
        }
    }

    onGetRecordTitle(record: IRecord_Bo) {
        return `${record.VsTimeStart.getFullYear()}/${record.VsTimeStart.getMonth() + 1}/${record.VsTimeStart.getDate()}`;
    }

    download(record: IRecord_Bo) {
        let ctl = new SwDownloadFile();
        ctl.getFile(this.Config.AppPath + "/Bo_Download", { id: record.Id });
    }
}

/*
    Record
 */
interface IRecord_Scale extends ISwRecord {
    TheDate?: Date;
    MemberNo?: string;
    MemberName?: string;
    Content?: any;
}

/**
 * copd評量表清冊
 */
class ScaleCtrl extends SwMaster2Ctrl {

    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $filter: ng.IFilterService, public $scope: ng.IScope) {
        super($q, $scope);

        //初始排序條件
        this.pageOrderBy('日期', true);

        this.pageQuery(10);
    }

    onPageOrderBy(qp: ISwPageParameter): ng.IPromise<{}> {
        return this.$http.post(this.Config.AppPath + "/scale_pageorderby", null, { params: qp });
    }

    onPageQuery(pager: ISwPageParameter): ng.IHttpPromise<{}> {
        for (let v in this.QryArgs) {
            let v1 = this.QryArgs[v] as ISwQryArg;
            if (v1.Checked) {
                pager[v] = v1.Value;
            }
        }
        pager["memberId"] = this.$scope.$parent.record.Id;
        return this.$http.post(this.Config.AppPath + "/scale_pagequery", null, { params: pager });
    }

    onRecordView(record: IRecord_Scale, config?: any): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/scale_get", null, { params: { Id: record.Id } });
    }

    onRecordLoaded(result: ISwResult, config?: any) {
        if (result.Result == "OK") {
            let record = <IRecord_Scale>result.Record;
            record.TheDate = new Date(<any>record.TheDate);
            record.Content = angular.fromJson(record.Content);
        }
    }

    onGetRecordTitle(record: IRecord_Scale) {
        return `${this.$filter('date')(record.TheDate, 'yyyy/MM/dd')}`;
    }
}

/*
      Record
   */
interface IRecord_Video extends ISwRecord {
    //CreateDate?: Date;
    //No?: string;
    //Name?: string;
    //Note?: string;
}

/**
 * Video訊號
 */
class VideoCtrl extends SwMaster2Ctrl {


    MemberId: string;

    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $filter: ng.IFilterService, public $scope: ng.IScope) {
        super($q, $scope);

        //初始排序條件
        this.pageOrderBy('錄製時間', true);

        this.pageQuery(10);
    }

    onPageOrderBy(qp: ISwPageParameter): ng.IPromise<{}> {

        return this.$http.post(this.Config.AppPath + "/Video_pageorderby", null, { params: qp });
    }

    onPageQuery(pager: ISwPageParameter): ng.IHttpPromise<{}> {
        for (let v in this.QryArgs) {
            let v1 = this.QryArgs[v] as ISwQryArg;
            if (v1.Checked) {
                pager[v] = v1.Value;
            }
        }
        pager["memberId"] = this.$scope.$parent.record.Id;

        return this.$http.post(this.Config.AppPath + "/Video_pagequery", null, { params: pager });
    }
}

/*
     Record
  */
interface IRecord_Note extends ISwRecord {
    Created?: Date;
    MemberId?: number;
}

/**
 * 日誌
 */
class NoteCtrl extends SwMaster2Ctrl {

    constructor(public $http: ng.IHttpService, public Config: ISwConfig, public $q: ng.IQService, public $scope: ng.IScope, public $filter: ng.IFilterService, ) {
        super($q, $scope);

        //初始排序條件
        this.pageOrderBy('日期', true);
        this.pageQuery();
    }

    onQueryOne(record: IRecord_Note): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/note_query", null, { params: { Id: record.Id } });
    }

    onPageOrderBy(qp: ISwPageParameter): ng.IPromise<{}> {

        return this.$http.post(this.Config.AppPath + "/note_pageorderby", null, { params: qp });
    }

    onPageQuery(pager: ISwPageParameter): ng.IHttpPromise<{}> {
        for (let v in this.QryArgs) {
            let v1 = this.QryArgs[v] as ISwQryArg;
            if (v1.Checked) {
                pager[v] = v1.Value;
            }
        }
        pager["memberId"] = this.$scope.$parent.record.Id;

        return this.$http.post(this.Config.AppPath + "/note_pagequery", null, { params: pager });
    }

    onRecordView(record: IRecord_Note): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/note_get", null, { params: { Id: record.Id } });
    }

    onRecordSave(record: IRecord_Note): ng.IHttpPromise<any> {
        record.MemberId = this.$scope.$parent.record.Id;
        return this.$http.post(this.Config.AppPath + "/note_save", record);
    }

    onRecordDeleteDo(record: IRecord_Note): ng.IHttpPromise<any> {
        return this.$http.post(this.Config.AppPath + "/note_delete", null, { params: { Id: record.Id } });
    }

    onGetRecordTitle(record: IRecord_Note) {
        if (!record.Id)
            return '新日誌';
        return `${this.$filter('date')(record.Created, 'yyyy/MM/dd')}`;
    }

    onRecordStateChange(record: ISwRecord, state: SwRecordState) {
        ////檢視直接進編輯
        //if (!record.$State && state == SwRecordState.View) {
        //    record.$State = SwRecordState.Update;
        //}
        //編輯完成直接關閉
        //else
        if (record.$State == SwRecordState.New && state == SwRecordState.View) {
            record.$State = SwRecordState.None;
        }
        else
            record.$State = state;
    }
}

/**
 * App Start
 */
export function startApp(sitepath, apppath) {
    angular.module("app", [CommonModule, Sys010Module, 'rzModule']).constant('Config', {
        SitePath: sitepath,
        AppPath: apppath
    })
    angular.module("app")
        .config(($qProvider) => {
            $qProvider.errorOnUnhandledRejections(false);
        })
        .controller('MainCtrl', Copd003Ctrl)
        .controller('VsCtrl', VsCtrl)
        .controller('VideoCtrl', VideoCtrl)
        .controller('BoCtrl', BoCtrl)
        .controller('ScaleCtrl', ScaleCtrl)
        .controller('NoteCtrl', NoteCtrl)
        .run(() => {
        })
        ;

    angular.bootstrap(document, ['app']);
};
