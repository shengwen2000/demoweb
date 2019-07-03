interface String {
    left(len: number): string;
    right(len: number): string;
    trim(): string;
    //endsWith(suffix: string): boolean;
}

if (!String.prototype.left) {
    String.prototype.left = function (len: number): string {
        if (!this.length)
            return this;
        if (len >= this.length)
            return this;
        return (<string>this).substring(0, len);
    }
}

if (!String.prototype.right) {
    String.prototype.right = function (len: number): string {
        if (!this.length)
            return this;
        if (len >= this.length)
            return this;
        return (<string>this).substring(this.length - len, this.length);
    }
}

if (!String.prototype.trim) {
    String.prototype.trim = function (): string {
        if (!this.length)
            return this;
        return (<string>this).replace(/^\s+|\s+$/g, "");
    }
}

//日期序列化去時區
Date.prototype.toISOString = function () {

    let toStr = (x: number, width: number) => {
        if (x == null)
            return null;
        let txt = x.toString();
        if (txt.length < width)
            return '0'.repeat(width - txt.length) + txt;
        else
            return txt;
    };

    //年度有可能為負值
    let toYY = (x: number) => {
        if (x == null)
            return null;
        if (x < 0)
            return `-${toStr(-x, 4)}`;
        return toStr(x, 4);
    };

    //"2018-09-19T00:00:00.000"
    return `${toYY(this.getFullYear())}-${toStr(this.getMonth() + 1, 2)}-${toStr(this.getDate(), 2)}T${toStr(this.getHours(), 2)}:${toStr(this.getMinutes(), 2)}:${toStr(this.getSeconds(), 2)}.${toStr(this.getMilliseconds(), 3)}`;
}


//日期序列化去時區
Date.prototype.toJSON = function () {

    let toStr = (x: number, width: number) => {
        if (x == null)
            return null;
        let txt = x.toString();
        if (txt.length < width)
            return '0'.repeat(width - txt.length) + txt;
        else
            return txt;
    };

    //年度有可能為負值
    let toYY = (x: number) => {
        if (x == null)
            return null;
        if (x < 0)
            return `-${toStr(-x, 4)}`;
        return toStr(x, 4);
    };

    //"2018-09-19T00:00:00.000"
    return `${toYY(this.getFullYear())}-${toStr(this.getMonth() + 1, 2)}-${toStr(this.getDate(), 2)}T${toStr(this.getHours(), 2)}:${toStr(this.getMinutes(), 2)}:${toStr(this.getSeconds(), 2)}.${toStr(this.getMilliseconds(), 3)}`;
}

//if (!String.prototype.endsWith) {
//    String.prototype.endsWith = function (suffix: string) {
//        return (<string>this).indexOf(suffix, this.length - suffix.length) !== -1;
//    };
//}

