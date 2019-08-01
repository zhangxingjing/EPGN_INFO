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
window.onerror = function () {
    return false
};
var addFavorite = function () {
    var sURL = window.location.href;
    var sTitle = document.title;
    try {
        window.external.addFavorite(sURL, sTitle)
    } catch (e) {
        try {
            window.sidebar.addPanel(sTitle, sURL, "")
        } catch (e) {
            alert("\u5f88\u62b1\u6b49,\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u8be5\u529f\u80fd,\u8bf7\u624b\u52a8\u52a0\u5165\u6536\u85cf")
        }
    }
};
var getRewriteJsUrl = function (ajaxUrl) {
    if (!ajaxUrl) {
        return ""
    }
    ajaxUrl = ajaxUrl.replace(/index\.php\?c=AjaxVer3_([\w_]+)\&a=([\w_]+)\&(.+)/g, "xhr3_$1_$2_$3.html");
    ajaxUrl = ajaxUrl.replace(/index\.php\?c=AjaxVer3_([\w_]+)\&a=([\w_]+)/g, "xhr3_$1_$2.html");
    ajaxUrl = ajaxUrl.replace(/index\.php\?c=AjaxVer3_([\w_]+)/g, "xhr3_$1.html");
    ajaxUrl = ajaxUrl.replace(/(&|%26)/g, "%5E");
    return ajaxUrl
};
var getRewriteJsUrlV4 = function (ajaxUrl) {
    if (!ajaxUrl) {
        return ""
    }
    ajaxUrl = ajaxUrl.replace(/index\.php\?c=AjaxVer4_([\w_]+)\&a=([\w_]+)\&(.+)/g, "xhr4_$1_$2_$3.html");
    ajaxUrl = ajaxUrl.replace(/index\.php\?c=AjaxVer4_([\w_]+)\&a=([\w_]+)/g, "xhr4_$1_$2.html");
    ajaxUrl = ajaxUrl.replace(/index\.php\?c=AjaxVer4_([\w_]+)/g, "xhr4_$1.html");
    ajaxUrl = ajaxUrl.replace(/(&|%26)/g, "%5E");
    return ajaxUrl
};
var jumpPage = function (url, blank) {
    if (blank == 1) {
        window.open(url, "_blank")
    } else {
        if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
            var referLink = $('<a href="' + referLink + '"></a>');
            $("body").append(referLink);
            document.location.href = url
        } else {
            document.location.href = url
        }
    }
};
var userLocationId = 0;
var userProvinceId = 0;
var userCityId = 0;
var userFidLocationId = 0;
var realLocationId = 0;
var getUserAreaInfo = function (callback) {
    userLocationId = parseInt($.cookie("userLocationId"), 10);
    userProvinceId = parseInt($.cookie("userProvinceId"), 10);
    userFidLocationId = parseInt($.cookie("userFidLocationId"), 10);
    realLocationId = parseInt($.cookie("realLocationId"), 10);
    userCityId = parseInt($.cookie("userCityId"), 10);
    userCountyId = parseInt($.cookie("userCountyId"), 10);
    if (!userLocationId || !userProvinceId || !userFidLocationId) {
        var r = new Date().getTime();
        var url = getRewriteJsUrl("/index.php?c=AjaxVer3_AreaInfo&a=GetUserArea&time=" + r + "&_nots_=1");
        $.get(url, function (data) {
            var info = eval("(" + data + ")");
            userProvinceId = info.provinceId;
            userLocationId = info.locationId;
            userCityId = info.cityId;
            userCountyId = info.countyId;
            userFidLocationId = info.fidLocationId;
            realLocationId = info.realLocationId;
            typeof (callback) == "function" && callback()
        })
    } else {
        typeof (callback) == "function" && callback()
    }
    return
};
var getDetailUrl = function (options) {
    var defaults = {
        proId: 0,
        subPageType: ""
    };
    var options = $.extend(defaults, options);
    var subPath = Math.ceil(options.proId / 1000);
    return "/" + subPath + "/" + options.proId + "/" + options.subPageType + ".shtml"
};
var loadJsCss = function (file, filetype, callback) {
    var self = this;
    this.loaded = false;
    this.callback = callback;
    filetype = filetype || "js";
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
(function ($) {
    var Base = {
        getIPCK: function () {
            var ip_ck;
            if (document.cookie && document.cookie.match(/ip_ck=([^;$]+)/)) {
                ip_ck = document.cookie.match(/ip_ck=([^;$]+)/)[1]
            } else {
                ip_ck = "######IP_CK#####"
            }
            return ip_ck
        },
        pvStat: function (url) {
            _zpv_document_refer = url;
            pv_d()
        },
        eventStat: function (eventName, url) {
            var ip_ck = this.getIPCK();
            var URL = typeof (url) === "undefined" ? document.URL : url;
            var statUrl = "http://pvtest.zol.com.cn/image/pvevents.gif?t=" + new Date().getTime() + "&event=" + eventName + "&ip_ck=" + ip_ck + "&url=" + URL;
            var img = new Image();
            img.src = statUrl
        },
        eventStatWithParams: function (eventName, params, url) {
            var ip_ck = this.getIPCK();
            var URL = typeof (url) === "undefined" ? document.URL : url;
            var paramsArr = [];
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var str = key + "=" + params[key];
                    paramsArr.push(str)
                }
            }
            var statUrl = "http://pvtest.zol.com.cn/image/pvevents.gif?t=" + new Date().getTime() + "&event=" + eventName + "&" + paramsArr.join("&") + "&ip_ck=" + ip_ck + "&url=" + URL;
            var img = new Image();
            img.src = statUrl
        }
    };
    window.Base = Base
})(window.jQuery || window.$);
$(document).ready(function () {
    if (typeof (subcateId) != "undefined") {
        if ($.cookie("listSubcateId") != subcateId) {
            $.cookie("listSubcateId", subcateId, {
                domain: ".zol.com.cn",
                "expires": 600
            })
        }
    }
});
if ($.isFunction($(document).survey)) {
    $(document).survey()
}
var transformPrm = function (url) {
    var prm = "?";
    if (url) {
        if (url.indexOf("?") != -1) {
            prm = "&"
        }
    }
    return prm
};
$(document).ready(function () {
    if (typeof (pageType) != "undefined" && typeof (subPageType) != "undefined") {
        if (pageType == "Detail") {
            var hcpid = document.URL.match(/hcpid=(\d+)/);
            if (hcpid != null) {
                hcpid = hcpid[1];
                $(".nav li a").each(function () {
                    var k = $(this).attr("href");
                    if (k) {
                        var prm = transformPrm(k);
                        $(this).attr("href", k + prm + "hcpid=" + hcpid)
                    }
                });
                var comUrl = $(".more-comments").attr("href");
                if (comUrl) {
                    var prm = transformPrm(comUrl);
                    $(".more-comments").attr("href", comUrl + prm + "hcpid=" + hcpid)
                }
                var bkUrl = $(".back_home_btn").attr("href");
                if (bkUrl) {
                    var prm = transformPrm(bkUrl);
                    $(".back_home_btn").attr("href", bkUrl + prm + "hcpid=" + hcpid)
                }
            }
        }
    }
});
jQuery.cookie = function (name, value, options) {
    if (typeof value != "undefined") {
        options = options || {};
        if (value === null) {
            value = "";
            options.expires = -1
        }
        var expires = "";
        if (options.expires && (typeof options.expires == "number" || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == "number") {
                var tempExpires = 0;
                if (options.expires < 1000) {
                    tempExpires = options.expires * 24 * 3600 * 1000
                } else {
                    tempExpires = options.expires * 1000 + 8 * 3600 * 1000
                }
                date = (new Date((new Date()).getTime() + tempExpires)).toUTCString()
            } else {
                date = options.expires.toUTCString()
            }
            expires = "; expires=" + date
        }
        var path = "; path=/";
        var domain = options.domain ? "; domain=" + (options.domain) : "";
        var secure = options.secure ? "; secure" : "";
        document.cookie = [name, "=", encodeURIComponent(value), expires, path, domain, secure].join("")
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != "") {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + "=")) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break
                }
            }
        }
        return cookieValue
    }
};
(function ($) {
    function User() {
        this.sid = $.cookie("zol_sid")
    }
    var _urls = {
        myUrl: "http://my.zol.com.cn/",
        loginUrl: "https://service.zol.com.cn/user/login.php",
        regUrl: "https://service.zol.com.cn/user/register.php",
        logoutUrl: "https://service.zol.com.cn/user/login.php?type=quit"
    };
    User.prototype.getUserId = function () {
        var userId = $.cookie("zol_userid");
        if (userId && userId.indexOf('"') > 0) {
            userId = userId.substr(0, userId.indexOf('"'))
        }
        return userId
    };
    User.prototype.getUserInfo = function () {
        var userInfo = {};
        var userId = this.getUserId();
        if (userId) {
            userInfo.sid = this.sid;
            userInfo.uid = userId;
            userInfo.myUrl = _urls.myUrl + userId + "/";
            userInfo.msgUrl = _urls.myUrl + userId + "/message/";
            userInfo.setUrl = _urls.myUrl + userId + "/settings/"
        }
        userInfo.login = _urls.loginUrl;
        userInfo.logout = _urls.logoutUrl;
        userInfo.regUrl = _urls.regUrl;
        return userInfo
    };
    User.prototype.getUserData = function (callback) {
        var userId = this.getUserId();
        if (userId) {
            var url = getRewriteJsUrl("/index.php?c=AjaxVer3_User&a=GetUserInfo&userId=" + userId);
            $.get(url, function (result) {
                var data = $.parseJSON(result);
                typeof (callback) === "function" && callback(data)
            })
        }
    };
    window.User = new User()
})(window.$ || window.jQuery);
(function (window, document, $) {
    window.ZUI = typeof window.ZUI === "undefined" ? {} : window.ZUI;

    function getIPCK() {
        var ip_ck;
        if (document.cookie && document.cookie.match(/ip_ck=([^;$]+)/)) {
            ip_ck = document.cookie.match(/ip_ck=([^;$]+)/)[1]
        } else {
            ip_ck = "######IP_CK#####"
        }
        return ip_ck
    }
    window.ZUI.Count = (function () {
        return {
            pvStat: function (url) {
                window._zpv_document_refer = url;
                pv_d()
            },
            eventCount: function (eventName, url) {
                var ip_ck = getIPCK();
                var URL = typeof (url) === "undefined" ? document.URL : url;
                var countUrl = "http://pvtest.zol.com.cn/image/pvevents.gif?t=" + new Date().getTime() + "&event=" + eventName + "&ip_ck=" + ip_ck + "&url=" + URL;
                var img = new Image();
                img.src = countUrl
            },
            eventCountWithParams: function (eventName, params, url) {
                var ip_ck = getIPCK();
                var URL = typeof (url) === "undefined" ? document.URL : url;
                var paramsArr = [];
                for (var key in params) {
                    if (params.hasOwnProperty(key)) {
                        var str = key + "=" + params[key];
                        paramsArr.push(str)
                    }
                }
                var countUrl = "http://pvtest.zol.com.cn/image/pvevents.gif?t=" + new Date().getTime() + "&event=" + eventName + "&" + paramsArr.join("&") + "&ip_ck=" + ip_ck + "&url=" + URL;
                var img = new Image();
                img.src = countUrl
            }
        }
    })()
})(window, document, window.$ || window.jQuery);
(function ($) {
    var apiGetFollowData = "/xhr3_Header_WTrendEnter_";
    var apiDoFollow = "/xhr_WTrend_AttendPro_";
    var executeScript = function (src) {
        var script = document.createElement("script");
        script.src = src;
        document.body.appendChild(script)
    };
    var userId = User.getUserId();
    var _wtrendFollowButtonCreate = function (data) {
        var buttonsContainer = $("[node-type^=wtrend-follow-button]");
        if (buttonsContainer.length > 0) {
            $.each($("[node-type^=wtrend-follow-button]"), function () {
                var id = $(this).attr("node-type").split("-").pop();
                var key = "follow-" + id;
                $(this).html(data[key]["button"]);
                $(this).children().attr("title", "\u70b9\u51fb\u5173\u6ce8\u5b83\u7684\u6700\u65b0\u4fe1\u606f");
                if (!userId) {
                    $(this).children().attr("data-role", "user-login")
                }
            });
            $(".followed-button").hover(function () {
                $(this).addClass("followed-button-hover")
            }, function () {
                $(this).removeClass("followed-button-hover")
            })
        }
    };
    var _createFollowTip = function () {
        if ($("#GZ-box").length === 0) {
            var html = ['<div id="GZ-box" class="GZ-box" style="display:none"><div class="GZ-box-inner">', '<span class="GZ-close"></span><div class="GZ-box-main">', '<p class="GZ-box-tip">\u60a8\u5173\u6ce8\u7684\u4ea7\u54c1\u53ef\u5728\u201c', '<a href="http://detail.zol.com.cn/dongtai/home" target="_blank">\u4ea7\u54c1\u5fae\u52a8\u6001</a>\u201d', "\u4e86\u89e3\u5230\u66f4\u52a0\u5168\u9762\u7684\u4fe1\u606f</p>", "<p>\u8fd8\u53ef\u4ee5\u5728\u9875\u9762\u9876\u90e8\u901a\u8fc7<span>\u201c\u5173\u6ce8\u201d</span>\u8fdb\u5165\u5230\u4ea7\u54c1\u5fae\u52a8\u6001</p>", '<div class="GZ-box-tip-pic"><span class="GZ-close-area"></span></div>', "</div></div></div>"].join("");
            $(html).appendTo($("body")).show();
            $(".GZ-close, .GZ-close-area").on("click", function () {
                $("#GZ-box").remove()
            })
        }
    };
    var _follow = function () {
        var followButton = "[action-type=wtrend_follow_button]";
        $(document).on("click", followButton, function (e) {
            e.preventDefault();
            var button = $(this);
            var followId = button.attr("data-id");
            var sameFollowButton = $("[node-type=wtrend-follow-button-" + followId + "]").find("a");
            var flag = parseInt(button.attr("flag"));
            var parameters = button.attr("action-data").split("&");
            parameters.push("opFlag=" + flag, "callback=WtrendCallback.DoFollow");
            var doFollowUrl = apiDoFollow + parameters.slice(1).join("^") + ".html";
            WtrendCallback.DoFollow = function (json) {
                if (json) {
                    if (flag === 1) {
                        sameFollowButton.text("\u5df2\u5173\u6ce8").attr({
                            "class": "followed-button",
                            "flag": "0",
                            "title": "\u53d6\u6d88\u5bf9\u5b83\u7684\u5173\u6ce8"
                        });
                        var followed = $(".followed-button");
                        followed.hover(function () {
                            $(this).addClass("followed-button-hover")
                        }, function () {
                            $(this).removeClass("followed-button-hover")
                        });
                        if (typeof (pageType) !== "undefined" && pageType === "List") {
                            _createFollowTip()
                        }
                    } else {
                        sameFollowButton.text("\u5173\u6ce8").attr({
                            "class": "follow-button",
                            "flag": "1",
                            "title": "\u70b9\u51fb\u5173\u6ce8\u5b83\u7684\u6700\u65b0\u4fe1\u606f"
                        })
                    }
                }
                WtrendCallback.DoFollow = null
            };
            $.getScript(doFollowUrl)
        })
    };
    var _getIdStr = function () {
        var followId = "",
            follows = [],
            idStr = "";
        if (typeof (pageType) !== "undefined" && pageType === "List") {
            $.each($("[data-follow-id]"), function () {
                follows.push($(this).attr("data-follow-id"))
            })
        } else {
            if (typeof (seriesId) !== "undefined" && parseInt(seriesId) > 0) {
                followId = "s" + seriesId
            } else {
                if (typeof (proId) != "undefined" && parseInt(proId) > 0) {
                    followId = "p" + proId
                }
            }
        }
        if (follows.length === 0) {
            idStr = followId
        } else {
            idStr = (followId === "") ? follows.join("-") : followId + "-" + follows.join("-")
        }
        return idStr
    };
    window.WtrendCallback = {
        GetFollow: function (data) {
            _wtrendFollowButtonCreate(data);
            if (userId) {
                _follow()
            }
            WtrendCallback.GetFollow = null
        },
        signFollowAndVisited: function (data) {
            setTimeout(function () {
                if ($("#J_WFnum").length != 0) {
                    $("#J_WFnum").html("\u5173\u6ce8(<em>" + data.followNum + "</em>\u6b3e)")
                }
                if ($("#J_WVnum").length != 0) {
                    $("#J_WVnum").html("\u6d4f\u89c8(<em>" + data.visitedNum + "</em>\u6b3e)")
                }
            }, 10)
        }
    };
    var ProductFollow = {
        getFollowList: function () {
            var userStr = userId ? "^userId=" + userId : "";
            var idStr = _getIdStr();
            var url = apiGetFollowData + "proIds=" + idStr + userStr + "^callback=WtrendCallback.GetFollow.html";
            $(document).ready(function () {
                executeScript(url)
            })
        },
        getFollowNum: function (userid) {
            var url = apiGetFollowData + "userId=" + userid + "^callback=WtrendCallback.signFollowAndVisited.html";
            executeScript(url)
        }
    };
    if (typeof (pageType) !== "undefined" && pageType === "List") {
        ProductFollow.getFollowList()
    }
    window.ProductFollow = ProductFollow
})(window.$ || window.jQuery);
(function ($) {
    var FeedBackWidget = {
        config: {
            feedBackUrl: "http://service.zol.com.cn/complain/complain.php?id=7",
            surveyUrl: "http://survey.zol.com.cn/front/1/945.html"
        },
        isN1: false,
        executeScript: function (src) {
            var script = document.createElement("script");
            script.src = src;
            document.body.appendChild(script)
        },
        widgetCreate: function () {
            var widget = $('<div id="feedBackWidget"></div>');
            var qrCode = "",
                n1c = "",
                isHide = "",
                tryLink = "",
                pk = "";
            if (pageType == "Detail" && subPageType == "Detail" && typeof ewImg !== "undefined" && ewImg !== "") {
                qrCode = '<div id="QrCode" class="QrCode"><span>\u624b\u673a\u6d4f\u89c8<i></i></span><div class="qrcode-box"><img src="' + ewImg + '" width="150" height="150"></div></div>'
            }
            var today = new Date();
            if (pageType == "List" && subPageType == "List") {
                if (subcateId == "57" && today.getFullYear() == "2018" && today.getMonth() == "8" && today.getDate() < "18") {
                    tryLink = '<div id="aside-zhibo"><a href="//detail.zol.com.cn/cell_phone/index1229519.shtml" target="_blank"><img src="//icon.zol-img.com.cn/products/active/aside-zhibo.jpg" style="vertical-align:top"></a></div>'
                } else {
                    tryLink = '<div id="tryLink"><a href="http://try.zol.com.cn/" target="_blank">\u514d\u8d39\u8bd5\u7528<i></i></a></div>'
                }
            }
            if (pageType == "Detail" && subPageType == "Review") {}
            var html = [tryLink, qrCode, pk, '<div id="callFeedBack"' + isHide + '><a href="' + this.config.feedBackUrl + '" target="_blank">\u610f\u89c1\u53cd\u9988</a></div>', '<div id="backTop" style="display:none"><a href="javascript:void(0);" title="\u8fd4\u56de\u9876\u90e8" target="_self"><i></i></a></div>'].join("");
            widget.html(html);
            $("body").append(widget)
        },
        resize: function () {
            var winW = $(window).width();
            if (winW <= 1150) {
                $("#feedBackWidget").addClass("widget-by-window")
            } else {
                $("#feedBackWidget").removeClass("widget-by-window")
            }
        },
        initEvent: function () {
            var self = this;
            $("#backTop").bind("click", function (e) {
                e.preventDefault();
                $("html,body").scrollTop(0);
                var elem = document.createElement("img");
                with(elem) {
                    src = "http://pvtest.zol.com.cn/image/pvevents.gif?t=" + (+new Date) + "&event=detail_index_returntop &ip_ck=" + $.cookie("ip_ck") + "&url=" + location.href
                }
            });
            $(window).scroll(function () {
                if ($(this).scrollTop() > 400) {
                    $("#backTop").show();
                    if (self.isN1) {
                        $("#callFeedBack").show()
                    }
                } else {
                    $("#backTop").hide();
                    if (self.isN1) {
                        $("#callFeedBack").hide()
                    }
                }
            });
            $(window).resize(function () {
                self.resize()
            });
            $("#N1 a").on("click", function () {
                Base.eventStat("n1corp20150409")
            });
            $("#QrCode").on({
                "mouseenter": function () {
                    $(this).addClass("QrCode-on")
                },
                "mouseleave": function () {
                    $(this).removeClass("QrCode-on")
                }
            })
        },
        init: function () {
            if (screen.width > 1200) {
                this.widgetCreate();
                this.resize();
                this.initEvent()
            }
        }
    };
    FeedBackWidget.init()
})(window.$ || window.jQuery);
(function ($) {
    var userInfo = User.getUserInfo();
    var wtrendStrollPage = "http://detail.zol.com.cn/dongtai/stroll";
    var wtrendFollowPage = "http://detail.zol.com.cn/dongtai/home";
    var htmlAfterLogin = ['<div class="sitenav-productlibrary-count">', '</div><div class="sitenav-personal-center">', '<a href="' + userInfo.logout + '" class="sitenav-personal-login-out" target="_self">\u9000\u51fa</a>', '<a id="J_NavMsg" href="{{MYMSG}}" class="sitenav-personal-msg" title="\u77ed\u6d88\u606f" target="_blank"></a>', '<div class="sitenav-personal-welcome">\u6b22\u8fce\u60a8\uff0c<a href="{{MYURL}}" target="_blank">{{MYUSERID}}</a></div>', "</div>"].join("");
    var getMsg = function () {
        $.getJSON("//my.zol.com.cn/public_msg_index.php?callback=?", function (data) {
            if (data) {
                $("#J_NavMsg").html("<i></i>").attr("title", "\u60a8\u6709" + data + "\u6761\u77ed\u6d88\u606f")
            }
        })
    };
    var executeScript = function (src) {
        var script = document.createElement("script");
        script.src = src;
        document.body.appendChild(script)
    };
    if (userInfo.uid) {
        var html = htmlAfterLogin.replace("{{MYMSG}}", userInfo.msgUrl).replace("{{MYURL}}", userInfo.myUrl);
        User.getUserData(function (data) {
            html = html.replace("{{MYUSERID}}", data.nickName);
            $("#J_NavLoginBar").html(html);
            getMsg();
            ProductFollow.getFollowNum(userInfo.uid)
        })
    } else {
        executeScript("//icon.zol-img.com.cn/group/js/login.js");
        window.ZOL_SMALL_LOGIN_CALLBACK = function (data) {
            if (data) {
                try {
                    if (data.type == "change" || data.type == "bind" || data.type == "bindPhone") {
                        var param = "type=" + data.type + "&userid=" + encodeURIComponent(data.userid);
                        param += "&token=" + data.token + "&timestamp=" + data.timestamp;
                        param += "&email=" + data.email + "&phone=" + data.phone;
                        param += "&backurl=" + encodeURIComponent(data.backurl);
                        var script = document.createElement("script");
                        script.type = "text/javascript";
                        script.id = "chgpwd_scriptChangePwd";
                        script.src = "//icon.zol-img.com.cn/service/js/chgpwd.js?" + param;
                        document.body.appendChild(script);
                        return false
                    } else {
                        window.location.reload(true)
                    }
                } catch (e) {}
            }
        };
        var leavTimer = null;
        $("#J_NavLogin").on({
            "mouseenter": function () {
                if (leavTimer) {
                    clearTimeout(leavTimer)
                }
                $(this).addClass("sitenav-login-box-open");
                document.getElementById("ZOL_SMALL_LOGIN").src = "//service.zol.com.cn/user/siteLogin.php?type=small&callback=ZOL_SMALL_LOGIN_CALLBACK";
                var ifrWin = document.getElementById("ZOL_SMALL_LOGIN").contentWindow;
                $(ifrWin).on("load", function () {
                    var $$ = this.$;
                    $$("#loginUser").focus()
                })
            },
            "mouseleave": function () {
                var self = $(this);
                leavTimer = setTimeout(function () {
                    self.removeClass("sitenav-login-box-open")
                }, 200)
            }
        });
        $("#J_NavLoginLink").on("click", function (e) {
            e.preventDefault();
            $(this).parent().toggleClass("sitenav-login-box-open")
        })
    }
    $("#J_NavGroupSite").hover(function () {
        $(this).addClass("h-sitenav-groupsite")
    }, function () {
        $(this).removeClass("h-sitenav-groupsite")
    })
})(window.$ || window.jQuery);
(function ($) {
    $.comp_num = 0;
    $.comp_proArr = {};
    var _removeCallbackArr = [];
    $.fn.compare = function (settings) {
        var limitSubIdArr = ["57", "16", "15"];
        var addLimitNum = ($.inArray(subcateId, limitSubIdArr) !== -1) ? 5 : 4;
        var defaults = {
            requestUrl: "/index.php?c=AjaxVer3_Compare&a=Compare&proIdStr=",
            postUrl: "/ProductComp_param_{PARAM}.html",
            detail: "http://detail.zol.com.cn",
            counter: 0,
            counterCon: "",
            proArr: {},
            itemContainer: "",
            compareBox: "",
            cookieName: "comp_pro_",
            subcateId: 0,
            addItem: false,
            addNum: addLimitNum,
            buttons: [{
                value: "\u5bf9\u6bd4",
                id: "v3CompareParamBtn",
                type: "button",
                page: "param"
            }],
            removeCallback: null,
            onlyAdd: false
        };
        _removeCallbackArr.push(settings.removeCallback);
        var options = $.extend(defaults, settings, {
            removeCallback: _removeCallbackArr
        });
        var doc = document;
        if (window.parent) {
            doc = window.parent.document
        }
        var createBox = function () {
            options.compareBox = $("#v3CompareBox", doc);
            if (options.compareBox.length === 0) {
                var compareBox = ['<div id="v3CompareBox" class="v3-compare-box" style="display:none">', '<div class="v3-compare-box-header">', '<span id="v3CompareClose" class="v3-compare-box-close">\u5173\u95ed</span>', '<h4 class="v3-compare-box-title">[<span id="v3CompareNum">0</span>/' + options.addNum + "] \u5bf9\u6bd4\u6846</h4></div>", '<ul id="v3CompareItems" class="v3-compare-box-list"></ul>', '<div class="v3-compare-box-buttons">', '<form id="v3CompareButtons" method="post" action="" target="_blank">', "</form>", '<em id="v3CompareDelAll" class="v3-compare-box-clear">\u6e05\u7a7a\u5bf9\u6bd4\u680f</em>', "</div></div>"].join("");
                if (window.parent) {
                    $(doc.body).append(compareBox)
                } else {
                    $("body").append($(compareBox))
                }
                var compareButtons = $("#v3CompareButtons", doc);
                $.each(options.buttons, function (i, btn) {
                    var _btn = $('<button type="' + btn.type + '" hidefocus="true" class="v3-compare-box-button"></button', doc);
                    _btn.attr("id", btn.id).text(btn.value);
                    compareButtons.append(_btn);
                    $("#" + btn.id, doc).on("click", function () {
                        var param = $.cookie("comp_pro_" + $.lastSubId);
                        options.postUrl = "/ProductComp_" + btn.page + "_{PARAM}.html";
                        param = param.replace(new RegExp(",", "gm"), "-");
                        var url = options.detail + options.postUrl.replace("{PARAM}", param);
                        compareButtons.attr("action", url);
                        compareButtons.submit()
                    })
                })
            }
            options.itemContainer = $("#v3CompareItems", doc);
            options.compareCounter = $("#v3CompareNum", doc);
            $.comp_num = parseInt(options.compareCounter.text());
            $(doc).on("click", "#v3CompareClose", function () {
                $(this).parent().parent().hide()
            });
            $(window.parent).on("scroll", function () {
                var isIE6 = !-[1, ] && !window.XMLHttpRequest;
                if (isIE6) {
                    options.compareBox.css({
                        top: ($(window.parent).scrollTop() + 70) + "px"
                    })
                }
            })
        };
        var initItem = function () {
            options.itemContainer.find("li").on({
                "mouseenter": function () {
                    $(this).addClass("hover")
                },
                "mouseleave": function () {
                    $(this).removeClass("hover")
                }
            })
        };
        var exec = function () {
            var param = $.cookie("comp_pro_" + $.lastSubId);
            param = param.replace(new RegExp(",", "gm"), "-");
            var url = options.detail + options.postUrl.replace("{PARAM}", param);
            return url
        };
        var addItem = function (proId, proName, url, pic, subcateId, setcookie) {
            $("#v3CompareBox", doc).show();
            if ($.lastSubId && subcateId != $.lastSubId) {
                options.itemContainer.empty();
                $.comp_num = 0;
                options.compareCounter.text(0)
            }
            if (options.addItem && $.comp_proArr[proId]) {
                alert("\u5bf9\u6bd4\u6846\u5df2\u6709\u8be5\u4ea7\u54c1\u4e86\uff0c\u8bf7\u9009\u62e9\u5176\u4ed6\u4ea7\u54c1");
                return
            }
            if ($.comp_num >= options.addNum) {
                alert("\u62b1\u6b49\uff0c\u60a8\u53ea\u80fd\u9009\u62e9" + options.addNum + "\u6b3e\u5bf9\u6bd4\u4ea7\u54c1");
                return
            }
            $.lastSubId = subcateId;
            pic = pic.replace("_80x60", "_60x45");
            var idstring = [1235132, 1180706, 1183648, 1212030].join("#");
            var flag = false;
            $("#v4CompareItems > li").each(function (index, item) {
                if (item.id.replace("v4Compare-", "") == 1213148) {
                    flag = true
                }
            });
            if (!flag && idstring.indexOf(proId) >= 0 && $.comp_num < 4) {
                var endTime = new Date(2019, 0, 1);
                var startTime = new Date(2018, 11, 10);
                var nowTime = new Date();
                if (startTime <= nowTime && nowTime <= endTime) {
                    addItem(1213148, "\u60e0\u666e\u661f 14-CE0027TX\uff084HL26PA\uff09", "/notebook/index1213148.shtml", "https://2c.zol-img.com.cn/product_small/13_60x45/138/cerTWUhO2jcE.jpg", subcateId, true)
                }
            }
            var item = $('<li id="v3Compare-' + proId + '"></li>', doc);
            item.html(['<span id="v3CompareDel-' + proId + '" class="v3-compare-item-del">\u5173\u95ed</span>', '<a class="pic" href="' + url + '" title="' + proName + '" target="_blank">', '<img src="' + pic + '" width="60" height="45" />', "<span>" + proName + "</span>", '</a><input type="hidden" name="pro_id[]" value="' + proId + '">'].join(""));
            $.comp_proArr[proId] = true;
            $.comp_num++;
            options.compareCounter.text($.comp_num);
            options.itemContainer.append(item);
            if (setcookie) {
                destruct()
            }
            $("#v3CompareDel-" + proId, doc).on("click", function () {
                remove(proId)
            })
        };
        var loadItems = function (proIdStr) {
            var ajaxurl = options.requestUrl + proIdStr;
            $.ajax({
                type: "GET",
                url: getRewriteJsUrl(ajaxurl),
                success: function (data) {
                    if (data) {
                        var proArr = $.parseJSON(data);
                        for (var proId in proArr) {
                            var proName = proArr[proId].NAME;
                            var url = options.detail + proArr[proId].URL;
                            var pic = proArr[proId].PIC;
                            var subcateId = "";
                            if ($.lastSubId) {
                                subcateId = $.lastSubId
                            } else {
                                if (proArr[proId].SUBID) {
                                    subcateId = proArr[proId].SUBID
                                }
                            }
                            addItem(proId, proName, url, pic, subcateId, false)
                        }
                    }
                }
            })
        };
        var sortProId = function () {
            var proJoin = [];
            if ($.comp_proArr) {
                for (var k in $.comp_proArr) {
                    proJoin.push(k)
                }
                return proJoin.sort(function compare(a, b) {
                    if ("s" == a.substring(0, 1)) {
                        a = a.substring(1)
                    }
                    if ("s" == b.substring(0, 1)) {
                        b = b.substring(1)
                    }
                    return (a.split("_")[0] - b.split("_")[0])
                })
            }
            return false
        };
        var destruct = function () {
            var proIdArr = sortProId();
            if (!proIdArr) {
                return false
            }
            var proStr = proIdArr.join(",");
            if ($.lastSubId) {
                $.cookie("comp_pro_" + $.lastSubId, proStr, {
                    domain: ".zol.com.cn"
                })
            }
            return true
        };
        var remove = function (proId) {
            delete $.comp_proArr[proId];
            $("#v3Compare-" + proId, doc).remove();
            $.comp_num--;
            options.compareCounter.text($.comp_num);
            destruct();
            $.each(_removeCallbackArr, function (i) {
                if (typeof (_removeCallbackArr[i]) !== "undefined" && $.isFunction(_removeCallbackArr[i])) {
                    options.removeCallback[i](proId)
                }
            })
        };
        var removeAll = function () {
            $.comp_proArr = {};
            options.itemContainer.empty();
            $.comp_num = 0;
            options.compareCounter.text(0);
            $.cookie("comp_pro_" + $.lastSubId, null, {
                domain: ".zol.com.cn"
            });
            $.each(_removeCallbackArr, function (i) {
                if (typeof (_removeCallbackArr[i]) !== "undefined" && $.isFunction(_removeCallbackArr[i])) {
                    options.removeCallback[i]()
                }
            })
        };
        var reSet = function () {
            options.itemContainer.empty();
            $.comp_num = 0;
            options.compareCounter.text(0);
            options.compareBox.remove()
        };
        var init = function () {
            createBox("v3CompareBox");
            $("#v3CompareDelAll", doc).on("click", function () {
                removeAll()
            });
            initItem();
            options.cookieName += options.subcateId;
            var proIdStr = $.cookie(options.cookieName);
            if (proIdStr) {
                var proArr = proIdStr.split(",");
                for (var i = 0; i < proArr.length; i++) {
                    $.comp_proArr[proArr[i]] = true
                }
            }
            var k = 0;
            if (options.remove) {
                if ($.comp_proArr[options.proId]) {
                    remove(options.proId)
                }
                for (var b in $.comp_proArr) {
                    k++
                }
                if (k == 0) {
                    options.compareBox.hide()
                }
                return
            }
            if (options.addItem && k < options.addNum) {
                addItem(options.proId, options.proName, options.url, options.pic, options.subcateId, true)
            } else {
                if (proIdStr) {
                    reSet();
                    loadItems(proIdStr)
                } else {
                    reSet()
                }
            }
        };
        init();
        this.addCallback = function (opt) {
            if (opt != undefined) {
                _removeCallbackArr.push(opt.removeCallback);
                settings = $.extend(settings, opt, {
                    removeCallback: _removeCallbackArr
                })
            }
        };
        return this
    }
})(window.$ || window.jQuery);
(function ($) {
    $.fn.suggest = function (options) {
        var defaults = {
            conId: "keyword",
            suggest: "suggest",
            formId: "searchForm",
            searchBtn: "subSerch",
            blurColor: "#ccc",
            focusColor: "#333",
            url: "/index.php?c=AjaxVer3_Suggest&a=Default&keyword="
        };
        var options = $.extend(defaults, options);
        var locRsArr = [];
        var kwInput = $("#" + options.conId);
        if (kwInput.size() == 0) {
            return false
        }
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
            if (keyword.replace(/[^\x00-\xff]/g, "xx").length < 3) {
                return
            }
            var reg = new RegExp("%", "g");
            keyword = escape(keyword).replace(reg, "@");
            var url = options.url + keyword;
            $.getJSON(getRewriteJsUrl(url), function (data) {
                for (var c = 0; c < data.length; c++) {
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
        $("#" + options.conId).focus(function () {
            if ($("#" + options.conId).val() == options.dfWord) {
                $(this).val("").css("color", options.focusColor)
            }
        });
        $("#" + options.conId).blur(function () {
            if (!$(this).val()) {
                $(this).css("color", options.blurColor).val(options.dfWord)
            }
        });
        var jumpSerch = function () {
            if ("vivo X21\u5c4f\u5e55\u6307\u7eb9\u624b\u673a" === $("#" + options.conId).val()) {
                window.open("http://detail.zol.com.cn/cell_phone/index1208704.shtml", "_blank");
                return
            }
            if ("vivo NEX \u65d7\u8230\u7248" === $("#" + options.conId).val()) {
                window.open("http://detail.zol.com.cn/cell_phone/index1219823.shtml", "_blank");
                return
            }
            if ("\u4f73\u80fdEOS M50" === kwInput.val()) {
                window.open("http://detail.zol.com.cn/digital_camera/index1203318.shtml", "_blank");
                return
            }
            if ("vivo X23" === kwInput.val()) {
                window.open("http://detail.zol.com.cn/cell_phone/index1227284.shtml", "_blank");
                return
            }
            if ("\u4f73\u80fdEOS R" === kwInput.val()) {
                window.open("http://detail.zol.com.cn/digital_camera/index1230432.shtml", "_blank");
                return
            }
            if ($("#" + options.conId).val() == options.dfWord) {
                if (options.dfWord == "\u8bf7\u8f93\u5165\u4f60\u8981\u627e\u7684\u4ea7\u54c1") {
                    $("#" + options.conId).val("")
                }
            }
            if ($("#" + options.conId).val() != "") {
                $("#" + options.formId).submit()
            }
        };
        var nextResult = function () {
            var self;
            if ($("#sugUl .sug-sel").length > 0) {
                if ($("#sugUl").children(".sug-sel").next().attr("class") == "sug-t") {
                    self = $("#sugUl").children(".sug-sel").attr("class", "none").next().next()
                } else {
                    self = $("#sugUl").children(".sug-sel").attr("class", "none").next()
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
                jumpPage(url, 1);
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
                for (var c = 0; c < locRsArr.length; c++) {
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
(function ($) {
    $.fn.picLoad = function (options) {
        var defaults = {
            checkShow: false
        };
        var options = $.extend(defaults, options);
        var failurelimit = 1;
        var elements = this;
        var naviUA = navigator.userAgent;
        var checkToShow = function () {
            var counter = 0;
            elements.each(function () {
                if (!$.belowthefold(this)) {
                    $.toshowimg(this)
                } else {
                    if (counter++ > failurelimit) {
                        return false
                    }
                }
            });
            var temp = $.grep(elements, function (element) {
                return !element.loaded
            });
            elements = $(temp)
        };
        if (naviUA.match(/iPhone|iPad|iPod/i)) {
            elements.each(function () {
                $.toshowimg(this)
            })
        } else {
            $(window).bind("scroll", function () {
                checkToShow()
            });
            $(window).bind("resize", function () {
                checkToShow()
            })
        }
        if (options.checkShow) {
            checkToShow()
        }
    };
    $.toshowimg = function (element) {
        if (!element.loaded && $(element).attr(".src")) {
            $(element).attr("src", $(element).attr(".src"))
        }
        element.loaded = true
    };
    $.belowthefold = function (element) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - 200
    };
    $.rightoffold = function (element) {
        var fold = $(window).width() + $(window).scrollLeft();
        return fold <= $(element).offset().left
    }
})(jQuery);
(function () {
    function e(e) {
        function o(o, i) {
            var s, h, k = o == window,
                v = i && void 0 !== i.message ? i.message : void 0;
            if (i = e.extend({}, e.blockUI.defaults, i || {}), !i.ignoreIfBlocked || !e(o).data("blockUI.isBlocked")) {
                if (i.overlayCSS = e.extend({}, e.blockUI.defaults.overlayCSS, i.overlayCSS || {}), s = e.extend({}, e.blockUI.defaults.css, i.css || {}), i.onOverlayClick && (i.overlayCSS.cursor = "pointer"), h = e.extend({}, e.blockUI.defaults.themedCSS, i.themedCSS || {}), v = void 0 === v ? i.message : v, k && b && t(window, {
                        fadeOut: 0
                    }), v && "string" != typeof v && (v.parentNode || v.jquery)) {
                    var y = v.jquery ? v[0] : v,
                        m = {};
                    e(o).data("blockUI.history", m), m.el = y, m.parent = y.parentNode, m.display = y.style.display, m.position = y.style.position, m.parent && m.parent.removeChild(y)
                }
                e(o).data("blockUI.onUnblock", i.onUnblock);
                var g, I, w, U, x = i.baseZ;
                g = r || i.forceIframe ? e('<iframe class="blockUI" style="z-index:' + x++ + ';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="' + i.iframeSrc + '"></iframe>') : e('<div class="blockUI" style="display:none"></div>'), I = i.theme ? e('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:' + x++ + ';display:none"></div>') : e('<div class="blockUI blockOverlay" style="z-index:' + x++ + ';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>'), i.theme && k ? (U = '<div class="blockUI ' + i.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:' + (x + 10) + ';display:none;position:fixed">', i.title && (U += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (i.title || "&nbsp;") + "</div>"), U += '<div class="ui-widget-content ui-dialog-content"></div>', U += "</div>") : i.theme ? (U = '<div class="blockUI ' + i.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:' + (x + 10) + ';display:none;position:absolute">', i.title && (U += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (i.title || "&nbsp;") + "</div>"), U += '<div class="ui-widget-content ui-dialog-content"></div>', U += "</div>") : U = k ? '<div class="blockUI ' + i.blockMsgClass + ' blockPage" style="z-index:' + (x + 10) + ';display:none;position:fixed"></div>' : '<div class="blockUI ' + i.blockMsgClass + ' blockElement" style="z-index:' + (x + 10) + ';display:none;position:absolute"></div>', w = e(U), v && (i.theme ? (w.css(h), w.addClass("ui-widget-content")) : w.css(s)), i.theme || I.css(i.overlayCSS), I.css("position", k ? "fixed" : "absolute"), (r || i.forceIframe) && g.css("opacity", 0);
                var C = [g, I, w],
                    S = k ? e("body") : e(o);
                e.each(C, function () {
                    this.appendTo(S)
                }), i.theme && i.draggable && e.fn.draggable && w.draggable({
                    handle: ".ui-dialog-titlebar",
                    cancel: "li"
                });
                var O = f && (!e.support.boxModel || e("object,embed", k ? null : o).length > 0);
                if (u || O) {
                    if (k && i.allowBodyStretch && e.support.boxModel && e("html,body").css("height", "100%"), (u || !e.support.boxModel) && !k) {
                        var E = d(o, "borderTopWidth"),
                            T = d(o, "borderLeftWidth"),
                            M = E ? "(0 - " + E + ")" : 0,
                            B = T ? "(0 - " + T + ")" : 0
                    }
                    e.each(C, function (e, o) {
                        var t = o[0].style;
                        if (t.position = "absolute", 2 > e) {
                            k ? t.setExpression("height", "Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:" + i.quirksmodeOffsetHack + ') + "px"') : t.setExpression("height", 'this.parentNode.offsetHeight + "px"'), k ? t.setExpression("width", 'jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"') : t.setExpression("width", 'this.parentNode.offsetWidth + "px"'), B && t.setExpression("left", B), M && t.setExpression("top", M)
                        } else {
                            if (i.centerY) {
                                k && t.setExpression("top", '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"'), t.marginTop = 0
                            } else {
                                if (!i.centerY && k) {
                                    var n = i.css && i.css.top ? parseInt(i.css.top, 10) : 0,
                                        s = "((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + " + n + ') + "px"';
                                    t.setExpression("top", s)
                                }
                            }
                        }
                    })
                }
                if (v && (i.theme ? w.find(".ui-widget-content").append(v) : w.append(v), (v.jquery || v.nodeType) && e(v).show()), (r || i.forceIframe) && i.showOverlay && g.show(), i.fadeIn) {
                    var j = i.onBlock ? i.onBlock : c,
                        H = i.showOverlay && !v ? j : c,
                        z = v ? j : c;
                    i.showOverlay && I._fadeIn(i.fadeIn, H), v && w._fadeIn(i.fadeIn, z)
                } else {
                    i.showOverlay && I.show(), v && w.show(), i.onBlock && i.onBlock.bind(w)()
                }
                if (n(1, o, i), k ? (b = w[0], p = e(i.focusableElements, b), i.focusInput && setTimeout(l, 20)) : a(w[0], i.centerX, i.centerY), i.timeout) {
                    var W = setTimeout(function () {
                        k ? e.unblockUI(i) : e(o).unblock(i)
                    }, i.timeout);
                    e(o).data("blockUI.timeout", W)
                }
            }
        }

        function t(o, t) {
            var s, l = o == window,
                a = e(o),
                d = a.data("blockUI.history"),
                c = a.data("blockUI.timeout");
            c && (clearTimeout(c), a.removeData("blockUI.timeout")), t = e.extend({}, e.blockUI.defaults, t || {}), n(0, o, t), null === t.onUnblock && (t.onUnblock = a.data("blockUI.onUnblock"), a.removeData("blockUI.onUnblock"));
            var r;
            r = l ? e("body").children().filter(".blockUI").add("body > .blockUI") : a.find(">.blockUI"), t.cursorReset && (r.length > 1 && (r[1].style.cursor = t.cursorReset), r.length > 2 && (r[2].style.cursor = t.cursorReset)), l && (b = p = null), t.fadeOut ? (s = r.length, r.stop().fadeOut(t.fadeOut, function () {
                0 === --s && i(r, d, t, o)
            })) : i(r, d, t, o)
        }

        function i(o, t, i, n) {
            var s = e(n);
            if (!s.data("blockUI.isBlocked")) {
                o.each(function () {
                    this.parentNode && this.parentNode.removeChild(this)
                }), t && t.el && (t.el.style.display = t.display, t.el.style.position = t.position, t.el.style.cursor = "default", t.parent && t.parent.appendChild(t.el), s.removeData("blockUI.history")), s.data("blockUI.static") && s.css("position", "static"), "function" == typeof i.onUnblock && i.onUnblock(n, i);
                var l = e(document.body),
                    a = l.width(),
                    d = l[0].style.width;
                l.width(a - 1).width(a), l[0].style.width = d
            }
        }

        function n(o, t, i) {
            var n = t == window,
                l = e(t);
            if ((o || (!n || b) && (n || l.data("blockUI.isBlocked"))) && (l.data("blockUI.isBlocked", o), n && i.bindEvents && (!o || i.showOverlay))) {
                var a = "mousedown mouseup keydown keypress keyup touchstart touchend touchmove";
                o ? e(document).bind(a, i, s) : e(document).unbind(a, s)
            }
        }

        function s(o) {
            if ("keydown" === o.type && o.keyCode && 9 == o.keyCode && b && o.data.constrainTabKey) {
                var t = p,
                    i = !o.shiftKey && o.target === t[t.length - 1],
                    n = o.shiftKey && o.target === t[0];
                if (i || n) {
                    return setTimeout(function () {
                        l(n)
                    }, 10), !1
                }
            }
            var s = o.data,
                a = e(o.target);
            return a.hasClass("blockOverlay") && s.onOverlayClick && s.onOverlayClick(o), a.parents("div." + s.blockMsgClass).length > 0 ? !0 : 0 === a.parents().children().filter("div.blockUI").length
        }

        function l(e) {
            if (p) {
                var o = p[e === !0 ? p.length - 1 : 0];
                o && o.focus()
            }
        }

        function a(e, o, t) {
            var i = e.parentNode,
                n = e.style,
                s = (i.offsetWidth - e.offsetWidth) / 2 - d(i, "borderLeftWidth"),
                l = (i.offsetHeight - e.offsetHeight) / 2 - d(i, "borderTopWidth");
            o && (n.left = s > 0 ? s + "px" : "0"), t && (n.top = l > 0 ? l + "px" : "0")
        }

        function d(o, t) {
            return parseInt(e.css(o, t), 10) || 0
        }
        e.fn._fadeIn = e.fn.fadeIn;
        var c = e.noop || function () {},
            r = /MSIE/.test(navigator.userAgent),
            u = /MSIE 6.0/.test(navigator.userAgent) && !/MSIE 8.0/.test(navigator.userAgent);
        document.documentMode || 0;
        var f = e.isFunction(document.createElement("div").style.setExpression);
        e.blockUI = function (e) {
            o(window, e)
        }, e.unblockUI = function (e) {
            t(window, e)
        }, e.growlUI = function (o, t, i, n) {
            var s = e('<div class="growlUI"></div>');
            o && s.append("<h1>" + o + "</h1>"), t && s.append("<h2>" + t + "</h2>"), void 0 === i && (i = 3000);
            var l = function (o) {
                o = o || {}, e.blockUI({
                    message: s,
                    fadeIn: o.fadeIn !== void 0 ? o.fadeIn : 700,
                    fadeOut: o.fadeOut !== void 0 ? o.fadeOut : 1000,
                    timeout: o.timeout !== void 0 ? o.timeout : i,
                    centerY: !1,
                    showOverlay: !1,
                    onUnblock: n,
                    css: e.blockUI.defaults.growlCSS
                })
            };
            l(), s.css("opacity"), s.mouseover(function () {
                l({
                    fadeIn: 0,
                    timeout: 30000
                });
                var o = e(".blockMsg");
                o.stop(), o.fadeTo(300, 1)
            }).mouseout(function () {
                e(".blockMsg").fadeOut(1000)
            })
        }, e.fn.block = function (t) {
            if (this[0] === window) {
                return e.blockUI(t), this
            }
            var i = e.extend({}, e.blockUI.defaults, t || {});
            return this.each(function () {
                var o = e(this);
                i.ignoreIfBlocked && o.data("blockUI.isBlocked") || o.unblock({
                    fadeOut: 0
                })
            }), this.each(function () {
                "static" == e.css(this, "position") && (this.style.position = "relative", e(this).data("blockUI.static", !0)), this.style.zoom = 1, o(this, t)
            })
        }, e.fn.unblock = function (o) {
            return this[0] === window ? (e.unblockUI(o), this) : this.each(function () {
                t(this, o)
            })
        }, e.blockUI.version = 2.7, e.blockUI.defaults = {
            message: "<h1>Please wait...</h1>",
            title: null,
            draggable: !0,
            theme: !1,
            css: {
                padding: 0,
                margin: 0,
                width: "30%",
                top: "40%",
                left: "35%",
                textAlign: "center",
                color: "#000",
                border: "3px solid #aaa",
                backgroundColor: "",
                cursor: "default"
            },
            themedCSS: {
                width: "30%",
                top: "40%",
                left: "35%"
            },
            overlayCSS: {
                backgroundColor: "#000",
                opacity: 0.6,
                cursor: "default"
            },
            cursorReset: "default",
            growlCSS: {
                width: "350px",
                top: "10px",
                left: "",
                right: "10px",
                border: "none",
                padding: "5px",
                opacity: 0.6,
                cursor: "default",
                color: "#fff",
                backgroundColor: "#000",
                "-webkit-border-radius": "10px",
                "-moz-border-radius": "10px",
                "border-radius": "10px"
            },
            iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank",
            forceIframe: !1,
            baseZ: 1000,
            centerX: !0,
            centerY: !0,
            allowBodyStretch: !0,
            bindEvents: !0,
            constrainTabKey: !0,
            fadeIn: 200,
            fadeOut: 400,
            timeout: 0,
            showOverlay: !0,
            focusInput: !0,
            focusableElements: ":input:enabled:visible",
            onBlock: null,
            onUnblock: null,
            onOverlayClick: null,
            quirksmodeOffsetHack: 4,
            blockMsgClass: "blockMsg",
            ignoreIfBlocked: !1
        };
        var b = null,
            p = []
    }
    "function" == typeof define && define.amd && define.amd.jQuery ? define(["jquery"], e) : e(jQuery)
})();
(function ($) {
    var zmallTips = $(".zplus-mall").find(".zplus-nav-icon-tips");
    var zmallTipsCookie = $.cookie("__ZPLUSMALLTIPS");
    if (!zmallTipsCookie && zmallTips.length) {
        zmallTips.show();
        zmallTips.find("em").on("click", function () {
            $(this).parent().remove();
            $.cookie("__ZPLUSMALLTIPS", "1", {
                domain: ".zol.com.cn",
                "expires": 7
            })
        })
    }
    var Ceiling = function () {
        if (!$("#tagNav")[0] || typeof (pageType) == "undefined") {
            return
        }
        var isIE6 = !-[1, ] && !window.XMLHttpRequest;
        if (isIE6 || ("Detail" == pageType && "Price" == subPageType) || ("Series" == pageType && "Param" == subPageType) || (typeof tplType !== "undefined" && tplType == "Svip")) {
            return
        }
        var tagTop = $("#tagNav").offset().top;
        var tempTop = tagTop + 34;
        var tagNav = $("#tagNav").clone(true);
        tagNav.attr("id", "tagNavClone").appendTo($("body"));
        var wrapFlag = false;
        (function () {
            var st = $(window).scrollTop();
            if (st > tempTop) {
                tagNav.wrap('<div id="fixedTagNav"></div>')
            }
        })();
        $(window).scroll(function () {
            var st = $(window).scrollTop();
            if (st < tempTop) {
                if (!wrapFlag) {
                    tagNav.unwrap('<div id="fixedTagNav"></div>');
                    wrapFlag = true
                }
            } else {
                if (wrapFlag) {
                    tagNav.wrap('<div id="fixedTagNav"></div>');
                    wrapFlag = false
                }
            }
        })
    };
    var CategoryNav = {
        categoryNavTrigger: $("#J_CategorySwitch"),
        categoryNavBox: $("#J_CategoryNavBox"),
        activateSubmenu: function (obj) {
            var items = $(obj);
            var panel = items.attr("data-panel");
            $("#J_CategoryNavBox").find("#" + panel).show();
            items.addClass("hover")
        },
        deactivateSubmenu: function (obj) {
            var items = $(obj);
            var panel = items.attr("data-panel");
            $("#J_CategoryNavBox").find("#" + panel).hide();
            items.removeClass("hover")
        },
        init: function () {
            var my = this;
            var categoryTimer = null;
            my.categoryNavTrigger.on({
                "mouseenter": function () {
                    if (categoryTimer) {
                        clearTimeout(categoryTimer)
                    }
                    $(this).parent().addClass("category-nav-open");
                    if (my.categoryNavBox.html() === "") {
                        var subcateNavUrl = getRewriteJsUrl("/index.php?c=AjaxVer3_Subcate&a=SubcateNav");
                        $.ajax({
                            type: "GET",
                            url: subcateNavUrl,
                            success: function (data) {
                                if (data) {
                                    my.categoryNavBox.html(data).show();
                                    my.categoryNavBox.find("#J_CategoryNavItem").menuAim({
                                        activate: my.activateSubmenu,
                                        deactivate: my.deactivateSubmenu
                                    })
                                }
                            }
                        })
                    } else {
                        my.categoryNavBox.show()
                    }
                },
                "mouseleave": function () {
                    var self = $(this);
                    categoryTimer = setTimeout(function () {
                        my.categoryNavBox.hide();
                        self.parent().removeClass("category-nav-open")
                    }, 50)
                }
            });
            my.categoryNavBox.on({
                "mouseenter": function () {
                    if (categoryTimer) {
                        clearTimeout(categoryTimer)
                    }
                },
                "mouseleave": function () {
                    var self = $(this);
                    categoryTimer = setTimeout(function () {
                        self.hide();
                        self.parent().removeClass("category-nav-open")
                    }, 50)
                }
            })
        },
        nav: function () {
            $("#J_HeadCateNav .onav").hover(function () {
                var self = $(this);
                $("#J_HeadCateNav .onav").removeClass("active");
                self.addClass("active");
                var closeButton = $(self).attr("data-rel").split("-")[2];
                $("#J_CloseSubList_" + closeButton).click(function () {
                    self.removeClass("active")
                })
            }, function () {
                $(this).removeClass("active")
            })
        },
        initNav: function (callback) {
            var self = this;
            if ($("#navigation").length !== 0) {
                $.ajax({
                    type: "GET",
                    url: getRewriteJsUrl("/index.php?c=AjaxVer3_Subcate&a=Nav"),
                    success: function (result) {
                        if (result) {
                            $("#navigation").html(result).show();
                            if (typeof callback !== "undefined" && $.isFunction(callback)) {
                                callback()
                            }
                            self.nav()
                        }
                    }
                })
            }
        }
    };
    CategoryNav.initNav(function () {
        Ceiling()
    });
    $(document).suggest({
        blurColor: "#999"
    });
    $.ajax({
        type: "GET",
        url: window.location.protocol + "//icon.zol-img.com.cn/public/js/search.js",
        dataType: "script",
        cache: true,
        success: function () {
            if ("Detail" == pageType && "Detail" == subPageType) {
                $("#keyword").zsuggest({
                    offsetX: -12,
                    offsetY: 8,
                    width: 419,
                    source: "pro",
                    isSuggest: false,
                    corp: {
                        subcateId: subcateId,
                        corp: 1
                    }
                })
            } else {
                $("#keyword").zsuggest({
                    offsetX: -12,
                    offsetY: 8,
                    width: 419,
                    source: "pro",
                    isSuggest: false
                })
            }
        }
    });
    $("#moreNav").hover(function () {
        $(this).addClass("more-nav-hover")
    }, function () {
        $(this).removeClass("more-nav-hover")
    });
    $(document).on("click", "#tagNav .ol-tmall", function () {
        Base.eventStat("detail_tagnav_tmall")
    });
    $(".top-ad-window").find(".ad-item").on({
        "mouseenter": function () {
            $(".ad-item").addClass("back");
            $(this).removeClass("back").addClass("hover")
        },
        "mouseleave": function () {
            $(".ad-item").removeClass("back");
            $(this).removeClass("hover")
        }
    });
    if (!(pageType === "Compare")) {
        window.__v3Compare = $(document).compare({
            subcateId: subcateId
        })
    }
    $("#J_CardCompare").on("click", function () {
        var _pro = $(this).attr("data-rel").split(",");
        var configArr = {
            proId: _pro[0],
            proName: _pro[1],
            url: _pro[2],
            pic: _pro[3],
            subcateId: _pro[4],
            addItem: true
        };
        $(this).compare(configArr)
    });
    var showcases = $(".top-ad-window .ad-item");
    $.each(showcases, function (i) {
        $(this).find("a").on("click", function () {
            Base.eventStat("top_showcase_ad" + (i + 1))
        })
    });
    var isIE = function (ver) {
        var b = document.createElement("b");
        b.innerHTML = "<!--[if IE " + ver + "]><i></i><![endif]-->";
        return b.getElementsByTagName("i").length === 1
    };
    $(window).on("load", function () {
        var AD_DriverBottom = $("#detail_index_driver_bottom");
        if (AD_DriverBottom.length && !isIE(6)) {
            var t = AD_DriverBottom.offset().top - 14;
            $(window).scroll(function () {
                var st = $(window).scrollTop();
                if (st < t) {
                    AD_DriverBottom.removeClass("driver_bottom_ad_fixed")
                } else {
                    AD_DriverBottom.addClass("driver_bottom_ad_fixed")
                }
            })
        }
    });
    if ($("#moreNav #navList").size() && typeof proId != "undefined") {
        $(function () {
            if (!userProvinceId) {
                var userProvinceId = parseInt($.cookie("userProvinceId"), 10);
                var userCityId = parseInt($.cookie("userCityId"), 10)
            }
            var url = "/index.php?c=AjaxVer3_Merchant&a=MerchantFenqi" + "&proId=" + proId + "&provinceId=" + userProvinceId + "&cityId=" + userCityId;
            $.ajax({
                url: getRewriteJsUrl(url),
                dataType: "html",
                success: function (data) {
                    if (data) {
                        $("#moreNav #navList").append('<a href="' + data + '" target="_blank">\u5206\u671f\u8d2d</a>')
                    }
                }
            })
        })
    }
    if ($("#navSolution").size() && typeof proId != "undefined") {
        $(function () {
            if (!userProvinceId) {
                var userProvinceId = parseInt($.cookie("userProvinceId"), 10);
                var userCityId = parseInt($.cookie("userCityId"), 10)
            }
            var url = "/index.php?c=AjaxVer3_Merchant&a=MerchantSolution" + "&proId=" + proId + "&provinceId=" + userProvinceId + "&cityId=" + userCityId;
            $.ajax({
                url: getRewriteJsUrl(url),
                dataType: "html",
                success: function (data) {
                    if (data) {
                        $("#navSolution").attr("href", data)
                    }
                }
            })
        });
        $("#navSolution").on("click", function () {
            Base.eventStat("detail_solution_nav_click")
        })
    }
    if (!$("#_j_has_activity").length && $(".zplus-mall .zplus-mall-true").size() && typeof proId != "undefined") {
        $(function () {
            if (!userProvinceId) {
                var userProvinceId = parseInt($.cookie("userProvinceId"), 10);
                var userCityId = parseInt($.cookie("userCityId"), 10)
            }
            var url = "/index.php?c=AjaxVer3_Online&a=GetZplusToOnline" + "&proId=" + proId + "&provinceId=" + userProvinceId + "&cityId=" + userCityId;
            $.ajax({
                url: getRewriteJsUrl(url),
                dataType: "json",
                success: function (data) {
                    if (data.url) {
                        $(".zplus-mall .zplus-mall-true").attr("href", data.url);
                        if (data.name) {
                            $(".zplus-mall .zplus-mall-true").html(data.name)
                        }
                    }
                }
            })
        })
    }
    if (typeof proId != "undefined") {
        $(function () {
            if (!userProvinceId) {
                var userProvinceId = parseInt($.cookie("userProvinceId"), 10);
                var userCityId = parseInt($.cookie("userCityId"), 10)
            }
            var url = "/index.php?c=AjaxVer3_SecHand&a=GetRepairEntrance" + "&proId=" + proId + "&provinceId=" + userProvinceId + "&cityId=" + userCityId;
            $.ajax({
                url: getRewriteJsUrl(url),
                dataType: "html",
                success: function (data) {
                    if (data) {
                        var insertHtml = '<li><a href="' + data + '" target="_ablank">\u7ef4\u4fee</a></li>';
                        if ($("#tagNav .nav li a[href*='ershou.shtml']").size() > 0) {
                            $("#tagNav .nav li a[href*='ershou.shtml']").parent().before(insertHtml)
                        } else {
                            if (typeof subPageType != "undefined" && subPageType == "SecHand") {
                                $(".used-tabs li[data-rel='tab_weixiu']").hide()
                            }
                            if ($("#tagNav .nav li").size() > 7) {
                                $("#tagNav .nav li").eq(7).before(insertHtml)
                            } else {
                                $("#tagNav .nav li").append(insertHtml)
                            }
                        }
                    }
                }
            })
        })
    }
    $(function () {
        var eventArr = ["1111", "shouji", "bijiben", "shuma"];
        $(".wrapper .promotion-banner .banner-container a").eq(0).click(function () {
            Base.eventStat("detail_top_promotion_banner_" + eventArr[0])
        });
        $(".wrapper .promotion-banner .banner-container a").eq(1).click(function () {
            Base.eventStat("detail_top_promotion_banner_1111_" + eventArr[1])
        });
        $(".wrapper .promotion-banner .banner-container a").eq(2).click(function () {
            Base.eventStat("detail_top_promotion_banner_1111_" + eventArr[2])
        });
        $(".wrapper .promotion-banner .banner-container a").eq(3).click(function () {
            Base.eventStat("detail_top_promotion_banner_1111_" + eventArr[3])
        })
    });
    $(".zplus-mall").on("click", ".promation-tag", function () {
        Base.eventStat("detail_nav_promotion_1111_tag")
    });
    $(".product-detail-box").on("click", ".btn-new-buy", function () {
        Base.eventStat("detail_new_buy_btn_1111_tcg")
    })
})(window.$ || window.jQuery);
(function ($) {
    function _1(e) {
        var _2 = $.data(e.data.target, "draggable").options;
        var _3 = e.data;
        var _4 = _3.startLeft + e.pageX - _3.startX;
        var _5 = _3.startTop + e.pageY - _3.startY;
        if (_2.deltaX != null && _2.deltaX != undefined) {
            _4 = e.pageX + _2.deltaX
        }
        if (_2.deltaY != null && _2.deltaY != undefined) {
            _5 = e.pageY + _2.deltaY
        }
        if (e.data.parnet != document.body) {
            if ($.boxModel == true) {
                _4 += $(e.data.parent).scrollLeft();
                _5 += $(e.data.parent).scrollTop()
            }
        }
        if (_2.axis == "h") {
            _3.left = _4
        } else {
            if (_2.axis == "v") {
                _3.top = _5
            } else {
                _3.left = _4;
                _3.top = _5
            }
        }
    }

    function _6(e) {
        var _7 = $.data(e.data.target, "draggable").options;
        var _8 = $.data(e.data.target, "draggable").proxy;
        if (_8) {
            _8.css("cursor", _7.cursor)
        } else {
            _8 = $(e.data.target);
            $.data(e.data.target, "draggable").handle.css("cursor", _7.cursor)
        }
        _8.css({
            left: e.data.left,
            top: e.data.top
        })
    }

    function _9(e) {
        var _a = $.data(e.data.target, "draggable").options;
        var _b = $(".droppable").filter(function () {
            return e.data.target != this
        }).filter(function () {
            var _c = $.data(this, "droppable").options.accept;
            if (_c) {
                return $(_c).filter(function () {
                    return this == e.data.target
                }).length > 0
            } else {
                return true
            }
        });
        $.data(e.data.target, "draggable").droppables = _b;
        var _d = $.data(e.data.target, "draggable").proxy;
        if (!_d) {
            if (_a.proxy) {
                if (_a.proxy == "clone") {
                    _d = $(e.data.target).clone().insertAfter(e.data.target)
                } else {
                    _d = _a.proxy.call(e.data.target, e.data.target)
                }
                $.data(e.data.target, "draggable").proxy = _d
            } else {
                _d = $(e.data.target)
            }
        }
        _d.css("position", "absolute");
        _1(e);
        _6(e);
        _a.onStartDrag.call(e.data.target, e);
        return false
    }

    function _e(e) {
        _1(e);
        if ($.data(e.data.target, "draggable").options.onDrag.call(e.data.target, e) != false) {
            _6(e)
        }
        var _f = e.data.target;
        $.data(e.data.target, "draggable").droppables.each(function () {
            var _10 = $(this);
            var p2 = $(this).offset();
            if (e.pageX > p2.left && e.pageX < p2.left + _10.outerWidth() && e.pageY > p2.top && e.pageY < p2.top + _10.outerHeight()) {
                if (!this.entered) {
                    $(this).trigger("_dragenter", [_f]);
                    this.entered = true
                }
                $(this).trigger("_dragover", [_f])
            } else {
                if (this.entered) {
                    $(this).trigger("_dragleave", [_f]);
                    this.entered = false
                }
            }
        });
        return false
    }

    function _11(e) {
        _1(e);
        var _12 = $.data(e.data.target, "draggable").proxy;
        var _13 = $.data(e.data.target, "draggable").options;
        if (_13.revert) {
            if (_14() == true) {
                _15();
                $(e.data.target).css({
                    position: e.data.startPosition,
                    left: e.data.startLeft,
                    top: e.data.startTop
                })
            } else {
                if (_12) {
                    _12.animate({
                        left: e.data.startLeft,
                        top: e.data.startTop
                    }, function () {
                        _15()
                    })
                } else {
                    $(e.data.target).animate({
                        left: e.data.startLeft,
                        top: e.data.startTop
                    }, function () {
                        $(e.data.target).css("position", e.data.startPosition)
                    })
                }
            }
        } else {
            $(e.data.target).css({
                position: "absolute",
                left: e.data.left,
                top: e.data.top
            });
            _15();
            _14()
        }
        _13.onStopDrag.call(e.data.target, e);

        function _15() {
            if (_12) {
                _12.remove()
            }
            $.data(e.data.target, "draggable").proxy = null
        }

        function _14() {
            var _16 = false;
            $.data(e.data.target, "draggable").droppables.each(function () {
                var _17 = $(this);
                var p2 = $(this).offset();
                if (e.pageX > p2.left && e.pageX < p2.left + _17.outerWidth() && e.pageY > p2.top && e.pageY < p2.top + _17.outerHeight()) {
                    if (_13.revert) {
                        $(e.data.target).css({
                            position: e.data.startPosition,
                            left: e.data.startLeft,
                            top: e.data.startTop
                        })
                    }
                    $(this).trigger("_drop", [e.data.target]);
                    _16 = true;
                    this.entered = false
                }
            });
            return _16
        }
        $(document).unbind(".draggable");
        return false
    }
    $.fn.draggable = function (_18) {
        if (typeof _18 == "string") {
            switch (_18) {
                case "options":
                    return $.data(this[0], "draggable").options;
                case "proxy":
                    return $.data(this[0], "draggable").proxy;
                case "enable":
                    return this.each(function () {
                        $(this).draggable({
                            disabled: false
                        })
                    });
                case "disable":
                    return this.each(function () {
                        $(this).draggable({
                            disabled: true
                        })
                    })
            }
        }
        return this.each(function () {
            var _19;
            var _1a = $.data(this, "draggable");
            if (_1a) {
                _1a.handle.unbind(".draggable");
                _19 = $.extend(_1a.options, _18)
            } else {
                _19 = $.extend({}, $.fn.draggable.defaults, _18 || {})
            }
            if (_19.disabled == true) {
                $(this).css("cursor", "default");
                return
            }
            var _1b = null;
            if (typeof _19.handle == "undefined" || _19.handle == null) {
                _1b = $(this)
            } else {
                _1b = (typeof _19.handle == "string" ? $(_19.handle, this) : _1b)
            }
            $.data(this, "draggable", {
                options: _19,
                handle: _1b
            });
            _1b.bind("mousedown.draggable", {
                target: this
            }, _1c);
            _1b.bind("mousemove.draggable", {
                target: this
            }, _1d);

            function _1c(e) {
                if (_1e(e) == false) {
                    return
                }
                var _1f = $(e.data.target).position();
                var _20 = {
                    startPosition: $(e.data.target).css("position"),
                    startLeft: _1f.left,
                    startTop: _1f.top,
                    left: _1f.left,
                    top: _1f.top,
                    startX: e.pageX,
                    startY: e.pageY,
                    target: e.data.target,
                    parent: $(e.data.target).parent()[0]
                };
                $(document).bind("mousedown.draggable", _20, _9);
                $(document).bind("mousemove.draggable", _20, _e);
                $(document).bind("mouseup.draggable", _20, _11)
            }

            function _1d(e) {
                if (_1e(e)) {
                    $(this).css("cursor", _19.cursor)
                } else {
                    $(this).css("cursor", "default")
                }
            }

            function _1e(e) {
                var _21 = $(_1b).offset();
                var _22 = $(_1b).outerWidth();
                var _23 = $(_1b).outerHeight();
                var t = e.pageY - _21.top;
                var r = _21.left + _22 - e.pageX;
                var b = _21.top + _23 - e.pageY;
                var l = e.pageX - _21.left;
                return Math.min(t, r, b, l) > _19.edge
            }
        })
    };
    $.fn.draggable.defaults = {
        proxy: null,
        revert: false,
        cursor: "move",
        deltaX: null,
        deltaY: null,
        handle: null,
        disabled: false,
        edge: 0,
        axis: null,
        onStartDrag: function (e) {},
        onDrag: function (e) {},
        onStopDrag: function (e) {}
    }
})(jQuery);
(function ($) {
    function _1(_2) {
        $(_2).addClass("droppable");
        $(_2).bind("_dragenter", function (e, _3) {
            $.data(_2, "droppable").options.onDragEnter.apply(_2, [e, _3])
        });
        $(_2).bind("_dragleave", function (e, _4) {
            $.data(_2, "droppable").options.onDragLeave.apply(_2, [e, _4])
        });
        $(_2).bind("_dragover", function (e, _5) {
            $.data(_2, "droppable").options.onDragOver.apply(_2, [e, _5])
        });
        $(_2).bind("_drop", function (e, _6) {
            $.data(_2, "droppable").options.onDrop.apply(_2, [e, _6])
        })
    }
    $.fn.droppable = function (_7) {
        _7 = _7 || {};
        return this.each(function () {
            var _8 = $.data(this, "droppable");
            if (_8) {
                $.extend(_8.options, _7)
            } else {
                _1(this);
                $.data(this, "droppable", {
                    options: $.extend({}, $.fn.droppable.defaults, _7)
                })
            }
        })
    };
    $.fn.droppable.defaults = {
        accept: null,
        onDragEnter: function (e, _9) {},
        onDragOver: function (e, _a) {},
        onDragLeave: function (e, _b) {},
        onDrop: function (e, _c) {}
    }
})(jQuery);
(function ($) {
    $(".J_HideSame").on("change", function () {
        $(this).parent().toggleClass("active");
        var rel = $(this).attr("data-rel");
        $('label[node-type="' + rel + '"]').toggleClass("active");
        if ($(this).attr("checked")) {
            $(".param-table tr.same").hide();
            $('label[node-type="' + rel + '"]').find("input").attr("checked", "checked")
        } else {
            $(".param-table tr.same").each(function (i) {
                var className = $.trim($(this).attr("class").replace("same", ""));
                if ($('label[node-type="onlyMarked"]').hasClass("active")) {
                    $(".marked").parent("tr").show().siblings(".data-core-param").hide()
                } else {
                    if ($('label[node-type="keyParameter"]').hasClass("active")) {
                        $(".data-core-param").show()
                    } else {
                        $(".data-core-param").show();
                        if ($('tr.hover-disabled[data-rel="' + className + '"]').hasClass("cate-item-on")) {
                            $(this).find("td").css("visibility", "visible");
                            $(this).show()
                        } else {
                            if ($(this).find(".marked").length != 0) {
                                $(this).find("td:not(.marked)").css("visibility", "hidden");
                                $(this).show()
                            }
                        }
                    }
                }
            });
            $('label[node-type="' + rel + '"]').find("input").removeAttr("checked")
        }
    });
    $(function () {
        var hash = window.location.hash;
        if (hash === "#version") {
            $(".J_HideSame").attr("checked", "checked");
            $(".J_HideSame").parent().addClass("active");
            setTimeout(function () {
                $(".param-table tr.same").hide()
            }, 1)
        }
    });
    $(".J_OnlyMarked").on("change", function () {
        $(this).parent().toggleClass("active");
        rel = $(this).attr("data-rel");
        $('label[node-type="' + rel + '"]').toggleClass("active");
        if ($(this).attr("checked")) {
            window.ZUI.Count.eventCount("pc_contrast_selection");
            $('label[node-type="' + rel + '"]').find("input").attr("checked", "checked");
            var cateItem = [];
            $('.param-table tr:not(".hover-disabled,.produce-pic,.product-choose,.product-name")').each(function () {
                var allMark = $(this).find(".marked");
                if ($('label[node-type="keyParameter"]').hasClass("active")) {
                    $(".same:not(.trShow)").hide()
                }
                if (allMark.length === 0) {
                    $(this).hide();
                    var id = $(this).attr("data-rel-num");
                    if (id) {
                        if ($.inArray(id, cateItem) === -1) {
                            cateItem.push(id)
                        }
                    }
                } else {
                    $(this).find("td:not(.marked)").css("visibility", "hidden")
                }
            });
            for (var i = 0; i < cateItem.length; i++) {
                $("#param_list_" + cateItem[i]).removeClass("cate-item-on")
            }
        } else {
            $('label[node-type="' + rel + '"]').find("input").removeAttr("checked");
            $('.param-table tr:not(".hover-disabled,.produce-pic,.product-choose,.product-name")').each(function () {
                if ($('label[node-type="keyParameter"]').hasClass("active")) {
                    $(".data-core-param").show();
                    $(".data-core-param").find("td:not(.marked)").css("visibility", "visible")
                } else {
                    var id = $(this).attr("data-rel-num");
                    if (id) {
                        $("#param_list_" + id).addClass("cate-item-on")
                    }
                    $(this).find("td").css("visibility", "visible");
                    $(this).show()
                }
            });
            if ($("#hide-same").attr("checked")) {
                $(".param-table tr.same").hide()
            }
        }
    });
    $(".J_HideOptimal").on("change", function () {
        $(this).parent().toggleClass("active");
        var rel = $(this).attr("data-rel");
        $('label[node-type="' + rel + '"]').toggleClass("active");
        if (!$(this).attr("checked")) {
            $('label[node-type="' + rel + '"]').find("input").attr("checked", "checked");
            var cateItem = [];
            $('.param-table tr:not(".hover-disabled,.produce-pic,.product-choose,.product-name")').each(function () {
                var allOptimal = $(this).find(".optimal");
                if (allOptimal.length === 0) {
                    $(".optimal").addClass("bgColor")
                }
            });
            for (var i = 0; i < cateItem.length; i++) {
                $("#param_list_" + cateItem[i]).removeClass("cate-item-on")
            }
        } else {
            $('label[node-type="' + rel + '"]').find("input").removeAttr("checked");
            $('.param-table tr:not(".hover-disabled,.produce-pic,.product-choose,.product-name")').each(function () {
                $(".optimal").removeClass("bgColor")
            })
        }
    });
    $(".J_KeyParameter").on("change", function () {
        $(this).parent().toggleClass("active");
        var rel = $(this).attr("data-rel");
        $('label[node-type="' + rel + '"]').toggleClass("active");
        if ($(this).attr("checked")) {
            $('label[node-type="' + rel + '"]').find("input").attr("checked", "checked");
            var cateItem = [];
            $('.param-table tr:not("#param_list_1,#btnMove,.produce-pic,.product-choose,.product-name")').each(function () {
                $("#param_list_1").find("strong").html("\u91cd\u8981\u53c2\u6570");
                $("#param_list_1").addClass("nodisabled");
                var allOptimal = $(".data-core-param");
                if ($('label[node-type="hideSame"]').hasClass("active")) {
                    $(".same").hide()
                }
                if ($('label[node-type="onlyMarked"]').hasClass("active")) {
                    $(".data-core-param:not(.trShow)").hide()
                }
                if ($('label[node-type="keyParameter"]').hasClass("active")) {
                    $(this).find("td:not(.marked)").css("visibility", "visible")
                }
                if (allOptimal.length === 0) {
                    $(this).hide()
                } else {
                    if ($(this).hasClass("data-core-param")) {
                        $(this).show()
                    } else {
                        $(this).hide()
                    }
                }
            });
            for (var i = 0; i < cateItem.length; i++) {
                $("#param_list_" + cateItem[i]).removeClass("cate-item-on")
            }
        } else {
            $("#param_list_1").removeClass("nodisabled");
            $('label[node-type="' + rel + '"]').find("input").removeAttr("checked");
            $('.param-table tr:not("#param_list_1,#btnMove,.produce-pic,.product-choose,.product-name")').each(function () {
                $("#param_list_1").find("strong").html("<i></i>\u57fa\u672c\u53c2\u6570");
                $(this).show()
            });
            if ($("#hide-same").attr("checked")) {
                $(".param-table tr.same").hide()
            }
        }
    });
    $(".move-btn span.change").on("click", function () {
        var index = $(this).parents("td").index();
        exChange(index, index + 1)
    });
    var Compare = {
        getUrl: function () {
            var url = window.location.pathname;
            url = url.split(".");
            var urlArr = url[0].split("_");
            var haveExtra = url[0].match(/\d+_\d+/g);
            if (haveExtra != null) {
                urlArr[2] = urlArr.slice(2).join("_")
            }
            return urlArr
        },
        getDefaultCompareId: function () {
            var urlArr = this.getUrl();
            var proIdStr = urlArr[2];
            var proIdArr = proIdStr.split("-");
            return proIdArr
        },
        addNewLink: function (id) {
            var urlArr = this.getUrl();
            var proIdArr = this.getDefaultCompareId();
            if (proIdArr.length === 1 && proIdArr[0].indexOf("subcate") !== -1) {
                proIdArr = []
            }
            var link = "";
            if ($.inArray(id, proIdArr) === -1) {
                proIdArr.push(id);
                var newProIdStr = proIdArr.join("-");
                link = urlArr[0] + "_" + urlArr[1] + "_" + newProIdStr + ".html"
            } else {
                link = "javascript:void(0);"
            }
            return link
        },
        replaceLink: function (newId, oldId) {
            var urlArr = this.getUrl();
            var proIdArr = this.getDefaultCompareId();
            var proIdStr = proIdArr.join("-");
            proIdStr = proIdStr.replace(oldId, newId);
            var link = urlArr[0] + "_" + urlArr[1] + "_" + proIdStr + ".html";
            return link
        },
        setList: function (data, id) {
            var me = this;
            var selectTitList = "";
            var brandFirstWord = "";
            var brandSelectStr = "";
            var brandContent = "";
            var proIdArr = this.getDefaultCompareId();
            var contentXilie = "";
            var contentXinghao = "";
            var listHtml = "";
            var checkExistsStr = id ? "node-type='J_ManuProList_" + id + "'" : "";
            if (data.manuSelectList) {
                brandFirstWord += '<div class="brand-index">';
                selectTitList += '<li><a href="javascript:void(0)" target="_self" class="name" data-type="brandTitle">\u54c1\u724c</a></li>';
                brandContent += '<div class="select-dl" data-type="brand"><dd class="town-btn" >';
                $.each(data.manuSelectList, function (key, value) {
                    if (key == "others") {
                        key = "#"
                    }
                    if (key == 0) {
                        key = "\u70ed\u95e8\u54c1\u724c";
                        brandFirstWord += '<a href="javascript:void(0);" target="_self">' + "\u70ed" + "</a>"
                    } else {
                        brandFirstWord += '<a href="javascript:void(0);" target="_self">' + key + "</a>"
                    }
                    brandContent += '<dl class="town-con-dl"><dt>' + key + '</dt><dd class="town-btn" >';
                    $.each(value, function (k, v) {
                        brandContent += '<a href="javascript:void(0);" data-key="' + v.id + '">' + v.name + "</a>"
                    });
                    brandContent += "</dd></dl>"
                });
                brandContent += "</div>";
                brandFirstWord += "</div>";
                brandSelectStr = '<div class="box-content-dl box-content-brand" style="display: none;">' + brandFirstWord + brandContent + "</div>"
            }
            if (data.seriesProList) {
                var flag = data.proListArr ? 'style="display: none;"' : 'style="display: block;"';
                var flagOn = data.proListArr ? "" : "on";
                contentXilie = '<div class="box-content-dl box-content-xilie" ' + flag + ' > <div class="select-dl" ' + checkExistsStr + ' data-type="series"><dl class="town-hd"><dd class="town-btn">';
                selectTitList += '<li class="' + flagOn + '"><span class="ge">&gt;</span><a href="javascript:void(0)" target="_self" class="name" data-type="seriesTitle">\u7cfb\u5217</a></li>';
                $.each(data.seriesProList, function (key, value) {
                    if (value.isSeries == 1) {
                        contentXilie += '<a target="_self" href="javascript:void(0)" data-sale="' + value.proName + '" data-key="' + value.proId + '" data-text="' + value.proName + '">' + value.proName + "</a>"
                    } else {
                        var link = "";
                        if (typeof id === "undefined") {
                            link = me.addNewLink(value.proId)
                        } else {
                            link = me.replaceLink(value.proId, id)
                        }
                        var alreadyExistsClass = "";
                        if ($.inArray(value.proId, proIdArr) !== -1) {
                            alreadyExistsClass = ' class="already-exists"'
                        }
                        contentXilie += "<a " + alreadyExistsClass + ' target="_self" href="' + link + '" data-sale="' + value.proName + '" data-key="' + value.proId + '" data-text="' + value.proName + '">' + value.proName + "</a>"
                    }
                });
                contentXilie += "</dd></dl></div></div>"
            }
            if (data.proListArr) {
                contentXinghao = '<div class="box-content-dl box-content-xinghao" id="type_id" style="display: block;"><div class="select-dl" ' + checkExistsStr + ' data-type="spec"><dl class="town-hd"><dd class="town-btn">';
                selectTitList += '<li class="on"><span class="ge">&gt;</span><a href="javascript:void(0)" target="_self" class="name" data-type="specTitle">\u578b\u53f7</a></li>';
                $.each(data.proListArr, function (key, value) {
                    var link = "";
                    if (typeof id === "undefined") {
                        link = me.addNewLink(value.proId)
                    } else {
                        link = me.replaceLink(value.proId, id)
                    }
                    var alreadyExistsClass = "";
                    if ($.inArray(value.proId, proIdArr) !== -1) {
                        alreadyExistsClass = ' class="already-exists"'
                    }
                    contentXinghao += '<a target="_self" ' + alreadyExistsClass + ' href="' + link + '" data-sale="' + value.proName + '" data-key="' + value.proId + '" data-text="' + value.proName + '"><span class="price">' + value.price + "</span>" + value.proName + "</a>"
                });
                contentXinghao += "</dd></dl></div></div>"
            }
            listHtml = '<div class="select-box-title"><ul>' + selectTitList + "</ul></div>" + '<div class="select-box-content">' + brandSelectStr + contentXilie + contentXinghao + "</div>";
            return listHtml
        }
    };
    var delPro = function (index, isSeries) {
        var proIdArr = Compare.getDefaultCompareId();
        var proIdNum = proIdArr.length;
        if (proIdNum < 1) {
            alert("\u4e0d\u80fd\u518d\u5220\u9664\u4e86");
            return
        }
        var delIndex = index;
        if (proIdNum > 2) {
            var tempProId = proIdArr[index];
            proIdArr.sort();
            $.each(proIdArr, function (i, item) {
                if (item == tempProId) {
                    delIndex = i
                }
            })
        }
        if (proIdNum > 5) {
            proIdNum = 5
        }
        var k = 0,
            newProIdStr = "";
        for (var j = 0; j < proIdNum; j++) {
            if (j !== delIndex) {
                if (0 === k) {
                    newProIdStr = proIdArr[j]
                } else {
                    newProIdStr += "-" + proIdArr[j]
                }
                k++
            }
        }
        var urlArr = Compare.getUrl();
        var comSub = false;
        if (newProIdStr == "") {
            newProIdStr = "subcate" + subcateId;
            comSub = true
        }
        var link = urlArr[0] + "_" + urlArr[1] + "_" + newProIdStr + ".html";
        var proStr = newProIdStr.split("-").join(",");
        if (subcateId && !comSub) {
            $.cookie("comp_pro_" + subcateId, proStr, {
                domain: ".zol.com.cn"
            })
        }
        window.location.href = link
    };
    $('.move-btn span[data-role="del"]').on("click", function () {
        var index = $('.move-btn span[data-role="del"]').index(this);
        var isSeries = parseInt($(this).attr("data-series"));
        delPro(index, isSeries)
    });
    $('.move-btn span[data-role="fixed_del"]').on("click", function () {
        var index = $('.move-btn span[data-role="fixed_del"]').index(this);
        var isSeries = parseInt($(this).attr("data-series"));
        delPro(index, isSeries)
    });
    $(".cate-tr").click(function () {
        if (!$(this).hasClass("nodisabled")) {
            $(this).toggleClass("cate-item-on");
            var moreClassName = $(this).attr("data-rel");
            if ($(this).hasClass("cate-item-on")) {
                $("." + moreClassName).show()
            } else {
                $("." + moreClassName).hide()
            }
        }
    });
    $(document).on("mouseenter", ".product-choose .select-item", function (e) {
        e.stopPropagation();
        $(".product-choose .select-item").removeClass("select-item-hover");
        if (!$(this).hasClass("select-disabled") && !$(this).hasClass("select-item-on")) {
            $(this).addClass("select-item-hover")
        }
    });
    $(document).on("mouseleave", ".product-choose .select-item", function () {
        var self = $(this);
        self.removeClass("select-item-hover")
    });
    $(document).on("click", ".select-trigger", function (e) {
        var self = $(this);
        e.stopPropagation();
        if (self.parent().hasClass("select-disabled")) {
            return
        }
        if (!self.parent().hasClass("select-item-empty")) {
            $(".select-item").each(function () {
                $(".select-item").removeClass("select-item-on")
            });
            self.parent().addClass("select-item-on").removeClass("select-item-hover")
        } else {
            alert("\u8bf7\u5148\u9009\u62e9\u54c1\u724c")
        }
        var subcateCompare = (proIdStr == "" && subcateId != "") ? 1 : 0;
        if (subcateCompare) {
            self.parent().find(".select-option .select-box-title ul li").removeClass("on").hide().eq(0).show().addClass("on");
            self.parent().find(".select-option .select-box-content .box-content-dl").hide().eq(0).show()
        }
        if (self.parent().hasClass("select-item-add") && !subcateCompare) {
            var manuId = self.parent(".select-item").attr("data-manuid");
            var proId = self.parent(".select-item").attr("data-proid");
            var replaceProId = self.parent(".select-item").attr("data-replace-proid");
            getProListByManu(manuId, subcateId, proId, replaceProId, function (data) {
                var list = "";
                list = Compare.setList(data);
                self.siblings(".select-option").html(list)
            })
        }
    });
    $(document).on("click", ".select-option", function (e) {
        e.stopPropagation()
    });
    $(document).on("click", function () {
        $(".product-choose .select-item").removeClass("select-item-hover, select-item-on")
    });
    $(".product-choose .select-item").each(function (i, ele) {
        $(ele).delegate(".select-box-title li", "click", function () {
            fnTitle($(this))
        });
        $(ele).delegate(".box-content-brand .town-con-dl a", "click", function () {
            conAlinkList($(this), 1);
            var dataKey = $(this).attr("data-key");
            $(this).parents(".select-item").attr("data-manuid", dataKey);
            $(this).parents(".select-item").attr("data-proid", "")
        });
        $(ele).delegate(".box-content-xilie a", "click", function () {
            conAlinkList($(this), 2);
            var dataKey = $(this).attr("data-key");
            $(this).parents(".select-item").attr("data-proid", dataKey)
        });
        $(ele).delegate(".box-content-xinghao a", "click", function () {
            $(this).closest(".select-item").removeClass("select-item-on");
            var thisContent = $(this).html();
            $(this).parents(".select-item").find(".select-trigger").html(thisContent.replace(/\<span(\sclass\=\S*)*\>\S*\<\/span\>/g, ""))
        })
    });
    var getProListByManu = function (manuId, subcateId, proId, replaceProId, callback) {
        var url = getRewriteJsUrl("/index.php?c=AjaxVer3_Compare&a=GetCompParamSelectList&manuId=" + manuId + "&subcateId=" + subcateId + "&proId=" + proId);
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function (data) {
                if (data.status) {
                    callback(data)
                }
            }
        })
    };
    var manuBoxList = $(".select-item");
    $.each(manuBoxList, function () {
        if ($(this).hasClass("select-disabled")) {
            return
        }
        var self = $(this);
        var manuId = $(this).attr("data-manuid");
        var proId = $(this).attr("data-proid");
        var replaceProId = $(this).attr("data-replace-proid");
        getProListByManu(manuId, subcateId, proId, replaceProId, function (data) {
            var list = Compare.setList(data, replaceProId);
            self.find(".select-option").html(list)
        })
    });
    $(document).on("click", ".town-con-dl a", function (e) {
        e.stopPropagation();
        var self = $(this);
        var manuId = self.attr("data-key");
        var proListBox = self.parents(".box-content-dl").next().find(".box-content-dl");
        var proId = self.parents(".select-item").attr("data-proid");
        var replaceProId = self.parents(".select-item").attr("data-replace-proid");
        var text = self.attr("title");
        self.parents(".select-item").find(".select-trigger").text(text);
        getProListByManu(manuId, subcateId, proId, replaceProId, function (data) {
            self.parents(".select-item").next().find(".select-trigger").text("\u8bf7\u9009\u62e9\u578b\u53f7");
            var list = "";
            if (replaceProId) {
                list = Compare.setList(data, replaceProId)
            } else {
                list = Compare.setList(data)
            }
            self.parents(".select-option").html(list).removeAttr("id")
        })
    });
    $(document).on("click", ".town-btn a", function (e) {
        e.stopPropagation();
        var self = $(this);
        var proId = self.attr("data-key");
        var replaceProId = self.parents(".select-item").attr("data-replace-proid");
        var proListBox = self.parents(".box-content-dl").next().find(".box-content-dl");
        var manuId = self.parents(".select-item").attr("data-manuid");
        if (self.hasClass("already-exists")) {
            alert("\u5bf9\u6bd4\u6846\u91cc\u5df2\u7ecf\u6709\u8fd9\u6b3e\u4ea7\u54c1\u4e86\uff0c\u6362\u4e00\u4e2a\u5427")
        }
        var text = self.attr("title");
        self.parents(".select-item").find(".select-trigger").text(text);
        getProListByManu(manuId, subcateId, proId, replaceProId, function (data) {
            self.parents(".select-item").next().find(".select-trigger").text("\u8bf7\u9009\u62e9\u578b\u53f7");
            var list = "";
            if (replaceProId) {
                list = Compare.setList(data, replaceProId)
            } else {
                list = Compare.setList(data)
            }
            self.parents(".select-option").html(list).removeAttr("id")
        })
    });
    $(document).on("click", 'div[node-type^="J_ManuProList_"] a', function (e) {
        if ($(this).hasClass("already-exists")) {
            e.preventDefault();
            alert("\u5bf9\u6bd4\u6846\u91cc\u5df2\u7ecf\u6709\u8fd9\u6b3e\u4ea7\u54c1\u4e86\uff0c\u6362\u4e00\u4e2a\u5427")
        } else {
            var url = $(this).attr("href"),
                urlArr = Compare.getUrl();
            if (url != "javascript:void(0)") {
                url = url.split(urlArr[0] + "_" + urlArr[1] + "_")[1].split(".html")[0].split("-");
                var proStr = url.join(",");
                if (subcateId) {
                    $.cookie("comp_pro_" + subcateId, proStr, {
                        domain: ".zol.com.cn"
                    })
                }
            }
        }
    });
    $('.param-table tr:not(".hover-disabled,.produce-pic,.product-choose,.product-name") td').on("click", function () {
        if ($(this).hasClass("marked")) {
            $(this).removeClass("marked")
        } else {
            if (!$(this).hasClass("unavailable")) {
                $(this).addClass("marked");
                $(this).parent("tr").addClass("trShow");
                $('label[node-type="onlyMarked"]').removeClass("active")
            } else {
                $(this).parent("tr").removeClass("trShow")
            }
        }
    });
    $('.param-table tr:not(".hover-disabled,.produce-pic,.product-choose,.product-name") td a').on("click", function (e) {
        e.stopPropagation()
    });
    $('.param-table tr:not(".hover-disabled,.produce-pic,.product-choose,.product-name") td').hover(function () {
        if (!$(this).hasClass("unavailable")) {
            $(this).addClass("hov")
        }
    }, function () {
        $(this).removeClass("hov")
    });
    $('.param-table tr:not(".hover-disabled,.produce-pic,.product-choose,.product-name")').hover(function () {
        $(this).addClass("tr-hover")
    }, function () {
        $(this).removeClass("tr-hover")
    });
    $(function () {
        if ($(".series-param-item").length === 0) {
            return
        }
        $(document).on("mouseenter", ".series-param-item", function () {
            $(this).css("z-index", 5);
            $(this).find(".series-list-box").show()
        });
        $(document).on("mouseleave", ".series-param-item", function () {
            $(this).css("z-index", 1);
            $(this).find(".series-list-box").hide()
        })
    });
    if (typeof proId !== "undefined" && proId !== "") {
        $(window).on("scroll", function () {
            var tempTop = $(".navbox-new,.nav-tab").offset().top;
            tempTop = tempTop + 225;
            if ($(window).scrollTop() > tempTop) {
                $("div.fixed-table").show()
            } else {
                $("div.fixed-table").hide()
            }
        })
    }
    $("img").picLoad({
        checkShow: true
    });
    $(function () {
        var anchorHeader = $('[data-anchor="1"]');
        if (anchorHeader.length <= 2 || document.body.offsetWidth < 1480) {
            return
        }
        var anchorArr = [];
        $.each(anchorHeader, function (i) {
            $(this).attr("id", "s-" + i);
            var text = $(this).text();
            text = $.trim(text);
            anchorArr.push(text)
        });
        var items = "";
        var len = anchorArr.length;
        for (var i = 0; i < len; i++) {
            var currentClass = (i === 0) ? ' class="active"' : "";
            items += "<li" + currentClass + '><span><a href="#s-' + i + '" target="_self">' + anchorArr[i] + "</a></span></li>"
        }
        var itemNum = len - 1;
        var scrollClass = (itemNum > 12) ? " side-anchor-menu-scroll" : "";
        var scrollButton = "";
        var sideMenu = ['<div id="sideAnchorMenu" class="side-anchor-menu">', '<div class="side-anchor-menu-box">', '<div id="sideAnchorMenuScroll" class="side-anchor-menu-box-inner' + scrollClass + '">', '<ul id="sideAnchorMenuList">', items, "</ul></div></div>", "</div>"].join("");
        if (itemNum >= 2) {
            $("body").append(sideMenu)
        }
        var sideAnchorScrollBox = $("#sideAnchorMenuScroll");
        var menuScrollTop = sideAnchorScrollBox.scrollTop();
        var sideAnchorScroll = function (step, callback) {
            var scrollButton = $("#sideAnchorMenuScrollBtn");
            if (scrollButton.length === 0) {
                return
            }
            var prev = scrollButton.find("div").eq(0);
            var next = scrollButton.find("div").eq(1);
            var contentH = $("#sideAnchorMenu").height();
            menuScrollTop += (30 * step);
            sideAnchorScrollBox.animate({
                scrollTop: menuScrollTop
            }, 300, function () {
                var st = $(this).scrollTop();
                if (st == 0) {
                    prev.attr("class", "side-anchor-menu-up-disabled");
                    next.attr("class", "side-anchor-menu-down")
                } else {
                    if (st >= contentH - 30 * 8) {
                        next.attr("class", "side-anchor-menu-down-disabled");
                        prev.attr("class", "side-anchor-menu-up")
                    } else {
                        prev.attr("class", "side-anchor-menu-up");
                        next.attr("class", "side-anchor-menu-down")
                    }
                }
                if (typeof (callback) !== "undefined" && $.isFunction(callback)) {
                    callback()
                }
                menuScrollTop = sideAnchorScrollBox.scrollTop()
            })
        };
        $(document).on("click", "#sideAnchorMenuScrollBtn .side-anchor-menu-down", function () {
            sideAnchorScroll(2)
        });
        $(document).on("click", "#sideAnchorMenuScrollBtn .side-anchor-menu-up", function () {
            sideAnchorScroll(-2)
        });
        if ($("#sideAnchorMenuScrollBtn").length !== 0) {
            $("#sideAnchorMenu").on("mouseenter", function () {
                $("#sideAnchorMenuScrollBtn").show()
            });
            $("#sideAnchorMenu").on("mouseleave", function () {
                $("#sideAnchorMenuScrollBtn").hide()
            })
        }
        var lock = false;
        $("#sideAnchorMenu a").on("click", function (e) {
            e.preventDefault();
            lock = true;
            var self = $(this);
            var sideAnchorMenu = $("#sideAnchorMenu");
            sideAnchorMenu.find("li").removeClass("active");
            self.parent().parent().addClass("active");
            var index = self.attr("href").split("-").pop();
            var st = sideAnchorMenu.scrollTop();
            var step = index - 3 - parseInt(st / 30);
            sideAnchorScroll(step);
            var target = self.attr("href");
            var top = $(target).offset().top - 187 - 24 * index;
            if (!$(target).parent().hasClass("cate-item-on")) {
                $(target).click()
            }
            $("html,body").animate({
                "scrollTop": top
            }, function () {
                lock = false
            });
            if (subPageType == "param") {
                Base.eventStat("compare_param_side_anchor_menu")
            } else {
                if (subPageType == "picture") {
                    Base.eventStat("compare_picture_side_anchor_menu")
                } else {
                    if (subPageType == "review") {
                        Base.eventStat("compare_review_side_anchor_menu")
                    }
                }
            }
        });
        var sectionAnchorOffsetArr = [];
        $.each(anchorHeader, function (index) {
            var top = $(this).offset().top - 187 - 24 * index;
            sectionAnchorOffsetArr.push(top)
        });
        var scrollTimer = null;
        $(window).scroll(function () {
            if (lock) {
                return
            }
            var st = $(window).scrollTop();
            if (st > sectionAnchorOffsetArr[0] - 150) {
                $("#sideAnchorMenu").show()
            } else {
                $("#sideAnchorMenu").hide()
            }
            var current = null;
            for (var i = 0; i < len; i++) {
                if (st >= sectionAnchorOffsetArr[i]) {
                    current = $("#sideAnchorMenuList").find("a[href=#s-" + i + "]")
                }
                if (st < sectionAnchorOffsetArr[0]) {
                    current = $("#sideAnchorMenuList").find("a[href=#s-0]")
                }
                $("#sideAnchorMenuList li").removeClass("active");
                current.parent().parent().addClass("active")
            }
            var navScrollTop = $("#sideAnchorMenuScroll").scrollTop();
            var index = current.attr("href").split("-").pop();
            var step = index - 3 - parseInt(navScrollTop / 30);
            if (scrollTimer) {
                clearTimeout(scrollTimer);
                scrollTimer = null
            }
            scrollTimer = setTimeout(function () {
                sideAnchorScroll(step)
            }, 250)
        })
    });
    $("[data-event]").on("click", function (e) {
        var eventName = $(this).attr("data-event");
        if (!eventName || eventName == "" || typeof eventName == "undefined") {
            return
        }
        window.ZUI.Count.eventCount(eventName)
    });
    $(".select-item").each(function () {
        var $this = $(this);
        $this.delegate(".brand-index a", "click", function () {
            var index = $(this).index();
            var thisHeight = $(this).parent(".brand-index").siblings(".select-dl").find("dt").eq(index).offset().top - $(this).parent(".brand-index").siblings(".select-dl").find("dt").eq(0).offset().top;
            $this.find(".select-dl").scrollTop(thisHeight)
        })
    })
})(window.$ || window.jQuery);

function exChange(index1, index2) {
    var targetTd, originalTd;
    $(".commpare-table tr").each(function (i, eleTd) {
        if ($(this).attr("id") != "btnMove") {
            targetTd = $(eleTd).find("td").eq(index1);
            originalTd = $(eleTd).find("td").eq(index2);
            exchangeItems(originalTd, targetTd)
        }
    })
}

function exchangeItems(sourceItem, targetItem) {
    var temp = $("<div>");
    temp.insertBefore(targetItem);
    targetItem.insertBefore(sourceItem);
    sourceItem.insertBefore(temp);
    temp.remove()
}

function fnTitle(obj) {
    var index = obj.index();
    obj.addClass("on").siblings().removeClass("on");
    if (index == 1) {
        obj.parent().find("li").eq(2).hide();
        obj.parents(".select-option").find(".select-box-content .box-content-dl").eq(1).show().siblings().hide()
    } else {
        if (index == 0) {
            obj.parent().find("li").eq(2).hide();
            obj.parent().find("li").eq(1).hide();
            obj.parents(".select-option").find(".select-box-content .box-content-dl").eq(0).show().siblings().hide()
        }
    }
}

function conAlinkList(obj, index) {
    obj.parents(".select-option").find(".select-box-title li").eq(index).show().addClass("on").siblings().removeClass("on");
    obj.parents(".box-content-dl").hide().next().html("");
    obj.parents(".box-content-dl").hide().next().show()
};