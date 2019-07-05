var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
     * copd個案摘要
     */
    var Copd003Ctrl = /** @class */ (function (_super) {
        __extends(Copd003Ctrl, _super);
        function Copd003Ctrl($http, Config, $q, $filter, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$filter = $filter;
            _this.$scope = $scope;
            /** The Init Data*/
            _this.FormInit = {
                Gateways: [{ Id: 1, Name: "ASUS" }],
            };
            _this.formInit();
            //this.QryArgs.Date1 = <ISwQryArg>{ Value: this.getToday(-7), Checked: true };
            //初始排序條件
            _this.pageOrderBy('註冊日', true);
            _this.pageQuery(50);
            return _this;
        }
        /**
         * 取得初始資料
         */
        Copd003Ctrl.prototype.formInit = function () {
            var _this = this;
            var a = this.exeHttpAction(this.$http.post(this.Config.AppPath + "/formInit", null));
            a.then(function (x) {
                if (x.Result == "OK") {
                    _this.FormInit = x.Record;
                }
            });
            return a;
        };
        Copd003Ctrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/data_pageorderby", null, { params: qp });
        };
        Copd003Ctrl.prototype.onPageQuery = function (pager) {
            for (var v in this.QryArgs) {
                var v1 = this.QryArgs[v];
                if (v1.Checked) {
                    pager[v] = v1.Value;
                }
            }
            return this.$http.post(this.Config.AppPath + "/data_pagequery", null, { params: pager });
        };
        Copd003Ctrl.prototype.onRecordView = function (record, config) {
            return this.$http.post(this.Config.AppPath + "/data_get", null, { params: { Id: record.Id } });
        };
        Copd003Ctrl.prototype.onRecordLoaded = function (result, config) {
            if (result.Result == "OK") {
                var record = result.Record;
                record.CreateDate = new Date(record.CreateDate);
            }
        };
        Copd003Ctrl.prototype.onRecordSave = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_save", record);
        };
        Copd003Ctrl.prototype.onGetRecordTitle = function (record) {
            return record.No + "-" + record.Name;
        };
        Copd003Ctrl.prototype.onRecordDeleteDo = function (record) {
            return this.$http.post(this.Config.AppPath + "/data_delete", null, { params: { Id: record.Id } });
        };
        return Copd003Ctrl;
    }(master2_1.SwMaster2Ctrl));
    /**
     * 生理訊號
     */
    var VsCtrl = /** @class */ (function (_super) {
        __extends(VsCtrl, _super);
        function VsCtrl($http, Config, $q, $filter, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$filter = $filter;
            _this.$scope = $scope;
            //初始排序條件
            _this.pageOrderBy('量測時間', true);
            _this.pageQuery(10);
            return _this;
        }
        VsCtrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/Vs_pageorderby", null, { params: qp });
        };
        VsCtrl.prototype.onPageQuery = function (pager) {
            for (var v in this.QryArgs) {
                var v1 = this.QryArgs[v];
                if (v1.Checked) {
                    pager[v] = v1.Value;
                }
            }
            pager["memberId"] = this.$scope.$parent.record.Id;
            return this.$http.post(this.Config.AppPath + "/Vs_pagequery", null, { params: pager });
        };
        return VsCtrl;
    }(master2_1.SwMaster2Ctrl));
    exports.VsCtrl = VsCtrl;
    /**
    規劃
    */
    var GraphConfig = /** @class */ (function () {
        function GraphConfig(record) {
            this.record = record;
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
                                    beginAtZero: false
                                }
                            }]
                    },
                    tooltips: {
                        callbacks: {
                            title: function (tooltipItems, chart) {
                                return "";
                                //let item = tooltipItems[0];
                                //let date = <Date>chart.datasets[0].data[item.index].x;
                                //return (date.getMinutes() + 100).toString().substr(1, 2) + ":" + (date.getSeconds() + 100).toString().substr(1, 2);
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
            this.GraphData.options.tooltips.callbacks.title = function (tooltipItems, chart) {
                var item = tooltipItems[0];
                var date = chart.datasets[0].data[item.index].x;
                var date2 = new Date(record.VsTimeStart.getTime() + date.getMinutes() * 60000 + date.getSeconds() * 1000);
                return (date2.getHours() + 100).toString().substr(1, 2) + ":" + (date2.getMinutes() + 100).toString().substr(1, 2) + ":" + (date2.getSeconds() + 100).toString().substr(1, 2);
            };
        }
        return GraphConfig;
    }());
    /**
     * 旺北-血氧量測記錄
     */
    var BoCtrl = /** @class */ (function (_super) {
        __extends(BoCtrl, _super);
        function BoCtrl($http, Config, $q, $timeout, $scope, $filter) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$timeout = $timeout;
            _this.$scope = $scope;
            _this.$filter = $filter;
            //初始排序設定
            _this.pageOrderBy('量測時間', true);
            _this.pageQuery(10);
            return _this;
        }
        BoCtrl.prototype.onPageQuery = function (pager) {
            for (var v in this.QryArgs) {
                var v1 = this.QryArgs[v];
                if (v1.Checked) {
                    pager[v] = v1.Value;
                }
            }
            pager["memberId"] = this.$scope.$parent.record.Id;
            return this.$http.post(this.Config.AppPath + "/Bo_pagequery", null, { params: pager });
        };
        BoCtrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/Bo_pageorderby", null, { params: qp });
        };
        BoCtrl.prototype.recordView = function (record, config) {
            var _this = this;
            var a = _super.prototype.recordView.call(this, record, config);
            a.then(function (x) {
                var r1 = x;
                r1.$Graph = new GraphConfig(r1);
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
                    r1.$Graph.GraphData.options.title.text = "" + _this.$filter('date')(r1.VsTimeStart, 'yyyy/MM/dd HH:mm');
                }
                {
                    r1.$Graph.Slider.options.onChange = function (a, b, c, d) { return _this.onSliderChange(a, b, c, d); };
                }
                _this.$timeout(500).then(function () { return _this.graphShow(); });
                //this.$scope.$watch(() => angular.element("#TheChart_" + r1.Id).is(':visible'),
                //    (nv, ov) => {
                //        if (nv == true && ov == false)
                //            this.graphShow();
                //    }
                //);
            });
            return a;
        };
        /**
        * 放大
        * @param record
        */
        BoCtrl.prototype.zoomin = function (record) {
            var zoom = record.$Graph.Zoom;
            var zoom0 = zoom;
            switch (zoom) {
                case 1:
                    zoom = 5;
                    break;
                case 5:
                    zoom = 10;
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
        BoCtrl.prototype.zoomout = function (record) {
            var zoom = record.$Graph.Zoom;
            if (zoom == 1)
                return;
            var zoom0 = zoom;
            switch (zoom) {
                case 5:
                    zoom = 1;
                    break;
                case 10:
                    zoom = 5;
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
        BoCtrl.prototype.graphShow = function () {
            var r1 = this.getFocusTab().Content;
            var c = document.getElementById("TheChart_" + r1.Id);
            var ctx = c.getContext('2d');
            r1.$Graph.Chart = new Chart(ctx, r1.$Graph.GraphData);
        };
        BoCtrl.prototype.onSliderChange = function (sliderId, modelValue, highValue, pointerType) {
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
        BoCtrl.prototype.onRecordView = function (record) {
            return this.$http.post(this.Config.AppPath + "/bo_get", null, { params: { id: record.Id } });
        };
        BoCtrl.prototype.onRecordLoaded = function (result, config) {
            if (result.Result == "OK") {
                var record = result.Record;
                record.VsTimeStart = new Date(record.VsTimeStart);
            }
        };
        BoCtrl.prototype.onGetRecordTitle = function (record) {
            return record.VsTimeStart.getFullYear() + "/" + (record.VsTimeStart.getMonth() + 1) + "/" + record.VsTimeStart.getDate();
        };
        BoCtrl.prototype.download = function (record) {
            var ctl = new common_1.SwDownloadFile();
            ctl.getFile(this.Config.AppPath + "/Bo_Download", { id: record.Id });
        };
        return BoCtrl;
    }(master2_1.SwMaster2Ctrl));
    /**
     * copd評量表清冊
     */
    var ScaleCtrl = /** @class */ (function (_super) {
        __extends(ScaleCtrl, _super);
        function ScaleCtrl($http, Config, $q, $filter, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$filter = $filter;
            _this.$scope = $scope;
            //初始排序條件
            _this.pageOrderBy('日期', true);
            _this.pageQuery(10);
            return _this;
        }
        ScaleCtrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/scale_pageorderby", null, { params: qp });
        };
        ScaleCtrl.prototype.onPageQuery = function (pager) {
            for (var v in this.QryArgs) {
                var v1 = this.QryArgs[v];
                if (v1.Checked) {
                    pager[v] = v1.Value;
                }
            }
            pager["memberId"] = this.$scope.$parent.record.Id;
            return this.$http.post(this.Config.AppPath + "/scale_pagequery", null, { params: pager });
        };
        ScaleCtrl.prototype.onRecordView = function (record, config) {
            return this.$http.post(this.Config.AppPath + "/scale_get", null, { params: { Id: record.Id } });
        };
        ScaleCtrl.prototype.onRecordLoaded = function (result, config) {
            if (result.Result == "OK") {
                var record = result.Record;
                record.TheDate = new Date(record.TheDate);
                record.Content = angular.fromJson(record.Content);
            }
        };
        ScaleCtrl.prototype.onGetRecordTitle = function (record) {
            return "" + this.$filter('date')(record.TheDate, 'yyyy/MM/dd');
        };
        return ScaleCtrl;
    }(master2_1.SwMaster2Ctrl));
    /**
     * Video訊號
     */
    var VideoCtrl = /** @class */ (function (_super) {
        __extends(VideoCtrl, _super);
        function VideoCtrl($http, Config, $q, $filter, $scope) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$filter = $filter;
            _this.$scope = $scope;
            //初始排序條件
            _this.pageOrderBy('錄製時間', true);
            _this.pageQuery(10);
            return _this;
        }
        VideoCtrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/Video_pageorderby", null, { params: qp });
        };
        VideoCtrl.prototype.onPageQuery = function (pager) {
            for (var v in this.QryArgs) {
                var v1 = this.QryArgs[v];
                if (v1.Checked) {
                    pager[v] = v1.Value;
                }
            }
            pager["memberId"] = this.$scope.$parent.record.Id;
            return this.$http.post(this.Config.AppPath + "/Video_pagequery", null, { params: pager });
        };
        return VideoCtrl;
    }(master2_1.SwMaster2Ctrl));
    /**
     * 日誌
     */
    var NoteCtrl = /** @class */ (function (_super) {
        __extends(NoteCtrl, _super);
        function NoteCtrl($http, Config, $q, $scope, $filter) {
            var _this = _super.call(this, $q, $scope) || this;
            _this.$http = $http;
            _this.Config = Config;
            _this.$q = $q;
            _this.$scope = $scope;
            _this.$filter = $filter;
            //初始排序條件
            _this.pageOrderBy('日期', true);
            _this.pageQuery();
            return _this;
        }
        NoteCtrl.prototype.onQueryOne = function (record) {
            return this.$http.post(this.Config.AppPath + "/note_query", null, { params: { Id: record.Id } });
        };
        NoteCtrl.prototype.onPageOrderBy = function (qp) {
            return this.$http.post(this.Config.AppPath + "/note_pageorderby", null, { params: qp });
        };
        NoteCtrl.prototype.onPageQuery = function (pager) {
            for (var v in this.QryArgs) {
                var v1 = this.QryArgs[v];
                if (v1.Checked) {
                    pager[v] = v1.Value;
                }
            }
            pager["memberId"] = this.$scope.$parent.record.Id;
            return this.$http.post(this.Config.AppPath + "/note_pagequery", null, { params: pager });
        };
        NoteCtrl.prototype.onRecordView = function (record) {
            return this.$http.post(this.Config.AppPath + "/note_get", null, { params: { Id: record.Id } });
        };
        NoteCtrl.prototype.onRecordSave = function (record) {
            record.MemberId = this.$scope.$parent.record.Id;
            return this.$http.post(this.Config.AppPath + "/note_save", record);
        };
        NoteCtrl.prototype.onRecordDeleteDo = function (record) {
            return this.$http.post(this.Config.AppPath + "/note_delete", null, { params: { Id: record.Id } });
        };
        NoteCtrl.prototype.onGetRecordTitle = function (record) {
            if (!record.Id)
                return '新日誌';
            return "" + this.$filter('date')(record.Created, 'yyyy/MM/dd');
        };
        NoteCtrl.prototype.onRecordStateChange = function (record, state) {
            ////檢視直接進編輯
            //if (!record.$State && state == SwRecordState.View) {
            //    record.$State = SwRecordState.Update;
            //}
            //編輯完成直接關閉
            //else
            if (record.$State == common_1.SwRecordState.New && state == common_1.SwRecordState.View) {
                record.$State = common_1.SwRecordState.None;
            }
            else
                record.$State = state;
        };
        return NoteCtrl;
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
            .controller('MainCtrl', Copd003Ctrl)
            .controller('VsCtrl', VsCtrl)
            .controller('VideoCtrl', VideoCtrl)
            .controller('BoCtrl', BoCtrl)
            .controller('ScaleCtrl', ScaleCtrl)
            .controller('NoteCtrl', NoteCtrl)
            .run(function () {
        });
        angular.bootstrap(document, ['app']);
    }
    exports.startApp = startApp;
    ;
});
//# sourceMappingURL=copd003.js.map