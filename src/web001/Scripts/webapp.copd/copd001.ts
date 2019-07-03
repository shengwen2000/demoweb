import { SwBaseCtrl, ISwConfig, CommonModule } from "../webapp/common";
import { Sys010Module } from "../webapp.sys/sys010";

/**
    * 會員主檔
    */
class Copd001Ctrl extends SwBaseCtrl {

    /**是否檢視*/
    ScaleIsView: boolean = true;

    /**評量表*/
    Scale = {
        CAT: {
            Q1: 1,
            Q2: 1,
            Q3: 1,
            Q4: 1,
            Q5: 1,
            Q6: 1,
            Q7: 1,
            Q8: 1,
        },
        mMRC: { Q1: 1 },
        COPD: {
            Q1: 1,
            Q2: 1,
            Q3: 1,
            Q4: 1
        }
    };

    /**會員*/
    Member =
        {
            LoginNo: '12343343',
            Name: 'David',
            Sex: '男'
        };

    /**導覽*/
    Navigator = {
        //可否新增
        Newable: false,
        //前一個
        PrvId: null,
        //下一個
        NextId: null
    };

    constructor(public $http: ng.IHttpService, public $scope: ng.IScope, public $q: ng.IQService, public Config: ISwConfig) {
        super($q, $scope);

        this.Member = null;
        this.Scale = null;
        this.ScaleIsView = true;
    }

    /**
     * 登入帳號
     * @param login_no
     */
    login(login_no: string) {
        this.exeHttpAction(this.$http.post(this.Config.AppPath + '/MemberLogin', null, { params: { login_no: login_no } }))
            .then(x => {
                if (x.Result == "OK") {
                    this.Member = (x.Record as any);
                    this.navigatorRefresh();
                }
            })
            ;
    }

    logout() {
        this.Member = null;
        this.Scale = null;
        this.Navigator = <any>{};
    }

    navigatorRefresh(scaleId?: number) {
        this.exeHttpAction(this.$http.post(this.Config.AppPath + '/NaviagorRefresh', null, { params: { login_no: this.Member.LoginNo, scaleId: scaleId } }))
            .then(x => {
                if (x.Result == "OK") {
                    let nav = x.Record as any;
                    this.Navigator = {} as any;
                    this.Navigator.Newable = nav.Newable;
                    this.Navigator.NextId = nav.NextId;
                    this.Navigator.PrvId = nav.PrvId;
                    this.Scale = angular.fromJson(nav.CurContent);
                    this.ScaleIsView = true;
                }
            })
            ;
    }

    /**
     * 新增評量
     */
    scaleNew() {
        this.Scale = {} as any;
        this.ScaleIsView = false;
    }

    /**
     * 看前一個評量
     */
    scalePrevious() {
        this.navigatorRefresh(this.Navigator.PrvId);
    }

    /**
    * 看下一個評量
    */
    scaleNext() {
        this.navigatorRefresh(this.Navigator.NextId);
    }

    scaleCancel() {
        this.navigatorRefresh();
    }

    scaleSave() {
        if (this.Scale.CAT == null || this.Scale.CAT.Q1 == null || this.Scale.CAT.Q2 == null || this.Scale.CAT.Q3 == null || this.Scale.CAT.Q4 == null || this.Scale.CAT.Q5 == null || this.Scale.CAT.Q6 == null || this.Scale.CAT.Q7 == null || this.Scale.CAT.Q8 == null) {
            this.showMessage("請先填寫-慢性阻塞性肺病評估測試");
            return;
        }

        if (this.Scale.mMRC == null || this.Scale.mMRC.Q1 == null) {
            this.showMessage("請先填寫-呼吸困難程度計分(mMRC)");
            return;
        }

        if (this.Scale.COPD == null || this.Scale.COPD.Q1 == null || this.Scale.COPD.Q2 == null || this.Scale.COPD.Q3 == null || this.Scale.COPD.Q4 == null) {
            this.showMessage("請先填寫-COPD惡化評估指標");
            return;
        }

        this.exeHttpAction(this.$http.post(this.Config.AppPath + '/ScaleSave', this.Scale, { params: { login_no: this.Member.LoginNo } }))
            .then(x => {
                if (x.Result == "OK") {
                    this.navigatorRefresh();
                }
            })
            ;
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
        .controller('MainCtrl', Copd001Ctrl)
        .run(() => {
        })
        ;

    angular.bootstrap(document, ['app']);
};
