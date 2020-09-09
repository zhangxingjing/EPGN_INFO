window.onerror = function () {};
if (typeof ZOL == "undefined" || !ZOL) {
    var ZOL = {}
}
ZOL.namespace = function () {
    var a = arguments,
        o = null,
        i, j, d;
    for (i = 0; i < a.length; i = i + 1) {
        d = a[i].split(".");
        o = ZOL;
        for (j = (d[0] == "ZOL") ? 1 : 0; j < d.length; j = j + 1) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]]
        }
    }
    return o
};
(function () {
    ZOL.namespace("util", "widget")
})();
ZOL.config = {
    root: "//icon.zol-img.com.cn/products/js/",
    loadRoot: ""
};
ZOL.extend = function (target, source, deep) {
    target = target || {};
    var sType = typeof source,
        i = 1,
        options;
    if (sType === "undefined" || sType === "boolean") {
        deep = sType === "boolean" ? source : false;
        source = target;
        target = this
    }
    if (typeof source !== "object" && Object.prototype.toString.call(source).call(source) !== "[object Function]") {
        source = {}
    }
    while (i <= 2) {
        options = i === 1 ? target : source;
        if (options != null) {
            for (var name in options) {
                var src = target[name],
                    copy = options[name];
                if (target === copy) {
                    continue
                }
                if (deep && copy && typeof copy === "object" && !copy.nodeType) {
                    target[name] = this.extend(src || (copy.length != null ? [] : {}), copy, deep)
                } else {
                    if (copy !== undefined) {
                        target[name] = copy
                    }
                }
            }
        }
        i++
    }
    return target
};
ZOL.W = window;
ZOL.D = document;
ZOL.URL = ZOL.D.location.href;
ZOL.go = function (url) {
    ZOL.D.location.href = url
};
ZOL.$ = function (id) {
    if (!id) {
        return false
    }
    if (typeof (id) == "object") {
        return id
    }
    var isIE = ZOL.browser.IE;
    if (isIE && isIE < 8) {
        elems = document.all[id];
        if (elems) {
            for (var i = 0, len = elems.length; i < len; i++) {
                var elem = elems[i];
                if (elem.id == id) {
                    return elem
                }
            }
        } else {
            return false
        }
    }
    return !!id && document.getElementById(id) || false
};
ZOL.find = function (tagName, contextId) {
    if (!tagName || typeof (tagName) != "string") {
        return false
    }
    var context = ZOL.$(contextId);
    if (contextId && !context) {
        return false
    }
    context = context || ZOL.D;
    if (typeof (context) != "object") {
        return false
    }
    return context.getElementsByTagName(tagName)
};
ZOL.findByClass = function (className, contextId, tagName) {
    var ele = [];
    var context = ZOL.$(contextId);
    if (contextId && !context) {
        return false
    }
    context = context || ZOL.D;
    var all = context.getElementsByTagName(tagName || "*");
    for (var i = 0; i < all.length; i++) {
        if (all[i].className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"))) {
            ele[ele.length] = all[i]
        }
    }
    return ele
};
ZOL.each = function (arr, callback) {
    var len = arr.length;
    if (!len || typeof (callback) !== "function") {
        return false
    }
    for (var i = 0; i < len; i++) {
        callback(arr[i], i)
    }
    return true
};
ZOL.browser = function () {
    var o = {
        IE: 0,
        OPERA: 0,
        GECKO: 0,
        WEBKIT: 0,
        FIREFOX: 0,
        MOBILE: null
    };
    var ua = navigator.userAgent,
        m;
    if ((/KHTML/).test(ua)) {
        o.WEBKIT = 1
    }
    m = ua.match(/AppleWebKit\/([^\s]*)/);
    if (m && m[1]) {
        o.WEBKIT = parseFloat(m[1]);
        if (/ Mobile\//.test(ua)) {
            o.MOBILE = "Apple"
        } else {
            m = ua.match(/NokiaN[^\/]*/);
            if (m) {
                o.MOBILE = m[0]
            }
        }
    }
    if (!o.WEBKIT) {
        m = ua.match(/Opera[\s\/]([^\s]*)/);
        if (m && m[1]) {
            o.OPERA = parseFloat(m[1]);
            m = ua.match(/Opera Mini[^;]*/);
            if (m) {
                o.MOBILE = m[0]
            }
        } else {
            m = ua.match(/MSIE\s([^;]*)/);
            if (m && m[1]) {
                o.IE = parseFloat(m[1])
            } else {
                m = ua.match(/Gecko\/([^\s]*)/);
                if (m) {
                    o.GECKO = 1;
                    m = ua.match(/rv:([^\s\)]*)/);
                    if (m && m[1]) {
                        o.GECKO = parseFloat(m[1])
                    }
                }
                m = ua.match(/Firefox\/([^\s]*)/);
                if (m && m[1]) {
                    o.FIREFOX = m[1]
                }
            }
        }
    }
    return o
}();
ZOL.env = {
    trim: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "")
    },
    isUndefined: function (o) {
        return typeof (o) === "undefined"
    },
    isnull: function (exp) {
        return exp === null
    },
    isset: function (exp) {
        return exp == undefined
    },
    strlen: function (str) {
        return str.replace(/[^\x00-\xff]/g, "..").length
    },
    getRewriteJsUrl: function (ajaxUrl) {
        if (!ajaxUrl) {
            return false
        }
        ajaxUrl = ajaxUrl.replace(/index\.php\?c=Ajax\&a=([\w_]+)\&(.+)/g, "ajax_$1_$2.html");
        ajaxUrl = ajaxUrl.replace(/(&|%26)/g, "%5E");
        return ajaxUrl
    },
    escape: function (str) {
        return escape(str).replace(/%/g, "^")
    }
};
ZOL.load = function (file, filetype, callback) {
    var self = this;
    this.loaded = false;
    this.callback = callback;
    filetype = filetype || "js";
    file = file.indexOf("http://") == 0 ? file : (ZOL.config.loadRoot + file);
    var onload = function (file) {
        typeof (callback) == "function" && callback(file)
    };
    var isLoading = function (elem) {
        return elem.readyState && elem.readyState == "loading"
    };
    var checkLoaded = function () {
        switch (filetype) {
            case "js":
                tagName = "script";
                linkAttrName = "src";
                break;
            case "css":
                tagName = "link";
                linkAttrName = "href";
                break;
            default:
                return false;
                break
        }
        var loadElems = document.getElementsByTagName(tagName);
        if (loadElems) {
            for (var i = 0, len = loadElems.length; i < len; i++) {
                var elem = loadElems[i];
                if (elem[linkAttrName].indexOf(file) != -1 && !isLoading(elem)) {
                    self.loaded = true;
                    return true
                }
            }
        }
    };
    if (checkLoaded()) {
        onload(file);
        return
    }
    if (filetype == "js") {
        var elem = document.createElement("script");
        with(elem) {
            type = "text/javascript";
            src = file
        }
    } else {
        if (filetype == "css") {
            var elem = document.createElement("link");
            with(elem) {
                type = "text/css";
                rel = "stylesheet";
                href = file
            }
        }
    }
    elem && document.getElementsByTagName("head")[0].appendChild(elem);
    var loadFunc = function () {
        if (isLoading(this)) {
            return
        } else {
            onload(file)
        }
    };
    elem.onload = elem.onreadystatechange = loadFunc;
    return elem
};
ZOL.addEvent = function (obj, eventType, fn) {
    var obj = (typeof (obj) == "string") ? ZOL.$(obj) : obj;
    if (!obj) {
        return false
    }
    if (obj.attachEvent) {
        var typeRef = "_" + eventType;
        if (!obj[typeRef]) {
            obj[typeRef] = [];
            var onEvent = obj["on" + eventType];
            onEvent && obj[typeRef].push(onEvent)
        }
        for (var i in obj[typeRef]) {
            if (obj[typeRef][i] == fn) {
                return
            }
        }
        obj[typeRef].push(fn);
        obj["on" + eventType] = function () {
            for (var i in this[typeRef]) {
                if (this[typeRef][i].apply(this, arguments) === false) {
                    return false
                }
            }
        }
    } else {
        obj.addEventListener(eventType, fn, false)
    }
};
ZOL.removeEvent = function (obj, eventType, fn) {
    var obj = (typeof (obj) == "string") ? ZOL.$(obj) : obj;
    if (!obj) {
        return false
    }
    if (obj.attachEvent) {
        var typeRef = "_" + eventType;
        if (!obj[typeRef]) {
            return false
        }
        for (var i in obj[typeRef]) {
            if (obj[typeRef][i] == fn) {
                obj[typeRef].splice(i, 1);
                break
            }
        }
    } else {
        obj.removeEventListener(eventType, fn, false)
    }
};
ZOL.addClass = function (obj, className) {
    var obj = (typeof (obj) == "string") ? ZOL.$(obj) : obj;
    ZOL.removeClass(obj, className);
    obj.className += " " + className;
    return true
};
ZOL.removeClass = function (obj, className) {
    var obj = (typeof (obj) == "string") ? ZOL.$(obj) : obj;
    if (!className) {
        obj.className = "";
        return true
    }
    var classNames = className.split(" ");
    var _className = " " + obj.className + " ";
    for (var i in classNames) {
        _className = _className.replace(" " + classNames[i] + " ", " ")
    }
    obj.className = ZOL.env.trim(_className);
    return true
};
ZOL.onReady = function (fn) {
    if (typeof (fn) != "function") {
        return false
    }
    this.domReady = false;
    if (typeof (fns) == "undefined") {
        var fns = []
    }
    fns.push(fn);
    var init = function () {
        for (i in fns) {
            fns[i]()
        }
    };
    this.ready = function () {
        if (this.domReady) {
            init()
        }
        if (ZOL.browser.IE) {
            var timer = window.setInterval(function () {
                try {
                    document.body.doScroll("left");
                    init();
                    window.clearInterval(timer);
                    this.domReady = true
                } catch (e) {}
            }, 5)
        } else {
            try {
                document.removeEventListener("DOMContentLoaded", init)
            } catch (e) {}
            document.addEventListener("DOMContentLoaded", init, false);
            this.domReady = true
        }
    };
    this.ready()
};
ZOL.util.cookie = {
    get: function (n) {
        var v = "",
            c = " " + document.cookie + ";",
            s = c.indexOf((" " + n + "="));
        if (s >= 0) {
            s += n.length + 2;
            v = unescape(c.substring(s, c.indexOf(";", s)))
        }
        return v
    },
    set: function (n, v) {
        var a = arguments,
            al = a.length;
        document.cookie = n + "=" + v + ((al > 2 && a[2] != "") ? ";expires=" + ((new Date((new Date()).getTime() + a[2] * 3600000)).toGMTString()) : "") + ";path=" + ((al > 3 && a[3] != "") ? a[3] : "/") + ";domain=" + ((al > 4 && a[4] != "") ? a[4] : ".zol.com.cn")
    },
    checksub: function (sCookie, s) {
        var aParts = sCookie.split("&"),
            nParts = aParts.length,
            aKeyVal;
        if (nParts == 1) {
            return sCookie.indexOf(s)
        } else {
            for (var i = 0; i < nParts; i++) {
                aKeyVal = aParts[i].split("=");
                if (aKeyVal[0] == s) {
                    return i
                }
            }
        }
        return -1
    },
    getsub: function (n, s) {
        var sCookie = this.get(n);
        var nExists = this.checksub(sCookie, s);
        if (nExists > -1) {
            return sCookie.split("&")[nExists].split("=")[1]
        } else {
            if (sCookie.indexOf(s) > 0) {
                return sCookie.split("=")[1]
            }
        }
        return ""
    },
    setsub: function (n, s, v) {
        var sCookie = this.get(n),
            a = arguments,
            al = a.length;
        var aParts = sCookie.split("&");
        var nExists = this.checksub(sCookie, s);
        if (sCookie == "") {
            sNewVal = (s + "=" + v).toString()
        } else {
            if (nExists == -1) {
                nExists = aParts.length
            }
            aParts[nExists] = s + "=" + v;
            sNewVal = aParts.join("&")
        }
        return this.set(n, sNewVal, (a[3] || ""), (a[4] || "/"), (a[5] || ""))
    }
};
ZOL.util.addFavorite = function (obj) {
    var url = document.location.href;
    var title = document.title;
    if (document.all) {
        window.external.AddFavorite(url, title)
    } else {
        if (window.sidebar) {
            window.sidebar.addPanel(title, url, "")
        } else {
            if (window.opera && window.print) {
                obj.setAttribute("rel", "sidebar");
                obj.setAttribute("href", url);
                obj.setAttribute("title", title)
            }
        }
    }
    return false
};
ZOL.util.copy = function (data, callback) {
    if (window.clipboardData) {
        if (window.clipboardData.setData("Text", data)) {
            typeof (callback) == "function" && callback()
        }
    } else {
        var flashcopier = "flashcopier";
        var swfFile = "/_clipboard.swf";
        if (!ZOL.$(flashcopier)) {
            var divholder = document.createElement("div");
            divholder.id = flashcopier;
            divholder.style.display = "none";
            document.body.appendChild(divholder)
        }
        ZOL.$(flashcopier).innerHTML = "";
        data = data.replace(/\"/g, "'");
        var divinfo = '<embed src="' + swfFile + '" FlashVars="clipboard=' + data + '" width="0" height="0" type="application/x-shockwave-flash"></embed>';
        ZOL.$(flashcopier).innerHTML = divinfo;
        alert("\u5f53\u524d\u6d4f\u89c8\u5668\u65e0\u6cd5\u81ea\u52a8\u590d\u5236\u5230\u526a\u8d34\u677f\uff0c\u8bf7\u4f7f\u7528Ctrl+c\u5feb\u6377\u952e\u624b\u52a8\u590d\u5236\r\n" + data)
    }
};
ZOL.util.getPosition = function (elem) {
    if (!elem) {
        return false
    }
    var x = elem.offsetLeft;
    var y = elem.offsetTop;
    var w = elem.offsetWidth;
    var h = elem.offsetHeight;
    while (elem = elem.offsetParent) {
        x += elem.offsetLeft;
        y += elem.offsetTop
    }
    return {
        x: x,
        y: y,
        w: w,
        h: h
    }
};
ZOL.util.getBodySize = function () {
    var doc = document.documentElement,
        body = document.body;
    var aw = doc && doc.scrollWidth || body && body.scrollWidth || 0;
    var ah = doc && doc.scrollHeight || body && body.scrollHeight || 0;
    var w = doc && doc.clientWidth || body && body.clientWidth || 0;
    var h = doc && doc.clientHeight || body && body.clientHeight || 0;
    var x = doc && doc.scrollLeft || body && body.scrollLeft || 0;
    var y = doc && doc.scrollTop || body && body.scrollTop || 0;
    return {
        aw: aw,
        ah: ah,
        w: w,
        h: h,
        x: x,
        y: y
    }
};
ZOL.util.mouse = function (e) {
    var e = e || window.event;
    var bodyPos = ZOL.util.getBodySize();
    var x = e.pageX || (e.clientX ? (e.clientX + bodyPos.x) : null);
    var y = e.pageY || (e.clientY ? (e.clientY + bodyPos.y) : null);
    var rx = e.screenX;
    var ry = e.screenY;
    return {
        x: x,
        y: y,
        rx: rx,
        ry: ry
    }
};
ZOL.user = function () {
    var info = {
        sid: 0,
        id: "",
        nickName: ""
    };
    var cookie = ZOL.util.cookie;
    info.sid = cookie.get("zol_sid");
    info.id = cookie.get("zol_userid");
    info.nickName = cookie.get("zol_nickname");
    return info
}();
ZOL.util.toggle = function (id, styles, callback) {
    var obj = ZOL.$(id);
    styles = styles || {};
    var show = styles.show || "";
    var hidden = styles.hidden || "none";
    if (obj.style.display == show) {
        obj.style.display = hidden
    } else {
        obj.style.display = show
    }
    typeof (callback) == "function" && callback(obj.style.display)
};
var loginFrom = null;
ZOL.widget.login = {
    show: function () {
        new ZOL.load(ZOL.config.root + "util/dialog.js", "js", function () {
            var login_str = ['<form target="_top" method="post" action="http://service.zol.com.cn/user/login.php" name="log_form">', '<input type="hidden" value="login" name="ACT"/>', '<input type="hidden" value="' + ZOL.URL + '" name="backUrl"/>', "<dl>", "<dt>\u767b\u5f55\u540d</dt>", '<dd><input type="text" class="login" name="userid"></dd>', "<dt>\u5bc6\u7801</dt>", '<dd><input type="password" class="login" name="pwd"></dd>', "</dl>", "<dl>", '<input type="submit" value="\u786e\u5b9a" />', '<input type="button" value="\u53d6\u6d88" onclick="loginFrom.hidden()"/>', "</dl>", "<dl>", '<a href="http://service.zol.com.cn/user/get_pwd.php">\u5fd8\u8bb0\u5bc6\u7801\uff1f</a>', "</dl>", '<dl class="line">', "</dl>", "<dl>", '<input type="submit" style="float: none;" onclick="location.href=\'https://service.zol.com.cn/user/register.php\';" value="\u7acb\u5373\u6ce8\u518cZOL\u5e10\u53f7" name="submit"/>', "</dl>", "</form>"].join("\r\n");
            var config = {
                border: "1px solid #000",
                cssfile: "//icon.zol-img.com.cn/products/css/login.css",
                width: "240px",
                height: "230px",
                title: '<b id="login_title">ZOL\u7528\u6237\u8bf7\u767b\u5f55\u540e\u7ee7\u7eed\u64cd\u4f5c</b>',
                buttons: {}
            };
            loginFrom = new ZOL.widget.dialog("login_form", config);
            loginFrom.config.content = login_str;
            loginFrom.show()
        })
    }
};
ZOL.widget.piclogin = {
    show: function () {
        new ZOL.load(ZOL.config.root + "util/dialog.js", "js", function () {
            var login_str = ['<form target="_top" method="post" action="http://service.zol.com.cn/user/login.php" name="log_form">', '<input type="hidden" value="login" name="ACT"/>', '<input type="hidden" value="' + ZOL.URL + '" name="backUrl"/>', '<div class="loginMsg">\u6e29\u99a8\u63d0\u793a\uff1a\u767b\u5f55\u540e\u65b9\u53ef\u6d4f\u89c8\u539f\u59cb\u5927\u56fe</div>', '<div class="loginName"><span>\u767b\u5f55\u540d\uff1a</span><input type="text" class="login" name="userid"></div>', '<div class="loginPass"><span>\u5bc6\u3000\u7801\uff1a</span><input type="password" class="login" name="pwd"></div>', '<div class="loginTip"><lable><input type="checkbox"></lable> \u81ea\u52a8\u767b\u5f55', '<a href="http://service.zol.com.cn/user/get_pwd.php">\u5fd8\u8bb0\u5bc6\u7801\uff1f</a></div>', '<div class="loginSub"><input class="dl_bg" type="submit" value="" />', '<a href="https://service.zol.com.cn/user/register.php">\u6ce8\u518cZOL\u5e10\u53f7</a></div>', "</form>"].join("\r\n");
            var config = {
                defaultCssFile: "//icon.zol-img.com.cn/products/css/piclogin.css",
                padding: "0",
                width: "415px",
                height: "260px",
                title: '<b id="login_title">\u7528\u6237\u767b\u5f55</b>',
                buttons: {}
            };
            loginFrom = new ZOL.widget.dialog("login_form", config);
            loginFrom.config.content = login_str;
            loginFrom.show()
        })
    }
};
ZOL.util.scroller = function (el, duration) {
    if (typeof el != "object") {
        el = ZOL.$(el)
    }
    if (!el) {
        return
    }
    var z = this;
    z.el = el;
    z.p = ZOL.util.getPosition(el);
    z.s = ZOL.util.getBodySize();
    z.clear = function () {
        window.clearInterval(z.timer);
        z.timer = null
    };
    z.t = (new Date).getTime();
    z.step = function () {
        var t = (new Date).getTime();
        var p = (t - z.t) / duration;
        if (t >= duration + z.t) {
            z.clear();
            window.setTimeout(function () {
                z.scroll(z.p.y, z.p.x)
            }, 13)
        } else {
            st = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (z.p.y - z.s.y) + z.s.y;
            sl = 0;
            z.scroll(st, sl)
        }
    };
    z.scroll = function (t, l) {
        window.scrollTo(0, t)
    };
    z.timer = window.setInterval(function () {
        z.step()
    }, 13)
};
ZOL.autoOnclick = function (obj) {
    if (ZOL.browser.IE) {
        obj.onclick()
    } else {
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        obj.dispatchEvent(evt)
    }
};
ZOL.util = ZOL.util || {};
ZOL.util.AJAX = function () {
    this.lang = {
        HTTP_BUILDING_LINK: "",
        HTTP_SENDING: "",
        HTTP_LOADING: "",
        HTTP_DATA_IN_PROCESSED: "",
        HTTP_LOAD_FAILED: ""
    };
    this.statusId = null;
    this.targetUrl = "ooo";
    this.postData = "";
    this.recvType = "HTML";
    this.async = true;
    this.isCache = true;
    this._poll = {};
    this._rewrite = true;
    this.callback = null;
    var self = this;
    this._msxmlVersion = ["MSXML2.XMLHTTP", "MSXML.XMLHTTP", "Microsoft.XMLHTTP", ];
    this.createXMLHttpRequest = function () {
        var request = false;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest()
        } else {
            if (window.ActiveXObject) {
                for (i in this._msxmlVersion) {
                    try {
                        request = new ActiveXObject(this._msxmlVersion[i]);
                        if (request) {
                            return request
                        }
                    } catch (e) {}
                }
            }
        }
        return request
    };
    var httpRequest = this.createXMLHttpRequest();
    this._processHandle = function () {
        if (self.statusId) {
            self.statusId.style.display = "block"
        }
        if (httpRequest.readyState == 1 && self.statusId) {
            self.lang.HTTP_BUILDING_LINK && (self.statusId.innerHTML = self.lang.HTTP_BUILDING_LINK)
        } else {
            if (httpRequest.readyState == 2 && self.statusId) {
                self.lang.HTTP_SENDING && (self.statusId.innerHTML = self.lang.HTTP_SENDING)
            } else {
                if (httpRequest.readyState == 3 && self.statusId) {
                    self.lang.HTTP_LOADING && (self.statusId.innerHTML = self.lang.HTTP_LOADING)
                } else {
                    if (httpRequest.readyState == 4) {
                        if (httpRequest.status == 200) {
                            if (self.statusId) {
                                self.lang.HTTP_DATA_IN_PROCESSED && (self.statusId.innerHTML = self.lang.HTTP_DATA_IN_PROCESSED)
                            }
                            if (self.recvType == "HTML") {
                                var data = httpRequest.responseText
                            } else {
                                if (self.recvType == "XML") {
                                    var data = httpRequest.responseXML.lastChild.firstChild.nodeValue
                                }
                            }
                            self._poll[self.targetUrl] = data;
                            self.callback(data, self)
                        } else {
                            if (self.statusId) {
                                self.lang.HTTP_LOAD_FAILED && (self.statusId.innerHTML = self.lang.HTTP_LOAD_FAILED)
                            }
                        }
                    }
                }
            }
        }
    };
    this.get = function (targetUrl, callback) {
        this.targetUrl = targetUrl;
        this.callback = callback;
        if (this._rewrite && ZOL.env.getRewriteJsUrl) {
            this.targetUrl = ZOL.env.getRewriteJsUrl(targetUrl)
        }
        if (this._poll[this.targetUrl] && this.isCache) {
            this.callback(this._poll[this.targetUrl], this);
            return true
        }
        httpRequest.onreadystatechange = (ZOL.browser.FIREFOX && !this.async) ? this._processHandle() : this._processHandle;
        if (window.XMLHttpRequest) {
            httpRequest.open("GET", this.targetUrl, this.async);
            httpRequest.send(null)
        } else {
            httpRequest.open("GET", this.targetUrl, this.async);
            httpRequest.send()
        }
        if (!this.async) {
            httpRequest.onreadystatechange = ZOL.browser.FIREFOX ? this._processHandle() : this._processHandle
        }
    };
    this.post = function (targetUrl, postData, callback) {
        this.targetUrl = targetUrl;
        this.postData = postData;
        this.callback = callback;
        if (this._rewrite && ZOL.env.getRewriteJsUrl) {
            this.targetUrl = ZOL.env.getRewriteJsUrl(targetUrl)
        }
        if (this._poll[this.targetUrl] && this.isCache) {
            this.callback(this._poll[this.targetUrl], this);
            return true
        }
        httpRequest.onreadystatechange = this._processHandle;
        httpRequest.open("POST", this.targetUrl, this.async);
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=gbk");
        httpRequest.send(this.postData)
    };
    this.abort = function () {
        return httpRequest.abort()
    }
};
ZOL.widget = ZOL.widget || {};
ZOL.widget.TabView = function (elems, option) {
    var self = this;
    this.option = {
        tagName: "a",
        defaultSel: "",
        activeCss: "sel",
        ignoreCss: "ignore",
        eventName: "onmouseover",
        requestUrl: "",
        rewrite: true,
        ajUrn: "",
        ajCache: {},
        ajCon: "",
        callback: null,
        Delay: 0,
        autoPlay: 0,
        ajLang: null
    };
    this.waitInterval = null;
    if (typeof option == "object") {
        for (var key in option) {
            this.option[key] = option[key]
        }
    }
    this._doTab = function (li, tab) {
        var curItem = li;
        var curRel = curItem.getAttribute("rel");
        curRel = curRel ? curRel : self.option.ajCon;
        var curUrn = curItem.getAttribute("urn");
        if (!curUrn) {
            if (self.option.ajUrn && self.option.ajUrn == "INNER") {
                curUrn = this.innerHTML
            } else {
                curUrn = self.option.ajUrn
            }
        }
        var curCon = ZOL.$(curRel);
        var items = curItem.parentNode.getElementsByTagName(self.option.tagName);
        var cons = [];
        clearTimeout(self.waitInterval);
        self.waitInterval = setTimeout(function () {
            for (var k = 0; k < items.length; k++) {
                var item = items[k];
                if (item.className == self.option.ignoreCss) {
                    continue
                }
                var rel = items[k].getAttribute("rel");
                var con = ZOL.$(rel);
                cons[k] = con;
                ZOL.removeClass(item, self.option.activeCss);
                con && (con.style.display = "none");
                if (curItem == items[k]) {
                    ZOL.addClass(curItem, self.option.activeCss);
                    curCon && (curCon.style.display = "block");
                    if (self.option.autoPlay && tab.autoPlayHd && !self.auto) {
                        self._stop(tab);
                        curItem.onmouseout = function () {
                            self._play(tab)
                        }
                    }
                }
            }
            var callback = function () {
                (typeof (self.option.callback) == "function") && self.option.callback(curItem, curCon, items, cons)
            };
            if (curUrn) {
                if (self.option.ajCache[curUrn] == null) {
                    if (ZOL.util.AJAX) {
                        var AJAX = new ZOL.util.AJAX();
                        AJAX._rewrite = self.option.rewrite;
                        if (self.option.ajLang) {
                            AJAX.statusId = curCon;
                            AJAX.lang = self.option.ajLang
                        }
                        var url = self.option.requestUrl + curUrn;
                        AJAX.get(url, function (data) {
                            self.option.ajCache[curUrn] = data;
                            curCon.innerHTML = data;
                            callback()
                        })
                    }
                } else {
                    curCon.innerHTML = self.option.ajCache[curUrn];
                    callback()
                }
            } else {
                callback()
            }
        }, self.option.Delay)
    };
    this._play = function (tab) {
        clearInterval(tab.autoPlayHd);
        var self = this;
        var getNextItem = function () {
            var items = ZOL.find(self.option.tagName, tab);
            var nextItem = null;
            ZOL.each(items, function (item, i) {
                var _css = " " + item.className + " ";
                if (_css.indexOf(" " + self.option.activeCss + " ") >= 0) {
                    nextItem = i < items.length ? items[i + 1] : items[0]
                }
            });
            nextItem = nextItem || items[0];
            self.auto = true;
            self._doTab(nextItem, tab)
        };
        tab.autoPlayHd = setInterval(getNextItem, self.option.autoPlay)
    };
    this._stop = function (tab) {
        clearInterval(tab.autoPlayHd)
    };
    for (var i = 0; i < elems.length; i++) {
        var tab = ZOL.$(elems[i]);
        if (!tab) {
            continue
        }
        var items = ZOL.find(this.option.tagName, tab);
        var selItem = null;
        var tabfunc = function () {
            self.auto = false;
            self._doTab(this, tab)
        };
        for (var m = 0; m < items.length; m++) {
            var item = items[m];
            if (item.className == this.option.ignoreCss) {
                continue
            }
            var urn = item.getAttribute("urn");
            var rel = item.getAttribute("rel");
            rel = rel ? rel : this.option.ajCon;
            if (this.option.defaultSel && (urn == this.option.defaultSel || rel == this.option.defaultSel)) {
                selItem = item
            }
            var con = ZOL.$(rel);
            con.tab = item;
            if (urn && urn.indexOf("#default") > -1) {
                this.option.ajCache[urn] = con.innerHTML
            }
            var e = this.option.eventName;
            e = e.indexOf("on") == 0 ? e.substr(2) : e;
            ZOL.addEvent(item, e, tabfunc);
            if (this.option.autoPlay) {
                ZOL.addEvent(con, e, function () {
                    tabfunc.apply(this.tab)
                });
                con.onmouseout = function () {
                    this.tab.onmouseout && this.tab.onmouseout()
                }
            }
        }
        selItem && selItem[self.option.eventName]();
        if (self.option.autoPlay) {
            tab.autoPlayHd = null;
            self._play(tab)
        }
    }
};
/* jQuery v1.7.1 jquery.com | jquery.org/license */
(function (a, b) {
    function cy(a) {
        return f.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1
    }

    function cv(a) {
        if (!ck[a]) {
            var b = c.body,
                d = f("<" + a + ">").appendTo(b),
                e = d.css("display");
            d.remove();
            if (e === "none" || e === "") {
                cl || (cl = c.createElement("iframe"), cl.frameBorder = cl.width = cl.height = 0), b.appendChild(cl);
                if (!cm || !cl.createElement) {
                    cm = (cl.contentWindow || cl.contentDocument).document, cm.write((c.compatMode === "CSS1Compat" ? "<!doctype html>" : "") + "<html><body>"), cm.close()
                }
                d = cm.createElement(a), cm.body.appendChild(d), e = f.css(d, "display"), b.removeChild(cl)
            }
            ck[a] = e
        }
        return ck[a]
    }

    function cu(a, b) {
        var c = {};
        f.each(cq.concat.apply([], cq.slice(0, b)), function () {
            c[this] = a
        });
        return c
    }

    function ct() {
        cr = b
    }

    function cs() {
        setTimeout(ct, 0);
        return cr = f.now()
    }

    function cj() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (b) {}
    }

    function ci() {
        try {
            return new a.XMLHttpRequest
        } catch (b) {}
    }

    function cc(a, c) {
        a.dataFilter && (c = a.dataFilter(c, a.dataType));
        var d = a.dataTypes,
            e = {},
            g, h, i = d.length,
            j, k = d[0],
            l, m, n, o, p;
        for (g = 1; g < i; g++) {
            if (g === 1) {
                for (h in a.converters) {
                    typeof h == "string" && (e[h.toLowerCase()] = a.converters[h])
                }
            }
            l = k, k = d[g];
            if (k === "*") {
                k = l
            } else {
                if (l !== "*" && l !== k) {
                    m = l + " " + k, n = e[m] || e["* " + k];
                    if (!n) {
                        p = b;
                        for (o in e) {
                            j = o.split(" ");
                            if (j[0] === l || j[0] === "*") {
                                p = e[j[1] + " " + k];
                                if (p) {
                                    o = e[o], o === !0 ? n = p : p === !0 && (n = o);
                                    break
                                }
                            }
                        }
                    }!n && !p && f.error("No conversion from " + m.replace(" ", " to ")), n !== !0 && (c = n ? n(c) : p(o(c)))
                }
            }
        }
        return c
    }

    function cb(a, c, d) {
        var e = a.contents,
            f = a.dataTypes,
            g = a.responseFields,
            h, i, j, k;
        for (i in g) {
            i in d && (c[g[i]] = d[i])
        }
        while (f[0] === "*") {
            f.shift(), h === b && (h = a.mimeType || c.getResponseHeader("content-type"))
        }
        if (h) {
            for (i in e) {
                if (e[i] && e[i].test(h)) {
                    f.unshift(i);
                    break
                }
            }
        }
        if (f[0] in d) {
            j = f[0]
        } else {
            for (i in d) {
                if (!f[0] || a.converters[i + " " + f[0]]) {
                    j = i;
                    break
                }
                k || (k = i)
            }
            j = j || k
        }
        if (j) {
            j !== f[0] && f.unshift(j);
            return d[j]
        }
    }

    function ca(a, b, c, d) {
        if (f.isArray(b)) {
            f.each(b, function (b, e) {
                c || bE.test(a) ? d(a, e) : ca(a + "[" + (typeof e == "object" || f.isArray(e) ? b : "") + "]", e, c, d)
            })
        } else {
            if (!c && b != null && typeof b == "object") {
                for (var e in b) {
                    ca(a + "[" + e + "]", b[e], c, d)
                }
            } else {
                d(a, b)
            }
        }
    }

    function b_(a, c) {
        var d, e, g = f.ajaxSettings.flatOptions || {};
        for (d in c) {
            c[d] !== b && ((g[d] ? a : e || (e = {}))[d] = c[d])
        }
        e && f.extend(!0, a, e)
    }

    function b$(a, c, d, e, f, g) {
        f = f || c.dataTypes[0], g = g || {}, g[f] = !0;
        var h = a[f],
            i = 0,
            j = h ? h.length : 0,
            k = a === bT,
            l;
        for (; i < j && (k || !l); i++) {
            l = h[i](c, d, e), typeof l == "string" && (!k || g[l] ? l = b : (c.dataTypes.unshift(l), l = b$(a, c, d, e, l, g)))
        }(k || !l) && !g["*"] && (l = b$(a, c, d, e, "*", g));
        return l
    }

    function bZ(a) {
        return function (b, c) {
            typeof b != "string" && (c = b, b = "*");
            if (f.isFunction(c)) {
                var d = b.toLowerCase().split(bP),
                    e = 0,
                    g = d.length,
                    h, i, j;
                for (; e < g; e++) {
                    h = d[e], j = /^\+/.test(h), j && (h = h.substr(1) || "*"), i = a[h] = a[h] || [], i[j ? "unshift" : "push"](c)
                }
            }
        }
    }

    function bC(a, b, c) {
        var d = b === "width" ? a.offsetWidth : a.offsetHeight,
            e = b === "width" ? bx : by,
            g = 0,
            h = e.length;
        if (d > 0) {
            if (c !== "border") {
                for (; g < h; g++) {
                    c || (d -= parseFloat(f.css(a, "padding" + e[g])) || 0), c === "margin" ? d += parseFloat(f.css(a, c + e[g])) || 0 : d -= parseFloat(f.css(a, "border" + e[g] + "Width")) || 0
                }
            }
            return d + "px"
        }
        d = bz(a, b, b);
        if (d < 0 || d == null) {
            d = a.style[b] || 0
        }
        d = parseFloat(d) || 0;
        if (c) {
            for (; g < h; g++) {
                d += parseFloat(f.css(a, "padding" + e[g])) || 0, c !== "padding" && (d += parseFloat(f.css(a, "border" + e[g] + "Width")) || 0), c === "margin" && (d += parseFloat(f.css(a, c + e[g])) || 0)
            }
        }
        return d + "px"
    }

    function bp(a, b) {
        b.src ? f.ajax({
            url: b.src,
            async: !1,
            dataType: "script"
        }) : f.globalEval((b.text || b.textContent || b.innerHTML || "").replace(bf, "/*$0*/")), b.parentNode && b.parentNode.removeChild(b)
    }

    function bo(a) {
        var b = c.createElement("div");
        bh.appendChild(b), b.innerHTML = a.outerHTML;
        return b.firstChild
    }

    function bn(a) {
        var b = (a.nodeName || "").toLowerCase();
        b === "input" ? bm(a) : b !== "script" && typeof a.getElementsByTagName != "undefined" && f.grep(a.getElementsByTagName("input"), bm)
    }

    function bm(a) {
        if (a.type === "checkbox" || a.type === "radio") {
            a.defaultChecked = a.checked
        }
    }

    function bl(a) {
        return typeof a.getElementsByTagName != "undefined" ? a.getElementsByTagName("*") : typeof a.querySelectorAll != "undefined" ? a.querySelectorAll("*") : []
    }

    function bk(a, b) {
        var c;
        if (b.nodeType === 1) {
            b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), c = b.nodeName.toLowerCase();
            if (c === "object") {
                b.outerHTML = a.outerHTML
            } else {
                if (c !== "input" || a.type !== "checkbox" && a.type !== "radio") {
                    if (c === "option") {
                        b.selected = a.defaultSelected
                    } else {
                        if (c === "input" || c === "textarea") {
                            b.defaultValue = a.defaultValue
                        }
                    }
                } else {
                    a.checked && (b.defaultChecked = b.checked = a.checked), b.value !== a.value && (b.value = a.value)
                }
            }
            b.removeAttribute(f.expando)
        }
    }

    function bj(a, b) {
        if (b.nodeType === 1 && !!f.hasData(a)) {
            var c, d, e, g = f._data(a),
                h = f._data(b, g),
                i = g.events;
            if (i) {
                delete h.handle, h.events = {};
                for (c in i) {
                    for (d = 0, e = i[c].length; d < e; d++) {
                        f.event.add(b, c + (i[c][d].namespace ? "." : "") + i[c][d].namespace, i[c][d], i[c][d].data)
                    }
                }
            }
            h.data && (h.data = f.extend({}, h.data))
        }
    }

    function bi(a, b) {
        return f.nodeName(a, "table") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }

    function U(a) {
        var b = V.split("|"),
            c = a.createDocumentFragment();
        if (c.createElement) {
            while (b.length) {
                c.createElement(b.pop())
            }
        }
        return c
    }

    function T(a, b, c) {
        b = b || 0;
        if (f.isFunction(b)) {
            return f.grep(a, function (a, d) {
                var e = !!b.call(a, d, a);
                return e === c
            })
        }
        if (b.nodeType) {
            return f.grep(a, function (a, d) {
                return a === b === c
            })
        }
        if (typeof b == "string") {
            var d = f.grep(a, function (a) {
                return a.nodeType === 1
            });
            if (O.test(b)) {
                return f.filter(b, d, !c)
            }
            b = f.filter(b, d)
        }
        return f.grep(a, function (a, d) {
            return f.inArray(a, b) >= 0 === c
        })
    }

    function S(a) {
        return !a || !a.parentNode || a.parentNode.nodeType === 11
    }

    function K() {
        return !0
    }

    function J() {
        return !1
    }

    function n(a, b, c) {
        var d = b + "defer",
            e = b + "queue",
            g = b + "mark",
            h = f._data(a, d);
        h && (c === "queue" || !f._data(a, e)) && (c === "mark" || !f._data(a, g)) && setTimeout(function () {
            !f._data(a, e) && !f._data(a, g) && (f.removeData(a, d, !0), h.fire())
        }, 0)
    }

    function m(a) {
        for (var b in a) {
            if (b === "data" && f.isEmptyObject(a[b])) {
                continue
            }
            if (b !== "toJSON") {
                return !1
            }
        }
        return !0
    }

    function l(a, c, d) {
        if (d === b && a.nodeType === 1) {
            var e = "data-" + c.replace(k, "-$1").toLowerCase();
            d = a.getAttribute(e);
            if (typeof d == "string") {
                try {
                    d = d === "true" ? !0 : d === "false" ? !1 : d === "null" ? null : f.isNumeric(d) ? parseFloat(d) : j.test(d) ? f.parseJSON(d) : d
                } catch (g) {}
                f.data(a, c, d)
            } else {
                d = b
            }
        }
        return d
    }

    function h(a) {
        var b = g[a] = {},
            c, d;
        a = a.split(/\s+/);
        for (c = 0, d = a.length; c < d; c++) {
            b[a[c]] = !0
        }
        return b
    }
    var c = a.document,
        d = a.navigator,
        e = a.location,
        f = function () {
            function J() {
                if (!e.isReady) {
                    try {
                        c.documentElement.doScroll("left")
                    } catch (a) {
                        setTimeout(J, 1);
                        return
                    }
                    e.ready()
                }
            }
            var e = function (a, b) {
                    return new e.fn.init(a, b, h)
                },
                f = a.jQuery,
                g = a.$,
                h, i = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
                j = /\S/,
                k = /^\s+/,
                l = /\s+$/,
                m = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
                n = /^[\],:{}\s]*$/,
                o = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                p = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                q = /(?:^|:|,)(?:\s*\[)+/g,
                r = /(webkit)[ \/]([\w.]+)/,
                s = /(opera)(?:.*version)?[ \/]([\w.]+)/,
                t = /(msie) ([\w.]+)/,
                u = /(mozilla)(?:.*? rv:([\w.]+))?/,
                v = /-([a-z]|[0-9])/ig,
                w = /^-ms-/,
                x = function (a, b) {
                    return (b + "").toUpperCase()
                },
                y = d.userAgent,
                z, A, B, C = Object.prototype.toString,
                D = Object.prototype.hasOwnProperty,
                E = Array.prototype.push,
                F = Array.prototype.slice,
                G = String.prototype.trim,
                H = Array.prototype.indexOf,
                I = {};
            e.fn = e.prototype = {
                constructor: e,
                init: function (a, d, f) {
                    var g, h, j, k;
                    if (!a) {
                        return this
                    }
                    if (a.nodeType) {
                        this.context = this[0] = a, this.length = 1;
                        return this
                    }
                    if (a === "body" && !d && c.body) {
                        this.context = c, this[0] = c.body, this.selector = a, this.length = 1;
                        return this
                    }
                    if (typeof a == "string") {
                        a.charAt(0) !== "<" || a.charAt(a.length - 1) !== ">" || a.length < 3 ? g = i.exec(a) : g = [null, a, null];
                        if (g && (g[1] || !d)) {
                            if (g[1]) {
                                d = d instanceof e ? d[0] : d, k = d ? d.ownerDocument || d : c, j = m.exec(a), j ? e.isPlainObject(d) ? (a = [c.createElement(j[1])], e.fn.attr.call(a, d, !0)) : a = [k.createElement(j[1])] : (j = e.buildFragment([g[1]], [k]), a = (j.cacheable ? e.clone(j.fragment) : j.fragment).childNodes);
                                return e.merge(this, a)
                            }
                            h = c.getElementById(g[2]);
                            if (h && h.parentNode) {
                                if (h.id !== g[2]) {
                                    return f.find(a)
                                }
                                this.length = 1, this[0] = h
                            }
                            this.context = c, this.selector = a;
                            return this
                        }
                        return !d || d.jquery ? (d || f).find(a) : this.constructor(d).find(a)
                    }
                    if (e.isFunction(a)) {
                        return f.ready(a)
                    }
                    a.selector !== b && (this.selector = a.selector, this.context = a.context);
                    return e.makeArray(a, this)
                },
                selector: "",
                jquery: "1.7.1",
                length: 0,
                size: function () {
                    return this.length
                },
                toArray: function () {
                    return F.call(this, 0)
                },
                get: function (a) {
                    return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a]
                },
                pushStack: function (a, b, c) {
                    var d = this.constructor();
                    e.isArray(a) ? E.apply(d, a) : e.merge(d, a), d.prevObject = this, d.context = this.context, b === "find" ? d.selector = this.selector + (this.selector ? " " : "") + c : b && (d.selector = this.selector + "." + b + "(" + c + ")");
                    return d
                },
                each: function (a, b) {
                    return e.each(this, a, b)
                },
                ready: function (a) {
                    e.bindReady(), A.add(a);
                    return this
                },
                eq: function (a) {
                    a = +a;
                    return a === -1 ? this.slice(a) : this.slice(a, a + 1)
                },
                first: function () {
                    return this.eq(0)
                },
                last: function () {
                    return this.eq(-1)
                },
                slice: function () {
                    return this.pushStack(F.apply(this, arguments), "slice", F.call(arguments).join(","))
                },
                map: function (a) {
                    return this.pushStack(e.map(this, function (b, c) {
                        return a.call(b, c, b)
                    }))
                },
                end: function () {
                    return this.prevObject || this.constructor(null)
                },
                push: E,
                sort: [].sort,
                splice: [].splice
            }, e.fn.init.prototype = e.fn, e.extend = e.fn.extend = function () {
                var a, c, d, f, g, h, i = arguments[0] || {},
                    j = 1,
                    k = arguments.length,
                    l = !1;
                typeof i == "boolean" && (l = i, i = arguments[1] || {}, j = 2), typeof i != "object" && !e.isFunction(i) && (i = {}), k === j && (i = this, --j);
                for (; j < k; j++) {
                    if ((a = arguments[j]) != null) {
                        for (c in a) {
                            d = i[c], f = a[c];
                            if (i === f) {
                                continue
                            }
                            l && f && (e.isPlainObject(f) || (g = e.isArray(f))) ? (g ? (g = !1, h = d && e.isArray(d) ? d : []) : h = d && e.isPlainObject(d) ? d : {}, i[c] = e.extend(l, h, f)) : f !== b && (i[c] = f)
                        }
                    }
                }
                return i
            }, e.extend({
                noConflict: function (b) {
                    a.$ === e && (a.$ = g), b && a.jQuery === e && (a.jQuery = f);
                    return e
                },
                isReady: !1,
                readyWait: 1,
                holdReady: function (a) {
                    a ? e.readyWait++ : e.ready(!0)
                },
                ready: function (a) {
                    if (a === !0 && !--e.readyWait || a !== !0 && !e.isReady) {
                        if (!c.body) {
                            return setTimeout(e.ready, 1)
                        }
                        e.isReady = !0;
                        if (a !== !0 && --e.readyWait > 0) {
                            return
                        }
                        A.fireWith(c, [e]), e.fn.trigger && e(c).trigger("ready").off("ready")
                    }
                },
                bindReady: function () {
                    if (!A) {
                        A = e.Callbacks("once memory");
                        if (c.readyState === "complete") {
                            return setTimeout(e.ready, 1)
                        }
                        if (c.addEventListener) {
                            c.addEventListener("DOMContentLoaded", B, !1), a.addEventListener("load", e.ready, !1)
                        } else {
                            if (c.attachEvent) {
                                c.attachEvent("onreadystatechange", B), a.attachEvent("onload", e.ready);
                                var b = !1;
                                try {
                                    b = a.frameElement == null
                                } catch (d) {}
                                c.documentElement.doScroll && b && J()
                            }
                        }
                    }
                },
                isFunction: function (a) {
                    return e.type(a) === "function"
                },
                isArray: Array.isArray || function (a) {
                    return e.type(a) === "array"
                },
                isWindow: function (a) {
                    return a && typeof a == "object" && "setInterval" in a
                },
                isNumeric: function (a) {
                    return !isNaN(parseFloat(a)) && isFinite(a)
                },
                type: function (a) {
                    return a == null ? String(a) : I[C.call(a)] || "object"
                },
                isPlainObject: function (a) {
                    if (!a || e.type(a) !== "object" || a.nodeType || e.isWindow(a)) {
                        return !1
                    }
                    try {
                        if (a.constructor && !D.call(a, "constructor") && !D.call(a.constructor.prototype, "isPrototypeOf")) {
                            return !1
                        }
                    } catch (c) {
                        return !1
                    }
                    var d;
                    for (d in a) {}
                    return d === b || D.call(a, d)
                },
                isEmptyObject: function (a) {
                    for (var b in a) {
                        return !1
                    }
                    return !0
                },
                error: function (a) {
                    throw new Error(a)
                },
                parseJSON: function (b) {
                    if (typeof b != "string" || !b) {
                        return null
                    }
                    b = e.trim(b);
                    if (a.JSON && a.JSON.parse) {
                        return a.JSON.parse(b)
                    }
                    if (n.test(b.replace(o, "@").replace(p, "]").replace(q, ""))) {
                        return (new Function("return " + b))()
                    }
                    e.error("Invalid JSON: " + b)
                },
                parseXML: function (c) {
                    var d, f;
                    try {
                        a.DOMParser ? (f = new DOMParser, d = f.parseFromString(c, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(c))
                    } catch (g) {
                        d = b
                    }(!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && e.error("Invalid XML: " + c);
                    return d
                },
                noop: function () {},
                globalEval: function (b) {
                    b && j.test(b) && (a.execScript || function (b) {
                        a.eval.call(a, b)
                    })(b)
                },
                camelCase: function (a) {
                    return a.replace(w, "ms-").replace(v, x)
                },
                nodeName: function (a, b) {
                    return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase()
                },
                each: function (a, c, d) {
                    var f, g = 0,
                        h = a.length,
                        i = h === b || e.isFunction(a);
                    if (d) {
                        if (i) {
                            for (f in a) {
                                if (c.apply(a[f], d) === !1) {
                                    break
                                }
                            }
                        } else {
                            for (; g < h;) {
                                if (c.apply(a[g++], d) === !1) {
                                    break
                                }
                            }
                        }
                    } else {
                        if (i) {
                            for (f in a) {
                                if (c.call(a[f], f, a[f]) === !1) {
                                    break
                                }
                            }
                        } else {
                            for (; g < h;) {
                                if (c.call(a[g], g, a[g++]) === !1) {
                                    break
                                }
                            }
                        }
                    }
                    return a
                },
                trim: G ? function (a) {
                    return a == null ? "" : G.call(a)
                } : function (a) {
                    return a == null ? "" : (a + "").replace(k, "").replace(l, "")
                },
                makeArray: function (a, b) {
                    var c = b || [];
                    if (a != null) {
                        var d = e.type(a);
                        a.length == null || d === "string" || d === "function" || d === "regexp" || e.isWindow(a) ? E.call(c, a) : e.merge(c, a)
                    }
                    return c
                },
                inArray: function (a, b, c) {
                    var d;
                    if (b) {
                        if (H) {
                            return H.call(b, a, c)
                        }
                        d = b.length, c = c ? c < 0 ? Math.max(0, d + c) : c : 0;
                        for (; c < d; c++) {
                            if (c in b && b[c] === a) {
                                return c
                            }
                        }
                    }
                    return -1
                },
                merge: function (a, c) {
                    var d = a.length,
                        e = 0;
                    if (typeof c.length == "number") {
                        for (var f = c.length; e < f; e++) {
                            a[d++] = c[e]
                        }
                    } else {
                        while (c[e] !== b) {
                            a[d++] = c[e++]
                        }
                    }
                    a.length = d;
                    return a
                },
                grep: function (a, b, c) {
                    var d = [],
                        e;
                    c = !!c;
                    for (var f = 0, g = a.length; f < g; f++) {
                        e = !!b(a[f], f), c !== e && d.push(a[f])
                    }
                    return d
                },
                map: function (a, c, d) {
                    var f, g, h = [],
                        i = 0,
                        j = a.length,
                        k = a instanceof e || j !== b && typeof j == "number" && (j > 0 && a[0] && a[j - 1] || j === 0 || e.isArray(a));
                    if (k) {
                        for (; i < j; i++) {
                            f = c(a[i], i, d), f != null && (h[h.length] = f)
                        }
                    } else {
                        for (g in a) {
                            f = c(a[g], g, d), f != null && (h[h.length] = f)
                        }
                    }
                    return h.concat.apply([], h)
                },
                guid: 1,
                proxy: function (a, c) {
                    if (typeof c == "string") {
                        var d = a[c];
                        c = a, a = d
                    }
                    if (!e.isFunction(a)) {
                        return b
                    }
                    var f = F.call(arguments, 2),
                        g = function () {
                            return a.apply(c, f.concat(F.call(arguments)))
                        };
                    g.guid = a.guid = a.guid || g.guid || e.guid++;
                    return g
                },
                access: function (a, c, d, f, g, h) {
                    var i = a.length;
                    if (typeof c == "object") {
                        for (var j in c) {
                            e.access(a, j, c[j], f, g, d)
                        }
                        return a
                    }
                    if (d !== b) {
                        f = !h && f && e.isFunction(d);
                        for (var k = 0; k < i; k++) {
                            g(a[k], c, f ? d.call(a[k], k, g(a[k], c)) : d, h)
                        }
                        return a
                    }
                    return i ? g(a[0], c) : b
                },
                now: function () {
                    return (new Date).getTime()
                },
                uaMatch: function (a) {
                    a = a.toLowerCase();
                    var b = r.exec(a) || s.exec(a) || t.exec(a) || a.indexOf("compatible") < 0 && u.exec(a) || [];
                    return {
                        browser: b[1] || "",
                        version: b[2] || "0"
                    }
                },
                sub: function () {
                    function a(b, c) {
                        return new a.fn.init(b, c)
                    }
                    e.extend(!0, a, this), a.superclass = this, a.fn = a.prototype = this(), a.fn.constructor = a, a.sub = this.sub, a.fn.init = function (d, f) {
                        f && f instanceof e && !(f instanceof a) && (f = a(f));
                        return e.fn.init.call(this, d, f, b)
                    }, a.fn.init.prototype = a.fn;
                    var b = a(c);
                    return a
                },
                browser: {}
            }), e.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (a, b) {
                I["[object " + b + "]"] = b.toLowerCase()
            }), z = e.uaMatch(y), z.browser && (e.browser[z.browser] = !0, e.browser.version = z.version), e.browser.webkit && (e.browser.safari = !0), j.test(" ") && (k = /^[\s\xA0]+/, l = /[\s\xA0]+$/), h = e(c), c.addEventListener ? B = function () {
                c.removeEventListener("DOMContentLoaded", B, !1), e.ready()
            } : c.attachEvent && (B = function () {
                c.readyState === "complete" && (c.detachEvent("onreadystatechange", B), e.ready())
            });
            return e
        }(),
        g = {};
    f.Callbacks = function (a) {
        a = a ? g[a] || h(a) : {};
        var c = [],
            d = [],
            e, i, j, k, l, m = function (b) {
                var d, e, g, h, i;
                for (d = 0, e = b.length; d < e; d++) {
                    g = b[d], h = f.type(g), h === "array" ? m(g) : h === "function" && (!a.unique || !o.has(g)) && c.push(g)
                }
            },
            n = function (b, f) {
                f = f || [], e = !a.memory || [b, f], i = !0, l = j || 0, j = 0, k = c.length;
                for (; c && l < k; l++) {
                    if (c[l].apply(b, f) === !1 && a.stopOnFalse) {
                        e = !0;
                        break
                    }
                }
                i = !1, c && (a.once ? e === !0 ? o.disable() : c = [] : d && d.length && (e = d.shift(), o.fireWith(e[0], e[1])))
            },
            o = {
                add: function () {
                    if (c) {
                        var a = c.length;
                        m(arguments), i ? k = c.length : e && e !== !0 && (j = a, n(e[0], e[1]))
                    }
                    return this
                },
                remove: function () {
                    if (c) {
                        var b = arguments,
                            d = 0,
                            e = b.length;
                        for (; d < e; d++) {
                            for (var f = 0; f < c.length; f++) {
                                if (b[d] === c[f]) {
                                    i && f <= k && (k--, f <= l && l--), c.splice(f--, 1);
                                    if (a.unique) {
                                        break
                                    }
                                }
                            }
                        }
                    }
                    return this
                },
                has: function (a) {
                    if (c) {
                        var b = 0,
                            d = c.length;
                        for (; b < d; b++) {
                            if (a === c[b]) {
                                return !0
                            }
                        }
                    }
                    return !1
                },
                empty: function () {
                    c = [];
                    return this
                },
                disable: function () {
                    c = d = e = b;
                    return this
                },
                disabled: function () {
                    return !c
                },
                lock: function () {
                    d = b, (!e || e === !0) && o.disable();
                    return this
                },
                locked: function () {
                    return !d
                },
                fireWith: function (b, c) {
                    d && (i ? a.once || d.push([b, c]) : (!a.once || !e) && n(b, c));
                    return this
                },
                fire: function () {
                    o.fireWith(this, arguments);
                    return this
                },
                fired: function () {
                    return !!e
                }
            };
        return o
    };
    var i = [].slice;
    f.extend({
        Deferred: function (a) {
            var b = f.Callbacks("once memory"),
                c = f.Callbacks("once memory"),
                d = f.Callbacks("memory"),
                e = "pending",
                g = {
                    resolve: b,
                    reject: c,
                    notify: d
                },
                h = {
                    done: b.add,
                    fail: c.add,
                    progress: d.add,
                    state: function () {
                        return e
                    },
                    isResolved: b.fired,
                    isRejected: c.fired,
                    then: function (a, b, c) {
                        i.done(a).fail(b).progress(c);
                        return this
                    },
                    always: function () {
                        i.done.apply(i, arguments).fail.apply(i, arguments);
                        return this
                    },
                    pipe: function (a, b, c) {
                        return f.Deferred(function (d) {
                            f.each({
                                done: [a, "resolve"],
                                fail: [b, "reject"],
                                progress: [c, "notify"]
                            }, function (a, b) {
                                var c = b[0],
                                    e = b[1],
                                    g;
                                f.isFunction(c) ? i[a](function () {
                                    g = c.apply(this, arguments), g && f.isFunction(g.promise) ? g.promise().then(d.resolve, d.reject, d.notify) : d[e + "With"](this === i ? d : this, [g])
                                }) : i[a](d[e])
                            })
                        }).promise()
                    },
                    promise: function (a) {
                        if (a == null) {
                            a = h
                        } else {
                            for (var b in h) {
                                a[b] = h[b]
                            }
                        }
                        return a
                    }
                },
                i = h.promise({}),
                j;
            for (j in g) {
                i[j] = g[j].fire, i[j + "With"] = g[j].fireWith
            }
            i.done(function () {
                e = "resolved"
            }, c.disable, d.lock).fail(function () {
                e = "rejected"
            }, b.disable, d.lock), a && a.call(i, i);
            return i
        },
        when: function (a) {
            function m(a) {
                return function (b) {
                    e[a] = arguments.length > 1 ? i.call(arguments, 0) : b, j.notifyWith(k, e)
                }
            }

            function l(a) {
                return function (c) {
                    b[a] = arguments.length > 1 ? i.call(arguments, 0) : c, --g || j.resolveWith(j, b)
                }
            }
            var b = i.call(arguments, 0),
                c = 0,
                d = b.length,
                e = Array(d),
                g = d,
                h = d,
                j = d <= 1 && a && f.isFunction(a.promise) ? a : f.Deferred(),
                k = j.promise();
            if (d > 1) {
                for (; c < d; c++) {
                    b[c] && b[c].promise && f.isFunction(b[c].promise) ? b[c].promise().then(l(c), j.reject, m(c)) : --g
                }
                g || j.resolveWith(j, b)
            } else {
                j !== a && j.resolveWith(j, d ? [a] : [])
            }
            return k
        }
    }), f.support = function () {
        var b, d, e, g, h, i, j, k, l, m, n, o, p, q = c.createElement("div"),
            r = c.documentElement;
        q.setAttribute("className", "t"), q.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>", d = q.getElementsByTagName("*"), e = q.getElementsByTagName("a")[0];
        if (!d || !d.length || !e) {
            return {}
        }
        g = c.createElement("select"), h = g.appendChild(c.createElement("option")), i = q.getElementsByTagName("input")[0], b = {
            leadingWhitespace: q.firstChild.nodeType === 3,
            tbody: !q.getElementsByTagName("tbody").length,
            htmlSerialize: !!q.getElementsByTagName("link").length,
            style: /top/.test(e.getAttribute("style")),
            hrefNormalized: e.getAttribute("href") === "/a",
            opacity: /^0.55/.test(e.style.opacity),
            cssFloat: !!e.style.cssFloat,
            checkOn: i.value === "on",
            optSelected: h.selected,
            getSetAttribute: q.className !== "t",
            enctype: !!c.createElement("form").enctype,
            html5Clone: c.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",
            submitBubbles: !0,
            changeBubbles: !0,
            focusinBubbles: !1,
            deleteExpando: !0,
            noCloneEvent: !0,
            inlineBlockNeedsLayout: !1,
            shrinkWrapBlocks: !1,
            reliableMarginRight: !0
        }, i.checked = !0, b.noCloneChecked = i.cloneNode(!0).checked, g.disabled = !0, b.optDisabled = !h.disabled;
        try {
            delete q.test
        } catch (s) {
            b.deleteExpando = !1
        }!q.addEventListener && q.attachEvent && q.fireEvent && (q.attachEvent("onclick", function () {
            b.noCloneEvent = !1
        }), q.cloneNode(!0).fireEvent("onclick")), i = c.createElement("input"), i.value = "t", i.setAttribute("type", "radio"), b.radioValue = i.value === "t", i.setAttribute("checked", "checked"), q.appendChild(i), k = c.createDocumentFragment(), k.appendChild(q.lastChild), b.checkClone = k.cloneNode(!0).cloneNode(!0).lastChild.checked, b.appendChecked = i.checked, k.removeChild(i), k.appendChild(q), q.innerHTML = "", a.getComputedStyle && (j = c.createElement("div"), j.style.width = "0", j.style.marginRight = "0", q.style.width = "2px", q.appendChild(j), b.reliableMarginRight = (parseInt((a.getComputedStyle(j, null) || {
            marginRight: 0
        }).marginRight, 10) || 0) === 0);
        if (q.attachEvent) {
            for (o in {
                    submit: 1,
                    change: 1,
                    focusin: 1
                }) {
                n = "on" + o, p = n in q, p || (q.setAttribute(n, "return;"), p = typeof q[n] == "function"), b[o + "Bubbles"] = p
            }
        }
        k.removeChild(q), k = g = h = j = q = i = null, f(function () {
            var a, d, e, g, h, i, j, k, m, n, o, r = c.getElementsByTagName("body")[0];
            !r || (j = 1, k = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;", m = "visibility:hidden;border:0;", n = "style='" + k + "border:5px solid #000;padding:0;'", o = "<div " + n + "><div></div></div>" + "<table " + n + " cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>", a = c.createElement("div"), a.style.cssText = m + "width:0;height:0;position:static;top:0;margin-top:" + j + "px", r.insertBefore(a, r.firstChild), q = c.createElement("div"), a.appendChild(q), q.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>", l = q.getElementsByTagName("td"), p = l[0].offsetHeight === 0, l[0].style.display = "", l[1].style.display = "none", b.reliableHiddenOffsets = p && l[0].offsetHeight === 0, q.innerHTML = "", q.style.width = q.style.paddingLeft = "1px", f.boxModel = b.boxModel = q.offsetWidth === 2, typeof q.style.zoom != "undefined" && (q.style.display = "inline", q.style.zoom = 1, b.inlineBlockNeedsLayout = q.offsetWidth === 2, q.style.display = "", q.innerHTML = "<div style='width:4px;'></div>", b.shrinkWrapBlocks = q.offsetWidth !== 2), q.style.cssText = k + m, q.innerHTML = o, d = q.firstChild, e = d.firstChild, h = d.nextSibling.firstChild.firstChild, i = {
                doesNotAddBorder: e.offsetTop !== 5,
                doesAddBorderForTableAndCells: h.offsetTop === 5
            }, e.style.position = "fixed", e.style.top = "20px", i.fixedPosition = e.offsetTop === 20 || e.offsetTop === 15, e.style.position = e.style.top = "", d.style.overflow = "hidden", d.style.position = "relative", i.subtractsBorderForOverflowNotVisible = e.offsetTop === -5, i.doesNotIncludeMarginInBodyOffset = r.offsetTop !== j, r.removeChild(a), q = a = null, f.extend(b, i))
        });
        return b
    }();
    var j = /^(?:\{.*\}|\[.*\])$/,
        k = /([A-Z])/g;
    f.extend({
        cache: {},
        uuid: 0,
        expando: "jQuery" + (f.fn.jquery + Math.random()).replace(/\D/g, ""),
        noData: {
            embed: !0,
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            applet: !0
        },
        hasData: function (a) {
            a = a.nodeType ? f.cache[a[f.expando]] : a[f.expando];
            return !!a && !m(a)
        },
        data: function (a, c, d, e) {
            if (!!f.acceptData(a)) {
                var g, h, i, j = f.expando,
                    k = typeof c == "string",
                    l = a.nodeType,
                    m = l ? f.cache : a,
                    n = l ? a[j] : a[j] && j,
                    o = c === "events";
                if ((!n || !m[n] || !o && !e && !m[n].data) && k && d === b) {
                    return
                }
                n || (l ? a[j] = n = ++f.uuid : n = j), m[n] || (m[n] = {}, l || (m[n].toJSON = f.noop));
                if (typeof c == "object" || typeof c == "function") {
                    e ? m[n] = f.extend(m[n], c) : m[n].data = f.extend(m[n].data, c)
                }
                g = h = m[n], e || (h.data || (h.data = {}), h = h.data), d !== b && (h[f.camelCase(c)] = d);
                if (o && !h[c]) {
                    return g.events
                }
                k ? (i = h[c], i == null && (i = h[f.camelCase(c)])) : i = h;
                return i
            }
        },
        removeData: function (a, b, c) {
            if (!!f.acceptData(a)) {
                var d, e, g, h = f.expando,
                    i = a.nodeType,
                    j = i ? f.cache : a,
                    k = i ? a[h] : h;
                if (!j[k]) {
                    return
                }
                if (b) {
                    d = c ? j[k] : j[k].data;
                    if (d) {
                        f.isArray(b) || (b in d ? b = [b] : (b = f.camelCase(b), b in d ? b = [b] : b = b.split(" ")));
                        for (e = 0, g = b.length; e < g; e++) {
                            delete d[b[e]]
                        }
                        if (!(c ? m : f.isEmptyObject)(d)) {
                            return
                        }
                    }
                }
                if (!c) {
                    delete j[k].data;
                    if (!m(j[k])) {
                        return
                    }
                }
                f.support.deleteExpando || !j.setInterval ? delete j[k] : j[k] = null, i && (f.support.deleteExpando ? delete a[h] : a.removeAttribute ? a.removeAttribute(h) : a[h] = null)
            }
        },
        _data: function (a, b, c) {
            return f.data(a, b, c, !0)
        },
        acceptData: function (a) {
            if (a.nodeName) {
                var b = f.noData[a.nodeName.toLowerCase()];
                if (b) {
                    return b !== !0 && a.getAttribute("classid") === b
                }
            }
            return !0
        }
    }), f.fn.extend({
        data: function (a, c) {
            var d, e, g, h = null;
            if (typeof a == "undefined") {
                if (this.length) {
                    h = f.data(this[0]);
                    if (this[0].nodeType === 1 && !f._data(this[0], "parsedAttrs")) {
                        e = this[0].attributes;
                        for (var i = 0, j = e.length; i < j; i++) {
                            g = e[i].name, g.indexOf("data-") === 0 && (g = f.camelCase(g.substring(5)), l(this[0], g, h[g]))
                        }
                        f._data(this[0], "parsedAttrs", !0)
                    }
                }
                return h
            }
            if (typeof a == "object") {
                return this.each(function () {
                    f.data(this, a)
                })
            }
            d = a.split("."), d[1] = d[1] ? "." + d[1] : "";
            if (c === b) {
                h = this.triggerHandler("getData" + d[1] + "!", [d[0]]), h === b && this.length && (h = f.data(this[0], a), h = l(this[0], a, h));
                return h === b && d[1] ? this.data(d[0]) : h
            }
            return this.each(function () {
                var b = f(this),
                    e = [d[0], c];
                b.triggerHandler("setData" + d[1] + "!", e), f.data(this, a, c), b.triggerHandler("changeData" + d[1] + "!", e)
            })
        },
        removeData: function (a) {
            return this.each(function () {
                f.removeData(this, a)
            })
        }
    }), f.extend({
        _mark: function (a, b) {
            a && (b = (b || "fx") + "mark", f._data(a, b, (f._data(a, b) || 0) + 1))
        },
        _unmark: function (a, b, c) {
            a !== !0 && (c = b, b = a, a = !1);
            if (b) {
                c = c || "fx";
                var d = c + "mark",
                    e = a ? 0 : (f._data(b, d) || 1) - 1;
                e ? f._data(b, d, e) : (f.removeData(b, d, !0), n(b, c, "mark"))
            }
        },
        queue: function (a, b, c) {
            var d;
            if (a) {
                b = (b || "fx") + "queue", d = f._data(a, b), c && (!d || f.isArray(c) ? d = f._data(a, b, f.makeArray(c)) : d.push(c));
                return d || []
            }
        },
        dequeue: function (a, b) {
            b = b || "fx";
            var c = f.queue(a, b),
                d = c.shift(),
                e = {};
            d === "inprogress" && (d = c.shift()), d && (b === "fx" && c.unshift("inprogress"), f._data(a, b + ".run", e), d.call(a, function () {
                f.dequeue(a, b)
            }, e)), c.length || (f.removeData(a, b + "queue " + b + ".run", !0), n(a, b, "queue"))
        }
    }), f.fn.extend({
        queue: function (a, c) {
            typeof a != "string" && (c = a, a = "fx");
            if (c === b) {
                return f.queue(this[0], a)
            }
            return this.each(function () {
                var b = f.queue(this, a, c);
                a === "fx" && b[0] !== "inprogress" && f.dequeue(this, a)
            })
        },
        dequeue: function (a) {
            return this.each(function () {
                f.dequeue(this, a)
            })
        },
        delay: function (a, b) {
            a = f.fx ? f.fx.speeds[a] || a : a, b = b || "fx";
            return this.queue(b, function (b, c) {
                var d = setTimeout(b, a);
                c.stop = function () {
                    clearTimeout(d)
                }
            })
        },
        clearQueue: function (a) {
            return this.queue(a || "fx", [])
        },
        promise: function (a, c) {
            function m() {
                --h || d.resolveWith(e, [e])
            }
            typeof a != "string" && (c = a, a = b), a = a || "fx";
            var d = f.Deferred(),
                e = this,
                g = e.length,
                h = 1,
                i = a + "defer",
                j = a + "queue",
                k = a + "mark",
                l;
            while (g--) {
                if (l = f.data(e[g], i, b, !0) || (f.data(e[g], j, b, !0) || f.data(e[g], k, b, !0)) && f.data(e[g], i, f.Callbacks("once memory"), !0)) {
                    h++, l.add(m)
                }
            }
            m();
            return d.promise()
        }
    });
    var o = /[\n\t\r]/g,
        p = /\s+/,
        q = /\r/g,
        r = /^(?:button|input)$/i,
        s = /^(?:button|input|object|select|textarea)$/i,
        t = /^a(?:rea)?$/i,
        u = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        v = f.support.getSetAttribute,
        w, x, y;
    f.fn.extend({
        attr: function (a, b) {
            return f.access(this, a, b, !0, f.attr)
        },
        removeAttr: function (a) {
            return this.each(function () {
                f.removeAttr(this, a)
            })
        },
        prop: function (a, b) {
            return f.access(this, a, b, !0, f.prop)
        },
        removeProp: function (a) {
            a = f.propFix[a] || a;
            return this.each(function () {
                try {
                    this[a] = b, delete this[a]
                } catch (c) {}
            })
        },
        addClass: function (a) {
            var b, c, d, e, g, h, i;
            if (f.isFunction(a)) {
                return this.each(function (b) {
                    f(this).addClass(a.call(this, b, this.className))
                })
            }
            if (a && typeof a == "string") {
                b = a.split(p);
                for (c = 0, d = this.length; c < d; c++) {
                    e = this[c];
                    if (e.nodeType === 1) {
                        if (!e.className && b.length === 1) {
                            e.className = a
                        } else {
                            g = " " + e.className + " ";
                            for (h = 0, i = b.length; h < i; h++) {
                                ~g.indexOf(" " + b[h] + " ") || (g += b[h] + " ")
                            }
                            e.className = f.trim(g)
                        }
                    }
                }
            }
            return this
        },
        removeClass: function (a) {
            var c, d, e, g, h, i, j;
            if (f.isFunction(a)) {
                return this.each(function (b) {
                    f(this).removeClass(a.call(this, b, this.className))
                })
            }
            if (a && typeof a == "string" || a === b) {
                c = (a || "").split(p);
                for (d = 0, e = this.length; d < e; d++) {
                    g = this[d];
                    if (g.nodeType === 1 && g.className) {
                        if (a) {
                            h = (" " + g.className + " ").replace(o, " ");
                            for (i = 0, j = c.length; i < j; i++) {
                                h = h.replace(" " + c[i] + " ", " ")
                            }
                            g.className = f.trim(h)
                        } else {
                            g.className = ""
                        }
                    }
                }
            }
            return this
        },
        toggleClass: function (a, b) {
            var c = typeof a,
                d = typeof b == "boolean";
            if (f.isFunction(a)) {
                return this.each(function (c) {
                    f(this).toggleClass(a.call(this, c, this.className, b), b)
                })
            }
            return this.each(function () {
                if (c === "string") {
                    var e, g = 0,
                        h = f(this),
                        i = b,
                        j = a.split(p);
                    while (e = j[g++]) {
                        i = d ? i : !h.hasClass(e), h[i ? "addClass" : "removeClass"](e)
                    }
                } else {
                    if (c === "undefined" || c === "boolean") {
                        this.className && f._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : f._data(this, "__className__") || ""
                    }
                }
            })
        },
        hasClass: function (a) {
            var b = " " + a + " ",
                c = 0,
                d = this.length;
            for (; c < d; c++) {
                if (this[c].nodeType === 1 && (" " + this[c].className + " ").replace(o, " ").indexOf(b) > -1) {
                    return !0
                }
            }
            return !1
        },
        val: function (a) {
            var c, d, e, g = this[0];
            if (!!arguments.length) {
                e = f.isFunction(a);
                return this.each(function (d) {
                    var g = f(this),
                        h;
                    if (this.nodeType === 1) {
                        e ? h = a.call(this, d, g.val()) : h = a, h == null ? h = "" : typeof h == "number" ? h += "" : f.isArray(h) && (h = f.map(h, function (a) {
                            return a == null ? "" : a + ""
                        })), c = f.valHooks[this.nodeName.toLowerCase()] || f.valHooks[this.type];
                        if (!c || !("set" in c) || c.set(this, h, "value") === b) {
                            this.value = h
                        }
                    }
                })
            }
            if (g) {
                c = f.valHooks[g.nodeName.toLowerCase()] || f.valHooks[g.type];
                if (c && "get" in c && (d = c.get(g, "value")) !== b) {
                    return d
                }
                d = g.value;
                return typeof d == "string" ? d.replace(q, "") : d == null ? "" : d
            }
        }
    }), f.extend({
        valHooks: {
            option: {
                get: function (a) {
                    var b = a.attributes.value;
                    return !b || b.specified ? a.value : a.text
                }
            },
            select: {
                get: function (a) {
                    var b, c, d, e, g = a.selectedIndex,
                        h = [],
                        i = a.options,
                        j = a.type === "select-one";
                    if (g < 0) {
                        return null
                    }
                    c = j ? g : 0, d = j ? g + 1 : i.length;
                    for (; c < d; c++) {
                        e = i[c];
                        if (e.selected && (f.support.optDisabled ? !e.disabled : e.getAttribute("disabled") === null) && (!e.parentNode.disabled || !f.nodeName(e.parentNode, "optgroup"))) {
                            b = f(e).val();
                            if (j) {
                                return b
                            }
                            h.push(b)
                        }
                    }
                    if (j && !h.length && i.length) {
                        return f(i[g]).val()
                    }
                    return h
                },
                set: function (a, b) {
                    var c = f.makeArray(b);
                    f(a).find("option").each(function () {
                        this.selected = f.inArray(f(this).val(), c) >= 0
                    }), c.length || (a.selectedIndex = -1);
                    return c
                }
            }
        },
        attrFn: {
            val: !0,
            css: !0,
            html: !0,
            text: !0,
            data: !0,
            width: !0,
            height: !0,
            offset: !0
        },
        attr: function (a, c, d, e) {
            var g, h, i, j = a.nodeType;
            if (!!a && j !== 3 && j !== 8 && j !== 2) {
                if (e && c in f.attrFn) {
                    return f(a)[c](d)
                }
                if (typeof a.getAttribute == "undefined") {
                    return f.prop(a, c, d)
                }
                i = j !== 1 || !f.isXMLDoc(a), i && (c = c.toLowerCase(), h = f.attrHooks[c] || (u.test(c) ? x : w));
                if (d !== b) {
                    if (d === null) {
                        f.removeAttr(a, c);
                        return
                    }
                    if (h && "set" in h && i && (g = h.set(a, d, c)) !== b) {
                        return g
                    }
                    a.setAttribute(c, "" + d);
                    return d
                }
                if (h && "get" in h && i && (g = h.get(a, c)) !== null) {
                    return g
                }
                g = a.getAttribute(c);
                return g === null ? b : g
            }
        },
        removeAttr: function (a, b) {
            var c, d, e, g, h = 0;
            if (b && a.nodeType === 1) {
                d = b.toLowerCase().split(p), g = d.length;
                for (; h < g; h++) {
                    e = d[h], e && (c = f.propFix[e] || e, f.attr(a, e, ""), a.removeAttribute(v ? e : c), u.test(e) && c in a && (a[c] = !1))
                }
            }
        },
        attrHooks: {
            type: {
                set: function (a, b) {
                    if (r.test(a.nodeName) && a.parentNode) {
                        f.error("type property can't be changed")
                    } else {
                        if (!f.support.radioValue && b === "radio" && f.nodeName(a, "input")) {
                            var c = a.value;
                            a.setAttribute("type", b), c && (a.value = c);
                            return b
                        }
                    }
                }
            },
            value: {
                get: function (a, b) {
                    if (w && f.nodeName(a, "button")) {
                        return w.get(a, b)
                    }
                    return b in a ? a.value : null
                },
                set: function (a, b, c) {
                    if (w && f.nodeName(a, "button")) {
                        return w.set(a, b, c)
                    }
                    a.value = b
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function (a, c, d) {
            var e, g, h, i = a.nodeType;
            if (!!a && i !== 3 && i !== 8 && i !== 2) {
                h = i !== 1 || !f.isXMLDoc(a), h && (c = f.propFix[c] || c, g = f.propHooks[c]);
                return d !== b ? g && "set" in g && (e = g.set(a, d, c)) !== b ? e : a[c] = d : g && "get" in g && (e = g.get(a, c)) !== null ? e : a[c]
            }
        },
        propHooks: {
            tabIndex: {
                get: function (a) {
                    var c = a.getAttributeNode("tabindex");
                    return c && c.specified ? parseInt(c.value, 10) : s.test(a.nodeName) || t.test(a.nodeName) && a.href ? 0 : b
                }
            }
        }
    }), f.attrHooks.tabindex = f.propHooks.tabIndex, x = {
        get: function (a, c) {
            var d, e = f.prop(a, c);
            return e === !0 || typeof e != "boolean" && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b
        },
        set: function (a, b, c) {
            var d;
            b === !1 ? f.removeAttr(a, c) : (d = f.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase()));
            return c
        }
    }, v || (y = {
        name: !0,
        id: !0
    }, w = f.valHooks.button = {
        get: function (a, c) {
            var d;
            d = a.getAttributeNode(c);
            return d && (y[c] ? d.nodeValue !== "" : d.specified) ? d.nodeValue : b
        },
        set: function (a, b, d) {
            var e = a.getAttributeNode(d);
            e || (e = c.createAttribute(d), a.setAttributeNode(e));
            return e.nodeValue = b + ""
        }
    }, f.attrHooks.tabindex.set = w.set, f.each(["width", "height"], function (a, b) {
        f.attrHooks[b] = f.extend(f.attrHooks[b], {
            set: function (a, c) {
                if (c === "") {
                    a.setAttribute(b, "auto");
                    return c
                }
            }
        })
    }), f.attrHooks.contenteditable = {
        get: w.get,
        set: function (a, b, c) {
            b === "" && (b = "false"), w.set(a, b, c)
        }
    }), f.support.hrefNormalized || f.each(["href", "src", "width", "height"], function (a, c) {
        f.attrHooks[c] = f.extend(f.attrHooks[c], {
            get: function (a) {
                var d = a.getAttribute(c, 2);
                return d === null ? b : d
            }
        })
    }), f.support.style || (f.attrHooks.style = {
        get: function (a) {
            return a.style.cssText.toLowerCase() || b
        },
        set: function (a, b) {
            return a.style.cssText = "" + b
        }
    }), f.support.optSelected || (f.propHooks.selected = f.extend(f.propHooks.selected, {
        get: function (a) {
            var b = a.parentNode;
            b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex);
            return null
        }
    })), f.support.enctype || (f.propFix.enctype = "encoding"), f.support.checkOn || f.each(["radio", "checkbox"], function () {
        f.valHooks[this] = {
            get: function (a) {
                return a.getAttribute("value") === null ? "on" : a.value
            }
        }
    }), f.each(["radio", "checkbox"], function () {
        f.valHooks[this] = f.extend(f.valHooks[this], {
            set: function (a, b) {
                if (f.isArray(b)) {
                    return a.checked = f.inArray(f(a).val(), b) >= 0
                }
            }
        })
    });
    var z = /^(?:textarea|input|select)$/i,
        A = /^([^\.]*)?(?:\.(.+))?$/,
        B = /\bhover(\.\S+)?\b/,
        C = /^key/,
        D = /^(?:mouse|contextmenu)|click/,
        E = /^(?:focusinfocus|focusoutblur)$/,
        F = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
        G = function (a) {
            var b = F.exec(a);
            b && (b[1] = (b[1] || "").toLowerCase(), b[3] = b[3] && new RegExp("(?:^|\\s)" + b[3] + "(?:\\s|$)"));
            return b
        },
        H = function (a, b) {
            var c = a.attributes || {};
            return (!b[1] || a.nodeName.toLowerCase() === b[1]) && (!b[2] || (c.id || {}).value === b[2]) && (!b[3] || b[3].test((c["class"] || {}).value))
        },
        I = function (a) {
            return f.event.special.hover ? a : a.replace(B, "mouseenter$1 mouseleave$1")
        };
    f.event = {
            add: function (a, c, d, e, g) {
                var h, i, j, k, l, m, n, o, p, q, r, s;
                if (!(a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(h = f._data(a)))) {
                    d.handler && (p = d, d = p.handler), d.guid || (d.guid = f.guid++), j = h.events, j || (h.events = j = {}), i = h.handle, i || (h.handle = i = function (a) {
                        return typeof f != "undefined" && (!a || f.event.triggered !== a.type) ? f.event.dispatch.apply(i.elem, arguments) : b
                    }, i.elem = a), c = f.trim(I(c)).split(" ");
                    for (k = 0; k < c.length; k++) {
                        l = A.exec(c[k]) || [], m = l[1], n = (l[2] || "").split(".").sort(), s = f.event.special[m] || {}, m = (g ? s.delegateType : s.bindType) || m, s = f.event.special[m] || {}, o = f.extend({
                            type: m,
                            origType: l[1],
                            data: e,
                            handler: d,
                            guid: d.guid,
                            selector: g,
                            quick: G(g),
                            namespace: n.join(".")
                        }, p), r = j[m];
                        if (!r) {
                            r = j[m] = [], r.delegateCount = 0;
                            if (!s.setup || s.setup.call(a, e, n, i) === !1) {
                                a.addEventListener ? a.addEventListener(m, i, !1) : a.attachEvent && a.attachEvent("on" + m, i)
                            }
                        }
                        s.add && (s.add.call(a, o), o.handler.guid || (o.handler.guid = d.guid)), g ? r.splice(r.delegateCount++, 0, o) : r.push(o), f.event.global[m] = !0
                    }
                    a = null
                }
            },
            global: {},
            remove: function (a, b, c, d, e) {
                var g = f.hasData(a) && f._data(a),
                    h, i, j, k, l, m, n, o, p, q, r, s;
                if (!!g && !!(o = g.events)) {
                    b = f.trim(I(b || "")).split(" ");
                    for (h = 0; h < b.length; h++) {
                        i = A.exec(b[h]) || [], j = k = i[1], l = i[2];
                        if (!j) {
                            for (j in o) {
                                f.event.remove(a, j + b[h], c, d, !0)
                            }
                            continue
                        }
                        p = f.event.special[j] || {}, j = (d ? p.delegateType : p.bindType) || j, r = o[j] || [], m = r.length, l = l ? new RegExp("(^|\\.)" + l.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                        for (n = 0; n < r.length; n++) {
                            s = r[n], (e || k === s.origType) && (!c || c.guid === s.guid) && (!l || l.test(s.namespace)) && (!d || d === s.selector || d === "**" && s.selector) && (r.splice(n--, 1), s.selector && r.delegateCount--, p.remove && p.remove.call(a, s))
                        }
                        r.length === 0 && m !== r.length && ((!p.teardown || p.teardown.call(a, l) === !1) && f.removeEvent(a, j, g.handle), delete o[j])
                    }
                    f.isEmptyObject(o) && (q = g.handle, q && (q.elem = null), f.removeData(a, ["events", "handle"], !0))
                }
            },
            customEvent: {
                getData: !0,
                setData: !0,
                changeData: !0
            },
            trigger: function (c, d, e, g) {
                if (!e || e.nodeType !== 3 && e.nodeType !== 8) {
                    var h = c.type || c,
                        i = [],
                        j, k, l, m, n, o, p, q, r, s;
                    if (E.test(h + f.event.triggered)) {
                        return
                    }
                    h.indexOf("!") >= 0 && (h = h.slice(0, -1), k = !0), h.indexOf(".") >= 0 && (i = h.split("."), h = i.shift(), i.sort());
                    if ((!e || f.event.customEvent[h]) && !f.event.global[h]) {
                        return
                    }
                    c = typeof c == "object" ? c[f.expando] ? c : new f.Event(h, c) : new f.Event(h), c.type = h, c.isTrigger = !0, c.exclusive = k, c.namespace = i.join("."), c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + i.join("\\.(?:.*\\.)?") + "(\\.|$)") : null, o = h.indexOf(":") < 0 ? "on" + h : "";
                    if (!e) {
                        j = f.cache;
                        for (l in j) {
                            j[l].events && j[l].events[h] && f.event.trigger(c, d, j[l].handle.elem, !0)
                        }
                        return
                    }
                    c.result = b, c.target || (c.target = e), d = d != null ? f.makeArray(d) : [], d.unshift(c), p = f.event.special[h] || {};
                    if (p.trigger && p.trigger.apply(e, d) === !1) {
                        return
                    }
                    r = [
                        [e, p.bindType || h]
                    ];
                    if (!g && !p.noBubble && !f.isWindow(e)) {
                        s = p.delegateType || h, m = E.test(s + h) ? e : e.parentNode, n = null;
                        for (; m; m = m.parentNode) {
                            r.push([m, s]), n = m
                        }
                        n && n === e.ownerDocument && r.push([n.defaultView || n.parentWindow || a, s])
                    }
                    for (l = 0; l < r.length && !c.isPropagationStopped(); l++) {
                        m = r[l][0], c.type = r[l][1], q = (f._data(m, "events") || {})[c.type] && f._data(m, "handle"), q && q.apply(m, d), q = o && m[o], q && f.acceptData(m) && q.apply(m, d) === !1 && c.preventDefault()
                    }
                    c.type = h, !g && !c.isDefaultPrevented() && (!p._default || p._default.apply(e.ownerDocument, d) === !1) && (h !== "click" || !f.nodeName(e, "a")) && f.acceptData(e) && o && e[h] && (h !== "focus" && h !== "blur" || c.target.offsetWidth !== 0) && !f.isWindow(e) && (n = e[o], n && (e[o] = null), f.event.triggered = h, e[h](), f.event.triggered = b, n && (e[o] = n));
                    return c.result
                }
            },
            dispatch: function (c) {
                c = f.event.fix(c || a.event);
                var d = (f._data(this, "events") || {})[c.type] || [],
                    e = d.delegateCount,
                    g = [].slice.call(arguments, 0),
                    h = !c.exclusive && !c.namespace,
                    i = [],
                    j, k, l, m, n, o, p, q, r, s, t;
                g[0] = c, c.delegateTarget = this;
                if (e && !c.target.disabled && (!c.button || c.type !== "click")) {
                    m = f(this), m.context = this.ownerDocument || this;
                    for (l = c.target; l != this; l = l.parentNode || this) {
                        o = {}, q = [], m[0] = l;
                        for (j = 0; j < e; j++) {
                            r = d[j], s = r.selector, o[s] === b && (o[s] = r.quick ? H(l, r.quick) : m.is(s)), o[s] && q.push(r)
                        }
                        q.length && i.push({
                            elem: l,
                            matches: q
                        })
                    }
                }
                d.length > e && i.push({
                    elem: this,
                    matches: d.slice(e)
                });
                for (j = 0; j < i.length && !c.isPropagationStopped(); j++) {
                    p = i[j], c.currentTarget = p.elem;
                    for (k = 0; k < p.matches.length && !c.isImmediatePropagationStopped(); k++) {
                        r = p.matches[k];
                        if (h || !c.namespace && !r.namespace || c.namespace_re && c.namespace_re.test(r.namespace)) {
                            c.data = r.data, c.handleObj = r, n = ((f.event.special[r.origType] || {}).handle || r.handler).apply(p.elem, g), n !== b && (c.result = n, n === !1 && (c.preventDefault(), c.stopPropagation()))
                        }
                    }
                }
                return c.result
            },
            props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function (a, b) {
                    a.which == null && (a.which = b.charCode != null ? b.charCode : b.keyCode);
                    return a
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function (a, d) {
                    var e, f, g, h = d.button,
                        i = d.fromElement;
                    a.pageX == null && d.clientX != null && (e = a.target.ownerDocument || c, f = e.documentElement, g = e.body, a.pageX = d.clientX + (f && f.scrollLeft || g && g.scrollLeft || 0) - (f && f.clientLeft || g && g.clientLeft || 0), a.pageY = d.clientY + (f && f.scrollTop || g && g.scrollTop || 0) - (f && f.clientTop || g && g.clientTop || 0)), !a.relatedTarget && i && (a.relatedTarget = i === a.target ? d.toElement : i), !a.which && h !== b && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0);
                    return a
                }
            },
            fix: function (a) {
                if (a[f.expando]) {
                    return a
                }
                var d, e, g = a,
                    h = f.event.fixHooks[a.type] || {},
                    i = h.props ? this.props.concat(h.props) : this.props;
                a = f.Event(g);
                for (d = i.length; d;) {
                    e = i[--d], a[e] = g[e]
                }
                a.target || (a.target = g.srcElement || c), a.target.nodeType === 3 && (a.target = a.target.parentNode), a.metaKey === b && (a.metaKey = a.ctrlKey);
                return h.filter ? h.filter(a, g) : a
            },
            special: {
                ready: {
                    setup: f.bindReady
                },
                load: {
                    noBubble: !0
                },
                focus: {
                    delegateType: "focusin"
                },
                blur: {
                    delegateType: "focusout"
                },
                beforeunload: {
                    setup: function (a, b, c) {
                        f.isWindow(this) && (this.onbeforeunload = c)
                    },
                    teardown: function (a, b) {
                        this.onbeforeunload === b && (this.onbeforeunload = null)
                    }
                }
            },
            simulate: function (a, b, c, d) {
                var e = f.extend(new f.Event, c, {
                    type: a,
                    isSimulated: !0,
                    originalEvent: {}
                });
                d ? f.event.trigger(e, null, b) : f.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
            }
        }, f.event.handle = f.event.dispatch, f.removeEvent = c.removeEventListener ? function (a, b, c) {
            a.removeEventListener && a.removeEventListener(b, c, !1)
        } : function (a, b, c) {
            a.detachEvent && a.detachEvent("on" + b, c)
        }, f.Event = function (a, b) {
            if (!(this instanceof f.Event)) {
                return new f.Event(a, b)
            }
            a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? K : J) : this.type = a, b && f.extend(this, b), this.timeStamp = a && a.timeStamp || f.now(), this[f.expando] = !0
        }, f.Event.prototype = {
            preventDefault: function () {
                this.isDefaultPrevented = K;
                var a = this.originalEvent;
                !a || (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
            },
            stopPropagation: function () {
                this.isPropagationStopped = K;
                var a = this.originalEvent;
                !a || (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
            },
            stopImmediatePropagation: function () {
                this.isImmediatePropagationStopped = K, this.stopPropagation()
            },
            isDefaultPrevented: J,
            isPropagationStopped: J,
            isImmediatePropagationStopped: J
        }, f.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }, function (a, b) {
            f.event.special[a] = {
                delegateType: b,
                bindType: b,
                handle: function (a) {
                    var c = this,
                        d = a.relatedTarget,
                        e = a.handleObj,
                        g = e.selector,
                        h;
                    if (!d || d !== c && !f.contains(c, d)) {
                        a.type = e.origType, h = e.handler.apply(this, arguments), a.type = b
                    }
                    return h
                }
            }
        }), f.support.submitBubbles || (f.event.special.submit = {
            setup: function () {
                if (f.nodeName(this, "form")) {
                    return !1
                }
                f.event.add(this, "click._submit keypress._submit", function (a) {
                    var c = a.target,
                        d = f.nodeName(c, "input") || f.nodeName(c, "button") ? c.form : b;
                    d && !d._submit_attached && (f.event.add(d, "submit._submit", function (a) {
                        this.parentNode && !a.isTrigger && f.event.simulate("submit", this.parentNode, a, !0)
                    }), d._submit_attached = !0)
                })
            },
            teardown: function () {
                if (f.nodeName(this, "form")) {
                    return !1
                }
                f.event.remove(this, "._submit")
            }
        }), f.support.changeBubbles || (f.event.special.change = {
            setup: function () {
                if (z.test(this.nodeName)) {
                    if (this.type === "checkbox" || this.type === "radio") {
                        f.event.add(this, "propertychange._change", function (a) {
                            a.originalEvent.propertyName === "checked" && (this._just_changed = !0)
                        }), f.event.add(this, "click._change", function (a) {
                            this._just_changed && !a.isTrigger && (this._just_changed = !1, f.event.simulate("change", this, a, !0))
                        })
                    }
                    return !1
                }
                f.event.add(this, "beforeactivate._change", function (a) {
                    var b = a.target;
                    z.test(b.nodeName) && !b._change_attached && (f.event.add(b, "change._change", function (a) {
                        this.parentNode && !a.isSimulated && !a.isTrigger && f.event.simulate("change", this.parentNode, a, !0)
                    }), b._change_attached = !0)
                })
            },
            handle: function (a) {
                var b = a.target;
                if (this !== b || a.isSimulated || a.isTrigger || b.type !== "radio" && b.type !== "checkbox") {
                    return a.handleObj.handler.apply(this, arguments)
                }
            },
            teardown: function () {
                f.event.remove(this, "._change");
                return z.test(this.nodeName)
            }
        }), f.support.focusinBubbles || f.each({
            focus: "focusin",
            blur: "focusout"
        }, function (a, b) {
            var d = 0,
                e = function (a) {
                    f.event.simulate(b, a.target, f.event.fix(a), !0)
                };
            f.event.special[b] = {
                setup: function () {
                    d++ === 0 && c.addEventListener(a, e, !0)
                },
                teardown: function () {
                    --d === 0 && c.removeEventListener(a, e, !0)
                }
            }
        }), f.fn.extend({
            on: function (a, c, d, e, g) {
                var h, i;
                if (typeof a == "object") {
                    typeof c != "string" && (d = c, c = b);
                    for (i in a) {
                        this.on(i, c, d, a[i], g)
                    }
                    return this
                }
                d == null && e == null ? (e = c, d = c = b) : e == null && (typeof c == "string" ? (e = d, d = b) : (e = d, d = c, c = b));
                if (e === !1) {
                    e = J
                } else {
                    if (!e) {
                        return this
                    }
                }
                g === 1 && (h = e, e = function (a) {
                    f().off(a);
                    return h.apply(this, arguments)
                }, e.guid = h.guid || (h.guid = f.guid++));
                return this.each(function () {
                    f.event.add(this, a, e, d, c)
                })
            },
            one: function (a, b, c, d) {
                return this.on.call(this, a, b, c, d, 1)
            },
            off: function (a, c, d) {
                if (a && a.preventDefault && a.handleObj) {
                    var e = a.handleObj;
                    f(a.delegateTarget).off(e.namespace ? e.type + "." + e.namespace : e.type, e.selector, e.handler);
                    return this
                }
                if (typeof a == "object") {
                    for (var g in a) {
                        this.off(g, c, a[g])
                    }
                    return this
                }
                if (c === !1 || typeof c == "function") {
                    d = c, c = b
                }
                d === !1 && (d = J);
                return this.each(function () {
                    f.event.remove(this, a, d, c)
                })
            },
            bind: function (a, b, c) {
                return this.on(a, null, b, c)
            },
            unbind: function (a, b) {
                return this.off(a, null, b)
            },
            live: function (a, b, c) {
                f(this.context).on(a, this.selector, b, c);
                return this
            },
            die: function (a, b) {
                f(this.context).off(a, this.selector || "**", b);
                return this
            },
            delegate: function (a, b, c, d) {
                return this.on(b, a, c, d)
            },
            undelegate: function (a, b, c) {
                return arguments.length == 1 ? this.off(a, "**") : this.off(b, a, c)
            },
            trigger: function (a, b) {
                return this.each(function () {
                    f.event.trigger(a, b, this)
                })
            },
            triggerHandler: function (a, b) {
                if (this[0]) {
                    return f.event.trigger(a, b, this[0], !0)
                }
            },
            toggle: function (a) {
                var b = arguments,
                    c = a.guid || f.guid++,
                    d = 0,
                    e = function (c) {
                        var e = (f._data(this, "lastToggle" + a.guid) || 0) % d;
                        f._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault();
                        return b[e].apply(this, arguments) || !1
                    };
                e.guid = c;
                while (d < b.length) {
                    b[d++].guid = c
                }
                return this.click(e)
            },
            hover: function (a, b) {
                return this.mouseenter(a).mouseleave(b || a)
            }
        }), f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) {
            f.fn[b] = function (a, c) {
                c == null && (c = a, a = null);
                return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
            }, f.attrFn && (f.attrFn[b] = !0), C.test(b) && (f.event.fixHooks[b] = f.event.keyHooks), D.test(b) && (f.event.fixHooks[b] = f.event.mouseHooks)
        }),
        function () {
            function x(a, b, c, e, f, g) {
                for (var h = 0, i = e.length; h < i; h++) {
                    var j = e[h];
                    if (j) {
                        var k = !1;
                        j = j[a];
                        while (j) {
                            if (j[d] === c) {
                                k = e[j.sizset];
                                break
                            }
                            if (j.nodeType === 1) {
                                g || (j[d] = c, j.sizset = h);
                                if (typeof b != "string") {
                                    if (j === b) {
                                        k = !0;
                                        break
                                    }
                                } else {
                                    if (m.filter(b, [j]).length > 0) {
                                        k = j;
                                        break
                                    }
                                }
                            }
                            j = j[a]
                        }
                        e[h] = k
                    }
                }
            }

            function w(a, b, c, e, f, g) {
                for (var h = 0, i = e.length; h < i; h++) {
                    var j = e[h];
                    if (j) {
                        var k = !1;
                        j = j[a];
                        while (j) {
                            if (j[d] === c) {
                                k = e[j.sizset];
                                break
                            }
                            j.nodeType === 1 && !g && (j[d] = c, j.sizset = h);
                            if (j.nodeName.toLowerCase() === b) {
                                k = j;
                                break
                            }
                            j = j[a]
                        }
                        e[h] = k
                    }
                }
            }
            var a = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
                d = "sizcache" + (Math.random() + "").replace(".", ""),
                e = 0,
                g = Object.prototype.toString,
                h = !1,
                i = !0,
                j = /\\/g,
                k = /\r\n/g,
                l = /\W/;
            [0, 0].sort(function () {
                i = !1;
                return 0
            });
            var m = function (b, d, e, f) {
                e = e || [], d = d || c;
                var h = d;
                if (d.nodeType !== 1 && d.nodeType !== 9) {
                    return []
                }
                if (!b || typeof b != "string") {
                    return e
                }
                var i, j, k, l, n, q, r, t, u = !0,
                    v = m.isXML(d),
                    w = [],
                    x = b;
                do {
                    a.exec(""), i = a.exec(x);
                    if (i) {
                        x = i[3], w.push(i[1]);
                        if (i[2]) {
                            l = i[3];
                            break
                        }
                    }
                } while (i);
                if (w.length > 1 && p.exec(b)) {
                    if (w.length === 2 && o.relative[w[0]]) {
                        j = y(w[0] + w[1], d, f)
                    } else {
                        j = o.relative[w[0]] ? [d] : m(w.shift(), d);
                        while (w.length) {
                            b = w.shift(), o.relative[b] && (b += w.shift()), j = y(b, j, f)
                        }
                    }
                } else {
                    !f && w.length > 1 && d.nodeType === 9 && !v && o.match.ID.test(w[0]) && !o.match.ID.test(w[w.length - 1]) && (n = m.find(w.shift(), d, v), d = n.expr ? m.filter(n.expr, n.set)[0] : n.set[0]);
                    if (d) {
                        n = f ? {
                            expr: w.pop(),
                            set: s(f)
                        } : m.find(w.pop(), w.length === 1 && (w[0] === "~" || w[0] === "+") && d.parentNode ? d.parentNode : d, v), j = n.expr ? m.filter(n.expr, n.set) : n.set, w.length > 0 ? k = s(j) : u = !1;
                        while (w.length) {
                            q = w.pop(), r = q, o.relative[q] ? r = w.pop() : q = "", r == null && (r = d), o.relative[q](k, r, v)
                        }
                    } else {
                        k = w = []
                    }
                }
                k || (k = j), k || m.error(q || b);
                if (g.call(k) === "[object Array]") {
                    if (!u) {
                        e.push.apply(e, k)
                    } else {
                        if (d && d.nodeType === 1) {
                            for (t = 0; k[t] != null; t++) {
                                k[t] && (k[t] === !0 || k[t].nodeType === 1 && m.contains(d, k[t])) && e.push(j[t])
                            }
                        } else {
                            for (t = 0; k[t] != null; t++) {
                                k[t] && k[t].nodeType === 1 && e.push(j[t])
                            }
                        }
                    }
                } else {
                    s(k, e)
                }
                l && (m(l, h, e, f), m.uniqueSort(e));
                return e
            };
            m.uniqueSort = function (a) {
                if (u) {
                    h = i, a.sort(u);
                    if (h) {
                        for (var b = 1; b < a.length; b++) {
                            a[b] === a[b - 1] && a.splice(b--, 1)
                        }
                    }
                }
                return a
            }, m.matches = function (a, b) {
                return m(a, null, null, b)
            }, m.matchesSelector = function (a, b) {
                return m(b, null, null, [a]).length > 0
            }, m.find = function (a, b, c) {
                var d, e, f, g, h, i;
                if (!a) {
                    return []
                }
                for (e = 0, f = o.order.length; e < f; e++) {
                    h = o.order[e];
                    if (g = o.leftMatch[h].exec(a)) {
                        i = g[1], g.splice(1, 1);
                        if (i.substr(i.length - 1) !== "\\") {
                            g[1] = (g[1] || "").replace(j, ""), d = o.find[h](g, b, c);
                            if (d != null) {
                                a = a.replace(o.match[h], "");
                                break
                            }
                        }
                    }
                }
                d || (d = typeof b.getElementsByTagName != "undefined" ? b.getElementsByTagName("*") : []);
                return {
                    set: d,
                    expr: a
                }
            }, m.filter = function (a, c, d, e) {
                var f, g, h, i, j, k, l, n, p, q = a,
                    r = [],
                    s = c,
                    t = c && c[0] && m.isXML(c[0]);
                while (a && c.length) {
                    for (h in o.filter) {
                        if ((f = o.leftMatch[h].exec(a)) != null && f[2]) {
                            k = o.filter[h], l = f[1], g = !1, f.splice(1, 1);
                            if (l.substr(l.length - 1) === "\\") {
                                continue
                            }
                            s === r && (r = []);
                            if (o.preFilter[h]) {
                                f = o.preFilter[h](f, s, d, r, e, t);
                                if (!f) {
                                    g = i = !0
                                } else {
                                    if (f === !0) {
                                        continue
                                    }
                                }
                            }
                            if (f) {
                                for (n = 0;
                                    (j = s[n]) != null; n++) {
                                    j && (i = k(j, f, n, s), p = e ^ i, d && i != null ? p ? g = !0 : s[n] = !1 : p && (r.push(j), g = !0))
                                }
                            }
                            if (i !== b) {
                                d || (s = r), a = a.replace(o.match[h], "");
                                if (!g) {
                                    return []
                                }
                                break
                            }
                        }
                    }
                    if (a === q) {
                        if (g == null) {
                            m.error(a)
                        } else {
                            break
                        }
                    }
                    q = a
                }
                return s
            }, m.error = function (a) {
                throw new Error("Syntax error, unrecognized expression: " + a)
            };
            var n = m.getText = function (a) {
                    var b, c, d = a.nodeType,
                        e = "";
                    if (d) {
                        if (d === 1 || d === 9) {
                            if (typeof a.textContent == "string") {
                                return a.textContent
                            }
                            if (typeof a.innerText == "string") {
                                return a.innerText.replace(k, "")
                            }
                            for (a = a.firstChild; a; a = a.nextSibling) {
                                e += n(a)
                            }
                        } else {
                            if (d === 3 || d === 4) {
                                return a.nodeValue
                            }
                        }
                    } else {
                        for (b = 0; c = a[b]; b++) {
                            c.nodeType !== 8 && (e += n(c))
                        }
                    }
                    return e
                },
                o = m.selectors = {
                    order: ["ID", "NAME", "TAG"],
                    match: {
                        ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                        CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                        NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                        ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                        TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                        CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                        POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                        PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
                    },
                    leftMatch: {},
                    attrMap: {
                        "class": "className",
                        "for": "htmlFor"
                    },
                    attrHandle: {
                        href: function (a) {
                            return a.getAttribute("href")
                        },
                        type: function (a) {
                            return a.getAttribute("type")
                        }
                    },
                    relative: {
                        "+": function (a, b) {
                            var c = typeof b == "string",
                                d = c && !l.test(b),
                                e = c && !d;
                            d && (b = b.toLowerCase());
                            for (var f = 0, g = a.length, h; f < g; f++) {
                                if (h = a[f]) {
                                    while ((h = h.previousSibling) && h.nodeType !== 1) {}
                                    a[f] = e || h && h.nodeName.toLowerCase() === b ? h || !1 : h === b
                                }
                            }
                            e && m.filter(b, a, !0)
                        },
                        ">": function (a, b) {
                            var c, d = typeof b == "string",
                                e = 0,
                                f = a.length;
                            if (d && !l.test(b)) {
                                b = b.toLowerCase();
                                for (; e < f; e++) {
                                    c = a[e];
                                    if (c) {
                                        var g = c.parentNode;
                                        a[e] = g.nodeName.toLowerCase() === b ? g : !1
                                    }
                                }
                            } else {
                                for (; e < f; e++) {
                                    c = a[e], c && (a[e] = d ? c.parentNode : c.parentNode === b)
                                }
                                d && m.filter(b, a, !0)
                            }
                        },
                        "": function (a, b, c) {
                            var d, f = e++,
                                g = x;
                            typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("parentNode", b, f, a, d, c)
                        },
                        "~": function (a, b, c) {
                            var d, f = e++,
                                g = x;
                            typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("previousSibling", b, f, a, d, c)
                        }
                    },
                    find: {
                        ID: function (a, b, c) {
                            if (typeof b.getElementById != "undefined" && !c) {
                                var d = b.getElementById(a[1]);
                                return d && d.parentNode ? [d] : []
                            }
                        },
                        NAME: function (a, b) {
                            if (typeof b.getElementsByName != "undefined") {
                                var c = [],
                                    d = b.getElementsByName(a[1]);
                                for (var e = 0, f = d.length; e < f; e++) {
                                    d[e].getAttribute("name") === a[1] && c.push(d[e])
                                }
                                return c.length === 0 ? null : c
                            }
                        },
                        TAG: function (a, b) {
                            if (typeof b.getElementsByTagName != "undefined") {
                                return b.getElementsByTagName(a[1])
                            }
                        }
                    },
                    preFilter: {
                        CLASS: function (a, b, c, d, e, f) {
                            a = " " + a[1].replace(j, "") + " ";
                            if (f) {
                                return a
                            }
                            for (var g = 0, h;
                                (h = b[g]) != null; g++) {
                                h && (e ^ (h.className && (" " + h.className + " ").replace(/[\t\n\r]/g, " ").indexOf(a) >= 0) ? c || d.push(h) : c && (b[g] = !1))
                            }
                            return !1
                        },
                        ID: function (a) {
                            return a[1].replace(j, "")
                        },
                        TAG: function (a, b) {
                            return a[1].replace(j, "").toLowerCase()
                        },
                        CHILD: function (a) {
                            if (a[1] === "nth") {
                                a[2] || m.error(a[0]), a[2] = a[2].replace(/^\+|\s*/g, "");
                                var b = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2] === "even" && "2n" || a[2] === "odd" && "2n+1" || !/\D/.test(a[2]) && "0n+" + a[2] || a[2]);
                                a[2] = b[1] + (b[2] || 1) - 0, a[3] = b[3] - 0
                            } else {
                                a[2] && m.error(a[0])
                            }
                            a[0] = e++;
                            return a
                        },
                        ATTR: function (a, b, c, d, e, f) {
                            var g = a[1] = a[1].replace(j, "");
                            !f && o.attrMap[g] && (a[1] = o.attrMap[g]), a[4] = (a[4] || a[5] || "").replace(j, ""), a[2] === "~=" && (a[4] = " " + a[4] + " ");
                            return a
                        },
                        PSEUDO: function (b, c, d, e, f) {
                            if (b[1] === "not") {
                                if ((a.exec(b[3]) || "").length > 1 || /^\w/.test(b[3])) {
                                    b[3] = m(b[3], null, null, c)
                                } else {
                                    var g = m.filter(b[3], c, d, !0 ^ f);
                                    d || e.push.apply(e, g);
                                    return !1
                                }
                            } else {
                                if (o.match.POS.test(b[0]) || o.match.CHILD.test(b[0])) {
                                    return !0
                                }
                            }
                            return b
                        },
                        POS: function (a) {
                            a.unshift(!0);
                            return a
                        }
                    },
                    filters: {
                        enabled: function (a) {
                            return a.disabled === !1 && a.type !== "hidden"
                        },
                        disabled: function (a) {
                            return a.disabled === !0
                        },
                        checked: function (a) {
                            return a.checked === !0
                        },
                        selected: function (a) {
                            a.parentNode && a.parentNode.selectedIndex;
                            return a.selected === !0
                        },
                        parent: function (a) {
                            return !!a.firstChild
                        },
                        empty: function (a) {
                            return !a.firstChild
                        },
                        has: function (a, b, c) {
                            return !!m(c[3], a).length
                        },
                        header: function (a) {
                            return /h\d/i.test(a.nodeName)
                        },
                        text: function (a) {
                            var b = a.getAttribute("type"),
                                c = a.type;
                            return a.nodeName.toLowerCase() === "input" && "text" === c && (b === c || b === null)
                        },
                        radio: function (a) {
                            return a.nodeName.toLowerCase() === "input" && "radio" === a.type
                        },
                        checkbox: function (a) {
                            return a.nodeName.toLowerCase() === "input" && "checkbox" === a.type
                        },
                        file: function (a) {
                            return a.nodeName.toLowerCase() === "input" && "file" === a.type
                        },
                        password: function (a) {
                            return a.nodeName.toLowerCase() === "input" && "password" === a.type
                        },
                        submit: function (a) {
                            var b = a.nodeName.toLowerCase();
                            return (b === "input" || b === "button") && "submit" === a.type
                        },
                        image: function (a) {
                            return a.nodeName.toLowerCase() === "input" && "image" === a.type
                        },
                        reset: function (a) {
                            var b = a.nodeName.toLowerCase();
                            return (b === "input" || b === "button") && "reset" === a.type
                        },
                        button: function (a) {
                            var b = a.nodeName.toLowerCase();
                            return b === "input" && "button" === a.type || b === "button"
                        },
                        input: function (a) {
                            return /input|select|textarea|button/i.test(a.nodeName)
                        },
                        focus: function (a) {
                            return a === a.ownerDocument.activeElement
                        }
                    },
                    setFilters: {
                        first: function (a, b) {
                            return b === 0
                        },
                        last: function (a, b, c, d) {
                            return b === d.length - 1
                        },
                        even: function (a, b) {
                            return b % 2 === 0
                        },
                        odd: function (a, b) {
                            return b % 2 === 1
                        },
                        lt: function (a, b, c) {
                            return b < c[3] - 0
                        },
                        gt: function (a, b, c) {
                            return b > c[3] - 0
                        },
                        nth: function (a, b, c) {
                            return c[3] - 0 === b
                        },
                        eq: function (a, b, c) {
                            return c[3] - 0 === b
                        }
                    },
                    filter: {
                        PSEUDO: function (a, b, c, d) {
                            var e = b[1],
                                f = o.filters[e];
                            if (f) {
                                return f(a, c, b, d)
                            }
                            if (e === "contains") {
                                return (a.textContent || a.innerText || n([a]) || "").indexOf(b[3]) >= 0
                            }
                            if (e === "not") {
                                var g = b[3];
                                for (var h = 0, i = g.length; h < i; h++) {
                                    if (g[h] === a) {
                                        return !1
                                    }
                                }
                                return !0
                            }
                            m.error(e)
                        },
                        CHILD: function (a, b) {
                            var c, e, f, g, h, i, j, k = b[1],
                                l = a;
                            switch (k) {
                                case "only":
                                case "first":
                                    while (l = l.previousSibling) {
                                        if (l.nodeType === 1) {
                                            return !1
                                        }
                                    }
                                    if (k === "first") {
                                        return !0
                                    }
                                    l = a;
                                case "last":
                                    while (l = l.nextSibling) {
                                        if (l.nodeType === 1) {
                                            return !1
                                        }
                                    }
                                    return !0;
                                case "nth":
                                    c = b[2], e = b[3];
                                    if (c === 1 && e === 0) {
                                        return !0
                                    }
                                    f = b[0], g = a.parentNode;
                                    if (g && (g[d] !== f || !a.nodeIndex)) {
                                        i = 0;
                                        for (l = g.firstChild; l; l = l.nextSibling) {
                                            l.nodeType === 1 && (l.nodeIndex = ++i)
                                        }
                                        g[d] = f
                                    }
                                    j = a.nodeIndex - e;
                                    return c === 0 ? j === 0 : j % c === 0 && j / c >= 0
                            }
                        },
                        ID: function (a, b) {
                            return a.nodeType === 1 && a.getAttribute("id") === b
                        },
                        TAG: function (a, b) {
                            return b === "*" && a.nodeType === 1 || !!a.nodeName && a.nodeName.toLowerCase() === b
                        },
                        CLASS: function (a, b) {
                            return (" " + (a.className || a.getAttribute("class")) + " ").indexOf(b) > -1
                        },
                        ATTR: function (a, b) {
                            var c = b[1],
                                d = m.attr ? m.attr(a, c) : o.attrHandle[c] ? o.attrHandle[c](a) : a[c] != null ? a[c] : a.getAttribute(c),
                                e = d + "",
                                f = b[2],
                                g = b[4];
                            return d == null ? f === "!=" : !f && m.attr ? d != null : f === "=" ? e === g : f === "*=" ? e.indexOf(g) >= 0 : f === "~=" ? (" " + e + " ").indexOf(g) >= 0 : g ? f === "!=" ? e !== g : f === "^=" ? e.indexOf(g) === 0 : f === "$=" ? e.substr(e.length - g.length) === g : f === "|=" ? e === g || e.substr(0, g.length + 1) === g + "-" : !1 : e && d !== !1
                        },
                        POS: function (a, b, c, d) {
                            var e = b[2],
                                f = o.setFilters[e];
                            if (f) {
                                return f(a, c, b, d)
                            }
                        }
                    }
                },
                p = o.match.POS,
                q = function (a, b) {
                    return "\\" + (b - 0 + 1)
                };
            for (var r in o.match) {
                o.match[r] = new RegExp(o.match[r].source + /(?![^\[]*\])(?![^\(]*\))/.source), o.leftMatch[r] = new RegExp(/(^(?:.|\r|\n)*?)/.source + o.match[r].source.replace(/\\(\d+)/g, q))
            }
            var s = function (a, b) {
                a = Array.prototype.slice.call(a, 0);
                if (b) {
                    b.push.apply(b, a);
                    return b
                }
                return a
            };
            try {
                Array.prototype.slice.call(c.documentElement.childNodes, 0)[0].nodeType
            } catch (t) {
                s = function (a, b) {
                    var c = 0,
                        d = b || [];
                    if (g.call(a) === "[object Array]") {
                        Array.prototype.push.apply(d, a)
                    } else {
                        if (typeof a.length == "number") {
                            for (var e = a.length; c < e; c++) {
                                d.push(a[c])
                            }
                        } else {
                            for (; a[c]; c++) {
                                d.push(a[c])
                            }
                        }
                    }
                    return d
                }
            }
            var u, v;
            c.documentElement.compareDocumentPosition ? u = function (a, b) {
                    if (a === b) {
                        h = !0;
                        return 0
                    }
                    if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
                        return a.compareDocumentPosition ? -1 : 1
                    }
                    return a.compareDocumentPosition(b) & 4 ? -1 : 1
                } : (u = function (a, b) {
                    if (a === b) {
                        h = !0;
                        return 0
                    }
                    if (a.sourceIndex && b.sourceIndex) {
                        return a.sourceIndex - b.sourceIndex
                    }
                    var c, d, e = [],
                        f = [],
                        g = a.parentNode,
                        i = b.parentNode,
                        j = g;
                    if (g === i) {
                        return v(a, b)
                    }
                    if (!g) {
                        return -1
                    }
                    if (!i) {
                        return 1
                    }
                    while (j) {
                        e.unshift(j), j = j.parentNode
                    }
                    j = i;
                    while (j) {
                        f.unshift(j), j = j.parentNode
                    }
                    c = e.length, d = f.length;
                    for (var k = 0; k < c && k < d; k++) {
                        if (e[k] !== f[k]) {
                            return v(e[k], f[k])
                        }
                    }
                    return k === c ? v(a, f[k], -1) : v(e[k], b, 1)
                }, v = function (a, b, c) {
                    if (a === b) {
                        return c
                    }
                    var d = a.nextSibling;
                    while (d) {
                        if (d === b) {
                            return -1
                        }
                        d = d.nextSibling
                    }
                    return 1
                }),
                function () {
                    var a = c.createElement("div"),
                        d = "script" + (new Date).getTime(),
                        e = c.documentElement;
                    a.innerHTML = "<a name='" + d + "'/>", e.insertBefore(a, e.firstChild), c.getElementById(d) && (o.find.ID = function (a, c, d) {
                        if (typeof c.getElementById != "undefined" && !d) {
                            var e = c.getElementById(a[1]);
                            return e ? e.id === a[1] || typeof e.getAttributeNode != "undefined" && e.getAttributeNode("id").nodeValue === a[1] ? [e] : b : []
                        }
                    }, o.filter.ID = function (a, b) {
                        var c = typeof a.getAttributeNode != "undefined" && a.getAttributeNode("id");
                        return a.nodeType === 1 && c && c.nodeValue === b
                    }), e.removeChild(a), e = a = null
                }(),
                function () {
                    var a = c.createElement("div");
                    a.appendChild(c.createComment("")), a.getElementsByTagName("*").length > 0 && (o.find.TAG = function (a, b) {
                        var c = b.getElementsByTagName(a[1]);
                        if (a[1] === "*") {
                            var d = [];
                            for (var e = 0; c[e]; e++) {
                                c[e].nodeType === 1 && d.push(c[e])
                            }
                            c = d
                        }
                        return c
                    }), a.innerHTML = "<a href='#'></a>", a.firstChild && typeof a.firstChild.getAttribute != "undefined" && a.firstChild.getAttribute("href") !== "#" && (o.attrHandle.href = function (a) {
                        return a.getAttribute("href", 2)
                    }), a = null
                }(), c.querySelectorAll && function () {
                    var a = m,
                        b = c.createElement("div"),
                        d = "__sizzle__";
                    b.innerHTML = "<p class='TEST'></p>";
                    if (!b.querySelectorAll || b.querySelectorAll(".TEST").length !== 0) {
                        m = function (b, e, f, g) {
                            e = e || c;
                            if (!g && !m.isXML(e)) {
                                var h = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);
                                if (h && (e.nodeType === 1 || e.nodeType === 9)) {
                                    if (h[1]) {
                                        return s(e.getElementsByTagName(b), f)
                                    }
                                    if (h[2] && o.find.CLASS && e.getElementsByClassName) {
                                        return s(e.getElementsByClassName(h[2]), f)
                                    }
                                }
                                if (e.nodeType === 9) {
                                    if (b === "body" && e.body) {
                                        return s([e.body], f)
                                    }
                                    if (h && h[3]) {
                                        var i = e.getElementById(h[3]);
                                        if (!i || !i.parentNode) {
                                            return s([], f)
                                        }
                                        if (i.id === h[3]) {
                                            return s([i], f)
                                        }
                                    }
                                    try {
                                        return s(e.querySelectorAll(b), f)
                                    } catch (j) {}
                                } else {
                                    if (e.nodeType === 1 && e.nodeName.toLowerCase() !== "object") {
                                        var k = e,
                                            l = e.getAttribute("id"),
                                            n = l || d,
                                            p = e.parentNode,
                                            q = /^\s*[+~]/.test(b);
                                        l ? n = n.replace(/'/g, "\\$&") : e.setAttribute("id", n), q && p && (e = e.parentNode);
                                        try {
                                            if (!q || p) {
                                                return s(e.querySelectorAll("[id='" + n + "'] " + b), f)
                                            }
                                        } catch (r) {} finally {
                                            l || k.removeAttribute("id")
                                        }
                                    }
                                }
                            }
                            return a(b, e, f, g)
                        };
                        for (var e in a) {
                            m[e] = a[e]
                        }
                        b = null
                    }
                }(),
                function () {
                    var a = c.documentElement,
                        b = a.matchesSelector || a.mozMatchesSelector || a.webkitMatchesSelector || a.msMatchesSelector;
                    if (b) {
                        var d = !b.call(c.createElement("div"), "div"),
                            e = !1;
                        try {
                            b.call(c.documentElement, "[test!='']:sizzle")
                        } catch (f) {
                            e = !0
                        }
                        m.matchesSelector = function (a, c) {
                            c = c.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                            if (!m.isXML(a)) {
                                try {
                                    if (e || !o.match.PSEUDO.test(c) && !/!=/.test(c)) {
                                        var f = b.call(a, c);
                                        if (f || !d || a.document && a.document.nodeType !== 11) {
                                            return f
                                        }
                                    }
                                } catch (g) {}
                            }
                            return m(c, null, null, [a]).length > 0
                        }
                    }
                }(),
                function () {
                    var a = c.createElement("div");
                    a.innerHTML = "<div class='test e'></div><div class='test'></div>";
                    if (!!a.getElementsByClassName && a.getElementsByClassName("e").length !== 0) {
                        a.lastChild.className = "e";
                        if (a.getElementsByClassName("e").length === 1) {
                            return
                        }
                        o.order.splice(1, 0, "CLASS"), o.find.CLASS = function (a, b, c) {
                            if (typeof b.getElementsByClassName != "undefined" && !c) {
                                return b.getElementsByClassName(a[1])
                            }
                        }, a = null
                    }
                }(), c.documentElement.contains ? m.contains = function (a, b) {
                    return a !== b && (a.contains ? a.contains(b) : !0)
                } : c.documentElement.compareDocumentPosition ? m.contains = function (a, b) {
                    return !!(a.compareDocumentPosition(b) & 16)
                } : m.contains = function () {
                    return !1
                }, m.isXML = function (a) {
                    var b = (a ? a.ownerDocument || a : 0).documentElement;
                    return b ? b.nodeName !== "HTML" : !1
                };
            var y = function (a, b, c) {
                var d, e = [],
                    f = "",
                    g = b.nodeType ? [b] : b;
                while (d = o.match.PSEUDO.exec(a)) {
                    f += d[0], a = a.replace(o.match.PSEUDO, "")
                }
                a = o.relative[a] ? a + "*" : a;
                for (var h = 0, i = g.length; h < i; h++) {
                    m(a, g[h], e, c)
                }
                return m.filter(f, e)
            };
            m.attr = f.attr, m.selectors.attrMap = {}, f.find = m, f.expr = m.selectors, f.expr[":"] = f.expr.filters, f.unique = m.uniqueSort, f.text = m.getText, f.isXMLDoc = m.isXML, f.contains = m.contains
        }();
    var L = /Until$/,
        M = /^(?:parents|prevUntil|prevAll)/,
        N = /,/,
        O = /^.[^:#\[\.,]*$/,
        P = Array.prototype.slice,
        Q = f.expr.match.POS,
        R = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    f.fn.extend({
        find: function (a) {
            var b = this,
                c, d;
            if (typeof a != "string") {
                return f(a).filter(function () {
                    for (c = 0, d = b.length; c < d; c++) {
                        if (f.contains(b[c], this)) {
                            return !0
                        }
                    }
                })
            }
            var e = this.pushStack("", "find", a),
                g, h, i;
            for (c = 0, d = this.length; c < d; c++) {
                g = e.length, f.find(a, this[c], e);
                if (c > 0) {
                    for (h = g; h < e.length; h++) {
                        for (i = 0; i < g; i++) {
                            if (e[i] === e[h]) {
                                e.splice(h--, 1);
                                break
                            }
                        }
                    }
                }
            }
            return e
        },
        has: function (a) {
            var b = f(a);
            return this.filter(function () {
                for (var a = 0, c = b.length; a < c; a++) {
                    if (f.contains(this, b[a])) {
                        return !0
                    }
                }
            })
        },
        not: function (a) {
            return this.pushStack(T(this, a, !1), "not", a)
        },
        filter: function (a) {
            return this.pushStack(T(this, a, !0), "filter", a)
        },
        is: function (a) {
            return !!a && (typeof a == "string" ? Q.test(a) ? f(a, this.context).index(this[0]) >= 0 : f.filter(a, this).length > 0 : this.filter(a).length > 0)
        },
        closest: function (a, b) {
            var c = [],
                d, e, g = this[0];
            if (f.isArray(a)) {
                var h = 1;
                while (g && g.ownerDocument && g !== b) {
                    for (d = 0; d < a.length; d++) {
                        f(g).is(a[d]) && c.push({
                            selector: a[d],
                            elem: g,
                            level: h
                        })
                    }
                    g = g.parentNode, h++
                }
                return c
            }
            var i = Q.test(a) || typeof a != "string" ? f(a, b || this.context) : 0;
            for (d = 0, e = this.length; d < e; d++) {
                g = this[d];
                while (g) {
                    if (i ? i.index(g) > -1 : f.find.matchesSelector(g, a)) {
                        c.push(g);
                        break
                    }
                    g = g.parentNode;
                    if (!g || !g.ownerDocument || g === b || g.nodeType === 11) {
                        break
                    }
                }
            }
            c = c.length > 1 ? f.unique(c) : c;
            return this.pushStack(c, "closest", a)
        },
        index: function (a) {
            if (!a) {
                return this[0] && this[0].parentNode ? this.prevAll().length : -1
            }
            if (typeof a == "string") {
                return f.inArray(this[0], f(a))
            }
            return f.inArray(a.jquery ? a[0] : a, this)
        },
        add: function (a, b) {
            var c = typeof a == "string" ? f(a, b) : f.makeArray(a && a.nodeType ? [a] : a),
                d = f.merge(this.get(), c);
            return this.pushStack(S(c[0]) || S(d[0]) ? d : f.unique(d))
        },
        andSelf: function () {
            return this.add(this.prevObject)
        }
    }), f.each({
        parent: function (a) {
            var b = a.parentNode;
            return b && b.nodeType !== 11 ? b : null
        },
        parents: function (a) {
            return f.dir(a, "parentNode")
        },
        parentsUntil: function (a, b, c) {
            return f.dir(a, "parentNode", c)
        },
        next: function (a) {
            return f.nth(a, 2, "nextSibling")
        },
        prev: function (a) {
            return f.nth(a, 2, "previousSibling")
        },
        nextAll: function (a) {
            return f.dir(a, "nextSibling")
        },
        prevAll: function (a) {
            return f.dir(a, "previousSibling")
        },
        nextUntil: function (a, b, c) {
            return f.dir(a, "nextSibling", c)
        },
        prevUntil: function (a, b, c) {
            return f.dir(a, "previousSibling", c)
        },
        siblings: function (a) {
            return f.sibling(a.parentNode.firstChild, a)
        },
        children: function (a) {
            return f.sibling(a.firstChild)
        },
        contents: function (a) {
            return f.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : f.makeArray(a.childNodes)
        }
    }, function (a, b) {
        f.fn[a] = function (c, d) {
            var e = f.map(this, b, c);
            L.test(a) || (d = c), d && typeof d == "string" && (e = f.filter(d, e)), e = this.length > 1 && !R[a] ? f.unique(e) : e, (this.length > 1 || N.test(d)) && M.test(a) && (e = e.reverse());
            return this.pushStack(e, a, P.call(arguments).join(","))
        }
    }), f.extend({
        filter: function (a, b, c) {
            c && (a = ":not(" + a + ")");
            return b.length === 1 ? f.find.matchesSelector(b[0], a) ? [b[0]] : [] : f.find.matches(a, b)
        },
        dir: function (a, c, d) {
            var e = [],
                g = a[c];
            while (g && g.nodeType !== 9 && (d === b || g.nodeType !== 1 || !f(g).is(d))) {
                g.nodeType === 1 && e.push(g), g = g[c]
            }
            return e
        },
        nth: function (a, b, c, d) {
            b = b || 1;
            var e = 0;
            for (; a; a = a[c]) {
                if (a.nodeType === 1 && ++e === b) {
                    break
                }
            }
            return a
        },
        sibling: function (a, b) {
            var c = [];
            for (; a; a = a.nextSibling) {
                a.nodeType === 1 && a !== b && c.push(a)
            }
            return c
        }
    });
    var V = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        W = / jQuery\d+="(?:\d+|null)"/g,
        X = /^\s+/,
        Y = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        Z = /<([\w:]+)/,
        $ = /<tbody/i,
        _ = /<|&#?\w+;/,
        ba = /<(?:script|style)/i,
        bb = /<(?:script|object|embed|option|style)/i,
        bc = new RegExp("<(?:" + V + ")", "i"),
        bd = /checked\s*(?:[^=]|=\s*.checked.)/i,
        be = /\/(java|ecma)script/i,
        bf = /^\s*<!(?:\[CDATA\[|\-\-)/,
        bg = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            area: [1, "<map>", "</map>"],
            _default: [0, "", ""]
        },
        bh = U(c);
    bg.optgroup = bg.option, bg.tbody = bg.tfoot = bg.colgroup = bg.caption = bg.thead, bg.th = bg.td, f.support.htmlSerialize || (bg._default = [1, "div<div>", "</div>"]), f.fn.extend({
        text: function (a) {
            if (f.isFunction(a)) {
                return this.each(function (b) {
                    var c = f(this);
                    c.text(a.call(this, b, c.text()))
                })
            }
            if (typeof a != "object" && a !== b) {
                return this.empty().append((this[0] && this[0].ownerDocument || c).createTextNode(a))
            }
            return f.text(this)
        },
        wrapAll: function (a) {
            if (f.isFunction(a)) {
                return this.each(function (b) {
                    f(this).wrapAll(a.call(this, b))
                })
            }
            if (this[0]) {
                var b = f(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function () {
                    var a = this;
                    while (a.firstChild && a.firstChild.nodeType === 1) {
                        a = a.firstChild
                    }
                    return a
                }).append(this)
            }
            return this
        },
        wrapInner: function (a) {
            if (f.isFunction(a)) {
                return this.each(function (b) {
                    f(this).wrapInner(a.call(this, b))
                })
            }
            return this.each(function () {
                var b = f(this),
                    c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },
        wrap: function (a) {
            var b = f.isFunction(a);
            return this.each(function (c) {
                f(this).wrapAll(b ? a.call(this, c) : a)
            })
        },
        unwrap: function () {
            return this.parent().each(function () {
                f.nodeName(this, "body") || f(this).replaceWith(this.childNodes)
            }).end()
        },
        append: function () {
            return this.domManip(arguments, !0, function (a) {
                this.nodeType === 1 && this.appendChild(a)
            })
        },
        prepend: function () {
            return this.domManip(arguments, !0, function (a) {
                this.nodeType === 1 && this.insertBefore(a, this.firstChild)
            })
        },
        before: function () {
            if (this[0] && this[0].parentNode) {
                return this.domManip(arguments, !1, function (a) {
                    this.parentNode.insertBefore(a, this)
                })
            }
            if (arguments.length) {
                var a = f.clean(arguments);
                a.push.apply(a, this.toArray());
                return this.pushStack(a, "before", arguments)
            }
        },
        after: function () {
            if (this[0] && this[0].parentNode) {
                return this.domManip(arguments, !1, function (a) {
                    this.parentNode.insertBefore(a, this.nextSibling)
                })
            }
            if (arguments.length) {
                var a = this.pushStack(this, "after", arguments);
                a.push.apply(a, f.clean(arguments));
                return a
            }
        },
        remove: function (a, b) {
            for (var c = 0, d;
                (d = this[c]) != null; c++) {
                if (!a || f.filter(a, [d]).length) {
                    !b && d.nodeType === 1 && (f.cleanData(d.getElementsByTagName("*")), f.cleanData([d])), d.parentNode && d.parentNode.removeChild(d)
                }
            }
            return this
        },
        empty: function () {
            for (var a = 0, b;
                (b = this[a]) != null; a++) {
                b.nodeType === 1 && f.cleanData(b.getElementsByTagName("*"));
                while (b.firstChild) {
                    b.removeChild(b.firstChild)
                }
            }
            return this
        },
        clone: function (a, b) {
            a = a == null ? !1 : a, b = b == null ? a : b;
            return this.map(function () {
                return f.clone(this, a, b)
            })
        },
        html: function (a) {
            if (a === b) {
                return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(W, "") : null
            }
            if (typeof a == "string" && !ba.test(a) && (f.support.leadingWhitespace || !X.test(a)) && !bg[(Z.exec(a) || ["", ""])[1].toLowerCase()]) {
                a = a.replace(Y, "<$1></$2>");
                try {
                    for (var c = 0, d = this.length; c < d; c++) {
                        this[c].nodeType === 1 && (f.cleanData(this[c].getElementsByTagName("*")), this[c].innerHTML = a)
                    }
                } catch (e) {
                    this.empty().append(a)
                }
            } else {
                f.isFunction(a) ? this.each(function (b) {
                    var c = f(this);
                    c.html(a.call(this, b, c.html()))
                }) : this.empty().append(a)
            }
            return this
        },
        replaceWith: function (a) {
            if (this[0] && this[0].parentNode) {
                if (f.isFunction(a)) {
                    return this.each(function (b) {
                        var c = f(this),
                            d = c.html();
                        c.replaceWith(a.call(this, b, d))
                    })
                }
                typeof a != "string" && (a = f(a).detach());
                return this.each(function () {
                    var b = this.nextSibling,
                        c = this.parentNode;
                    f(this).remove(), b ? f(b).before(a) : f(c).append(a)
                })
            }
            return this.length ? this.pushStack(f(f.isFunction(a) ? a() : a), "replaceWith", a) : this
        },
        detach: function (a) {
            return this.remove(a, !0)
        },
        domManip: function (a, c, d) {
            var e, g, h, i, j = a[0],
                k = [];
            if (!f.support.checkClone && arguments.length === 3 && typeof j == "string" && bd.test(j)) {
                return this.each(function () {
                    f(this).domManip(a, c, d, !0)
                })
            }
            if (f.isFunction(j)) {
                return this.each(function (e) {
                    var g = f(this);
                    a[0] = j.call(this, e, c ? g.html() : b), g.domManip(a, c, d)
                })
            }
            if (this[0]) {
                i = j && j.parentNode, f.support.parentNode && i && i.nodeType === 11 && i.childNodes.length === this.length ? e = {
                    fragment: i
                } : e = f.buildFragment(a, this, k), h = e.fragment, h.childNodes.length === 1 ? g = h = h.firstChild : g = h.firstChild;
                if (g) {
                    c = c && f.nodeName(g, "tr");
                    for (var l = 0, m = this.length, n = m - 1; l < m; l++) {
                        d.call(c ? bi(this[l], g) : this[l], e.cacheable || m > 1 && l < n ? f.clone(h, !0, !0) : h)
                    }
                }
                k.length && f.each(k, bp)
            }
            return this
        }
    }), f.buildFragment = function (a, b, d) {
        var e, g, h, i, j = a[0];
        b && b[0] && (i = b[0].ownerDocument || b[0]), i.createDocumentFragment || (i = c), a.length === 1 && typeof j == "string" && j.length < 512 && i === c && j.charAt(0) === "<" && !bb.test(j) && (f.support.checkClone || !bd.test(j)) && (f.support.html5Clone || !bc.test(j)) && (g = !0, h = f.fragments[j], h && h !== 1 && (e = h)), e || (e = i.createDocumentFragment(), f.clean(a, i, e, d)), g && (f.fragments[j] = h ? e : 1);
        return {
            fragment: e,
            cacheable: g
        }
    }, f.fragments = {}, f.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (a, b) {
        f.fn[a] = function (c) {
            var d = [],
                e = f(c),
                g = this.length === 1 && this[0].parentNode;
            if (g && g.nodeType === 11 && g.childNodes.length === 1 && e.length === 1) {
                e[b](this[0]);
                return this
            }
            for (var h = 0, i = e.length; h < i; h++) {
                var j = (h > 0 ? this.clone(!0) : this).get();
                f(e[h])[b](j), d = d.concat(j)
            }
            return this.pushStack(d, a, e.selector)
        }
    }), f.extend({
        clone: function (a, b, c) {
            var d, e, g, h = f.support.html5Clone || !bc.test("<" + a.nodeName) ? a.cloneNode(!0) : bo(a);
            if ((!f.support.noCloneEvent || !f.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !f.isXMLDoc(a)) {
                bk(a, h), d = bl(a), e = bl(h);
                for (g = 0; d[g]; ++g) {
                    e[g] && bk(d[g], e[g])
                }
            }
            if (b) {
                bj(a, h);
                if (c) {
                    d = bl(a), e = bl(h);
                    for (g = 0; d[g]; ++g) {
                        bj(d[g], e[g])
                    }
                }
            }
            d = e = null;
            return h
        },
        clean: function (a, b, d, e) {
            var g;
            b = b || c, typeof b.createElement == "undefined" && (b = b.ownerDocument || b[0] && b[0].ownerDocument || c);
            var h = [],
                i;
            for (var j = 0, k;
                (k = a[j]) != null; j++) {
                typeof k == "number" && (k += "");
                if (!k) {
                    continue
                }
                if (typeof k == "string") {
                    if (!_.test(k)) {
                        k = b.createTextNode(k)
                    } else {
                        k = k.replace(Y, "<$1></$2>");
                        var l = (Z.exec(k) || ["", ""])[1].toLowerCase(),
                            m = bg[l] || bg._default,
                            n = m[0],
                            o = b.createElement("div");
                        b === c ? bh.appendChild(o) : U(b).appendChild(o), o.innerHTML = m[1] + k + m[2];
                        while (n--) {
                            o = o.lastChild
                        }
                        if (!f.support.tbody) {
                            var p = $.test(k),
                                q = l === "table" && !p ? o.firstChild && o.firstChild.childNodes : m[1] === "<table>" && !p ? o.childNodes : [];
                            for (i = q.length - 1; i >= 0; --i) {
                                f.nodeName(q[i], "tbody") && !q[i].childNodes.length && q[i].parentNode.removeChild(q[i])
                            }
                        }!f.support.leadingWhitespace && X.test(k) && o.insertBefore(b.createTextNode(X.exec(k)[0]), o.firstChild), k = o.childNodes
                    }
                }
                var r;
                if (!f.support.appendChecked) {
                    if (k[0] && typeof (r = k.length) == "number") {
                        for (i = 0; i < r; i++) {
                            bn(k[i])
                        }
                    } else {
                        bn(k)
                    }
                }
                k.nodeType ? h.push(k) : h = f.merge(h, k)
            }
            if (d) {
                g = function (a) {
                    return !a.type || be.test(a.type)
                };
                for (j = 0; h[j]; j++) {
                    if (e && f.nodeName(h[j], "script") && (!h[j].type || h[j].type.toLowerCase() === "text/javascript")) {
                        e.push(h[j].parentNode ? h[j].parentNode.removeChild(h[j]) : h[j])
                    } else {
                        if (h[j].nodeType === 1) {
                            var s = f.grep(h[j].getElementsByTagName("script"), g);
                            h.splice.apply(h, [j + 1, 0].concat(s))
                        }
                        d.appendChild(h[j])
                    }
                }
            }
            return h
        },
        cleanData: function (a) {
            var b, c, d = f.cache,
                e = f.event.special,
                g = f.support.deleteExpando;
            for (var h = 0, i;
                (i = a[h]) != null; h++) {
                if (i.nodeName && f.noData[i.nodeName.toLowerCase()]) {
                    continue
                }
                c = i[f.expando];
                if (c) {
                    b = d[c];
                    if (b && b.events) {
                        for (var j in b.events) {
                            e[j] ? f.event.remove(i, j) : f.removeEvent(i, j, b.handle)
                        }
                        b.handle && (b.handle.elem = null)
                    }
                    g ? delete i[f.expando] : i.removeAttribute && i.removeAttribute(f.expando), delete d[c]
                }
            }
        }
    });
    var bq = /alpha\([^)]*\)/i,
        br = /opacity=([^)]*)/,
        bs = /([A-Z]|^ms)/g,
        bt = /^-?\d+(?:px)?$/i,
        bu = /^-?\d/,
        bv = /^([\-+])=([\-+.\de]+)/,
        bw = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        bx = ["Left", "Right"],
        by = ["Top", "Bottom"],
        bz, bA, bB;
    f.fn.css = function (a, c) {
        if (arguments.length === 2 && c === b) {
            return this
        }
        return f.access(this, a, c, !0, function (a, c, d) {
            return d !== b ? f.style(a, c, d) : f.css(a, c)
        })
    }, f.extend({
        cssHooks: {
            opacity: {
                get: function (a, b) {
                    if (b) {
                        var c = bz(a, "opacity", "opacity");
                        return c === "" ? "1" : c
                    }
                    return a.style.opacity
                }
            }
        },
        cssNumber: {
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": f.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function (a, c, d, e) {
            if (!!a && a.nodeType !== 3 && a.nodeType !== 8 && !!a.style) {
                var g, h, i = f.camelCase(c),
                    j = a.style,
                    k = f.cssHooks[i];
                c = f.cssProps[i] || i;
                if (d === b) {
                    if (k && "get" in k && (g = k.get(a, !1, e)) !== b) {
                        return g
                    }
                    return j[c]
                }
                h = typeof d, h === "string" && (g = bv.exec(d)) && (d = +(g[1] + 1) * +g[2] + parseFloat(f.css(a, c)), h = "number");
                if (d == null || h === "number" && isNaN(d)) {
                    return
                }
                h === "number" && !f.cssNumber[i] && (d += "px");
                if (!k || !("set" in k) || (d = k.set(a, d)) !== b) {
                    try {
                        j[c] = d
                    } catch (l) {}
                }
            }
        },
        css: function (a, c, d) {
            var e, g;
            c = f.camelCase(c), g = f.cssHooks[c], c = f.cssProps[c] || c, c === "cssFloat" && (c = "float");
            if (g && "get" in g && (e = g.get(a, !0, d)) !== b) {
                return e
            }
            if (bz) {
                return bz(a, c)
            }
        },
        swap: function (a, b, c) {
            var d = {};
            for (var e in b) {
                d[e] = a.style[e], a.style[e] = b[e]
            }
            c.call(a);
            for (e in b) {
                a.style[e] = d[e]
            }
        }
    }), f.curCSS = f.css, f.each(["height", "width"], function (a, b) {
        f.cssHooks[b] = {
            get: function (a, c, d) {
                var e;
                if (c) {
                    if (a.offsetWidth !== 0) {
                        return bC(a, b, d)
                    }
                    f.swap(a, bw, function () {
                        e = bC(a, b, d)
                    });
                    return e
                }
            },
            set: function (a, b) {
                if (!bt.test(b)) {
                    return b
                }
                b = parseFloat(b);
                if (b >= 0) {
                    return b + "px"
                }
            }
        }
    }), f.support.opacity || (f.cssHooks.opacity = {
        get: function (a, b) {
            return br.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : b ? "1" : ""
        },
        set: function (a, b) {
            var c = a.style,
                d = a.currentStyle,
                e = f.isNumeric(b) ? "alpha(opacity=" + b * 100 + ")" : "",
                g = d && d.filter || c.filter || "";
            c.zoom = 1;
            if (b >= 1 && f.trim(g.replace(bq, "")) === "") {
                c.removeAttribute("filter");
                if (d && !d.filter) {
                    return
                }
            }
            c.filter = bq.test(g) ? g.replace(bq, e) : g + " " + e
        }
    }), f(function () {
        f.support.reliableMarginRight || (f.cssHooks.marginRight = {
            get: function (a, b) {
                var c;
                f.swap(a, {
                    display: "inline-block"
                }, function () {
                    b ? c = bz(a, "margin-right", "marginRight") : c = a.style.marginRight
                });
                return c
            }
        })
    }), c.defaultView && c.defaultView.getComputedStyle && (bA = function (a, b) {
        var c, d, e;
        b = b.replace(bs, "-$1").toLowerCase(), (d = a.ownerDocument.defaultView) && (e = d.getComputedStyle(a, null)) && (c = e.getPropertyValue(b), c === "" && !f.contains(a.ownerDocument.documentElement, a) && (c = f.style(a, b)));
        return c
    }), c.documentElement.currentStyle && (bB = function (a, b) {
        var c, d, e, f = a.currentStyle && a.currentStyle[b],
            g = a.style;
        f === null && g && (e = g[b]) && (f = e), !bt.test(f) && bu.test(f) && (c = g.left, d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), g.left = b === "fontSize" ? "1em" : f || 0, f = g.pixelLeft + "px", g.left = c, d && (a.runtimeStyle.left = d));
        return f === "" ? "auto" : f
    }), bz = bA || bB, f.expr && f.expr.filters && (f.expr.filters.hidden = function (a) {
        var b = a.offsetWidth,
            c = a.offsetHeight;
        return b === 0 && c === 0 || !f.support.reliableHiddenOffsets && (a.style && a.style.display || f.css(a, "display")) === "none"
    }, f.expr.filters.visible = function (a) {
        return !f.expr.filters.hidden(a)
    });
    var bD = /%20/g,
        bE = /\[\]$/,
        bF = /\r?\n/g,
        bG = /#.*$/,
        bH = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
        bI = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        bJ = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
        bK = /^(?:GET|HEAD)$/,
        bL = /^\/\//,
        bM = /\?/,
        bN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        bO = /^(?:select|textarea)/i,
        bP = /\s+/,
        bQ = /([?&])_=[^&]*/,
        bR = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
        bS = f.fn.load,
        bT = {},
        bU = {},
        bV, bW, bX = ["*/"] + ["*"];
    try {
        bV = e.href
    } catch (bY) {
        bV = c.createElement("a"), bV.href = "", bV = bV.href
    }
    bW = bR.exec(bV.toLowerCase()) || [], f.fn.extend({
        load: function (a, c, d) {
            if (typeof a != "string" && bS) {
                return bS.apply(this, arguments)
            }
            if (!this.length) {
                return this
            }
            var e = a.indexOf(" ");
            if (e >= 0) {
                var g = a.slice(e, a.length);
                a = a.slice(0, e)
            }
            var h = "GET";
            c && (f.isFunction(c) ? (d = c, c = b) : typeof c == "object" && (c = f.param(c, f.ajaxSettings.traditional), h = "POST"));
            var i = this;
            f.ajax({
                url: a,
                type: h,
                dataType: "html",
                data: c,
                complete: function (a, b, c) {
                    c = a.responseText, a.isResolved() && (a.done(function (a) {
                        c = a
                    }), i.html(g ? f("<div>").append(c.replace(bN, "")).find(g) : c)), d && i.each(d, [c, b, a])
                }
            });
            return this
        },
        serialize: function () {
            return f.param(this.serializeArray())
        },
        serializeArray: function () {
            return this.map(function () {
                return this.elements ? f.makeArray(this.elements) : this
            }).filter(function () {
                return this.name && !this.disabled && (this.checked || bO.test(this.nodeName) || bI.test(this.type))
            }).map(function (a, b) {
                var c = f(this).val();
                return c == null ? null : f.isArray(c) ? f.map(c, function (a, c) {
                    return {
                        name: b.name,
                        value: a.replace(bF, "\r\n")
                    }
                }) : {
                    name: b.name,
                    value: c.replace(bF, "\r\n")
                }
            }).get()
        }
    }), f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (a, b) {
        f.fn[b] = function (a) {
            return this.on(b, a)
        }
    }), f.each(["get", "post"], function (a, c) {
        f[c] = function (a, d, e, g) {
            f.isFunction(d) && (g = g || e, e = d, d = b);
            return f.ajax({
                type: c,
                url: a,
                data: d,
                success: e,
                dataType: g
            })
        }
    }), f.extend({
        getScript: function (a, c) {
            return f.get(a, b, c, "script")
        },
        getJSON: function (a, b, c) {
            return f.get(a, b, c, "json")
        },
        ajaxSetup: function (a, b) {
            b ? b_(a, f.ajaxSettings) : (b = a, a = f.ajaxSettings), b_(a, b);
            return a
        },
        ajaxSettings: {
            url: bV,
            isLocal: bJ.test(bW[1]),
            global: !0,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: !0,
            async: !0,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": bX
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },
            converters: {
                "* text": a.String,
                "text html": !0,
                "text json": f.parseJSON,
                "text xml": f.parseXML
            },
            flatOptions: {
                context: !0,
                url: !0
            }
        },
        ajaxPrefilter: bZ(bT),
        ajaxTransport: bZ(bU),
        ajax: function (a, c) {
            function w(a, c, l, m) {
                if (s !== 2) {
                    s = 2, q && clearTimeout(q), p = b, n = m || "", v.readyState = a > 0 ? 4 : 0;
                    var o, r, u, w = c,
                        x = l ? cb(d, v, l) : b,
                        y, z;
                    if (a >= 200 && a < 300 || a === 304) {
                        if (d.ifModified) {
                            if (y = v.getResponseHeader("Last-Modified")) {
                                f.lastModified[k] = y
                            }
                            if (z = v.getResponseHeader("Etag")) {
                                f.etag[k] = z
                            }
                        }
                        if (a === 304) {
                            w = "notmodified", o = !0
                        } else {
                            try {
                                r = cc(d, x), w = "success", o = !0
                            } catch (A) {
                                w = "parsererror", u = A
                            }
                        }
                    } else {
                        u = w;
                        if (!w || a) {
                            w = "error", a < 0 && (a = 0)
                        }
                    }
                    v.status = a, v.statusText = "" + (c || w), o ? h.resolveWith(e, [r, w, v]) : h.rejectWith(e, [v, w, u]), v.statusCode(j), j = b, t && g.trigger("ajax" + (o ? "Success" : "Error"), [v, d, o ? r : u]), i.fireWith(e, [v, w]), t && (g.trigger("ajaxComplete", [v, d]), --f.active || f.event.trigger("ajaxStop"))
                }
            }
            typeof a == "object" && (c = a, a = b), c = c || {};
            var d = f.ajaxSetup({}, c),
                e = d.context || d,
                g = e !== d && (e.nodeType || e instanceof f) ? f(e) : f.event,
                h = f.Deferred(),
                i = f.Callbacks("once memory"),
                j = d.statusCode || {},
                k, l = {},
                m = {},
                n, o, p, q, r, s = 0,
                t, u, v = {
                    readyState: 0,
                    setRequestHeader: function (a, b) {
                        if (!s) {
                            var c = a.toLowerCase();
                            a = m[c] = m[c] || a, l[a] = b
                        }
                        return this
                    },
                    getAllResponseHeaders: function () {
                        return s === 2 ? n : null
                    },
                    getResponseHeader: function (a) {
                        var c;
                        if (s === 2) {
                            if (!o) {
                                o = {};
                                while (c = bH.exec(n)) {
                                    o[c[1].toLowerCase()] = c[2]
                                }
                            }
                            c = o[a.toLowerCase()]
                        }
                        return c === b ? null : c
                    },
                    overrideMimeType: function (a) {
                        s || (d.mimeType = a);
                        return this
                    },
                    abort: function (a) {
                        a = a || "abort", p && p.abort(a), w(0, a);
                        return this
                    }
                };
            h.promise(v), v.success = v.done, v.error = v.fail, v.complete = i.add, v.statusCode = function (a) {
                if (a) {
                    var b;
                    if (s < 2) {
                        for (b in a) {
                            j[b] = [j[b], a[b]]
                        }
                    } else {
                        b = a[v.status], v.then(b, b)
                    }
                }
                return this
            }, d.url = ((a || d.url) + "").replace(bG, "").replace(bL, bW[1] + "//"), d.dataTypes = f.trim(d.dataType || "*").toLowerCase().split(bP), d.crossDomain == null && (r = bR.exec(d.url.toLowerCase()), d.crossDomain = !(!r || r[1] == bW[1] && r[2] == bW[2] && (r[3] || (r[1] === "http:" ? 80 : 443)) == (bW[3] || (bW[1] === "http:" ? 80 : 443)))), d.data && d.processData && typeof d.data != "string" && (d.data = f.param(d.data, d.traditional)), b$(bT, d, c, v);
            if (s === 2) {
                return !1
            }
            t = d.global, d.type = d.type.toUpperCase(), d.hasContent = !bK.test(d.type), t && f.active++ === 0 && f.event.trigger("ajaxStart");
            if (!d.hasContent) {
                d.data && (d.url += (bM.test(d.url) ? "&" : "?") + d.data, delete d.data), k = d.url;
                if (d.cache === !1) {
                    var x = f.now(),
                        y = d.url.replace(bQ, "$1_=" + x);
                    d.url = y + (y === d.url ? (bM.test(d.url) ? "&" : "?") + "_=" + x : "")
                }
            }(d.data && d.hasContent && d.contentType !== !1 || c.contentType) && v.setRequestHeader("Content-Type", d.contentType), d.ifModified && (k = k || d.url, f.lastModified[k] && v.setRequestHeader("If-Modified-Since", f.lastModified[k]), f.etag[k] && v.setRequestHeader("If-None-Match", f.etag[k])), v.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + (d.dataTypes[0] !== "*" ? ", " + bX + "; q=0.01" : "") : d.accepts["*"]);
            for (u in d.headers) {
                v.setRequestHeader(u, d.headers[u])
            }
            if (d.beforeSend && (d.beforeSend.call(e, v, d) === !1 || s === 2)) {
                v.abort();
                return !1
            }
            for (u in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) {
                v[u](d[u])
            }
            p = b$(bU, d, c, v);
            if (!p) {
                w(-1, "No Transport")
            } else {
                v.readyState = 1, t && g.trigger("ajaxSend", [v, d]), d.async && d.timeout > 0 && (q = setTimeout(function () {
                    v.abort("timeout")
                }, d.timeout));
                try {
                    s = 1, p.send(l, w)
                } catch (z) {
                    if (s < 2) {
                        w(-1, z)
                    } else {
                        throw z
                    }
                }
            }
            return v
        },
        param: function (a, c) {
            var d = [],
                e = function (a, b) {
                    b = f.isFunction(b) ? b() : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
                };
            c === b && (c = f.ajaxSettings.traditional);
            if (f.isArray(a) || a.jquery && !f.isPlainObject(a)) {
                f.each(a, function () {
                    e(this.name, this.value)
                })
            } else {
                for (var g in a) {
                    ca(g, a[g], c, e)
                }
            }
            return d.join("&").replace(bD, "+")
        }
    }), f.extend({
        active: 0,
        lastModified: {},
        etag: {}
    });
    var cd = f.now(),
        ce = /(\=)\?(&|$)|\?\?/i;
    f.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            return f.expando + "_" + cd++
        }
    }), f.ajaxPrefilter("json jsonp", function (b, c, d) {
        var e = b.contentType === "application/x-www-form-urlencoded" && typeof b.data == "string";
        if (b.dataTypes[0] === "jsonp" || b.jsonp !== !1 && (ce.test(b.url) || e && ce.test(b.data))) {
            var g, h = b.jsonpCallback = f.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback,
                i = a[h],
                j = b.url,
                k = b.data,
                l = "$1" + h + "$2";
            b.jsonp !== !1 && (j = j.replace(ce, l), b.url === j && (e && (k = k.replace(ce, l)), b.data === k && (j += (/\?/.test(j) ? "&" : "?") + b.jsonp + "=" + h))), b.url = j, b.data = k, a[h] = function (a) {
                g = [a]
            }, d.always(function () {
                a[h] = i, g && f.isFunction(i) && a[h](g[0])
            }), b.converters["script json"] = function () {
                g || f.error(h + " was not called");
                return g[0]
            }, b.dataTypes[0] = "json";
            return "script"
        }
    }), f.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function (a) {
                f.globalEval(a);
                return a
            }
        }
    }), f.ajaxPrefilter("script", function (a) {
        a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
    }), f.ajaxTransport("script", function (a) {
        if (a.crossDomain) {
            var d, e = c.head || c.getElementsByTagName("head")[0] || c.documentElement;
            return {
                send: function (f, g) {
                    d = c.createElement("script"), d.async = "async", a.scriptCharset && (d.charset = a.scriptCharset), d.src = a.url, d.onload = d.onreadystatechange = function (a, c) {
                        if (c || !d.readyState || /loaded|complete/.test(d.readyState)) {
                            d.onload = d.onreadystatechange = null, e && d.parentNode && e.removeChild(d), d = b, c || g(200, "success")
                        }
                    }, e.insertBefore(d, e.firstChild)
                },
                abort: function () {
                    d && d.onload(0, 1)
                }
            }
        }
    });
    var cf = a.ActiveXObject ? function () {
            for (var a in ch) {
                ch[a](0, 1)
            }
        } : !1,
        cg = 0,
        ch;
    f.ajaxSettings.xhr = a.ActiveXObject ? function () {
            return !this.isLocal && ci() || cj()
        } : ci,
        function (a) {
            f.extend(f.support, {
                ajax: !!a,
                cors: !!a && "withCredentials" in a
            })
        }(f.ajaxSettings.xhr()), f.support.ajax && f.ajaxTransport(function (c) {
            if (!c.crossDomain || f.support.cors) {
                var d;
                return {
                    send: function (e, g) {
                        var h = c.xhr(),
                            i, j;
                        c.username ? h.open(c.type, c.url, c.async, c.username, c.password) : h.open(c.type, c.url, c.async);
                        if (c.xhrFields) {
                            for (j in c.xhrFields) {
                                h[j] = c.xhrFields[j]
                            }
                        }
                        c.mimeType && h.overrideMimeType && h.overrideMimeType(c.mimeType), !c.crossDomain && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest");
                        try {
                            for (j in e) {
                                h.setRequestHeader(j, e[j])
                            }
                        } catch (k) {}
                        h.send(c.hasContent && c.data || null), d = function (a, e) {
                            var j, k, l, m, n;
                            try {
                                if (d && (e || h.readyState === 4)) {
                                    d = b, i && (h.onreadystatechange = f.noop, cf && delete ch[i]);
                                    if (e) {
                                        h.readyState !== 4 && h.abort()
                                    } else {
                                        j = h.status, l = h.getAllResponseHeaders(), m = {}, n = h.responseXML, n && n.documentElement && (m.xml = n), m.text = h.responseText;
                                        try {
                                            k = h.statusText
                                        } catch (o) {
                                            k = ""
                                        }!j && c.isLocal && !c.crossDomain ? j = m.text ? 200 : 404 : j === 1223 && (j = 204)
                                    }
                                }
                            } catch (p) {
                                e || g(-1, p)
                            }
                            m && g(j, k, m, l)
                        }, !c.async || h.readyState === 4 ? d() : (i = ++cg, cf && (ch || (ch = {}, f(a).unload(cf)), ch[i] = d), h.onreadystatechange = d)
                    },
                    abort: function () {
                        d && d(0, 1)
                    }
                }
            }
        });
    var ck = {},
        cl, cm, cn = /^(?:toggle|show|hide)$/,
        co = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
        cp, cq = [
            ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
            ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
            ["opacity"]
        ],
        cr;
    f.fn.extend({
        show: function (a, b, c) {
            var d, e;
            if (a || a === 0) {
                return this.animate(cu("show", 3), a, b, c)
            }
            for (var g = 0, h = this.length; g < h; g++) {
                d = this[g], d.style && (e = d.style.display, !f._data(d, "olddisplay") && e === "none" && (e = d.style.display = ""), e === "" && f.css(d, "display") === "none" && f._data(d, "olddisplay", cv(d.nodeName)))
            }
            for (g = 0; g < h; g++) {
                d = this[g];
                if (d.style) {
                    e = d.style.display;
                    if (e === "" || e === "none") {
                        d.style.display = f._data(d, "olddisplay") || ""
                    }
                }
            }
            return this
        },
        hide: function (a, b, c) {
            if (a || a === 0) {
                return this.animate(cu("hide", 3), a, b, c)
            }
            var d, e, g = 0,
                h = this.length;
            for (; g < h; g++) {
                d = this[g], d.style && (e = f.css(d, "display"), e !== "none" && !f._data(d, "olddisplay") && f._data(d, "olddisplay", e))
            }
            for (g = 0; g < h; g++) {
                this[g].style && (this[g].style.display = "none")
            }
            return this
        },
        _toggle: f.fn.toggle,
        toggle: function (a, b, c) {
            var d = typeof a == "boolean";
            f.isFunction(a) && f.isFunction(b) ? this._toggle.apply(this, arguments) : a == null || d ? this.each(function () {
                var b = d ? a : f(this).is(":hidden");
                f(this)[b ? "show" : "hide"]()
            }) : this.animate(cu("toggle", 3), a, b, c);
            return this
        },
        fadeTo: function (a, b, c, d) {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d)
        },
        animate: function (a, b, c, d) {
            function g() {
                e.queue === !1 && f._mark(this);
                var b = f.extend({}, e),
                    c = this.nodeType === 1,
                    d = c && f(this).is(":hidden"),
                    g, h, i, j, k, l, m, n, o;
                b.animatedProperties = {};
                for (i in a) {
                    g = f.camelCase(i), i !== g && (a[g] = a[i], delete a[i]), h = a[g], f.isArray(h) ? (b.animatedProperties[g] = h[1], h = a[g] = h[0]) : b.animatedProperties[g] = b.specialEasing && b.specialEasing[g] || b.easing || "swing";
                    if (h === "hide" && d || h === "show" && !d) {
                        return b.complete.call(this)
                    }
                    c && (g === "height" || g === "width") && (b.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], f.css(this, "display") === "inline" && f.css(this, "float") === "none" && (!f.support.inlineBlockNeedsLayout || cv(this.nodeName) === "inline" ? this.style.display = "inline-block" : this.style.zoom = 1))
                }
                b.overflow != null && (this.style.overflow = "hidden");
                for (i in a) {
                    j = new f.fx(this, b, i), h = a[i], cn.test(h) ? (o = f._data(this, "toggle" + i) || (h === "toggle" ? d ? "show" : "hide" : 0), o ? (f._data(this, "toggle" + i, o === "show" ? "hide" : "show"), j[o]()) : j[h]()) : (k = co.exec(h), l = j.cur(), k ? (m = parseFloat(k[2]), n = k[3] || (f.cssNumber[i] ? "" : "px"), n !== "px" && (f.style(this, i, (m || 1) + n), l = (m || 1) / j.cur() * l, f.style(this, i, l + n)), k[1] && (m = (k[1] === "-=" ? -1 : 1) * m + l), j.custom(l, m, n)) : j.custom(l, h, ""))
                }
                return !0
            }
            var e = f.speed(b, c, d);
            if (f.isEmptyObject(a)) {
                return this.each(e.complete, [!1])
            }
            a = f.extend({}, a);
            return e.queue === !1 ? this.each(g) : this.queue(e.queue, g)
        },
        stop: function (a, c, d) {
            typeof a != "string" && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || "fx", []);
            return this.each(function () {
                function h(a, b, c) {
                    var e = b[c];
                    f.removeData(a, c, !0), e.stop(d)
                }
                var b, c = !1,
                    e = f.timers,
                    g = f._data(this);
                d || f._unmark(!0, this);
                if (a == null) {
                    for (b in g) {
                        g[b] && g[b].stop && b.indexOf(".run") === b.length - 4 && h(this, g, b)
                    }
                } else {
                    g[b = a + ".run"] && g[b].stop && h(this, g, b)
                }
                for (b = e.length; b--;) {
                    e[b].elem === this && (a == null || e[b].queue === a) && (d ? e[b](!0) : e[b].saveState(), c = !0, e.splice(b, 1))
                }(!d || !c) && f.dequeue(this, a)
            })
        }
    }), f.each({
        slideDown: cu("show", 1),
        slideUp: cu("hide", 1),
        slideToggle: cu("toggle", 1),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function (a, b) {
        f.fn[a] = function (a, c, d) {
            return this.animate(b, a, c, d)
        }
    }), f.extend({
        speed: function (a, b, c) {
            var d = a && typeof a == "object" ? f.extend({}, a) : {
                complete: c || !c && b || f.isFunction(a) && a,
                duration: a,
                easing: c && b || b && !f.isFunction(b) && b
            };
            d.duration = f.fx.off ? 0 : typeof d.duration == "number" ? d.duration : d.duration in f.fx.speeds ? f.fx.speeds[d.duration] : f.fx.speeds._default;
            if (d.queue == null || d.queue === !0) {
                d.queue = "fx"
            }
            d.old = d.complete, d.complete = function (a) {
                f.isFunction(d.old) && d.old.call(this), d.queue ? f.dequeue(this, d.queue) : a !== !1 && f._unmark(this)
            };
            return d
        },
        easing: {
            linear: function (a, b, c, d) {
                return c + d * a
            },
            swing: function (a, b, c, d) {
                return (-Math.cos(a * Math.PI) / 2 + 0.5) * d + c
            }
        },
        timers: [],
        fx: function (a, b, c) {
            this.options = b, this.elem = a, this.prop = c, b.orig = b.orig || {}
        }
    }), f.fx.prototype = {
        update: function () {
            this.options.step && this.options.step.call(this.elem, this.now, this), (f.fx.step[this.prop] || f.fx.step._default)(this)
        },
        cur: function () {
            if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) {
                return this.elem[this.prop]
            }
            var a, b = f.css(this.elem, this.prop);
            return isNaN(a = parseFloat(b)) ? !b || b === "auto" ? 0 : b : a
        },
        custom: function (a, c, d) {
            function h(a) {
                return e.step(a)
            }
            var e = this,
                g = f.fx;
            this.startTime = cr || cs(), this.end = c, this.now = this.start = a, this.pos = this.state = 0, this.unit = d || this.unit || (f.cssNumber[this.prop] ? "" : "px"), h.queue = this.options.queue, h.elem = this.elem, h.saveState = function () {
                e.options.hide && f._data(e.elem, "fxshow" + e.prop) === b && f._data(e.elem, "fxshow" + e.prop, e.start)
            }, h() && f.timers.push(h) && !cp && (cp = setInterval(g.tick, g.interval))
        },
        show: function () {
            var a = f._data(this.elem, "fxshow" + this.prop);
            this.options.orig[this.prop] = a || f.style(this.elem, this.prop), this.options.show = !0, a !== b ? this.custom(this.cur(), a) : this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur()), f(this.elem).show()
        },
        hide: function () {
            this.options.orig[this.prop] = f._data(this.elem, "fxshow" + this.prop) || f.style(this.elem, this.prop), this.options.hide = !0, this.custom(this.cur(), 0)
        },
        step: function (a) {
            var b, c, d, e = cr || cs(),
                g = !0,
                h = this.elem,
                i = this.options;
            if (a || e >= i.duration + this.startTime) {
                this.now = this.end, this.pos = this.state = 1, this.update(), i.animatedProperties[this.prop] = !0;
                for (b in i.animatedProperties) {
                    i.animatedProperties[b] !== !0 && (g = !1)
                }
                if (g) {
                    i.overflow != null && !f.support.shrinkWrapBlocks && f.each(["", "X", "Y"], function (a, b) {
                        h.style["overflow" + b] = i.overflow[a]
                    }), i.hide && f(h).hide();
                    if (i.hide || i.show) {
                        for (b in i.animatedProperties) {
                            f.style(h, b, i.orig[b]), f.removeData(h, "fxshow" + b, !0), f.removeData(h, "toggle" + b, !0)
                        }
                    }
                    d = i.complete, d && (i.complete = !1, d.call(h))
                }
                return !1
            }
            i.duration == Infinity ? this.now = e : (c = e - this.startTime, this.state = c / i.duration, this.pos = f.easing[i.animatedProperties[this.prop]](this.state, c, 0, 1, i.duration), this.now = this.start + (this.end - this.start) * this.pos), this.update();
            return !0
        }
    }, f.extend(f.fx, {
        tick: function () {
            var a, b = f.timers,
                c = 0;
            for (; c < b.length; c++) {
                a = b[c], !a() && b[c] === a && b.splice(c--, 1)
            }
            b.length || f.fx.stop()
        },
        interval: 13,
        stop: function () {
            clearInterval(cp), cp = null
        },
        speeds: {
            slow: 600,
            fast: 200,
            _default: 400
        },
        step: {
            opacity: function (a) {
                f.style(a.elem, "opacity", a.now)
            },
            _default: function (a) {
                a.elem.style && a.elem.style[a.prop] != null ? a.elem.style[a.prop] = a.now + a.unit : a.elem[a.prop] = a.now
            }
        }
    }), f.each(["width", "height"], function (a, b) {
        f.fx.step[b] = function (a) {
            f.style(a.elem, b, Math.max(0, a.now) + a.unit)
        }
    }), f.expr && f.expr.filters && (f.expr.filters.animated = function (a) {
        return f.grep(f.timers, function (b) {
            return a === b.elem
        }).length
    });
    var cw = /^t(?:able|d|h)$/i,
        cx = /^(?:body|html)$/i;
    "getBoundingClientRect" in c.documentElement ? f.fn.offset = function (a) {
        var b = this[0],
            c;
        if (a) {
            return this.each(function (b) {
                f.offset.setOffset(this, a, b)
            })
        }
        if (!b || !b.ownerDocument) {
            return null
        }
        if (b === b.ownerDocument.body) {
            return f.offset.bodyOffset(b)
        }
        try {
            c = b.getBoundingClientRect()
        } catch (d) {}
        var e = b.ownerDocument,
            g = e.documentElement;
        if (!c || !f.contains(g, b)) {
            return c ? {
                top: c.top,
                left: c.left
            } : {
                top: 0,
                left: 0
            }
        }
        var h = e.body,
            i = cy(e),
            j = g.clientTop || h.clientTop || 0,
            k = g.clientLeft || h.clientLeft || 0,
            l = i.pageYOffset || f.support.boxModel && g.scrollTop || h.scrollTop,
            m = i.pageXOffset || f.support.boxModel && g.scrollLeft || h.scrollLeft,
            n = c.top + l - j,
            o = c.left + m - k;
        return {
            top: n,
            left: o
        }
    } : f.fn.offset = function (a) {
        var b = this[0];
        if (a) {
            return this.each(function (b) {
                f.offset.setOffset(this, a, b)
            })
        }
        if (!b || !b.ownerDocument) {
            return null
        }
        if (b === b.ownerDocument.body) {
            return f.offset.bodyOffset(b)
        }
        var c, d = b.offsetParent,
            e = b,
            g = b.ownerDocument,
            h = g.documentElement,
            i = g.body,
            j = g.defaultView,
            k = j ? j.getComputedStyle(b, null) : b.currentStyle,
            l = b.offsetTop,
            m = b.offsetLeft;
        while ((b = b.parentNode) && b !== i && b !== h) {
            if (f.support.fixedPosition && k.position === "fixed") {
                break
            }
            c = j ? j.getComputedStyle(b, null) : b.currentStyle, l -= b.scrollTop, m -= b.scrollLeft, b === d && (l += b.offsetTop, m += b.offsetLeft, f.support.doesNotAddBorder && (!f.support.doesAddBorderForTableAndCells || !cw.test(b.nodeName)) && (l += parseFloat(c.borderTopWidth) || 0, m += parseFloat(c.borderLeftWidth) || 0), e = d, d = b.offsetParent), f.support.subtractsBorderForOverflowNotVisible && c.overflow !== "visible" && (l += parseFloat(c.borderTopWidth) || 0, m += parseFloat(c.borderLeftWidth) || 0), k = c
        }
        if (k.position === "relative" || k.position === "static") {
            l += i.offsetTop, m += i.offsetLeft
        }
        f.support.fixedPosition && k.position === "fixed" && (l += Math.max(h.scrollTop, i.scrollTop), m += Math.max(h.scrollLeft, i.scrollLeft));
        return {
            top: l,
            left: m
        }
    }, f.offset = {
        bodyOffset: function (a) {
            var b = a.offsetTop,
                c = a.offsetLeft;
            f.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(f.css(a, "marginTop")) || 0, c += parseFloat(f.css(a, "marginLeft")) || 0);
            return {
                top: b,
                left: c
            }
        },
        setOffset: function (a, b, c) {
            var d = f.css(a, "position");
            d === "static" && (a.style.position = "relative");
            var e = f(a),
                g = e.offset(),
                h = f.css(a, "top"),
                i = f.css(a, "left"),
                j = (d === "absolute" || d === "fixed") && f.inArray("auto", [h, i]) > -1,
                k = {},
                l = {},
                m, n;
            j ? (l = e.position(), m = l.top, n = l.left) : (m = parseFloat(h) || 0, n = parseFloat(i) || 0), f.isFunction(b) && (b = b.call(a, c, g)), b.top != null && (k.top = b.top - g.top + m), b.left != null && (k.left = b.left - g.left + n), "using" in b ? b.using.call(a, k) : e.css(k)
        }
    }, f.fn.extend({
        position: function () {
            if (!this[0]) {
                return null
            }
            var a = this[0],
                b = this.offsetParent(),
                c = this.offset(),
                d = cx.test(b[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : b.offset();
            c.top -= parseFloat(f.css(a, "marginTop")) || 0, c.left -= parseFloat(f.css(a, "marginLeft")) || 0, d.top += parseFloat(f.css(b[0], "borderTopWidth")) || 0, d.left += parseFloat(f.css(b[0], "borderLeftWidth")) || 0;
            return {
                top: c.top - d.top,
                left: c.left - d.left
            }
        },
        offsetParent: function () {
            return this.map(function () {
                var a = this.offsetParent || c.body;
                while (a && !cx.test(a.nodeName) && f.css(a, "position") === "static") {
                    a = a.offsetParent
                }
                return a
            })
        }
    }), f.each(["Left", "Top"], function (a, c) {
        var d = "scroll" + c;
        f.fn[d] = function (c) {
            var e, g;
            if (c === b) {
                e = this[0];
                if (!e) {
                    return null
                }
                g = cy(e);
                return g ? "pageXOffset" in g ? g[a ? "pageYOffset" : "pageXOffset"] : f.support.boxModel && g.document.documentElement[d] || g.document.body[d] : e[d]
            }
            return this.each(function () {
                g = cy(this), g ? g.scrollTo(a ? f(g).scrollLeft() : c, a ? c : f(g).scrollTop()) : this[d] = c
            })
        }
    }), f.each(["Height", "Width"], function (a, c) {
        var d = c.toLowerCase();
        f.fn["inner" + c] = function () {
            var a = this[0];
            return a ? a.style ? parseFloat(f.css(a, d, "padding")) : this[d]() : null
        }, f.fn["outer" + c] = function (a) {
            var b = this[0];
            return b ? b.style ? parseFloat(f.css(b, d, a ? "margin" : "border")) : this[d]() : null
        }, f.fn[d] = function (a) {
            var e = this[0];
            if (!e) {
                return a == null ? null : this
            }
            if (f.isFunction(a)) {
                return this.each(function (b) {
                    var c = f(this);
                    c[d](a.call(this, b, c[d]()))
                })
            }
            if (f.isWindow(e)) {
                var g = e.document.documentElement["client" + c],
                    h = e.document.body;
                return e.document.compatMode === "CSS1Compat" && g || h && h["client" + c] || g
            }
            if (e.nodeType === 9) {
                return Math.max(e.documentElement["client" + c], e.body["scroll" + c], e.documentElement["scroll" + c], e.body["offset" + c], e.documentElement["offset" + c])
            }
            if (a === b) {
                var i = f.css(e, d),
                    j = parseFloat(i);
                return f.isNumeric(j) ? j : i
            }
            return this.css(d, typeof a == "string" ? a : a + "px")
        }
    }), a.jQuery = a.$ = f, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function () {
        return f
    })
})(window);
(function ($) {
    $.fn.suggest = function (options) {
        var defaults = {
            conId: "keyword",
            suggest: "suggest",
            formId: "searchForm",
            searchBtn: "subSerch"
        };
        var options = $.extend(defaults, options);
        var getRewriteJsUrl = function (ajaxUrl) {
            if (!ajaxUrl) {
                return ""
            }
            ajaxUrl = ajaxUrl.replace(/index\.php\?c=Ajax_([\w_]+)\&a=([\w_]+)\&(.+)/g, "ajax_$1_$2_$3.html");
            ajaxUrl = ajaxUrl.replace(/(&|%26)/g, "%5E");
            return ajaxUrl
        };
        var locRsArr = [];
        var kwInput = $("#" + options.conId);
        var kwLength = 0;
        var suggest = $("#" + options.suggest);
        var timeout = false;
        options.dfWord = kwInput.val();
        var jump = false;
        if (navigator.userAgent.indexOf("MSIE") == -1) {
            kwInput.bind("input", function (event) {
                processKey(event)
            })
        }
        kwInput.keyup(function (event) {
            processKey(event)
        });
        kwInput.blur(function () {
            if (timeout) {
                clearTimeout(timeout)
            }
        });
        var processKey = function (e) {
            e = e || window.event;
            var keyCode = e.keyCode || e.which || e.charCode;
            if ((/38$|40$|13$/.test(e.keyCode))) {
                e.preventDefault && e.preventDefault();
                e.stopPropagation && e.stopPropagation();
                e.cancelBubble = true;
                e.returnValue = false;
                switch (keyCode) {
                    case 38:
                        jump = true;
                        prevResult();
                        break;
                    case 40:
                        jump = true;
                        nextResult();
                        break;
                    case 9:
                    case 13:
                        if (kwInput.val().length == kwLength || jump) {
                            selectCurrentResult()
                        }
                        break
                }
            } else {
                $("#sugUl").remove();
                locRsArr = [];
                if (timeout) {
                    clearTimeout(timeout)
                }
                timeout = setTimeout(function () {
                    if (kwInput.length > 0) {
                        var keyword = kwInput.val();
                        getData(keyword)
                    }
                }, 200)
            }
        };
        var getData = function (keyword) {
            var reg = new RegExp("%", "g");
            keyword = escape(keyword).replace(reg, "@");
            var url = "/index.php?c=Ajax&a=Suggest&keyword=" + keyword;
            $.getJSON(url, function (data) {
                for (var c in data) {
                    var locLi = $(data[c]);
                    locRsArr[c] = locLi
                }
                serCity()
            })
        };
        var selectCurrentResult = function () {
            jumpSerch()
        };
        $("#" + options.searchBtn).click(function () {
            jumpSerch()
        });
        $("#" + options.conId).focus(function () {});
        $("#" + options.conId).blur(function () {
            if (!$(this).val()) {
                $(this).css("color", "#ccc").val(options.dfWord)
            }
        });
        var jumpSerch = function () {
            if ($("#" + options.conId).val() == "\u8bf7\u8f93\u5165\u4f60\u8981\u627e\u7684\u4ea7\u54c1") {
                $("#" + options.conId).val("")
            }
            if ($("#" + options.conId).val() != "") {
                $("#" + options.formId).submit()
            }
        };
        var nextResult = function () {
            var self;
            if ($("#sugUl .sug-sel").length > 0) {
                if ($("#sugUl").children(".sug-sel").next().attr("class") == "sug-t") {
                    self = $("#sugUl").children(".sug-sel").attr("class", "nosel").next().next()
                } else {
                    self = $("#sugUl").children(".sug-sel").attr("class", "nosel").next()
                }
            } else {
                $("#sugUl").children(".sug-sel").attr("class", "");
                self = $("#sugUl :nth-child(2)")
            }
            self.attr("class", "sug-sel");
            if (self.html()) {
                kwInput.val(self.html().replace(/<[^>].*?>/g, ""))
            }
        };
        var prevResult = function () {
            var self;
            if ($("#sugUl").children(".sug-sel").prev().attr("id") == "sug_sub") {
                $("#sugUl").children(".sug-sel").attr("class", "");
                self = $("#sugUl li:last-child")
            } else {
                if ($("#sugUl").children(".sug-sel").prev().attr("id") == "sug_pro") {
                    self = $("#sugUl").children(".sug-sel").attr("class", "").prev().prev()
                } else {
                    self = $("#sugUl").children(".sug-sel").attr("class", "").prev()
                }
            }
            self.attr("class", "sug-sel");
            if (self.html()) {
                kwInput.val(self.html().replace(/<[^>].*?>/g, ""))
            }
        };
        var locLiEvent = function (li) {
            $(li).click(function (e) {
                var url = $(this).attr("data-rel");
                window.open(url, "_blank");
                e.stopPropagation()
            });
            $(li).mouseout(function () {
                $(this).removeClass("sug-sel")
            });
            $(li).mouseover(function () {
                $(this).addClass("sug-sel")
            })
        };
        var serCity = function () {
            suggest.empty();
            if (locRsArr.length != 0) {
                var locUl = $('<ul id="sugUl" class="suggest-list">');
                for (var c in locRsArr) {
                    var locLi = locRsArr[c];
                    if (!locLi.attr("class")) {
                        locLiEvent(locLi)
                    }
                    locUl.append(locLi)
                }
                suggest.append(locUl);
                suggest.show()
            } else {
                suggest.empty().hide()
            }
            if (kwInput.val()) {
                kwLength = kwInput.val().length
            }
        };
        $(document).click(function () {
            suggest.hide()
        })
    }
})(jQuery);
if (ZOL.$("top_more_nav")) {
    $(document).suggest();
    ZOL.$("top_more_nav").onmouseover = function () {
        ZOL.addClass(this, "quick-more-hover")
    };
    ZOL.$("top_more_nav").onmouseout = function () {
        ZOL.removeClass(this, "quick-more-hover")
    };
    var navTm = null;
    $("#head_pub_nav .onav").hover(function () {
        var self = $(this);
        navTm = setTimeout(function () {
            self.addClass("cur");
            var closeButton = self.attr("data-rel");
            $("#close_" + closeButton).click(function () {
                self.removeClass("cur")
            })
        }, 300)
    }, function () {
        $(this).removeClass("cur");
        if (navTm) {
            clearTimeout(navTm)
        }
    });
    $.getScript("//icon.zol-img.com.cn/public/js/search.js", function () {
        $("#keyword").zsuggest({
            offsetX: -8,
            offsetY: 5,
            width: 458,
            source: "pro",
            isSuggest: false
        })
    })
} else {
    a = new ZOL.util.AJAX();
    a._rewrite = false;
    var url = "/index.php?c=Ajax&a=getPubNav";
    a.get(url, function (data) {
        if (data) {
            var newData = data.split("||||###||||");
            ZOL.$("headerWrap").innerHTML = newData[0];
            ZOL.$("header").innerHTML = newData[1];
            $(document).suggest();
            ZOL.$("top_more_nav").onmouseover = function () {
                ZOL.addClass(this, "quick-more-hover")
            };
            ZOL.$("top_more_nav").onmouseout = function () {
                ZOL.removeClass(this, "quick-more-hover")
            };
            $("#head_pub_nav .onav").hover(function () {
                var self = $(this);
                $(this).addClass("cur");
                var closeButton = $(this).attr("data-rel");
                $("#close_" + closeButton).click(function () {
                    self.removeClass("cur")
                })
            }, function () {
                $(this).removeClass("cur")
            });
            $.getScript("//icon.zol-img.com.cn/public/js/search.js", function () {
                $("#keyword").zsuggest({
                    offsetX: -8,
                    offsetY: 5,
                    width: 442,
                    source: "pro",
                    isSuggest: true
                })
            })
        }
    })
}
$(document).ready(function () {
    var loginCon = ZOL.$("userbar");
    if (ZOL.user.id) {
        var myUrl = "//my.zol.com.cn/" + ZOL.user.id + "/";
        var msgUrl = myUrl + "message/";
        var setUrl = myUrl + "settings/";
        var logoutUrl = "//service.zol.com.cn/user/login.php?type=quit&backUrl=" + ZOL.URL;
        loginCon.innerHTML = '<div class="head-msg"><a id="headMsg" class="icon-msg" href="' + msgUrl + '" target="_blank"></a><div id="msg_n"></div></div><div class="zusername">' + '<span><a rel="nofollow" href="' + myUrl + '">' + ZOL.user.id + "</a><b></b></span>" + '<div class="user-center">' + '<a href="' + myUrl + '">\u4e2a\u4eba\u4e2d\u5fc3</a>' + '<a href="' + setUrl + '">\u8d26\u53f7\u8bbe\u7f6e</a>' + '<a href="' + logoutUrl + '" target="_self">\u9000\u51fa</a>' + "</div></div>";
        $(".zusername").hover(function () {
            $(this).addClass("zusername-hover")
        }, function () {
            $(this).removeClass("zusername-hover")
        });
        $.getScript("//my.zol.com.cn/public_new.php", function () {
            var msgStr = $("#msg_n").text().indexOf("(");
            if (msgStr > -1) {
                $("#headMsg").addClass("icon-msg-new")
            }
        })
    } else {
        var loginUrl = "//service.zol.com.cn/user/login.php?backUrl=" + ZOL.URL;
        var regUrl = "//service.zol.com.cn/user/register.php?backurl=" + ZOL.URL;
        loginCon.innerHTML = '<a rel="nofollow" href="' + loginUrl + '" target="_self">\u767b\u5f55</a><a rel="nofollow" href="' + regUrl + '" target="_blank">\u6ce8\u518c</a>'
    }
});
var total1 = $("#indexTopBlockContent li").size();
var recommend1Page = parseInt(Math.ceil(total1 / 5));
$(".change").live("click", function () {
    var offset1 = $(this).attr("data-rel");
    var hideId = ".show_" + offset1;
    $(hideId).hide();
    offset1 = parseInt(offset1) + 1;
    var displayId = ".show_" + offset1;
    $(displayId).show();
    if (offset1 > recommend1Page) {
        offset1 = 1;
        $(".show_" + offset1).show()
    }
    $(this).attr("data-rel", offset1)
});
var pv_subcatid = typeof (pv_subcatid) == "undefined" ? 0 : pv_subcatid;
var comp_proId = proId;
if (typeof (proId) == "undefined") {
    var proId = 0
}
if (typeof (pageKey) == "undefined" || "default" == pageKey) {
    var pageKey = "param"
}
var doStats = function () {
    var o = ZOL.$("pvstats");
    if (!o) {
        return false
    }
    var sid = ZOL.user.sid;
    if ("" != document.referrer) {
        var r = (new Date()).getTime() + Math.random();
        ZOL.load("/js/stats.php?id=" + proId + "&zol_sid=" + sid + "&stid=1&ref=" + document.referrer + "&r=" + r)
    }
    ZOL.removeEvent(document.body, "mousemove", doStats)
};
ZOL.addEvent(document.body, "mousemove", doStats);
var cookie = ZOL.util.cookie;
var userLocationId = parseInt(cookie.get("userLocationId"));
var userProvinceId = parseInt(cookie.get("userProvinceId"));
var userCityId = parseInt(cookie.get("userCityId"));
var getUserAreaInfo = function (callback) {
    if (userLocationId && userProvinceId) {
        typeof (callback) == "function" && callback();
        return
    }
    var A = new ZOL.util.AJAX();
    A._rewrite = false;
    var r = (new Date()).getTime() + Math.random();
    var url = "/index.php?c=Ajax&a=userAreaInfo&time=" + r;
    A.get(url, function (data) {
        if (data) {
            var info = eval("(" + data + ")");
            userProvinceId = info.provinceId;
            userLocationId = info.locationId;
            userCityId = info.cityId;
            callback()
        }
    })
};
var userLogin = function () {
    var loginCon = ZOL.$("top_login");
    var bbsLoginCon = ZOL.$("bbs_loginarea");
    var reviewLoginCon = ZOL.$("review_loginarea");
    if (ZOL.user.id) {
        var myUrl = "http://my.zol.com.cn/" + ZOL.user.id + "/";
        var blogUrl = "http://blog.zol.com.cn/" + ZOL.user.id + "/";
        var msgUrl = myUrl + "message/";
        var logoutUrl = "https://service.zol.com.cn/user/login.php?type=quit&backUrl=" + encodeURIComponent(ZOL.URL);
        var bbsLoginStr = "";
        var uLoginStr = '<a style="font-family: arial;" href="http://my.zol.com.cn/' + ZOL.user.id + '/" target="_blank">' + ZOL.user.id + "</a> | ";
        var mLoginStr = '<span id="msg_n"><a href="' + msgUrl + '" target="_blank">\u77ed\u6d88\u606f</a></span>  | ';
        var qLoginStr = '<a href="' + blogUrl + '" target="_blank">\u6211\u7684\u535a\u5ba2</a> | <a href="' + logoutUrl + '" target="_self">\u9000\u51fa</a>';
        loginCon.innerHTML = uLoginStr + mLoginStr + qLoginStr;
        if (bbsLoginCon) {
            bbsLoginCon.innerHTML = uLoginStr + qLoginStr
        }
        if (reviewLoginCon) {
            reviewLoginCon.innerHTML = uLoginStr + qLoginStr
        }
        ZOL.load("http://my.zol.com.cn/public_new.php")
    } else {
        var loginUrl = "https://service.zol.com.cn/user/login.php?backUrl=" + encodeURIComponent(ZOL.URL);
        var regUrl = "https://service.zol.com.cn/user/register.php?backurl=" + encodeURIComponent(ZOL.URL);
        rLoginStr = '<a href="' + loginUrl + '" target="_self">\u767b\u5f55</a> | <a href="' + regUrl + '" target="_blank">\u6ce8\u518c</a>';
        loginCon.innerHTML = rLoginStr;
        if (bbsLoginCon) {
            bbsLoginCon.innerHTML = rLoginStr
        }
        if (reviewLoginCon) {
            reviewLoginCon.innerHTML = rLoginStr
        }
        if (ZOL.$("top_login_star")) {
            ZOL.$("top_login_star").innerHTML = rLoginStr;
            ZOL.$("top_star_dianping").className = "top_star_dianping_class";
            ZOL.$("top_star_dianping").innerHTML = "\u6211\u6765\u70b9\u8bc4"
        }
    }
};
userLogin();
var openZjWind = function (subid, manuid, proid) {
    var zjUrl = "http://zj.zol.com.cn/diy/special.php?items[]=" + subid + "_" + manuid + "_" + proid;
    window.open(zjUrl)
};
var lastproTab = function () {
    if (!ZOL.$("lastpro-tab")) {
        return
    }
    new ZOL.widget.TabView(["lastpro-tab"], {
        ignoreCss: "more"
    })
}();
var navTag = function () {
    if (typeof proId == "undefined" || typeof pageKey == "undefined") {
        return false
    }
    var self = this;
    this.showCon = ZOL.$("tagnav-con");
    if (this.showCon) {
        this.showTags = this.showCon.getElementsByTagName("a")
    }
    if (ZOL.$("tagnav-hidden")) {
        this.hiddenTags = ZOL.$("tagnav-hidden").getElementsByTagName("a")
    }
    this.moreCon = ZOL.$("nav-more");
    this.showMore = ZOL.$("nav-more-all");
    this.pageKey = "tag_" + pageKey;
    this.moreCon.onmouseover = function () {
        self.showMore.style.display = "block"
    };
    this.moreCon.onmouseout = function () {
        self.showMore.style.display = "none"
    };
    if (this.hiddenTags) {
        while (this.hiddenTags.length) {
            var tag = this.hiddenTags[0];
            if (tag.id == this.pageKey || tag.id == "tag_online") {
                this.showCon.appendChild(tag)
            } else {
                this.showMore.appendChild(tag)
            }
        }
    }
};
ZOL.onReady(navTag);
var topMerchant = function () {
    if (!ZOL.$("topmer-tab")) {
        return
    }
    if (typeof (seriesId) == "undefined") {
        seriesId = 0
    }
    if (typeof isManualMerchant == "undefined") {
        var __proId = proId;
        var __subcateId = subcateId;
        var __manuId = manuId;
        var __seriesId = typeof (seriesId) == "undefined" ? 0 : seriesId
    } else {
        var __proId = typeof (_proId) == "undefined" ? 0 : _proId;
        var __subcateId = typeof (_subcateId) == "undefined" ? 0 : _subcateId;
        var __manuId = typeof (_manuId) == "undefined" ? 0 : _manuId;
        var __seriesId = typeof (_seriesId) == "undefined" ? 0 : _seriesId
    }
    var self = this;
    var lastActTag = null;
    var mLastActTag = null;
    var url = "/index.php?c=Ajax&a=DetailTopMerchant&proId=" + __proId + "&seriesId=" + __seriesId + "&provinceId=";
    this.option = {
        tagName: "li",
        eventName: "onclick",
        requestUrl: url,
        ajCon: "topmer-con",
        ajLang: {
            HTTP_LOADING: "\u6b63\u5728\u52a0\u8f7d\u6570\u636e..."
        }
    };
    this.merlistCon = ZOL.$("topmer-con");
    this.layer = null;
    this.layerOuter = null;
    this.load = function (provinceId) {
        var setting = {};
        setting = this.option;
        if (provinceId) {
            setting.requestUrl = url + provinceId + "&cityId=";
            setting.tagName = "a";
            setting.callback = function (item) {
                self.load(provinceId);
                self.showMerInfo()
            };
            var tabId = "topcity-tab"
        } else {
            setting.callback = function (item) {
                if (mLastActTag && item.getElementsByTagName("a")[0].innerHTML != mLastActTag.innerHTML) {
                    mLastActTag.className = ""
                }
                var provId = item.getAttribute("urn");
                self.load(provId);
                self.showMerInfo();
                lastActTag = item
            };
            var tabId = "topmer-tab"
        }
        var tab = new ZOL.widget.TabView([tabId], setting)
    };
    this.showMerInfo = function () {
        var titArr = ZOL.find("dl", "topmer-con");
        if (!titArr) {
            return false
        }
        var conf = {
            tagName: "dl",
            ignoreCss: "merinfo",
            activeCss: "mersel",
            callback: function (item, curCon) {
                var hiddenHD = null;
                ZOL.addEvent(item, "mouseover", function () {
                    hiddenHD && window.clearTimeout(hiddenHD)
                });
                ZOL.addEvent(item, "mouseout", function () {
                    hiddenHD = window.setTimeout(function () {
                        curCon.style.display = "none"
                    }, 10)
                })
            }
        };
        new ZOL.widget.TabView(["topmer-con"], conf)
    };
    this.load();
    this.load(ZOL.find("li", "topmer-tab")[0].getAttribute("urn"));
    this.showMerInfo();
    var topMerMore = ZOL.$("more-prov-con");
    if (topMerMore) {
        var moreBtn = ZOL.$("more-prov-btn");
        var moreCon = ZOL.$("more-prov-con");
        var lastTag = moreBtn.parentNode;
        var mLastActTag = null;
        var moreProvinceArr = ZOL.find("a", moreCon);
        var lastMoreObj = null;
        for (var i = 0, len = moreProvinceArr.length; i < len; i++) {
            var oneProv = moreProvinceArr[i];
            oneProv.onclick = function () {
                this.className = "sel";
                lastMoreObj && (lastMoreObj.className = "");
                lastMoreObj = this;
                if (lastActTag && lastActTag != this) {
                    lastActTag.className = ""
                }
                mLastActTag = this;
                cpItem = this.cloneNode(1);
                with(cpItem) {
                    className = ""
                }
                with(lastTag) {
                    removeChild(lastTag.getElementsByTagName("a")[0]);
                    insertBefore(cpItem, moreBtn);
                    className = "sel";
                    setAttribute("urn", cpItem.getAttribute("urn"))
                }
                ZOL.autoOnclick(lastTag);
                moreCon.style.display = "none"
            }
        }
        var hiddenHD = null;
        var moreConShow = function () {
            hiddenHD && clearTimeout(hiddenHD);
            moreCon.style.display = "block"
        };
        var moreConHidden = function () {
            moreCon.style.display = "none"
        };
        moreCon.onmouseover = moreBtn.onmouseover = moreConShow;
        moreCon.onmouseout = moreBtn.onmouseout = function () {
            hiddenHD = setTimeout(function () {
                moreConHidden()
            }, 200)
        }
    }
};
var chengButton = function () {
    ZOL.$("warning_button").onclick = function () {
        var small = ZOL.$("small_warning").style.display;
        if ("none" == small) {
            ZOL.$("big_warning").style.display = "none";
            ZOL.$("small_warning").style.display = "block";
            ZOL.$("warning_button_back").className = "show_more"
        } else {
            ZOL.$("big_warning").style.display = "block";
            ZOL.$("small_warning").style.display = "none";
            ZOL.$("warning_button_back").className = ""
        }
    }
};
var loadMerchant = function () {
    if (!proId) {
        return false
    }
    var module = ZOL.$("detailMidMerchant") ? "type[]=detailMidMerchant^" : "";
    module += ZOL.$("detailTopMerchant") ? "type[]=detailTopMerchant^" : "";
    if (!module) {
        return false
    }
    if (typeof isManualMerchant == "undefined") {
        var __proId = proId;
        var __subcateId = subcateId;
        var __manuId = manuId;
        var __seriesId = typeof (seriesId) == "undefined" ? 0 : seriesId
    } else {
        var __proId = typeof (_proId) == "undefined" ? 0 : _proId;
        var __subcateId = typeof (_subcateId) == "undefined" ? 0 : _subcateId;
        var __manuId = typeof (_manuId) == "undefined" ? 0 : _manuId;
        var __seriesId = typeof (_seriesId) == "undefined" ? 0 : _seriesId
    }
    if (typeof (userProvinceId) == "undefined") {
        userProvinceId = 1
    }
    if (typeof (userCityId) == "undefined") {
        userCityId = 0
    }
    if (typeof (provinceId) == "undefined") {
        provinceId = 1
    }
    if (typeof (merprovId) != "undefined") {
        provinceId = merprovId
    }
    var provId = provinceId == 1 ? userProvinceId : provinceId;
    var spMun = true;
    if (userProvinceId == 1 || userProvinceId == 2 || userProvinceId == 3 || userProvinceId == 4) {
        spMun = false
    }
    var url = "/js_" + module + "^proId=" + __proId + "^subcateId=" + __subcateId + "^manuId=" + __manuId;
    url += (typeof (__seriesId) != "undefined") ? ("^seriesId=" + __seriesId) : "";
    url += (typeof (provId) != "undefined") ? ("^provinceId=" + provId) : "";
    url += (typeof (userCityId) != "undefined" && spMun) ? ("^cityId=" + userCityId) : "";
    url += ".html";
    new ZOL.load(url, "js", function () {
        chengButton();
        topMerchant()
    })
};
var refreshDocs = function () {
    a = new ZOL.util.AJAX();
    var url = "/index.php?c=Ajax&a=detailDocs&proId=" + proId + "&userProvinceId=" + userProvinceId + "&userLocationId=" + userLocationId + "&userCityId=" + userCityId;
    a.get(url, function (data) {
        if (data) {
            ZOL.$("evaDocList").innerHTML = data
        }
    })
};
var loadMerchantAndDocs = function () {
    loadMerchant();
    if (userLocationId != 1) {
        refreshDocs()
    }
};
getUserAreaInfo(loadMerchantAndDocs);
$("#keywords").live("click", function () {
    $(".search-input").addClass("search-input-focus")
});
$("#keywords").live("blur", function () {
    $(".search-input").removeClass("search-input-focus")
});
var suggest = null;
ZOL.$("keywords").onclick = function () {
    var self = this;
    if ("\u8054\u60f3Y470\u7b14\u8bb0\u672c\u7535\u8111" == this.value || "\u8bf7\u8f93\u5165\u5173\u952e\u5b57" == this.value || "\u60e0\u666e g4-1058TX" == this.value) {
        this.value = ""
    }
    this.style.color = "#000000";
    if (suggest) {
        return
    }
    var suggest = new ZOL.load(ZOL.config.root + "util/suggest.js", "js", function () {
        ZOL.widget.suggest("keywords", {
            source: "/index.php?c=Ajax&a=SearchSuggest",
            cssFile: "http://icon.zol-img.com.cn/products/css/suggest.css",
            onSelect: function (item) {
                var go = item.getElementsByTagName("font")[0].getAttribute("rel");
                if (go) {
                    document.location.href = go;
                    return false
                }
            }
        });
        var top = parseInt($(".suggest-re").css("top")) + 3;
        var left = parseInt($(".suggest-re").css("left")) - 10;
        var width = parseInt($(".suggest-re").css("width")) + 28;
        $(".suggest-re").attr("style", "position: absolute; top: " + top + "px; left: " + left + "px; width: " + width + "px; display: none;")
    });
    this.onclick = null
};
ZOL.$("do").onclick = function () {
    if (typeof (defkeyword) == "undefined") {
        defkeyword = "\u8bf7\u8f93\u5165\u5173\u952e\u5b57"
    }
    if (ZOL.$("keywords").value == defkeyword || ZOL.$("keywords").value == "") {
        return false
    }
    this.onclick = null
};
var visitedPro = new function () {
    if (typeof proId == "undefined" || !proId) {
        return false
    }
    var self = this;
    this.config = {
        container: "visited-pro",
        idName: "visited_proId",
        infoName: "visited_info",
        expires: 24 * 1,
        delimiter: "|",
        maxNum: 6
    };
    var num = 0;
    var cookie = ZOL.util.cookie;
    this.idStr = "";
    this.idArr = [];
    this.init = function () {
        this.idStr = cookie.get(this.config.idName);
        this.idArr = this.idStr ? this.idStr.split("|") : [];
        return this
    };
    this.save = function () {
        if (this.idArr) {
            for (k in this.idArr) {
                if (this.idArr[k] == proId) {
                    this.idArr.splice(k, 1);
                    break
                }
            }
        }
        this.idArr.unshift(proId);
        if (this.idArr.length > this.config.maxNum) {
            this.idArr.pop()
        }
        this.idStr = this.idArr.join(this.config.delimiter);
        cookie.set(this.config.idName, this.idStr, this.config.expires);
        return this
    };
    this.show = function () {
        var con = ZOL.$(self.config.container);
        if (!con) {
            return false
        }
        this.init();
        if (this.idStr) {
            a = new ZOL.util.AJAX();
            var url = "/index.php?c=Ajax&a=VisitedPro&proIdStr=" + this.idStr + "&subcateId=" + subcateId;
            url += typeof (seriesId) == "undefined" ? "" : "&seriesId=" + seriesId;
            a.get(url, function (data) {
                if (data) {
                    con.innerHTML = data
                }
            })
        }
        this.save();
        return this
    };
    this.show()
};
var visitedTab = function () {
    if (!ZOL.$("visited-subcate-list")) {
        return false
    }
    var listArr = ZOL.find("a", "visited-subcate-list");
    for (var i = 0; i < listArr.length; i++) {
        listArr[i].onmouseover = function () {
            for (var j = 0; j < listArr.length; j++) {
                ZOL.$(listArr[j].getAttribute("rel")).style.display = "none";
                listArr[j].className = ""
            }
            ZOL.$(this.getAttribute("rel")).style.display = "block";
            this.className = "sel"
        }
    }
};
var visitedToCompare = function (relsubcateId) {
    var allIpt = ZOL.find("input", "looked");
    var len = allIpt.length;
    var url = "/ProductComp_param_";
    var cnt = 0;
    var comma = "";
    for (var i = 0; i < allIpt.length; i++) {
        var o = allIpt[i];
        if (o.type == "checkbox" && o.checked && o.getAttribute("rel") == "subcate_" + relsubcateId) {
            url += comma + allIpt[i].value;
            comma = "-";
            cnt++
        }
    }
    var limitSubIdArr = ["57", "16", "15"];
    var limitShowProNum = ($.inArray(subcateId, limitSubIdArr) !== -1) ? 5 : 4;
    if (cnt >= limitShowProNum) {
        var alertStr = "\u62b1\u6b49\uff0c\u60a8\u53ea\u80fd\u9009\u62e9" + limitShowProNum + "\u6b3e\u4ea7\u54c1\u8fdb\u884c\u5bf9\u6bd4";
        alert(alertStr);
        return
    }
    if (cnt < 1) {
        alert("\u8bf7\u9009\u62e9\u8981\u5bf9\u6bd4\u7684\u4ea7\u54c1");
        return
    }
    url += ".html";
    window.open(url)
};
var visitedClearCheckBox = function (relsubcateId) {
    var allIpt = ZOL.find("input", "looked");
    ZOL.each(allIpt, function (o) {
        if (o.type == "checkbox" && o.getAttribute("rel") == "subcate_" + relsubcateId) {
            o.checked = false
        }
    })
};
var visitedSubcatePro = new function () {
    if (typeof subcateId == "undefined" || !subcateId) {
        return false
    }
    var self = this;
    this.config = {
        container: "visited-subcate-pro",
        subcateIdName: "visited_subcateId",
        subcateProIdName: "visited_subcateProId",
        infoName: "visited_info",
        expires: 24 * 1,
        delimiter: "|",
        spDelimiter: "-",
        pDelimiter: ",",
        subcateMaxNum: 5,
        proMaxNum: 6
    };
    if (!ZOL.$(this.config.container) && pageKey != "default" && pageKey != "param") {
        return false
    }
    var num = 0;
    var cookie = ZOL.util.cookie;
    this.subcateIdStr = "";
    this.subcateIdArr = [];
    this.subcateProIdStr = "";
    this.subcateProIdArr = [];
    this.init = function () {
        this.subcateIdStr = cookie.get(this.config.subcateIdName);
        this.subcateIdArr = this.subcateIdStr ? this.subcateIdStr.split(this.config.delimiter) : [];
        this.subcateProIdStr = cookie.get(this.config.subcateProIdName);
        this.subcateProIdArr = this.subcateProIdStr ? this.subcateProIdStr.split(this.config.delimiter) : [];
        return this
    };
    this.save = function () {
        if (this.subcateIdArr) {
            for (k in this.subcateIdArr) {
                if (this.subcateIdArr[k] == subcateId) {
                    this.subcateIdArr.splice(k, 1);
                    break
                }
            }
        }
        this.subcateIdArr.unshift(subcateId);
        if (this.subcateIdArr.length > this.config.subcateMaxNum) {
            this.subcateIdArr.pop()
        }
        this.subcateIdStr = this.subcateIdArr.join(this.config.delimiter);
        cookie.set(this.config.subcateIdName, this.subcateIdStr, this.config.expires);
        this.subcateId = "";
        var proIdArr = new Array();
        if (this.subcateProIdArr) {
            var subArrLen = this.subcateProIdArr.length;
            for (var k = 0; k < subArrLen; k++) {
                this.subcateProId = this.subcateProIdArr[k].split(this.config.spDelimiter);
                this.subcateId = this.subcateProId[0];
                if (this.subcateId == subcateId) {
                    proIdArr = this.subcateProId[1].split(this.config.pDelimiter);
                    for (j in proIdArr) {
                        if (proIdArr[j] == proId) {
                            proIdArr.splice(j, 1);
                            break
                        }
                    }
                    this.subcateProIdArr.splice(k, 1);
                    break
                }
            }
        }
        proIdArr.unshift(proId);
        if (proIdArr.length > this.config.proMaxNum) {
            proIdArr.pop()
        }
        this.proIdStr = proIdArr.join(this.config.pDelimiter);
        this.subcateProId = subcateId + this.config.spDelimiter + this.proIdStr;
        this.subcateProIdArr.unshift(this.subcateProId);
        if (this.subcateProIdArr.length > this.subcateProIdArr.subcateMaxNum) {
            this.subcateProIdArr.pop()
        }
        this.newSubcateProIdStr = this.subcateProIdArr.join(this.config.delimiter);
        cookie.set(this.config.subcateProIdName, this.newSubcateProIdStr, this.config.expires);
        return this
    };
    this.show = function () {
        var con = ZOL.$(self.config.container);
        if (!con && pageKey != "default" && pageKey != "param") {
            return false
        }
        this.init();
        if (this.subcateIdStr && this.subcateProIdStr) {
            a = new ZOL.util.AJAX();
            var url = "/index.php?c=Ajax&a=NewVisitedPro&subcateIdStr=" + this.subcateIdStr + "&subcateProIdStr=" + this.subcateProIdStr + "&proId=" + proId + "&subcateId=" + subcateId + "&tmp=" + (new Date()).getTime();
            a.get(url, function (data) {
                if (data) {
                    con.innerHTML = data;
                    visitedTab();
                    addVisitedComp()
                }
            })
        }
        this.save();
        return this
    };
    this.show()
};
var addVisitedComp = function () {
    var proObjArr = ZOL.find("em", "visited-subcate-pro");
    for (var i = 0; i < proObjArr.length; i++) {
        var proObj = proObjArr[i];
        if ("addVistited" == proObj.className) {
            var nowProId = proObj.id.split("_")[1];
            proObj.proId = nowProId;
            proObj.value = nowProId;
            proObj.proName = ZOL.$("proName_" + nowProId).innerHTML;
            proObj.proUrl = ZOL.$("proName_" + nowProId).href;
            proObj.proPic = ZOL.$("proPic_" + nowProId).src;
            proObj.checked = "checked";
            proObj.onclick = function () {
                var item = document.createElement("input");
                with(item) {
                    type = "checkbox";
                    value = this.proId;
                    checked = "checked"
                }
                item.proId = this.proId;
                item.proName = this.proName;
                item.proUrl = this.proUrl;
                item.proPic = this.proPic.replace("_120x90/", "_80x60/");
                comp.add(item, item.proName, item.proUrl, item.proPic, subcateId)
            }
        }
    }
};
var funcicon = function () {
    var func = ZOL.$("func");
    if (!func) {
        return false
    }
    func.onmouseover = function () {
        new ZOL.load(ZOL.config.root + "funcicon.js");
        this.onmouseover = null
    }
}();
var copyUrl = function () {
    ZOL.util.copy(ZOL.URL, function () {
        alert("\u590d\u5236\u6210\u529f\uff01")
    })
};
var checkBbsForm = function (obj) {
    if (ZOL.user.id == "") {
        alert("\u5fc5\u987b\u662f\u767b\u5f55\u7528\u6237\u624d\u53ef\u4ee5\u53d1\u5e16");
        return false
    }
    if (obj.elements["book_type"].value == "") {
        alert("\u8bf7\u9009\u62e9\u8bba\u575b\u7c7b\u522b");
        obj.elements["book_type"].focus();
        return false
    }
    if (obj.elements["title"].value == "") {
        alert("\u8bf7\u8f93\u5165\u6807\u9898");
        obj.elements["title"].focus();
        return false
    } else {
        if (obj.elements["title"].value.length < 5) {
            alert("\u6807\u9898\u4e0d\u80fd\u5c11\u4e8e5\u4e2a\u5b57");
            obj.elements["title"].focus();
            return false
        } else {
            if (obj.elements["title"].value.length > 23) {
                alert("\u5e16\u5b50\u6807\u9898\u4e0d\u80fd\u8d85\u8fc723\u4e2a\u5b57");
                obj.elements["title"].focus();
                return false
            }
        }
    }
    if (obj.elements["content"].value == "") {
        alert("\u8bf7\u8f93\u5165\u5185\u5bb9");
        obj.elements["content"].focus();
        return false
    }
};
var bbsBookTab = new ZOL.widget.TabView(["booktab"], {
    tagName: "em",
    eventName: "onclick",
    ajCon: "bookcon",
    ajUrn: "INNER",
    requestUrl: "/index.php?c=Ajax&a=DetailGroupBbs&proId=" + proId + "&bookType=",
    Delay: 100,
    ajLang: {
        HTTP_LOADING: '<div class="loading">\u8bfb\u53d6\u4e2d...</div>'
    }
});
var pkTab = function () {
    if (ZOL.$("pktab")) {
        new ZOL.widget.TabView(["pktab"], {
            tagName: "em"
        })
    }
}();
if ((ZOL.$("pkshow") || ZOL.$("pk_manu_id")) && subcateId) {
    a = new ZOL.util.AJAX();
    var url = "/index.php?c=Ajax&a=DetailPKManu&subcateId=" + subcateId;
    a.get(url, function (data) {
        if (data) {
            var tmp = data.split("|");
            if (tmp.length >= 2) {
                var i = 0;
                for (i; i < tmp.length; i = i + 2) {
                    if (ZOL.$("pk_manu_id_top")) {
                        ZOL.$("pk_manu_id_top").options.add(new Option(tmp[i + 1], tmp[i]))
                    }
                    if (ZOL.$("pk_manu_id_nf")) {
                        ZOL.$("pk_manu_id_nf").options.add(new Option(tmp[i + 1], tmp[i]))
                    }
                    if (ZOL.$("pk_manu_id_p1")) {
                        ZOL.$("pk_manu_id_p1").options.add(new Option(tmp[i + 1], tmp[i]))
                    }
                    if (ZOL.$("pk_manu_id_p2")) {
                        ZOL.$("pk_manu_id_p2").options.add(new Option(tmp[i + 1], tmp[i]))
                    }
                }
            }
        }
    });
    var pkSelectChg = function (idstr) {
        ZOL.$("pk_pro_id" + idstr).length = 1;
        var tmpManuId = ZOL.$("pk_manu_id" + idstr).value;
        if (manuId > 0) {
            a = new ZOL.util.AJAX();
            var url = "/index.php?c=Ajax&a=detailpkpro&subcateId=" + subcateId + "&manuId=" + tmpManuId;
            a.get(url, function (data) {
                var tmp = data.split("|");
                if (tmp.length >= 2) {
                    var i = 0;
                    for (i; i < tmp.length; i = i + 2) {
                        var pkOpt = new Option(tmp[i + 1], tmp[i]);
                        ZOL.$("pk_pro_id" + idstr).options.add(pkOpt)
                    }
                }
            })
        }
    };
    ZOL.$("pk_manu_id").onchange = function () {
        pkSelectChg("")
    };
    ZOL.$("pk_manu_id_top").onchange = function () {
        pkSelectChg("_top")
    };
    ZOL.$("pk_manu_id_nf").onchange = function () {
        pkSelectChg("_nf")
    };
    ZOL.$("pk_manu_id_p1").onchange = function () {
        pkSelectChg("_p1")
    };
    ZOL.$("pk_manu_id_p2").onchange = function () {
        pkSelectChg("_p2")
    };
    var pkBtnClick = function (idstr) {
        var pk_pro_id = ZOL.$("pk_pro_id" + idstr).value;
        var pk_main_pro_id = ZOL.$("pk_main_pro_id").value;
        if (pk_main_pro_id > 0 && pk_pro_id > 0) {
            if (pk_main_pro_id < pk_pro_id) {
                window.open("/pk/" + pk_main_pro_id + "_" + pk_pro_id + ".shtml")
            }
            if (pk_main_pro_id > pk_pro_id) {
                window.open("/pk/" + pk_pro_id + "_" + pk_main_pro_id + ".shtml")
            }
        } else {
            if (proId > 0 && pk_pro_id > 0) {
                if (proId < pk_pro_id) {
                    window.open("/pk/" + proId + "_" + pk_pro_id + ".shtml")
                }
                if (pk_pro_id < proId) {
                    window.open("/pk/" + pk_pro_id + "_" + proId + ".shtml")
                }
            } else {
                alert("\u8bf7\u9009\u62e9\u8981pk\u7684\u5bf9\u8c61");
                return false
            }
        }
    };
    ZOL.$("pk_button").onclick = function () {
        pkBtnClick("_top")
    };
    ZOL.$("pk_button_top").onclick = function () {
        pkBtnClick("_top")
    };
    ZOL.$("pk_button_nf").onclick = function () {
        pkBtnClick("_nf")
    };
    ZOL.$("pk_button_p1").onclick = function () {
        pkBtnClick("_p1")
    };
    ZOL.$("pk_button_p2").onclick = function () {
        pkBtnClick("_p2")
    }
}
var rankTab = function () {
    new ZOL.widget.TabView(["lar-tab", "mlar-tab", "art_tab", "under_pic"], {
        tagName: "em"
    })
}();
var scrollPromo = function () {
    var promoCon = "detailScrollPromoInfo";
    var scrollObj = ZOL.$("pomo-demo");
    var promoObj = ZOL.$(promoCon);
    if (!promoObj || !scrollObj) {
        return false
    }
    new ZOL.load(ZOL.config.root + "util/effect.js", "js", function () {
        var config = {
            direction: "left",
            timer: 10
        };
        var scroll = new ZOL.widget.effect.marquee(scrollObj, config);
        scroll.start()
    })
}();
var switchBatchPro = function (showId, showDiv) {
    var extraPrice = ZOL.$(showId);
    if (!extraPrice) {
        return false
    }
    var hiddenHd = null;
    extraPrice.hiddenObj = ZOL.$(showDiv);
    extraPrice.onmouseover = function () {
        var pos = ZOL.util.getPosition(this);
        if (showDiv == "relmore") {
            this.hiddenObj.style.top = pos.y + "px";
            if (ZOL.browser.IE) {
                var posOffset = 10;
                if (subcateId == 15) {
                    posOffset = 0
                }
                if (subcateId == 57) {
                    posOffset = 11
                }
                this.hiddenObj.style.left = (pos.x - posOffset) + "px"
            } else {
                var posOffset = 11;
                if (subcateId == 15) {
                    posOffset = 0
                }
                if (subcateId == 57) {
                    posOffset = 10
                }
                this.hiddenObj.style.left = (pos.x - posOffset) + "px"
            }
        }
        this.hiddenObj.onmouseover = function () {
            hiddenHd && clearTimeout(hiddenHd);
            this.style.display = "inline"
        };
        if (this.hiddenObj) {
            this.hiddenObj.style.display = "inline";
            this.className = "more close"
        }
    };
    extraPrice.onmouseout = function () {
        var self = this;
        if (self.hiddenObj) {
            hiddenHd = setTimeout(function () {
                self.hiddenObj.style.display = "none";
                self.className = "more"
            }, 200)
        }
    }
};
switchBatchPro("extraMoreP", "extraP");
var gotoPic = function () {
    var dir = Math.ceil(proId / 1000);
    var url = ZOL.URL.replace(/\/\w+\/index\d+\.shtml/g, "/" + dir + "/" + proId + "/pic.shtml");
    ZOL.go(url)
};
var video = function () {
    return;
    var proImg = ZOL.$("pro-bigpic");
    if (!proImg) {
        return
    }
    var avId = parseInt(proImg.getAttribute("rel"));
    if (!avId) {
        return
    }
    var pic = proImg.src;
    new ZOL.load(ZOL.config.root + "pro_video.js", "js", function () {
        loadVideo(avId, pic, "fpic")
    })
};
ZOL.onReady(video);
var zoom = function () {
    var pic = ZOL.$("pro-bigpic");
    if (!pic) {
        return false
    }
    var morePicArr = ZOL.find("img", "sidemain");
    var defPic = pic.cloneNode(true);
    defPic.bigSrc = defPic.src;
    defPic.src = defPic.src.replace("_280x210", "_60x45");
    defPic.zoomSrc = defPic.src.replace("_280x210", "");
    defPic.defHref = pic.parentNode.href;
    defPic.defA = "A";
    var spanArr = ZOL.find("span", "fpic");
    var spanLen = spanArr.length;
    for (i = 0; i < spanLen; i++) {
        if (spanArr[i].className.indexOf("icon") != -1) {
            var spanStr = spanArr[i].className
        }
    }
    if (spanStr) {
        var _span = document.createElement("a");
        with(_span) {
            className = spanStr
        }
    }
    if (!pic || !pic.getAttribute("zoom")) {
        return false
    }
    var __call = false;
    var callback = function () {
        var config = {
            con: "fpic",
            css: "zoomer",
            width: 460,
            height: 400,
            lensCss: "zlens",
            position: "right",
            offset: 11,
            lens: true,
            preload: true
        };
        new ZOL.widget.zoomer(config);
        __call = true
    };
    var doZoom = function () {
        this.zoom = this.src.replace("_280x210", "");
        if (__call) {
            callback()
        } else {
            new ZOL.load(ZOL.config.root + "util/zoom.js", "js", function () {
                callback()
            })
        }
        this.onmouseover = null
    };
    pic.onmouseover = doZoom;
    var _smallMouseoverFunc = function () {
        var _img = new Image();
        var _bigImg = new Image();
        _bigImg.src = this.zoomSrc;
        if ("A" == this.defA) {
            var nowBigSrc = defPic.bigSrc;
            var nowZoomSrc = defPic.zoomSrc
        } else {
            var nowBigSrc = this.bigSrc;
            var nowZoomSrc = this.zoomSrc
        }
        with(_img) {
            src = nowBigSrc;
            zoom = nowZoomSrc;
            onmouseover = doZoom;
            bigImg = _bigImg
        }
        var fpic = ZOL.$("fpic");
        var a = document.createElement("a");
        if ("A" == this.defA) {
            a.href = defPic.defHref
        } else {
            a.href = this.parentNode.href
        }
        fpic.innerHTML = "";
        fpic.appendChild(a);
        a.appendChild(_img);
        if (spanStr) {
            a.appendChild(_span)
        }
        ZOL.each(morePicArr, function (morePic) {
            if (morePic.className !== "proPics") {
                return false
            }
            if (morePic.parentNode) {
                morePic.parentNode.parentNode.className = "title"
            }
        });
        if (this.parentNode) {
            this.parentNode.parentNode.className = "title nowbigpic"
        }
    };
    var _smallMouseoutFunc = function () {};
    var eachFunc = function (morePic) {
        morePic.bigSrc = morePic.src.replace("_60x45", "_280x210");
        morePic.zoomSrc = morePic.src.replace("_60x45", "");
        ZOL.addEvent(morePic, "mouseover", _smallMouseoverFunc)
    };
    ZOL.each(morePicArr, function (morePic) {
        if (morePic.className !== "proPics") {
            return false
        }
        eachFunc(morePic)
    });
    var eventHd = null;
    if (ZOL.browser.IE) {
        var overEventName = "mouseenter";
        var outEventName = "mouseleave"
    } else {
        var overEventName = "mouseover";
        var outEventName = "mouseout"
    }
    ZOL.addEvent("toppics", outEventName, function () {
        eventHd = window.setTimeout(function () {
            _smallMouseoverFunc.apply(defPic)
        }, 200)
    });
    ZOL.addEvent("toppics", overEventName, function () {
        eventHd && window.clearTimeout(eventHd)
    })
};
ZOL.onReady(zoom);
var allStats = function () {
    var inPage = function (pageKeyArr) {
        var curUrl = ZOL.URL;
        var inPage = false;
        for (var i = 0, len = pageKeyArr.length; i < len; i++) {
            if (curUrl.indexOf(pageKeyArr[i]) > 0) {
                inPage = true
            }
        }
        return inPage
    };
    new ZOL.load(ZOL.config.root + "util/modstats.js", "js", function () {
        var config = {
            startTime: "09/02/2010",
            endTime: "05/30/2011"
        };
        var modStats = new ZOL.widget.modStats(config);
        modStats.init()
    })
};
ZOL.onReady(allStats);
var showOnlineMerchant = function (provinceId) {
    var ajaxObj = new ZOL.util.AJAX();
    var url = "/index.php?c=Ajax&a=OnlineMerchant&proId=" + proId + "&provinceId=" + provinceId;
    ajaxObj.get(url, function (data) {
        if (data) {
            ZOL.$("oltable").innerHTML = data
        }
    })
};
var bindAd = function (con) {
    if (!ZOL.$(con)) {
        return false
    }
    var dlArr = ZOL.find("dl", con);
    if (!dlArr) {
        return false
    }
    ZOL.each(dlArr, function (dl) {
        dl.other = ZOL.find("dd", dl)[2];
        dl.arrow = ZOL.find("em", ZOL.find("dt", dl)[0])[0];
        (!dl.other && dl.arrow) && (dl.arrow.style.display = "none");
        if (ZOL.browser.IE) {
            var overEventName = "mouseenter";
            var outEventName = "mouseleave"
        } else {
            var overEventName = "mouseover";
            var outEventName = "mouseout"
        }
        var _lastdl = null;
        ZOL.addEvent(dl, overEventName, function () {
            this.arrow && (this.arrow.style.display = "none");
            this.other && (this.other.style.display = "inline-block");
            _lastdl && ZOL.addClass(_lastdl, "back");
            var _self = this;
            ZOL.each(dlArr, function (_dl) {
                if (_dl == _self) {
                    return false
                }
                ZOL.addClass(_dl, "back")
            });
            ZOL.removeClass(this, "back");
            _lastdl = this
        });
        ZOL.addEvent(dl, outEventName, function () {
            this.other && this.arrow && (this.arrow.style.display = "block");
            this.other && (this.other.style.display = "none");
            ZOL.each(dlArr, function (_dl) {
                ZOL.removeClass(_dl, "back")
            })
        })
    })
};
bindAd("detail_top_tonglan");
bindAd("detail_index_middle_ad");
var lastCompSubId = 0;
var comp = function (callback) {
    var self = this;
    var proIdStr = ZOL.util.cookie.get("comp_pro_" + subcateId);
    var compare = null;
    var scroll = null;
    var compScroll = null;
    var loaded = false;
    var init = function (callback) {
        if (loaded) {
            return
        }
        new ZOL.load("/js/util/compare.js", "js", function () {
            var compare = ZOL.widget.compare;
            compare.buttons = [{
                value: "\u5bf9\u6bd4",
                id: "comp-param-btn",
                type: "submit",
                callback: function () {
                    compare.postUrl = "/ProductComp_param_{PARAM}.html"
                }
            }];
            if (57 != subcateId && 15 != subcateId && 16 != subcateId) {
                compare.buttons[1] = null
            }
            compare.init(subcateId);
            var curBtnObj = ZOL.$("comp-" + pageKey + "-btn");
            curBtnObj && (curBtnObj.className = "selButton");
            new ZOL.load("http://icon.zol-img.com.cn/products/js/util/effect.js", "js", function () {
                scroll = ZOL.widget.effect.scroll;
                lastCompSubId = compare.lastSubcateId;
                var proIdStr = this.cookie.get("comp_pro_" + this.subcateId);
                if (proIdStr) {
                    var proIdArr = proIdStr.split(",");
                    for (var i = 0; i < proIdArr.length; i++) {
                        $("#proId_" + proIdArr[i]).attr("choose", true);
                        $("#proId_" + proIdArr[i]).attr("class", "cansel-btn")
                    }
                }
            });
            typeof (callback) == "function" && callback()
        });
        loaded = true
    };
    comp.add = function (obj, proName, proUrl, proPic, subcateId) {
        proPic = proPic.replace("_80x60/", "_60x45/");
        proPic = proPic.replace("_120x90/", "_60x45/");
        var proId = obj.value;
        var addfunc = function () {
            var compare = ZOL.widget.compare;
            if (!compare.compBox) {
                compare.init(subcateId)
            }
            if (compare.compBox.style.display == "none") {
                compare.compBox.style.display = "block"
            }
            if (obj.checked) {
                var limitSubIdArr = ["57", "16", "15"];
                var addLimitNum = ($.inArray(subcateId, limitSubIdArr) !== -1) ? 5 : 4;
                if (compare.counter >= addLimitNum) {
                    obj.checked = false;
                    var alertStr = "\u62b1\u6b49\uff0c\u60a8\u53ea\u80fd\u9009\u62e9" + addLimitNum + "\u6b3e\u5bf9\u6bd4\u4ea7\u54c1";
                    alert(alertStr);
                    return false
                }
                var result = compare.addItem(proId, proName, proUrl, proPic, subcateId);
                if (typeof (result) != "object") {
                    obj.checked = false;
                    alert("\u6b64\u4ea7\u54c1\u5df2\u7ecf\u5728\u5bf9\u6bd4\u680f\u4e2d\u4e86~");
                    return false
                }
            } else {
                compare.remove(proId)
            }
        };
        if (!loaded) {
            init(addfunc)
        } else {
            addfunc()
        }
    };
    comp.addPro = function (obj, proId, proName, proUrl, proPic, subcateId, type) {
        proPic = proPic.replace("_80x60/", "_60x45/");
        proPic = proPic.replace("_120x90/", "_60x45/");
        var addfunc = function () {
            var compare = ZOL.widget.compare;
            var check = obj.getAttribute("choose");
            if (!compare.compBox) {
                compare.init(subcateId)
            }
            if (compare.compBox.style.display == "none") {
                compare.compBox.style.display = "block"
            }
            if (check == "false") {
                var limitSubIdArr = ["57", "16", "15"];
                var addLimitNum = ($.inArray(subcateId, limitSubIdArr) !== -1) ? 5 : 4;
                if (type && compare.counter >= addLimitNum) {
                    var alertStr = "\u62b1\u6b49\uff0c\u60a8\u53ea\u80fd\u9009\u62e9" + addLimitNum + "\u6b3e\u5bf9\u6bd4\u4ea7\u54c1";
                    alert(alertStr);
                    return false
                }
                var idstring = [1235132, 1180706, 1183648, 1212030].join("#");
                var flag = false;
                $("#comp_items > li").each(function (index, item) {
                    if (item.id.replace("comp_items-", "") == 1213148) {
                        flag = true
                    }
                });
                if (!flag && idstring.indexOf(proId) >= 0 && compare.counter < 4) {
                    var endTime = new Date(2019, 0, 1);
                    var startTime = new Date(2018, 11, 10);
                    var nowTime = new Date();
                    if (startTime <= nowTime && nowTime <= endTime) {
                        compare.addItem(1213148, "\u60e0\u666e\u661f 14-CE0027TX\uff084HL26PA\uff09", "/notebook/index1213148.shtml", "https://2c.zol-img.com.cn/product_small/13_60x45/138/cerTWUhO2jcE.jpg", subcateId, true)
                    }
                }
                var result = compare.addItem(proId, proName, proUrl, proPic, subcateId);
                obj.setAttribute("choose", "true");
                obj.value = "\u53d6\u6d88\u5bf9\u6bd4";
                obj.className = "cansel-btn";
                if (typeof (result) != "object") {
                    alert("\u6b64\u4ea7\u54c1\u5df2\u7ecf\u5728\u5bf9\u6bd4\u680f\u4e2d\u4e86~");
                    return false
                }
            } else {
                obj.setAttribute("choose", "false");
                obj.value = "\u52a0\u5165\u5bf9\u6bd4";
                obj.className = "compare-btn";
                compare.remove(proId)
            }
        };
        if (!loaded) {
            init(addfunc)
        } else {
            addfunc()
        }
    };
    var exec = function () {
        compare.exec() && compare.compForm.submit();
        return false
    };
    comp.exec = exec;
    if (proIdStr) {
        init(callback)
    }
};
if (ZOL.$("addCompButton")) {
    comp();
    var proObj = ZOL.$("addCompButton");
    proObj.onclick = function () {
        var item = document.createElement("input");
        with(item) {
            type = "checkbox";
            value = comp_proId;
            checked = "checked"
        }
        item.proId = comp_proId;
        item.proName = proName;
        item.proUrl = "/" + subcateEnName + "/index" + proId + ".shtml";
        var proPicSrc = ZOL.$("nextStepSrc").src;
        item.proPic = proPicSrc.replace("_120x90/", "_60x45/");
        comp.add(item, item.proName, item.proUrl, item.proPic, subcateId);
        var nowCompNumObj = ZOL.$("comp_num");
        var compareIngCnt = !nowCompNumObj || typeof (nowCompNumObj) == "undefined" ? 0 : parseInt(nowCompNumObj.innerHTML, 10);
        if (compareIngCnt < 4) {
            showVisitToComp()
        }
    }
}
if (ZOL.$("prolistform")) {
    ZOL.$("prolistform").onsubmit = function () {
        var doBtn = ZOL.$("comp-param-btn");
        if (!doBtn) {
            alert("\u8bf7\u9009\u62e9\u8981\u5bf9\u6bd4\u7684\u4ea7\u54c1");
            return false
        }
        doBtn.click();
        return false
    }
}
var chartFunc = function () {
    var self = this;
    var swfRoot = "http://icon.zol-img.com.cn/products/charts/";
    var pieIdArr = ["age_top"];
    this.chartSwf = {
        "pie": swfRoot + "pie.swf",
        "toppie": swfRoot + "pie.swf",
        "line": swfRoot + "line.swf",
        "map": swfRoot + "map.swf"
    };
    var pieSetting = "<settings><decimals_separator>.</decimals_separator><font>simsun</font><text_size>12</text_size><data_type>csv</data_type><pie><x>{X}</x><y>{Y}</y><radius>60</radius><height>10</height><angle>45</angle><alpha>90</alpha><colors>#EA350C,#FFD701,#4C60D7,#93D103,#C659DF</colors><gradient>radial</gradient><gradient_ratio>0,-20</gradient_ratio></pie><animation><start_time>0</start_time><start_effect>strong</start_effect><pull_out_time>0.8</pull_out_time></animation><data_labels><radius>-50</radius><text_color>#FFFFFF</text_color></data_labels><balloon><corner_radius>5</corner_radius><max_width>150</max_width><show><![CDATA[{title}: {percents}% ]]></show></balloon>{LEGEND}</settings>";
    this.pieSetting = pieSetting.replace("{LEGEND}", "<legend><x>20</x><y>160</y><width>120</width><max_columns>120</max_columns><spacing>8</spacing><border_color>#000</border_color></legend>").replace("{X}", "").replace("{Y}", 80);
    this.toppieSetting = pieSetting.replace("{LEGEND}", "<legend><x>170</x><y>25%</y><width>120</width><max_columns>120</max_columns><spacing>5</spacing></legend>").replace("{X}", 70).replace("{Y}", 100);
    this.lineSetting = "<settings><data_type>csv</data_type><legend><enabled>false</enabled></legend><graphs><graph><bullet>round_outline</bullet><color>#0D8ECF</color></graph></graphs></settings>";
    this.mapSetting = "";
    this.ageStep = {
        18: "18\u5c81\u4ee5\u4e0b",
        22: "18-22\u5c81",
        30: "22-30\u5c81",
        40: "30-40\u5c81",
        199: "40\u5c81\u4ee5\u4e0a"
    };
    this.createChart = function (config) {
        var url = this.chartSwf[config.type];
        if (config.type == "map") {
            url += "?src=" + encodeURIComponent(config.data)
        }
        var fo = new SWFObject(url, config.id, config.width, config.height, 9);
        if (config.type != "map") {
            fo.addVariable("chart_settings", encodeURIComponent(this[config.type + "Setting"]));
            fo.addVariable("chart_data", encodeURIComponent(config.data));
            fo.addParam("wmode", "transparent")
        }
        fo.write(config.con);
        return true
    };
    var url = ["/index.php?c=Ajax&a=UserStats", "proId=" + proId].join("&");
    var a = new ZOL.util.AJAX();
    a.get(url, function (data) {
        if (!data) {
            ZOL.each(pieIdArr, function (pieId) {
                ZOL.$("pie_con_" + pieId).innerHTML = ""
            });
            ZOL.$("pie_con_age_top").innerHTML = '<span class="loaded">\u6682\u65e0\u6570\u636e</span>';
            return false
        }
        data = eval("(" + data + ")");
        ZOL.each(pieIdArr, function (pieId) {
            var _pieId = pieId;
            var _width = 160;
            var _height = 320;
            var _type = "pie";
            if (pieId == "age_top") {
                pieId = "age";
                _width = 260;
                _height = 160;
                _type = "toppie"
            }
            if (!data[pieId] || data[pieId] == {}) {
                ZOL.$("pie_con_" + pieId).innerHTML = "";
                return false
            }
            if (ZOL.$("user_struct")) {
                ZOL.$("user_struct").style.display = "inline"
            }
            var _data = [];
            var num = 6;
            for (var k in data[pieId]) {
                var v = data[pieId][k];
                if (pieId == "age") {
                    k = self.ageStep[k]
                }
                if (pieId == "sex") {
                    k = (k == 1) ? "\u7537\u6027" : "\u5973\u6027"
                }
                _data.push(k + ";" + v);
                num--;
                if (num == 0) {
                    break
                }
            }
            pieId = _pieId;
            _data = _data.join("\n");
            if (!_data) {
                ZOL.$("pie_con_" + pieId).innerHTML = '<span class="loaded">\u6682\u65e0\u6570\u636e</span>';
                return false
            }
            var conf = {
                type: _type,
                id: "pie_" + pieId,
                width: _width,
                height: _height,
                data: _data,
                con: "pie_con_" + pieId
            };
            self.createChart(conf)
        })
    })
};
if (!ZOL.user.id && !ZOL.$("pie_ft_age_top")) {
    ZOL.loginUrl = "https://service.zol.com.cn/user/login.php?backUrl=" + encodeURIComponent(ZOL.URL);
    ZOL.regUrl = "https://service.zol.com.cn/user/register.php?backurl=" + encodeURIComponent(ZOL.URL);
    var html = '<span class="notlogin">\u8bf7\u5148 <a href="' + ZOL.loginUrl + '">\u767b\u5f55</a> \u6216 <a href="' + ZOL.regUrl + '">\u6ce8\u518c</a></span>';
    ZOL.$("pie_con_age_top").className += " notloginback";
    ZOL.$("pie_con_age_top").innerHTML = html;
    if (ZOL.$("pie_con_age_top_text")) {
        ZOL.$("pie_con_age_top_text").style.display = "none"
    }
} else {
    if (!ZOL.$("pie_ft_age_top")) {
        ZOL.$("pie_con_login") && (ZOL.$("pie_con_login").style.display = "none");
        if (ZOL.$("pie_con_age_top")) {
            chartFunc()
        }
    }
}
var suitFunc = function () {
    var suitObj = ZOL.$("suit");
    var moreObj = ZOL.$("suit-more");
    var priceMoreObj = ZOL.$("p-more");
    if (!moreObj) {
        return false
    }
    suitObj.onmouseover = function () {
        moreObj.style.display = "inline";
        priceMoreObj.className = "more"
    };
    suitObj.onmouseout = function () {
        moreObj.style.display = "none";
        priceMoreObj.className = "icon more"
    }
}();
var morePro = function () {
    var suitObj = ZOL.$("label");
    var topLeft = ZOL.$("relLinkA");
    var moreObj = ZOL.$("relmore");
    if (!moreObj) {
        return false
    }
    suitObj.onmouseover = function () {
        var pos = ZOL.util.getPosition(ZOL.$("relLinkA"));
        moreObj.style.top = (pos.y) + "px";
        if (ZOL.browser.IE == 6) {
            moreObj.style.left = (pos.x - 9) + "px"
        } else {
            if (ZOL.browser.IE == 7) {
                moreObj.style.left = (pos.x - 10) + "px"
            } else {
                if (ZOL.browser.IE == 8) {
                    moreObj.style.left = (pos.x - 10) + "px"
                } else {
                    moreObj.style.left = (pos.x - 10) + "px"
                }
            }
        }
        moreObj.style.display = "inline";
        topLeft.style.display = "none"
    };
    suitObj.onmouseout = function () {
        moreObj.style.display = "none";
        topLeft.style.display = ""
    }
}();
if ("undefined" != typeof (subcateId)) {
    if (ZOL.$("top-tab")) {
        var topTab = function () {
            new ZOL.widget.TabView(["top-tab"], {
                tagName: "b",
                autoPlay: 10000
            })
        }()
    }
}
var showMoreIntro = function () {
    var allIntro = ZOL.$("intro-top").parentNode;
    var moreIntro = ZOL.$("more_intro");
    moreIntro.onmouseover = function () {
        allIntro.className += " intro_top_more";
        ZOL.$("intro-foot").style.display = "inline";
        this.parentNode.style.display = "none"
    };
    var eventHd = null;
    if (ZOL.browser.IE) {
        var overEventName = "mouseenter";
        var outEventName = "mouseleave"
    } else {
        var overEventName = "mouseover";
        var outEventName = "mouseout"
    }
    ZOL.addEvent(allIntro, outEventName, function () {
        eventHd = window.setTimeout(function () {
            if (!moreIntro || !allIntro) {
                return
            }
            allIntro.className = "intro";
            ZOL.$("intro-foot").style.display = "none";
            moreIntro.parentNode.style.display = "inline"
        }, 100)
    });
    ZOL.addEvent(allIntro, overEventName, function () {
        eventHd && window.clearTimeout(eventHd)
    })
};
ZOL.onReady(showMoreIntro);
var toAnchor = function () {
    if ("undefined" == typeof (pageKey)) {
        return false
    }
    var tagnav = document.getElementById("tagnav");
    if (!tagnav || typeof (seriesId) == "undefined") {
        return false
    }
    pageName = ZOL.URL.replace(/(.*\/){0,}([^\.]+).*/ig, "$2");
    pageSer = pageKey == "picture" ? "pic" + "_" + seriesId : pageKey + "_" + seriesId;
    var _backurl = cookie.get("detail_bkUrl");
    _time = pageKey == "picDetail" ? 0 : 1000;
    if (ZOL.URL == _backurl || pageName == "pic" || pageName == "review" || pageName == pageSer) {
        return false
    }
    cookie.set("detail_bkUrl", ZOL.URL, 24 * 7);
    if ((pageKey == "review" || pageKey == "picture" || pageKey == "picDetail") && ZOL.util.getBodySize().y == 0) {
        ZOL.util.scroller("tagnav", _time)
    }
}();
var showVisitToComp = function () {
    if (typeof ZOL.$("visitedToCompare") == "undefined" || !ZOL.$("visitedToCompare")) {
        var elem = document.createElement("div");
        elem.id = "visitedToCompare";
        elem.style.zIndex = "10000";
        elem.innerHTML = '<div class="vtc_title"><span onclick="ZOL.$(\'visitedToCompare\').style.display=\'none\'"> </span>\u662f\u5426\u5c06<strong>\u6700\u8fd1\u6d4f\u89c8\u8fc7\u7684\u4ea7\u54c1</strong>\u4e5f\u52a0\u5165\u5bf9\u6bd4\uff1f</div><ul id="visitedToCompare_ul"></ul></div>';
        document.getElementsByTagName("body")[0].appendChild(elem)
    }
    var subcateProIdStr = ZOL.util.cookie.get("visited_subcateProId");
    var a = new ZOL.util.AJAX();
    var url = "/index.php?c=Ajax&a=VisitedProJson&subcateId=" + subcateId + "&subcateProIdStr=" + subcateProIdStr + "&tmp=" + (new Date()).getTime();
    a.get(url, function (data) {
        var innerHtmlStr = "";
        if (data) {
            var jsonData = eval("(" + data + ")");
            try {
                var comparedProIds = ZOL.util.cookie.get("comp_pro_" + subcateId);
                for (var j = 0; j < jsonData.Products.length; j++) {
                    var productInfos = jsonData.Products[j];
                    var proCnt = productInfos.info.length;
                    var showCnt = 1;
                    for (var i = 0; i < proCnt; i++) {
                        var tmpObj = productInfos.info[i];
                        if (proId == tmpObj.proId) {
                            continue
                        }
                        if (comparedProIds.indexOf(tmpObj.proId) >= 0) {
                            continue
                        }
                        var liClass = showCnt == 1 ? ' class="vtc_nobd" ' : "";
                        innerHtmlStr += "<li" + liClass + '><div class="vtc_pros">';
                        innerHtmlStr += '  <div class="vtc_pros_img"><a href="' + tmpObj.url + '"><img width="80" height="60" src="' + tmpObj.img + '"></a></div>';
                        innerHtmlStr += '  <div class="vtc_pros_tit"><a href="' + tmpObj.url + '">' + tmpObj.name + "</a></div>";
                        innerHtmlStr += '  <div class="vtc_pros_btn"><em class="vtc_pros_addbtn" onclick="doVisitToComp(\'' + tmpObj.proId + "','" + tmpObj.name + "','" + tmpObj.img + "')\">\u52a0\u5165&gt;&gt;</em></div>";
                        innerHtmlStr += "</div></li>";
                        if (showCnt >= 4) {
                            break
                        }
                        showCnt++
                    }
                }
                ZOL.$("visitedToCompare_ul").innerHTML = innerHtmlStr + "<br clear='all'/>"
            } catch (e) {}
        }
        ZOL.$("visitedToCompare").style.display = innerHtmlStr == "" ? "none" : "block"
    });
    resizeVisitToCompDiv()
};
var doVisitToComp = function (pid, pname, psrc) {
    var item = document.createElement("input");
    item.type = "checkbox";
    item.value = pid;
    item.checked = "checked";
    item.proId = pid;
    item.proName = pname;
    item.proUrl = "/" + subcateEnName + "/index" + pid + ".shtml";
    var proPicSrc = psrc;
    item.proPic = proPicSrc.replace("_80x60/", "_60x45/");
    comp.add(item, item.proName, item.proUrl, item.proPic, subcateId)
};
var resizeVisitToCompDiv = function () {
    var elem = ZOL.$("visitedToCompare");
    if (elem) {
        var btnPos = ZOL.util.getPosition(ZOL.$("addCompButton"));
        elem.style.top = (btnPos.y + btnPos.h) + "px";
        elem.style.left = btnPos.x + "px"
    }
};
window.onresize = resizeVisitToCompDiv;
var searchButtonHover = function () {
    if (!ZOL.$("do")) {
        return false
    }
    var search = ZOL.$("do");
    search.onmouseover = function () {
        this.className = "sel_do"
    };
    search.onmouseout = function () {
        this.className = "nav_do"
    }
}();
var hiddenNavAlert = function () {
    ZOL.$("nav_alert").style.display = "none"
};
var navCookie = function () {
    if (!ZOL.$("nav_alert")) {
        return false
    }
    if (ZOL.util.cookie.get("nav_alert")) {
        return false
    } else {
        ZOL.$("nav_alert").style.display = "block";
        ZOL.$("nav_alert").onmouseover = function () {
            this.className = "nav_alert_sel"
        };
        ZOL.$("nav_alert").onmouseout = function () {
            this.className = ""
        };
        ZOL.$("i_know").onclick = hiddenNavAlert;
        ZOL.util.cookie.set("nav_alert", 1, 24 * 365)
    }
}();
var manuProList = function () {
    if (!ZOL.$("manuProList")) {
        return false
    }
    a = new ZOL.util.AJAX();
    var url = "/index.php?c=Ajax&a=detailmanuprolist&subcateId=" + subcateId + "&manuId=" + manuId;
    a.get(url, function (data) {
        if (!data) {
            ZOL.$("divManuPro").innerHTML = "";
            return false
        }
        var tmp = data.split("|");
        if (tmp.length >= 3) {
            var i = 0;
            var preYear;
            var defaultOpt = new Option("\u8bf7\u9009\u62e9\u540c\u54c1\u724c" + subcateName, 0);
            ZOL.$("manuProList").options.add(defaultOpt);
            for (i; i < tmp.length; i = i + 3) {
                if (tmp[i + 1]) {
                    var pro = tmp[i + 1].split("###");
                    var year = tmp[i + 2];
                    var proOpt = new Option(pro[0], tmp[i]);
                    if (year != preYear) {
                        var opyear = new Option("----" + year + "\u5e74----", -1);
                        opyear.style.fontWeight = "bold";
                        ZOL.$("manuProList").options.add(opyear)
                    }
                    ZOL.$("manuProList").options.add(proOpt)
                }
                preYear = year
            }
        }
    });
    ZOL.$("manuProList").onchange = function () {
        var tmpProId = ZOL.$("manuProList").value;
        if (tmpProId <= 0) {
            return fasle
        }
        window.open("/" + subcateEnName + "/" + "index" + tmpProId + ".shtml")
    }
}();
var addCmpBtnEvent = function (list) {
    ZOL.each(list, function (o, i) {
        ZOL.addEvent(o, "mouseover", function () {
            ZOL.addClass(this, "showbtn")
        });
        ZOL.addEvent(o, "mouseout", function () {
            ZOL.removeClass(this, "showbtn")
        })
    })
};
var showCmpBtnLis = ZOL.findByClass("li-show-cmp", "rankbar", "li");
if (showCmpBtnLis) {
    addCmpBtnEvent(showCmpBtnLis)
}
var showCmpBtnLis = ZOL.findByClass("li-show-cmp", "relbar", "li");
if (showCmpBtnLis) {
    addCmpBtnEvent(showCmpBtnLis)
}
var releProHover = function () {
    var releSubList = ZOL.find("li", "rele_pro_list");
    var releSubLen = releSubList.length;
    for (var i = 0; i < releSubLen; i++) {
        releSubList[i].onmouseover = function () {
            this.className = "hover"
        };
        releSubList[i].onmouseout = function () {
            this.className = ""
        }
    }
}();
var releSubBottonHover = function () {
    var releSubList = ZOL.find("em", "rele_pro_list");
    var releSubLen = releSubList.length;
    for (var i = 0; i < releSubLen; i++) {
        if ("show_more_subs" == releSubList[i].className) {
            releSubList[i].onmouseover = function () {
                this.className = "show_more_subs more_subs_hover"
            };
            releSubList[i].onmouseout = function () {
                this.className = "show_more_subs"
            }
        }
    }
}();
if (ZOL.$("rele_pro_content")) {
    new ZOL.load(ZOL.config.root + "jq/jquery.js", "js", function () {
        var scrollDiv = $("#rele_pro_content");
        var scrollList = $("#rele_pro_list");
        var leftButton = $("#scroll_left");
        var rightButton = $("#scroll_right");
        var offsetvar = 0;
        var scrollDivWidth = scrollDiv.width();
        var liArr = ZOL.find("li", "rele_pro_list");
        var scrollLeft = liArr[0].offsetWidth + 4;
        var scrollListWidth = scrollList.width();
        var scrolllock = false;
        leftButton.click(function () {
            if (offsetvar >= 0) {
                return false
            }
            offsetvar += scrollLeft;
            scrollList.animate({
                marginLeft: offsetvar
            }, 200, function () {
                rightButton[0].className = "next-btn";
                scrolllock = false;
                if (offsetvar >= 0) {
                    leftButton[0].className = "prev-btn-start";
                    scrolllock = true;
                    return false
                }
            })
        });
        rightButton.click(function () {
            if ((offsetvar + scrollListWidth) <= scrollDivWidth) {
                return false
            }
            offsetvar -= scrollLeft;
            scrollList.animate({
                marginLeft: offsetvar
            }, 200, function () {
                leftButton[0].className = "prev-btn";
                scrolllock = false;
                if ((offsetvar + scrollListWidth) <= scrollDivWidth) {
                    rightButton[0].className = "prev-btn-end";
                    scrolllock = true;
                    return false
                }
            })
        })
    })
}
var showMoreSubs = function () {
    var subButtonArr = ZOL.find("em", "rele_pro_list");
    var subButtonLen = subButtonArr.length;
    for (var i = 0; i < subButtonLen; i++) {
        if ("show_more_subs" != subButtonArr[i].className) {
            continue
        }
        subButtonArr[i].onclick = function () {
            var releSubId = this.getAttribute("rel");
            var A = new ZOL.util.AJAX();
            var url = "/index.php?c=Ajax&a=showMoreSubPros&proId=" + proId + "&subcateId=" + subcateId + "&releSubId=" + releSubId + "&manuId=" + manuId + "&page=1" + "&tmp=" + (new Date()).getTime();
            A.get(url, function (data) {
                if (data) {
                    var moreSubCon = ZOL.$("more_subcates_con");
                    var moreSub = ZOL.$("more_subcates");
                    moreSubCon.style.display = "block";
                    moreSub.style.display = "block";
                    moreSub.innerHTML = data;
                    if (ZOL.browser.IE == 6) {
                        var bodySize = ZOL.util.getBodySize();
                        moreSubCon.style.width = document.documentElement.clientWidth + "px";
                        moreSubCon.style.height = document.body.clientHeight + "px";
                        var rePosSubCon = function () {
                            moreSubCon.style.top = 0;
                            moreSub.style.top = document.documentElement.scrollTop + (document.documentElement.clientHeight - moreSub.offsetHeight) / 2 + "px";
                            moreSub.style.left = document.documentElement.scrollLeft + (document.documentElement.clientWidth - moreSub.offsetWidth) / 2 + "px"
                        }();
                        window.onresize = function () {
                            moreSubCon.style.top = 0;
                            moreSub.style.top = document.documentElement.scrollTop + (document.documentElement.clientHeight - moreSub.offsetHeight) / 2 + "px";
                            moreSub.style.left = document.documentElement.scrollLeft + (document.documentElement.clientWidth - moreSub.offsetWidth) / 2 + "px"
                        };
                        window.onscroll = function () {
                            moreSubCon.style.top = 0;
                            moreSub.style.top = document.documentElement.scrollTop + (document.documentElement.clientHeight - moreSub.offsetHeight) / 2 + "px";
                            moreSub.style.left = document.documentElement.scrollLeft + (document.documentElement.clientWidth - moreSub.offsetWidth) / 2 + "px"
                        }
                    }
                    closeMoreSubs()
                }
            })
        }
    }
}();
var showMoreSubPages = function (page, releSubId) {
    var A = new ZOL.util.AJAX();
    var url = "/index.php?c=Ajax&a=showMoreSubPros&proId=" + proId + "&subcateId=" + subcateId + "&releSubId=" + releSubId + "&manuId=" + manuId + "&page=" + page + "&tmp=" + (new Date()).getTime();
    A.get(url, function (data) {
        if (data) {
            var moreSubCon = ZOL.$("more_subcates");
            moreSubCon.style.display = "block";
            moreSubCon.innerHTML = data;
            closeMoreSubs();
            return false
        }
    })
};
var closeMoreSubs = function () {
    var nowCloseBot = ZOL.$("close_more_subs");
    nowCloseBot.onclick = function () {
        ZOL.$("more_subcates").style.display = "none";
        ZOL.$("more_subcates_con").style.display = "none"
    };
    nowCloseBot.onmouseover = function () {
        nowCloseBot.className = "close close_sub_hover"
    };
    nowCloseBot.onmouseout = function () {
        nowCloseBot.className = "close"
    }
};
var pkBottonHover = function () {
    var pkBotton = ZOL.$("detail_pk");
    pkBotton.onmouseover = function () {
        ZOL.$("pk_em").className = "act"
    };
    pkBotton.onmouseout = function () {
        ZOL.$("pk_em").className = ""
    }
}();
if (ZOL.$("hotRecMal")) {
    var topTab = function () {
        new ZOL.widget.TabView(["otherRD"], {
            tagName: "li",
            autoPlay: 7000,
            activeCss: "ordSelect"
        })
    }()
}
var loadTopNav = function () {
    var url = "/js_type%5B0%5D=topNav^subcateId=" + subcateId + "^pageType=new2012Detail^navTextHidden=1^hiddenCateText=1^curPageKey=default.html";
    var A = new ZOL.util.AJAX();
    A._rewrite = false;
    A.get(url, function (data) {
        if (data) {
            var navArr = new Array();
            navArr = data.split("|||###|||");
            ZOL.$("top_nav_2012").innerHTML = navArr[0];
            ZOL.$("nav_manu_2012").innerHTML = navArr[1];
            userLogin();
            ZOL.$("top_more_nav").onmouseover = function () {
                this.className = "topnav topnav_open"
            };
            ZOL.$("top_more_nav").onmouseout = function () {
                this.className = "topnav"
            };
            if (ZOL.$("head_pub_nav")) {
                var actHeadNav = function () {
                    var headPubNavArr = ZOL.find("li", "head_pub_nav");
                    var hiddenSN = null;
                    var subListHidden = function (nowObj) {
                        ZOL.$(nowObj.getAttribute("rel")).style.display = "none";
                        if (ZOL.$("manuProList")) {
                            ZOL.$("manuProList").style.display = "block"
                        }
                        ZOL.each(headPubNavArr, function (nowNav) {
                            if (nowNav.getAttribute("rel") != "noMore") {
                                var curClassName = nowNav.className;
                                if (curClassName.indexOf("vis") != -1) {
                                    nowNav.className = "onav vis cur hov"
                                } else {
                                    nowNav.className = "onav"
                                }
                            }
                        })
                    };
                    for (var i = 0; i < headPubNavArr.length; i++) {
                        if ("noMore" == headPubNavArr[i].getAttribute("rel")) {
                            continue
                        }
                        headPubNavArr[i].onmouseover = function () {
                            ZOL.each(headPubNavArr, function (nowNav) {
                                if (nowNav.getAttribute("rel") != "noMore") {
                                    var curClassName = nowNav.className;
                                    if (curClassName.indexOf("vis") != -1) {
                                        nowNav.className = "onav vis"
                                    } else {
                                        nowNav.className = "onav"
                                    }
                                    ZOL.$(nowNav.getAttribute("rel")).style.display = "none"
                                }
                            });
                            hiddenSN && clearTimeout(hiddenSN);
                            var nowObj = this;
                            if (nowObj.className.indexOf("vis") != -1) {
                                nowObj.className = "onav vis hov"
                            } else {
                                nowObj.className = "onav hov"
                            }
                            if (ZOL.$("manuProList")) {
                                ZOL.$("manuProList").style.display = "none"
                            }
                            ZOL.$(nowObj.getAttribute("rel")).style.display = "block"
                        };
                        headPubNavArr[i].onmouseout = function () {
                            var nowObj = this;
                            hiddenSN = setTimeout(function () {
                                subListHidden(nowObj)
                            }, 1)
                        }
                    }
                    var closeBotArr = ZOL.find("span", "head_pub_nav");
                    for (var i = 0; i < closeBotArr.length; i++) {
                        if ("nav_closed" == closeBotArr[i].className) {
                            closeBotArr[i].onclick = function () {
                                var liId = this.getAttribute("rel");
                                ZOL.$("list" + liId).style.display = "";
                                ZOL.$("bot_" + liId).className = ""
                            }
                        }
                    }
                }()
            }
        }
    })
};
if (ZOL.$("top_nav_2012")) {
    loadTopNav()
}
var in_array = function (v, a) {
    for (key in a) {
        if (a[key] == v) {
            return true
        }
    }
    return false
};
var useNewListAdStyle = function (subid) {
    return true;
    var allNewSub = [14, 57, 16, 15, 702, 5, 6, 2, 626, 274, 28, 84, 3, 10, 641, 44, 227, 35, 224, 226, 34, 67, 223, 100, 54, 637, 593, 11, 658, 661, 659, 660, 213, 662, 27, 12, 211, 212, 314, 399, 650, 101, 31, 382, 385, 383, 389, 51, 358, , 510, 370, 15, 268, 294, 46, 121, 590, 37, 548, 551, 7, 665, 636, 363, 618, 18, 49, 22, 322, 320, 61, 439, 307, 467, 555, 374, 529, 375, 68];
    return in_array(subid, allNewSub)
};
var listComp = function () {
    comp();
    var proObjArr = document.getElementsByName("proId[]");
    ZOL.each(proObjArr, function (proObj) {
        var proId = proObj.id.split("_")[1];
        proObj.proId = proId;
        proObj.proName = ZOL.$("proName_" + proId).innerHTML;
        proObj.proUrl = ZOL.$("proUrl_" + proId).href;
        proObj.proPic = ZOL.$("proPic_" + proId).src;
        var label = proObj.parentNode;
        proObj.label = label;
        proObj.parentNode.checkbox = proObj;
        ZOL.addEvent(proObj, "click", function () {
            comp.add(this, this.proName, this.proUrl, this.proPic, subcateId)
        });
        if (label.tagName != "LABEL") {
            return false
        }
        var item = label.parentNode;
        pageType == "HighSearch" && (item = item.parentNode);
        item.label = label;
        ZOL.addEvent(item, "mouseover", function () {
            var txt = document.createTextNode("\u5bf9\u6bd4");
            this.label.appendChild(txt)
        });
        ZOL.addEvent(item, "mouseout", function () {
            this.label.removeChild(this.label.checkbox.nextSibling)
        })
    });
    ZOL.$("prolistform").onsubmit = function () {
        if (paramStr.indexOf("k") == -1) {
            ZOL.$("comp-param-btn").click()
        }
        return false
    }
};
ZOL.onReady(listComp);
var formDefault = function (obj, defStr) {
    var obj = ZOL.$(obj);
    var defStr = defStr ? defStr : obj.getAttribute("title");
    ZOL.addEvent(obj, "focus", function () {
        if (obj.value == defStr) {
            obj.value = ""
        }
    });
    ZOL.addEvent(obj, "blur", function () {
        if (this.value == "") {
            this.value = defStr
        }
    })
};
var hotTop = function () {
    new ZOL.load("//icon.zol-img.com.cn/products/js/util/tabview.js", "js", function () {
        new ZOL.widget.TabView(["hottop-tab"], {
            tagName: "li"
        })
    })
}();
ZOL.$("swith_city").onclick = function () {
    a = new ZOL.util.AJAX();
    var url = "/index.php?c=Ajax&a=SwithCity&subcateId=" + subcateId + "&manuId=" + manuId + "&subcateEnName=" + subcateEnName + "&locationId=" + locationId + "&priceId=" + priceId + "&queryType=" + queryType + "&style=" + style + "&paramStr=" + paramStr;
    a.get(url, function (data) {
        if (data) {
            ZOL.$("city_list").innerHTML = data;
            if (ZOL.$("cityClose")) {
                ZOL.addEvent(ZOL.$("cityClose"), "click", function () {
                    ZOL.$("city_list").style.display = "none"
                })
            }
            ZOL.addEvent(ZOL.$("enCity"), "focus", function () {
                if (ZOL.$("enCity").value == "\u8bf7\u8f93\u5165\u57ce\u5e02\u540d") {
                    ZOL.$("enCity").value = ""
                }
            });
            if (ZOL.$("city_list")) {
                new ZOL.widget.TabView(["regionRot"], {
                    tagName: "li",
                    activeCss: "sel",
                    eventName: "onclick"
                })
            }
            ZOL.load("/js/serLocation.js", "js")
        }
    });
    ZOL.$("city_list").style.display = "block"
};
var leftNav = function () {
    var items = ZOL.find("b", "leftSublist");
    var lastitem, lastcon;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item.onclick = function () {
            if (lastitem && lastitem != this) {
                lastitem.className = "";
                lastcon.style.display = "none"
            }
            var rel = this.getAttribute("rel");
            var con = ZOL.$(rel);
            if (this.className == "sel") {
                this.className = "";
                con.style.display = "none"
            } else {
                this.className = "sel";
                con.style.display = "inline"
            }
            lastitem = this;
            lastcon = con;
            var link = ZOL.find("a", this)[0].href;
            if (link == ZOL.URL) {
                return false
            }
        }
    }
    var subcon = "scon-" + subcateId;
    var moreHD = ZOL.find("i", subcon);
    if (moreHD) {
        var hdStyle = {
            show: "block",
            hidden: "none"
        };
        for (var i = 0, len = moreHD.length; i < len; i++) {
            moreHD[i].onclick = function () {
                var selfHD = this;
                moreObj = ZOL.$("m" + this.id);
                if (moreObj) {
                    ZOL.util.toggle("m" + this.id, hdStyle, function (status) {
                        if (status == hdStyle.show) {
                            selfHD.innerHTML = "\u2191\u6536\u8d77\u663e\u793a"
                        } else {
                            selfHD.innerHTML = "\u2193\u5c55\u5f00\u663e\u793a\u66f4\u591a"
                        }
                    })
                }
            }
        }
    }
    var selObj = ZOL.find("a", subcon);
    for (var i = 0, len = selObj.length; i < len; i++) {
        var oneA = selObj[i];
        if (oneA.className == "sel") {
            var pCon = oneA.parentNode;
            var pId = pCon.id;
            if (pId.indexOf("m") == 0) {
                var mBtn = ZOL.$(pId.substr(1));
                mBtn && mBtn.onclick()
            }
        }
    }
}();
var leftSuggest = null;
ZOL.$("leftKeywords").onclick = function () {
    ZOL.$("leftKeywords").value = "";
    if (suggest) {
        return
    }
    var leftSuggest = new ZOL.load("//icon.zol-img.com.cn/products/js/util/suggest.js", "js", function () {
        ZOL.widget.suggest("leftKeywords", {
            source: "/index.php?c=Ajax&a=LeftSearchSuggest",
            cssFile: "//icon.zol-img.com.cn/products/css/suggest.css",
            isGroup: false,
            onSelect: function (item) {
                var go = item.getElementsByTagName("font")[0].getAttribute("rel");
                if (go) {
                    window.location.href = go;
                    return false
                }
                return true
            }
        })
    });
    this.onclick = null
};
var recMerchant = function () {
    if (locationId != 1 || typeof (userLocationId) == "undefined" || userLocationId == 1) {
        return false
    }
    var conObj = ZOL.$("recMerchant");
    var tabIdPre = "recmer-tab-";
    var regObj = ZOL.$("recmer-reg");
    var titleObj = ZOL.$("recmer-tit");
    var bigTitObj = ZOL.$("big-tit");
    var cityTitObj = ZOL.$("city_tit");
    if (!conObj) {
        return false
    }
    var relLocationId = locationId;
    locId = (locationId == 1 && isDefault) ? userLocationId : locationId;
    var url = "/index.php?c=Ajax&a=ListRecMerchant&";
    url += ["subcateId=" + subcateId, "manuId=" + manuId, "locationId=" + locId, "priceId=" + priceId, "queryType=" + queryType, "style=" + style, "paramStr=" + paramStr].join("&");
    var A = new ZOL.util.AJAX();
    A.get(url, function (data) {
        if (!data) {
            return false
        }
        data = data.split("@@@");
        if (useNewListAdStyle(subcateId)) {
            var html = data[0];
            var title = typeof (data[1]) != "undefined" ? data[1] : "";
            conObj.innerHTML = html;
            if (title) {
                regObj && (regObj.innerHTML = title + "\u5546\u5bb6\u6ce8\u518c");
                bigTitObj && (bigTitObj.innerHTML = title + "\u62a5\u4ef7");
                cityTitObj && (cityTitObj.innerHTML = data[2])
            }
        } else {
            var html = data[0];
            var title = typeof (data[1]) != "undefined" ? data[1] : "";
            conObj.innerHTML = html;
            if (title) {
                titleObj && (titleObj.innerHTML = title + "\u63a8\u8350\u7ecf\u9500\u5546");
                regObj && (regObj.innerHTML = title + "\u5546\u5bb6\u6ce8\u518c");
                bigTitObj && (bigTitObj.innerHTML = title + "\u62a5\u4ef7");
                cityTitObj && (cityTitObj.innerHTML = data[2])
            }
        }
    })
};
var locationAd = function () {
    var self = this;
    if (locationId != 1 || typeof (userLocationId) == "undefined" || userLocationId == 1) {
        return false
    }
    var doShow = function (codeArr) {
        for (var i = 0, len = codeArr.length; i < len; i++) {
            var code = codeArr[i].CODE;
            var type = codeArr[i].TYPE;
            var adId = codeArr[i].ID;
            if (type !== "HTML") {}
            if (ZOL.$(adId)) {
                ZOL.$(adId).innerHTML = code;
                ZOL.$(adId).style.display = "inline"
            }
        }
        var fontAd = ZOL.$("list_list_merchant_recommend_left_font");
        if (fontAd && fontAd.innerHTML == "") {
            fontAd.style.display = "none"
        }
    };
    var A = new ZOL.util.AJAX();
    var url = "/index.php?c=Ajax&a=locationAd&pageType=list&subcateId=" + subcateId + "&manuId=" + manuId + "&locationId=" + userLocationId;
    A.get(url, function (data) {
        if (!data) {
            return false
        }
        data = eval("(" + data + ")");
        doShow(data)
    })
};
if (typeof (pageType) !== "undefined" && pageType == "list") {
    getUserAreaInfo(function () {
        recMerchant();
        locationAd()
    })
}
var nvAd = function () {
    if (subcateId != 6 && subcateId != 16 && subcateId != 5) {
        return
    }
    if (!ZOL.$("list") && !ZOL.$("manulist")) {
        return
    }
    new ZOL.load("/js/nvad.js?20120229", "js", function () {
        if (ZOL.$("list")) {
            showAdLayer.conId = "list";
            showAdLayer.tagName = "em";
            if (manuId == 223) {
                showAdLayer.relName = "hp";
                showAdLayer.adImg = "//icon.zol-img.com.cn/detail0802/hp_icon_cu_big.jpg"
            }
            showAdLayer.exec()
        } else {
            if (ZOL.$("manulist")) {
                showAdLayer.exec()
            }
        }
    })
}();
var switchSeriesParamPro = function () {
    var list = ZOL.$("list");
    if (!list) {
        return false
    }
    var moreArr = ZOL.find("i", list);
    if (!moreArr) {
        return false
    }
    var hiddenHd = null;
    for (var i = 0, len = moreArr.length; i < len; i++) {
        var rel = moreArr[i].getAttribute("rel");
        if (!rel) {
            continue
        }
        moreArr[i].hiddenObj = ZOL.$(rel);
        moreArr[i].onmouseover = function () {
            this.hiddenObj.onmouseover = function () {
                hiddenHd && clearTimeout(hiddenHd);
                this.style.display = "inline"
            };
            if (this.hiddenObj) {
                this.hiddenObj.style.display = "inline";
                this.className = "icon more close"
            }
        };
        moreArr[i].onmouseout = function () {
            var self = this;
            if (self.hiddenObj) {
                hiddenHd = setTimeout(function () {
                    self.hiddenObj.style.display = "none";
                    self.className = "icon more"
                }, 200)
            }
        }
    }
}();
ZOL.util.showDirName = function (s_display) {
    var showDivId = ZOL.$("more_s");
    if (s_display == "none") {
        showDivId.innerHTML = "\u66f4\u591a&gt;&gt;"
    } else {
        showDivId.innerHTML = "\u6536\u8d77&gt;&gt;"
    }
    return true
};
var showPriceTime = function () {
    var list = ZOL.$("proList");
    if (!list) {
        return false
    }
    var moreArr = ZOL.find("a", list);
    if (!moreArr) {
        return false
    }
    var hiddenHd = null;
    for (var i = 0, len = moreArr.length; i < len; i++) {
        var url = moreArr[i].getAttribute("url");
        if (!url) {
            continue
        }
        moreArr[i].urlValue = url;
        moreArr[i].onmouseover = function () {
            var spanId = this.urlValue;
            ZOL.$(spanId).style.display = "block"
        };
        moreArr[i].onmouseout = function () {
            var spanId = this.urlValue;
            ZOL.$(spanId).style.display = "none"
        }
    }
}();
var checkPrice = function () {
    var minPrice = ZOL.$("minPrice").value;
    var maxPrice = ZOL.$("maxPrice").value;
    var isHave = 0;
    var isNum = function (num) {
        return /^\d+$/.test(num)
    };
    if (!isNum(minPrice) || !isNum(maxPrice)) {
        alert("\u8bf7\u8f93\u5165\u6570\u5b57\uff01");
        ZOL.$("minPrice").focus();
        return false
    }
    if (!minPrice && !maxPrice) {
        alert("\u8bf7\u81f3\u5c11\u8f93\u5165\u4e00\u4e2a\u4ef7\u683c\uff01");
        ZOL.$("minPrice").focus();
        return false
    }
    if (minPrice - maxPrice > 0) {
        var _tmp = "";
        _tmp = maxPrice;
        maxPrice = minPrice;
        minPrice = _tmp
    }
    var urlTpl = ZOL.$("selfPriUrl").value;
    var jumpURL;
    var parmPri = ZOL.find("a", "parmPrice");
    ZOL.each(parmPri, function (tagA) {
        var val = tagA.innerHTML;
        var tmpStr;
        var uPrice = minPrice + " - " + maxPrice;
        if (val.indexOf("\u4ee5\u4e0b") != -1) {
            tmpStr = "0 - " + val.substring(0, val.indexOf("\u5143"))
        } else {
            tmpStr = val.substring(0, val.indexOf("\u5143"))
        }
        if (uPrice == tmpStr) {
            isHave = 1;
            jumpURL = tagA.href;
            return true
        }
    });
    if (isHave) {
        document.location.href = jumpURL;
        return true
    } else {
        urlTpl = urlTpl.replace("{PRICEID}", minPrice + "-" + maxPrice);
        document.location.href = urlTpl;
        return true
    }
};
var countAd = function () {
    var listParam = ZOL.$("proParamFilter");
    if (!listParam) {
        return false
    }
    var paramArr = ZOL.find("a", listParam);
    if (!paramArr) {
        return false
    }
    for (var i = 0, len = paramArr.length; i < len; i++) {
        var rel = paramArr[i].getAttribute("url");
        var href = paramArr[i].getAttribute("href");
        if (!rel) {
            continue
        }
        paramArr[i].url = rel;
        paramArr[i].href = href;
        paramArr[i].onclick = function () {
            window.open("http://ad-apac.doubleclick.net/click;h=v2|3D28|0|0|%2a|g;232574700;0-0;0;56449328;31-1|1;37990730|38008487|1;;%3f" + this.href + "?utm_source=q4_Clientend&utm_medium=zol_productlibrary_notebookfeatures_3\u6b3e_38&utm_campaign=q4_Clientend")
        }
    }
}();
ZOL.$("Searchbutton").onclick = function () {
    checkPrice()
};
ZOL.$("minPrice").onkeyup = ZOL.$("maxPrice").onkeyup = function (event) {
    event = event || window.event;
    var keyCode = event.keyCode || event.which || event.charCode;
    if (keyCode == 13) {
        checkPrice()
    }
};
var highSearchFilter = function () {
    if (typeof (pageType) == "undefined") {
        return false
    }
    if (pageType != "HighSearch") {
        return false
    }
    if (!ZOL.$("s_filter")) {
        return false
    }
    var checkArr = ZOL.find("label", "s_filter");
    var checkPool = ZOL.find("a", "showc");
    var ajax, ajaxHd;
    var resNumTop = ZOL.$("Anchor_top");
    var resNumBot = ZOL.$("Anchor_bot");
    var tipsTop = ZOL.$("tips_top");
    var tipsBot = ZOL.$("tips_bot");
    var showCond = ZOL.$("showc");
    var searchSub = ZOL.$("svsub");
    var selWhere = ZOL.$("selwhere");
    if (!checkArr) {
        return false
    }
    var setSubDisplay = function () {
        if (!paramStr) {
            searchSub.style.display = "none";
            tipsTop.innerHTML = tipsBot.innerHTML = subcateName + "\u4ea7\u54c1\u5171\u6709\uff1a"
        } else {
            searchSub.style.display = "block";
            tipsTop.innerHTML = tipsBot.innerHTML = "\u7b26\u5408\u60a8\u9009\u62e9\u6761\u4ef6\u7684" + subcateName + "\u6709\uff1a"
        }
    };
    setSubDisplay.apply(paramStr);
    (checkPool.length != 1 && checkPool.length != 0) ? selWhere.style.display = "block": selWhere.style.display = "none";
    var findParam = function () {
        var paramArr = [];
        ZOL.each(checkArr, function (check) {
            var _input = ZOL.find("input", check)[0];
            if (!_input) {
                return false
            }
            if (_input.checked == true) {
                paramArr.push(_input.value)
            }
        });
        return paramArr
    };
    var createRest = function () {
        var resetBtn = ZOL.$("resetbtn");
        if (!resetBtn) {
            var resetBtn = document.createElement("a");
            resetBtn.id = "resetbtn";
            resetBtn.href = advUrl;
            resetBtn.target = "_self";
            resetBtn.className = "reset";
            resetBtn.innerHTML = "\u91cd\u65b0\u9009\u62e9"
        }
        return resetBtn
    };
    var createPoolItem = function (id, fobj) {
        var item = ZOL.$(id);
        if (!item) {
            item = document.createElement("a");
            item.id = id;
            item.className = "sel";
            item.fobj = fobj;
            item.innerHTML = fobj.parentNode.title;
            ZOL.addEvent(item, "click", cClickFunc)
        }
        return item
    };
    var ajaxFunc = function () {
        ajax = new ZOL.util.AJAX();
        paramStr = findParam().join("-");
        var url = "/index.php?c=Ajax&a=getsertotal&subcateId=" + subcateId + "&paramStr=" + paramStr + "&locationId=" + locationId;
        ajax._rewrite = false;
        ajax.get(url, function (data) {
            if (data) {
                setSubDisplay.apply(paramStr);
                resNumTop.innerHTML = resNumBot.innerHTML = data
            } else {
                resNumTop.innerHTML = resNumBot.innerHTML = "\u65e0\u5339\u914d\u7ed3\u679c!"
            }
        })
    };
    var doAjax = function () {
        resNumTop.innerHTML = resNumBot.innerHTML = "\u67e5\u627e\u4e2d...";
        ajaxHd && window.clearTimeout(ajaxHd);
        ajaxHd = window.setTimeout(ajaxFunc, 1000)
    };
    var cClickFunc = function (b) {
        if (!this.parentNode) {
            return false
        }
        with(this.fobj) {
            parentNode.className = "";
            checked = false
        }
        this.parentNode.removeChild(this);
        if (b != "val") {
            allCheck.apply(this.fobj)
        }
        checkPool.length != 1 ? selWhere.style.display = "block" : selWhere.style.display = "none";
        doAjax()
    };
    var choose = function () {
        var i = 0;
        var a = createPoolItem("pool_" + this.id, this);
        this.cobj = a;
        if (this.checked) {
            ZOL.addClass(this.parentNode, "checked");
            showCond.appendChild(a);
            showCond.appendChild(createRest());
            checkPool.length != 1 ? selWhere.style.display = "block" : selWhere.style.display = "none"
        } else {
            ZOL.removeClass(this.parentNode, "");
            cClickFunc.call(this.cobj, "val")
        }
        doAjax()
    };
    ZOL.each(checkArr, function (check, i) {
        var _input = ZOL.find("input", check)[0];
        if (!_input) {
            return false
        }
        _input.i = i;
        ZOL.addEvent(ZOL.find("input", check)[0], "click", choose)
    });
    ZOL.each(checkPool, function (a) {
        a.fobj = ZOL.$(a.getAttribute("rel"));
        ZOL.addEvent(a, "click", cClickFunc)
    });
    var moreArr = ZOL.find("em", "s_filter");
    ZOL.each(moreArr, function (more) {
        ZOL.addEvent(more, "click", function () {
            var moreConId = this.getAttribute("rel");
            ZOL.util.toggle(moreConId, {
                show: "block",
                hidden: "none"
            });
            ZOL.$(moreConId).style.display == "block" ? more.innerHTML = "\u6536\u8d77\u25b2" : more.innerHTML = "\u66f4\u591a\u25bc"
        })
    });
    var group = ZOL.find("div", "s_filter");
    var allCheck = function () {
        var divCheck = this.divCheck;
        var groupCon = this.parentNode.parentNode;
        var _self = this;
        if (this.offset == 0) {
            if (this.checked == true) {
                ZOL.each(divCheck, function (_check) {
                    if (_self == _check) {
                        return false
                    }
                    if (_check.checked) {
                        _check.checked = false;
                        choose.apply(_check)
                    }
                    _check.checked = true;
                    choose.apply(_check)
                });
                groupCon.conter = divCheck.length - 1
            } else {
                ZOL.each(divCheck, function (_check) {
                    if (_self == _check) {
                        return false
                    }
                    _check.checked = false;
                    choose.apply(_check)
                });
                groupCon.conter = 0
            }
        }
        if (this.offset > 0) {
            if (this.checked == true) {
                groupCon.conter++
            } else {
                groupCon.conter--
            }
            if (groupCon.conter < divCheck.length - 1) {
                divCheck[0].checked = false
            } else {}
            choose.apply(divCheck[0])
        }
    };
    ZOL.each(group, function (div) {
        if (div.className != "group") {
            return false
        }
        div.conter = 0;
        var divCheck = ZOL.find("input", div);
        ZOL.each(divCheck, function (check, offset) {
            check.divCheck = divCheck;
            check.offset = offset;
            ZOL.addEvent(check, "click", allCheck)
        })
    });
    ZOL.$("search_form").onsubmit = function () {
        if (pageType != "HighSearch") {
            return false
        }
        if (ZOL.$("keywords").value == "\u4ea7\u54c1\u641c\u7d22") {
            alert("\u8bf7\u8f93\u5165\u5173\u952e\u5b57!");
            return false
        }
        return true
    };
    ZOL.$("show_form").onsubmit = function () {
        page = 1;
        var paramStr = findParam().join("-");
        paramStr = paramStr ? paramStr : "";
        var actionUrl = "/" + subcateEnName + "_advSearch/" + "subcate" + subcateId + "_" + locationId + "_" + paramStr + "_" + queryType + "_" + style + "_0_" + page + ".html";
        this.action = actionUrl;
        return true
    }
}();
var huntsurvey = function () {
    if (typeof (pageType) == "undefined") {
        return false
    }
    if (pageType != "HighSearch") {
        return false
    }
    if (paramStr) {
        window.location.hash = "#showc"
    }
    var userid = ZOL.util.cookie.get("zol_userid");
    if (userid && paramStr) {
        ZOL.$("userHunt").style.display = "block"
    } else {
        ZOL.$("userHunt").style.display = "none";
        return false
    }
    ZOL.addEvent(ZOL.$("plea"), "click", function () {
        var ajax = ajax ? ajax : new ZOL.util.AJAX();
        ajax._rewrite = false;
        var url = "/index.php?c=Ajax&a=huntsurvey";
        var sendData = ["ispleased=1", "pgType=AdvSearch"].join("&");
        ajax.post(url, sendData, function (data) {
            if ("SUCCESS" == data) {
                ZOL.$("hunt").style.display = "none";
                ZOL.$("survey").style.display = "none";
                ZOL.$("result").style.display = "block"
            } else {
                ZOL.$("Anchor").innerHTML = "\u5b58\u50a8\u5931\u8d25\uff01"
            }
        })
    });
    ZOL.addEvent(ZOL.$("displea"), "click", function () {
        ZOL.$("hunt").style.display = "none";
        ZOL.$("survey").style.display = "block";
        ZOL.$("result").style.display = "none";
        ZOL.addEvent(ZOL.$("resSubmit"), "click", function () {
            if (ZOL.$("comments").value == "") {
                ZOL.$("u_sug").className = "fc3 show";
                ZOL.$("comments").focus();
                return
            }
            var ajax = ajax ? ajax : new ZOL.util.AJAX();
            ajax._rewrite = false;
            var url = "/index.php?c=Ajax&a=huntsurvey";
            var sendData = ["ispleased=2", "comments=" + ZOL.$("comments").value, "pgType=AdvSearch"].join("&");
            ajax.post(url, sendData, function (data) {
                if ("SUCCESS" == data) {
                    ZOL.$("hunt").style.display = "none";
                    ZOL.$("survey").style.display = "none";
                    ZOL.$("result").style.display = "block"
                } else {
                    ZOL.$("Anchor").innerHTML = "\u5b58\u50a8\u5931\u8d25\uff01"
                }
            })
        })
    });
    ZOL.addEvent(ZOL.$("resCenter"), "click", function () {
        ZOL.$("hunt").style.display = "block";
        ZOL.$("survey").style.display = "none";
        ZOL.$("result").style.display = "none"
    })
}();
var showTuanGou = function () {
    var proListArr = ZOL.find("dl", "proList");
    ZOL.each(proListArr, function (tuangou) {
        if ("tuangou" == tuangou.className || "rushBuy" == tuangou.id) {
            tuangou.proId = tuangou.getAttribute("rel");
            tuangou.tuanList = ZOL.$("tuanList_" + tuangou.proId);
            tuangou.onmouseover = function () {
                ZOL.$("tuanList_" + this.proId).style.display = "block";
                ZOL.$("tuanList_" + this.proId).parentNode.parentNode.className = "pic moreIndex"
            };
            tuangou.onmouseout = function () {
                ZOL.$("tuanList_" + this.proId).style.display = "none";
                ZOL.$("tuanList_" + this.proId).parentNode.parentNode.className = "pic"
            }
        }
    })
}();
var FilterSearch = function () {
    var list = ZOL.find("input", "pro_se");
    if (!list) {
        return false
    }
    ZOL.each(list, function (input) {
        ZOL.addEvent(input, "keyup", function () {
            if (ZOL.$("minPrice").value == "" && ZOL.$("maxPrice").value == "") {
                ZOL.$("Searchbutton").disabled = "disabled"
            } else {
                ZOL.$("Searchbutton").disabled = ""
            }
        })
    })
}();
var listFilter = function () {
    if (typeof (pageType) == "undefined") {
        return false
    }
    if (pageType == "HighSearch") {
        return false
    }
    var priSelf = ZOL.$("priSelf");
    var minPrice = ZOL.$("minPrice");
    var maxPrice = ZOL.$("maxPrice");
    ZOL.addEvent(ZOL.$("mau_more"), "click", function () {
        var moreConId = this.getAttribute("rel");
        ZOL.util.toggle(moreConId, {
            show: "inline",
            hidden: "none"
        });
        if (ZOL.$(moreConId).style.display == "inline" && moreConId == "more_menu") {
            ZOL.$("all_menu").style.display = "inline-block";
            ZOL.$("mau_more").innerHTML = "\u6536\u7f29\u2191"
        }
        if (ZOL.$(moreConId).style.display == "none" && moreConId == "more_menu") {
            ZOL.$("all_menu").style.display = "none";
            ZOL.$("mau_more").innerHTML = "\u66f4\u591a\u2193"
        }
    });
    for (var i = 2; i <= 3; i++) {
        if (!ZOL.$("mau_more_" + i)) {
            continue
        }
        ZOL.addEvent(ZOL.$("mau_more_" + i), "click", function () {
            var moreConId = this.getAttribute("rel");
            ZOL.util.toggle("more_menu_" + moreConId, {
                show: "inline",
                hidden: "none"
            });
            if (ZOL.$("more_menu_" + moreConId).style.display == "inline") {
                ZOL.$("all_menu_" + moreConId).style.display = "inline-block";
                ZOL.$("mau_more_" + moreConId).innerHTML = "\u6536\u7f29\u2191"
            }
            if (ZOL.$("more_menu_" + moreConId).style.display == "none") {
                ZOL.$("all_menu_" + moreConId).style.display = "none";
                ZOL.$("mau_more_" + moreConId).innerHTML = "\u66f4\u591a\u2193"
            }
        })
    }
    ZOL.addEvent(priSelf, "click", function () {
        var moreConId = this.getAttribute("rel");
        ZOL.util.toggle(moreConId, {
            show: "block",
            hidden: "none"
        });
        if (ZOL.$(moreConId).style.display == "block") {
            priSelf.parentNode.className = "pri_moredn";
            if (minPrice.value == "" && maxPrice.value == "") {
                ZOL.$("Searchbutton").disabled = "disabled"
            }
            minPrice.focus()
        } else {
            priSelf.parentNode.className = "pri_moreup"
        }
    });
    var moreArr = ZOL.find("dt", "pro_se");
    ZOL.each(moreArr, function (more) {
        var moreConId = more.getAttribute("rel");
        ZOL.addEvent(more, "click", function () {
            ZOL.util.toggle(moreConId, {
                show: "block",
                hidden: "none"
            });
            if (ZOL.$(moreConId).style.display == "block") {
                more.parentNode.className = "pm_moredn"
            } else {
                more.parentNode.className = "pm_moreup"
            }
        });
        var closeObj = ZOL.$("close_" + moreConId.substring(3));
        ZOL.addEvent(closeObj, "click", function () {
            closeObj.parentNode.style.display = "none";
            closeObj.parentNode.parentNode.className = "pm_moreup"
        });
        var aArr = ZOL.find("a", moreConId);
        ZOL.each(aArr, function (IemA) {
            if (IemA.className == "sel") {
                more.innerHTML = IemA.innerHTML + "<p>&nbsp;</p>"
            }
        })
    });
    ZOL.addEvent(ZOL.$("pri_close"), "click", function () {
        ZOL.$("pri_close").parentNode.style.display = "none";
        ZOL.$("pri_close").parentNode.parentNode.className = "pri_moreup"
    })
}();
ZOL.$("leftForm").onsubmit = function () {
    var _keword = ZOL.$("leftKeywords");
    if (_keword.value == "\u8bf7\u8f93\u5165\u54c1\u724c\u3001\u7c7b\u522b\u540d\u79f0" || _keword.value == "") {
        alert("\u8bf7\u8f93\u5165\u54c1\u724c\u3001\u7c7b\u522b\u540d\u79f0");
        _keword.value = "";
        _keword.focus();
        return false
    }
    return true
};
var toAnchor = function () {
    if (typeof (pageType) == "undefined") {
        return false
    }
    if (pageType != "list" || ZOL.util.getBodySize().y != 0) {
        return false
    }
    if ((manuId != 0 || manuId == 0) && priceId === "noPrice" && (paramStr === "" || paramStr === "0")) {
        return false
    }
    var _backurl = cookie.get("list_backUrl");
    if (ZOL.URL == _backurl) {
        return false
    }
    cookie.set("list_backUrl", ZOL.URL, 24 * 7);
    ZOL.util.scroller("pamFilter", 1000)
}();
var showMoreList = function () {
    if (ZOL.$("all_cates")) {
        var allCates = ZOL.$("all_cates");
        var all_cates_text = ZOL.$("all_cates_text");
        var allCatesL = ZOL.$("all_cate_list");
        allCates.onmouseover = allCatesL.onmouseover = function () {
            allCatesHD && clearTimeout(allCatesHD);
            all_cates_text.className = "sel";
            allCatesL.style.display = "block"
        };
        var hiddenMoreList = function () {
            all_cates_text.className = "";
            allCatesL.style.display = "none"
        };
        var allCatesHD = null;
        allCates.onmouseout = allCatesL.onmouseout = function () {
            allCatesHD && clearTimeout(allCatesHD);
            allCatesHD = setTimeout(function () {
                hiddenMoreList()
            }, 200)
        }
    }
};
ZOL.onReady(showMoreList);
var imgEnlarge = function () {
    var list = ZOL.find("img", "proList");
    if (!list) {
        return false
    }
    var createImgDiv = function (id, imgsrc) {
        var _span = ZOL.$(id);
        if (_span) {
            _span.innerHTML = "";
            var _p = document.createElement("p");
            _p.id = "iconpic";
            _p.className = "iconpic";
            var _img = document.createElement("img");
            _img.src = imgsrc;
            _span.className = "bigpic";
            _img.width = 280;
            _img.height = 210;
            _span.parentNode.appendChild(_p);
            _span.appendChild(_img);
            var ypos = ZOL.util.getPosition(_img);
            var _screeny = ZOL.util.getBodySize();
            var _valHeight = (_screeny.y + _screeny.h) - ypos.y;
            if (_valHeight < 210) {
                _span.style.top = (5 - (220 - _valHeight)) + "px"
            }
        }
    };
    ZOL.each(list, function (item) {
        var spanId = item.getAttribute("rel");
        var imgsrc = ZOL.$(spanId).innerHTML;
        var span = ZOL.$(spanId);
        ZOL.addEvent(item, "mouseover", function () {
            if (imgsrc) {
                var bigimgsrc = imgsrc.replace("_80x60", "_280x210");
                if (!bigimgsrc) {
                    return
                }
                createImgDiv(spanId, bigimgsrc)
            }
        });
        ZOL.addEvent(item, "mouseout", function () {
            if (span) {
                span.className = "hidden";
                span.style.top = "5px";
                span.parentNode.removeChild(ZOL.$("iconpic"));
                span.innerHTML = imgsrc
            }
        })
    })
}();
var imgEnlarge = function () {
    var showMore = ZOL.$("foldMore");
    if (!ZOL.$("foldMore") || !ZOL.$("morePmRow")) {
        return false
    }
    ZOL.addEvent(showMore, "click", function () {
        if ("none" == ZOL.$("morePmRow").style.display) {
            showMore.innerHTML = "\u6536\u8d77\u6761\u4ef6\u2191"
        } else {
            showMore.innerHTML = "\u5c55\u5f00\u66f4\u591a\u6761\u4ef6\u2193"
        }
        ZOL.util.toggle(ZOL.$("morePmRow"), {
            show: "",
            hidden: "none"
        })
    })
}();
var moreCateClose = function () {
    var closeBot = ZOL.$("more_cate_close");
    closeBot.onclick = function () {
        ZOL.$("all_cates_text").className = "";
        ZOL.$("all_cate_list").style.display = "none"
    }
}();
var adStyleModify = function () {
    if (!useNewListAdStyle(subcateId)) {
        return
    }
    var rightTopFont = ZOL.find("font", "list_list_merchant_recommend_left_font");
    if (rightTopFont && rightTopFont.length > 0) {
        ZOL.each(rightTopFont, function (o) {
            o.style.color = "#cc0000"
        })
    }
    var topAdWin = ZOL.findByClass("ad-window", "list_list_top_tonglan", "div");
    if (topAdWin.length >= 1) {
        var topAdOuter = ZOL.$("list_list_top_tonglan");
        if (topAdOuter) {
            topAdOuter.style.border = "none";
            topAdOuter.style.background = "none";
            if (screen.width >= 1110) {
                topAdOuter.style.width = " 895px"
            }
        }
    }
    return true
}();
var scrollPromo = function () {
    var scrollObj = ZOL.$("hotcity_c");
    if (!scrollObj) {
        return
    }
    var config = {
        direction: "up",
        delayTime: 5000,
        waitTime: 1000,
        scrollStep: 24
    };
    var scroll = new ZOL.widget.effect.marquee(scrollObj, config);
    scroll.start()
}();
var merIsOnline = function () {
    return false;
    var allOnlineBtn = ZOL.findByClass("ol-service", "mainFrame", "a");
    if (allOnlineBtn && allOnlineBtn.length > 0) {
        var merUNames = "";
        var comma = "";
        ZOL.each(allOnlineBtn, function (o) {
            merUNames += comma + o.getAttribute("rel");
            comma = "----"
        });
        if (merUNames) {
            var a = new ZOL.util.AJAX();
            var url = "/index.php?c=Ajax&a=DoveOnlie&userIds=" + merUNames;
            a.get(url, function (data) {
                if (data) {
                    data = eval("(" + data + ")");
                    var key = olFlag = "";
                    for (key in data) {
                        olFlag = data[key].split(",");
                        olFlag = olFlag[1];
                        var obj = ZOL.$("dove_" + key);
                        if ("avaiable" == olFlag) {
                            ZOL.addClass(ZOL.$(obj), "isol")
                        }
                        obj.onclick = function () {
                            openWin(this.getAttribute("rel"), this.getAttribute("rel2"))
                        };
                        obj.style.display = "block"
                    }
                }
            })
        }
    }
    return true
}();
var visitLocation = function () {
    if (!locationId) {
        return false
    }
    cookie.set("userLocationId", locationId, 0.5);
    cookie.set("userProvinceId", provinceId, 0.5);
    return true
};
var pageSerch = function () {
    function stripscript(s) {
        var pattern = new RegExp("[`~!+-@#$^&*()=|{}':;',\\[\\].<>/?~\uff01@#\uffe5\u2026\u2026&*\uff08\uff09\u2014\u2014|{}\u3010\u3011\u2018\uff1b\uff1a\u201d\u201c'\u3002\uff0c\u3001\uff1f]");
        var rs = "";
        for (var i = 0; i < s.length; i++) {
            rs = rs + s.substr(i, 1).replace(pattern, "")
        }
        return rs
    }
    if (!ZOL.$("bt_serch")) {
        return false
    }
    var subPgWord = function () {
        if (ZOL.$("pgword").value) {
            var keyword = stripscript(ZOL.$("pgword").value);
            keyword = escape(keyword);
            var reg = new RegExp("%", "g");
            keyword = keyword.replace(reg, "@");
            var sign = paramStr ? "-k" : "k";
            if (paramStr.indexOf("k") != -1) {
                var kwstr = paramStr.substring(paramStr.indexOf("k") - 1, paramStr.length);
                paramStr = paramStr.replace(kwstr, "")
            }
            var dfother = ("noPrice" != priceId || paramStr) ? "_1" : "";
            var dflocal = ("noPrice" != priceId || paramStr) ? "_0" : "";
            var dfmanu = (paramStr || ZOL.$("pgword").value) ? "_0" : "";
            var actionUrl = "/" + subcateEnName + "_index/subcate" + subcateId;
            actionUrl += manuId ? "_" + manuId : dfmanu;
            priceId = ("noPrice" == priceId && paramStr) ? 1 : priceId;
            actionUrl += ("noPrice" != priceId || paramStr) ? "_list_" + priceId : "";
            paramStr += (paramStr || "noPrice" != priceId) ? sign + keyword : "list_k" + keyword;
            actionUrl += paramStr ? "_" + paramStr : "";
            actionUrl += (queryType && queryType != 1) ? "_" + queryType : dfother;
            actionUrl += (style && style != 1) ? "_" + style : dfother;
            actionUrl += (locationId && locationId != 1) ? "_" + locationId : dflocal;
            actionUrl += "_1.html";
            ZOL.go(actionUrl)
        }
    };
    ZOL.addEvent(ZOL.$("bt_serch"), "click", function () {
        subPgWord()
    });
    ZOL.$("pgword").onkeydown = function (event) {
        var event = arguments[0] || window.event;
        var currentKey = event.charCode || event.keyCode;
        if (currentKey == 13) {
            subPgWord()
        }
    };
    return true
}();
var historySerch = function () {
    if (!ZOL.$("tory_serch")) {
        return false
    }
    var subHistoryPgWord = function () {
        if (ZOL.$("pgword").value) {
            var keyword = escape(ZOL.$("pgword").value);
            var reg = new RegExp("%", "g");
            keyword = keyword.replace(reg, "@");
            var sign = paramStr ? "-k" : "_k";
            if (paramStr.indexOf("k") != -1) {
                var kwstr = paramStr.substring(paramStr.indexOf("k") - 1, paramStr.length);
                paramStr = paramStr.replace(kwstr, "")
            }
            var actionUrl = "/history/subcate" + subcateId;
            actionUrl += manuId ? "_" + manuId : "_0";
            actionUrl += "_1";
            actionUrl += paramStr ? "_" + paramStr : "";
            actionUrl += keyword ? sign + keyword : "";
            actionUrl += queryType ? "_" + queryType : "_1";
            actionUrl += "_1.html";
            ZOL.go(actionUrl)
        }
    };
    ZOL.addEvent(ZOL.$("tory_serch"), "click", function () {
        subHistoryPgWord()
    });
    ZOL.$("pgword").onkeydown = function (event) {
        var event = arguments[0] || window.event;
        var currentKey = event.charCode || event.keyCode;
        if (currentKey == 13) {
            subPgWord()
        }
    };
    return true
}();
var getRemTime = function (endDate, elName) {
    var SysSecond;
    var InterValObj;
    ZOL.onReady(function () {
        SysSecond = parseInt(endDate);
        InterValObj = window.setInterval(SetRemainTime, 1000)
    });

    function SetRemainTime() {
        if (SysSecond > 0) {
            SysSecond = SysSecond - 1;
            var second = Math.floor(SysSecond % 60);
            var minite = Math.floor((SysSecond / 60) % 60);
            var hour = Math.floor(SysSecond / 3600);
            ZOL.$(elName).innerHTML = "<b>" + hour + "</b>\u5c0f\u65f6" + "<b>" + minite + "</b>\u5206" + "<b>" + second + "</b>\u79d2"
        } else {
            window.clearInterval(InterValObj)
        }
    }
};
var setRemTime = function () {
    if (ZOL.$("rushBuy") && rushDate) {
        var dateArr = rushDate.split(",");
        var n = 1;
        ZOL.each(dateArr, function (date) {
            getRemTime(date, "remainTime" + (n++))
        })
    }
}();
var cleanKeyword = function () {
    if (ZOL.$("comp-param-btn").value) {}
};
ZOL.$("keyword").onclick = function () {
    if ("\u8bf7\u8f93\u5165\u4f60\u8981\u627e\u7684\u4ea7\u54c1" == ZOL.$("keyword").value) {
        ZOL.$("keyword").value = ""
    }
};
ZOL.$("keyword").focus = function () {
    if ("" == ZOL.$("keyword").value) {
        ZOL.$("keyword").value = "\u8bf7\u8f93\u5165\u4f60\u8981\u627e\u7684\u4ea7\u54c1"
    }
};
$("#loadMore").live("click", function () {
    $("#myMore").show();
    $("#loadMore").hide()
});