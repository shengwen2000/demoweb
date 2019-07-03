"use strict";
if (!String.prototype.left) {
    String.prototype.left = function (len) {
        if (!this.length)
            return this;
        if (len >= this.length)
            return this;
        return this.substring(0, len);
    };
}
if (!String.prototype.right) {
    String.prototype.right = function (len) {
        if (!this.length)
            return this;
        if (len >= this.length)
            return this;
        return this.substring(this.length - len, this.length);
    };
}
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        if (!this.length)
            return this;
        return this.replace(/^\s+|\s+$/g, "");
    };
}
//日期序列化去時區
Date.prototype.toISOString = function () {
    var toStr = function (x, width) {
        if (x == null)
            return null;
        var txt = x.toString();
        if (txt.length < width)
            return '0'.repeat(width - txt.length) + txt;
        else
            return txt;
    };
    //年度有可能為負值
    var toYY = function (x) {
        if (x == null)
            return null;
        if (x < 0)
            return "-" + toStr(-x, 4);
        return toStr(x, 4);
    };
    //"2018-09-19T00:00:00.000"
    return toYY(this.getFullYear()) + "-" + toStr(this.getMonth() + 1, 2) + "-" + toStr(this.getDate(), 2) + "T" + toStr(this.getHours(), 2) + ":" + toStr(this.getMinutes(), 2) + ":" + toStr(this.getSeconds(), 2) + "." + toStr(this.getMilliseconds(), 3);
};
//日期序列化去時區
Date.prototype.toJSON = function () {
    var toStr = function (x, width) {
        if (x == null)
            return null;
        var txt = x.toString();
        if (txt.length < width)
            return '0'.repeat(width - txt.length) + txt;
        else
            return txt;
    };
    //年度有可能為負值
    var toYY = function (x) {
        if (x == null)
            return null;
        if (x < 0)
            return "-" + toStr(-x, 4);
        return toStr(x, 4);
    };
    //"2018-09-19T00:00:00.000"
    return toYY(this.getFullYear()) + "-" + toStr(this.getMonth() + 1, 2) + "-" + toStr(this.getDate(), 2) + "T" + toStr(this.getHours(), 2) + ":" + toStr(this.getMinutes(), 2) + ":" + toStr(this.getSeconds(), 2) + "." + toStr(this.getMilliseconds(), 3);
};
//if (!String.prototype.endsWith) {
//    String.prototype.endsWith = function (suffix: string) {
//        return (<string>this).indexOf(suffix, this.length - suffix.length) !== -1;
//    };
//}
//# sourceMappingURL=extension.js.map