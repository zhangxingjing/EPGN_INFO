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
            // httpRequest.send(null)
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
        new ZOL.load("/js/compare.js", "js", function () {
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
            new ZOL.load("./js/effect.js", "js", function () {
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
        // proPic = proPic.replace("_80x60/", "_60x45/");
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
    new ZOL.load("https://icon.zol-img.com.cn/products/js/util/tabview.js", "js", function () {
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
// var adStyleModify = function () {
//     if (!useNewListAdStyle(subcateId)) {
//         return
//     }
//     var rightTopFont = ZOL.find("font", "list_list_merchant_recommend_left_font");
//     if (rightTopFont && rightTopFont.length > 0) {
//         ZOL.each(rightTopFont, function (o) {
//             o.style.color = "#cc0000"
//         })
//     }
//     var topAdWin = ZOL.findByClass("ad-window", "list_list_top_tonglan", "div");
//     if (topAdWin.length >= 1) {
//         var topAdOuter = ZOL.$("list_list_top_tonglan");
//         if (topAdOuter) {
//             topAdOuter.style.border = "none";
//             topAdOuter.style.background = "none";
//             if (screen.width >= 1110) {
//                 topAdOuter.style.width = " 895px"
//             }
//         }
//     }
//     return true
// }();
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