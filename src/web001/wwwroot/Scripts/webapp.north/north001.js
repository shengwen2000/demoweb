var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../webapp/common", "../webapp/master2", "../webapp.sys/sys010"], function (require, exports, common_1, master2_1, sys010_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
    規劃
    */
    var GraphConfig = /** @class */ (function () {
        function GraphConfig() {
            /**滑動條*/
            this.Slider = {
                value: 0,
                options: {
                    floor: 0,
                    ceil: 20,
                    step: 1,
                    minLimit: 0,
                    maxLimit: 20,
                    onChange: null,
                }
            };
            /**圖表資料*/
            this.GraphData = {
                type: 'line',
                data: {
                    //labels: ["12:11", "12:12", "12:13", "12:14", "12:15", "12:16", "12:17", "12:18", "12:19", "12:20", "12:21", "12:22"],
                    datasets: [
                        {
                            label: '血氧',
                            pointStyle: 'triangle',
                            data: [{ x: new Date(), y: 99 }],
                            //backgroundColor: 'rgba(255, 99, 132, 0.1)',
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
                            //backgroundColor: 'rgba(100, 11, 64, 0.1)',
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
                                        second: 'mm:ss',
                                    },
                                    unit: 'second',
                                    min: new Date(),
                                    max: new Date()
                                }
                            }],
                        yAxes: [{
                                ticks: {
                                    beginAtZero: false
                                }
                            }]
                    },
                    tooltips: {
                        callbacks: {
                            title: function (tooltipItems, chart) {
                                var item = tooltipItems[0];
                                var date = chart.datasets[0].data[item.index].x;
                                return (date.getMinutes() + 100).toString().substr(1, 2) + ":" + (date.getSeconds() + 100).toString().substr(1, 2);
                            },
                            label: function (item, chart) {
                                if (item.datasetIndex == 0)
                                    return "血氧:" + chart.datasets[0].data[item.index].y + " 脈搏:" + chart.datasets[1].data[item.index].y;
                                else
                                    return "脈博" + chart.datasets[1].data[item.index].y + " 血氧:" + chart.datasets[0].data[item.index].y;
                            }
                        }
                    }
                }
            };
            /** 圖片放大為幾張 1=一張就看完 2 =兩張就看完 4=四張 6=六張**/
            this.Zoom = 1;
            /** 每張圖時間長度 **/
            this.ZoomTimeStep = 0;
        }
        return GraphConfig;
    }());
    /**
     * 旺北-血氧量測記錄
     */
    var NORTH001Ctrl = /** @class */ (function (_super) {
        __extends(NORTH001Ctrl, _super);
        function NORTH001Ctrl($http, Config, $q, $timeout, $scope, $filter) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$timeout = $timeout;
            _this.$scope = $scope;
            _this.$filter = $filter;
            /** The Init Data*/
            _this.FormInit = {
                Depts: { Id: 1, Name: "Dept1" }
            };
            //this.formInit();
            _this.QryArgs.Date1 = { Value: _this.getToday(-14), Checked: true };
            //初始排序設定
            _this.pageOrderBy('日期', true);
            _this.pageQuery(30);
            return _this;
        }
        NORTH001Ctrl.prototype.onPageQuery = function (pager) {
            for (var v in this.QryArgs) {
                var v1 = this.QryArgs[v];
                if (v1.Checked) {
                    pager[v] = v1.Value;
                }
            }
            return this.$http.post(this.Config.AppPath + "/data_pagequery", null, { params: pager });
        };
        NORTH001Ctrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/data_pageorderby", null, { params: qp });
        };
        NORTH001Ctrl.prototype.onQueryOne = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_query", null, { params: { id: record.Id } });
        };
        NORTH001Ctrl.prototype.recordView = function (record, config) {
            var _this = this;
            var a = _super.prototype.recordView.call(this, record, config);
            a.then(function (x) {
                var r1 = x;
                r1.$Graph = new GraphConfig();
                //graph data init
                {
                    var vv1 = r1.$Graph.GraphData.data.datasets[0].data; //bo
                    var vv2 = r1.$Graph.GraphData.data.datasets[1].data; //pulse
                    vv1.splice(0, vv1.length);
                    vv2.splice(0, vv2.length);
                    var time = new Date();
                    time = new Date(time.getFullYear(), time.getMonth(), time.getDate());
                    var prv = -1;
                    for (var idx = 0; idx < r1.VV_TIME.length; idx++) {
                        var t = r1.VV_TIME[idx];
                        if (t == prv)
                            continue;
                        prv = t;
                        var o = r1.VV_SOP2[idx];
                        var p = r1.VV_PULSE[idx];
                        vv1.push({ x: new Date(time.getTime() + 1000 * t), y: o });
                        vv2.push({ x: new Date(time.getTime() + 1000 * t), y: p });
                    }
                    var xAxes = r1.$Graph.GraphData.options.scales.xAxes[0];
                    xAxes.time.min = vv1[0].x;
                    xAxes.time.max = vv1[vv1.length - 1].x;
                    r1.$Graph.GraphData.options.title.text = r1.MemberName + "@" + _this.$filter('date')(r1.VsTimeStart, 'yyyy/MM/dd HH:mm');
                }
                {
                    r1.$Graph.Slider.options.onChange = function (a, b, c, d) { return _this.onSliderChange(a, b, c, d); };
                }
                //delay for wait graph ready
                _this.$timeout(500).then(function () { return _this.graphShow(); });
            });
            return a;
        };
        /**
         * 放大
         * @param record
         */
        NORTH001Ctrl.prototype.zoomin = function (record) {
            var zoom = record.$Graph.Zoom;
            var zoom0 = zoom;
            switch (zoom) {
                case 1:
                    zoom = 3;
                    break;
                case 3:
                    zoom = 9;
                    break;
            }
            var dataset = record.$Graph.GraphData.data.datasets[0];
            var min = dataset.data[0].x;
            var max = dataset.data[dataset.data.length - 1].x;
            var step = (max.getTime() - min.getTime() + 1) / zoom;
            record.$Graph.Zoom = zoom;
            record.$Graph.ZoomTimeStep = step;
            this.onSliderChange(null, record.$Graph.Slider.value, null, null);
        };
        /**
        * 縮小
        * @param record
        */
        NORTH001Ctrl.prototype.zoomout = function (record) {
            var zoom = record.$Graph.Zoom;
            if (zoom == 1)
                return;
            var zoom0 = zoom;
            switch (zoom) {
                case 3:
                    zoom = 1;
                    break;
                case 9:
                    zoom = 3;
                    break;
            }
            var dataset = record.$Graph.GraphData.data.datasets[0];
            var min = dataset.data[0].x;
            var max = dataset.data[dataset.data.length - 1].x;
            var step = (max.getTime() - min.getTime() + 1) / zoom;
            record.$Graph.Zoom = zoom;
            record.$Graph.ZoomTimeStep = step;
            this.onSliderChange(null, record.$Graph.Slider.value, null, null);
        };
        NORTH001Ctrl.prototype.graphShow = function () {
            var r1 = this.getFocusTab().Content;
            var c = document.getElementById("TheChart_" + r1.Id);
            var ctx = c.getContext('2d');
            r1.$Graph.Chart = new Chart(ctx, r1.$Graph.GraphData);
        };
        NORTH001Ctrl.prototype.onSliderChange = function (sliderId, modelValue, highValue, pointerType) {
            var r1 = this.getFocusTab().Content;
            if (r1.$Graph.Zoom == 1) {
                var xAxes = r1.$Graph.GraphData.options.scales.xAxes[0];
                var vv1 = r1.$Graph.GraphData.data.datasets[0].data;
                xAxes.time.min = vv1[0].x;
                xAxes.time.max = vv1[vv1.length - 1].x;
                r1.$Graph.Chart.update({ lazy: false, duration: 0 });
            }
            else {
                var xAxes = r1.$Graph.GraphData.options.scales.xAxes[0];
                var vv1 = r1.$Graph.GraphData.data.datasets[0].data; //bo
                var len = r1.$Graph.ZoomTimeStep;
                var min = vv1[0].x.getTime();
                var max = vv1[vv1.length - 1].x.getTime();
                var start = (max - min + 1) * (modelValue / r1.$Graph.Slider.options.ceil) + min;
                if ((start + len) > max) {
                    start = max - len;
                }
                xAxes.time.min = new Date(start);
                xAxes.time.max = new Date(start + len);
                r1.$Graph.Chart.update({ lazy: false, duration: 0 });
            }
        };
        NORTH001Ctrl.prototype.onRecordView = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { id: record.Id } });
        };
        NORTH001Ctrl.prototype.onRecordSave = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_save", record);
        };
        NORTH001Ctrl.prototype.onRecordLoaded = function (result, config) {
            if (result.Result == "OK") {
                var record = result.Record;
                record.TheDate = new Date(record.TheDate);
                record.VsTimeStart = new Date(record.VsTimeStart);
            }
        };
        NORTH001Ctrl.prototype.onGetRecordTitle = function (record) {
            return record.MemberName + "@" + record.TheDate.getFullYear() + "/" + (record.TheDate.getMonth() + 1) + "/" + record.TheDate.getDate();
        };
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
        //onRecordDeleteDo(record: IRecord): ng.IHttpPromise<{}> {
        //    return this.$http.post(this.Config.AppPath + "/data_delete", null, { params: {id:record.Id}});
        //}
        /**
         * 取得初始資料
         */
        NORTH001Ctrl.prototype.formInit = function () {
            var _this = this;
            var a = this.exeHttpAction(this.$http.post(this.Config.AppPath + "/formInit", null));
            a.then(function (x) {
                if (x.Result == "OK") {
                    _this.FormInit = x.Record;
                }
            });
            return a;
        };
        return NORTH001Ctrl;
    }(master2_1.SwMaster2Ctrl));
    /**
     * App Start
     */
    function startApp(sitepath, apppath) {
        angular.module("app", [common_1.CommonModule, sys010_1.Sys010Module, 'rzModule']).constant('Config', {
            SitePath: sitepath,
            AppPath: apppath
        });
        angular.module("app")
            .config(function ($qProvider) {
            $qProvider.errorOnUnhandledRejections(false);
        })
            .controller('MainCtrl', NORTH001Ctrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=north001.js.map