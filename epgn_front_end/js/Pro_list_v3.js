function setPostion() {
    $(function () {
        if ($("#J_ParamFilter").length !== 0) {
            if (scroll === "1") {
                $("#J_ParamFilter").ScrollTo(500)
            }
        }
    })
}

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
(function ($) {
    $.fn.lazyTab = function (options) {
        var defaults = {
            norCss: "",
            actCss: "",
            tm: 200,
            mouseEvent: 0,
            hasTextarea: 0
        };
        var options = $.extend(defaults, options);
        var nor = options.norCss;
        var act = options.actCss;
        var mouseEvent = options.mouseEvent;
        var tm = mouseEvent == 1 ? 1 : options.tm;
        var flag = options.hasTextarea;
        var navi_over = "",
            actCls = "";
        var doShow = function (self) {
            navi_over = setTimeout(function () {
                if ($(self) == null || $(self).attr("data-rel") == null) {
                    return
                }
                if ($(self).hasClass(nor) || !$(self).hasClass(act)) {
                    if (act) {
                        actCls = "." + act
                    } else {
                        actCls = '[class="' + act + '"]'
                    }
                    var act_navi = $(self).siblings(actCls);
                    if (act) {
                        act_navi.removeClass(act)
                    }
                    if (nor) {
                        act_navi.addClass(nor)
                    }
                    var rel_div = act_navi.attr("data-rel");
                    $("#" + rel_div).hide();
                    var now_div = $(self).attr("data-rel");
                    if (nor) {
                        $(self).removeClass(nor)
                    }
                    if (act) {
                        $(self).addClass(act)
                    }
                    if (flag) {
                        $("#" + now_div).getLazyArea()
                    }
                    $("#" + now_div).show()
                }
            }, tm)
        };
        if (mouseEvent == 1) {
            $(this).children().click(function () {
                if (navi_over) {
                    clearTimeout(navi_over)
                }
                doShow(this)
            })
        } else {
            $(this).children().mouseover(function () {
                doShow(this)
            }).mouseout(function () {
                if (navi_over) {
                    clearTimeout(navi_over)
                }
            })
        }
        $(this).children().mouseout(function () {
            if (navi_over) {
                clearTimeout(navi_over)
            }
        })
    };
    $.fn.autoTab = function (options) {
        var defaults = {
            norCss: "",
            actCss: "",
            tm: 200,
            hasTextarea: 0,
            contentSel: false
        };
        var options = $.extend(defaults, options);
        var nor = options.norCss;
        var act = options.actCss;
        var tm = options.tm;
        var flag = options.hasTextarea;
        var contentSel = options.contentSel;
        var self = this;
        var actCls;

        function navi_auto() {
            if (act) {
                actCls = "." + act
            } else {
                actCls = '[class="' + act + '"]'
            }
            var act_navi = $(self).children(actCls);
            if (act) {
                act_navi.removeClass(act)
            }
            if (nor) {
                act_navi.addClass(nor)
            }
            var rel_div = act_navi.attr("data-rel");
            if (!rel_div) {
                return
            }
            $("#" + rel_div).hide();
            while (1) {
                var next_navi = act_navi.next();
                if (next_navi.html() == null) {
                    next_navi = $(self).children().eq(0)
                }
                act_navi = next_navi;
                if (next_navi.attr("data-rel")) {
                    break
                }
            }
            if (nor) {
                next_navi.removeClass(nor)
            }
            if (act) {
                next_navi.addClass(act)
            }
            var next_div = next_navi.attr("data-rel");
            if (flag) {
                $("#" + next_div).getLazyArea()
            }
            $("#" + next_div).show()
        }
        var auto_navi = setInterval(navi_auto, tm);
        var contentBoxArr = [];
        $.each($(this).children(), function () {
            contentBoxArr.push("#" + $(this).attr("data-rel"))
        });
        contentBoxArr.push("#" + $(this).attr("id"));
        var contentBox = contentBoxArr.join(", ");
        if (contentSel) {
            $(contentBox).hover(function () {
                clearInterval(auto_navi)
            }, function () {
                auto_navi = setInterval(navi_auto, tm)
            })
        }
    };
    $.fn.getLazyArea = function () {
        var lazyarea = $(this).children("textarea");
        if (lazyarea.length == 1) {
            lazyarea.hide();
            var lazyhtml = lazyarea.val();
            $(this).html(lazyhtml)
        }
    }
})(jQuery);

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
    $.fn.scrollShow = function (options) {
        var defaults = {
            vertical: false,
            speed: 800,
            auto: false,
            pausetm: 5000,
            preId: false,
            nextId: false,
            items: false,
            itemparent: false,
            itemSpace: 200,
            showItemCnt: 4,
            overstop: true,
            isLoop: true,
            callback: null,
            cntIndex: 1,
            lazy: false
        };
        var options = $.extend(defaults, options);
        if (!options.items || !options.itemparent) {
            return
        }
        var callback = options.callback;
        var timeout = null;
        var moveObj1 = null;
        var moveObj2 = null;
        var scrolllock = false;
        if (options.vertical) {
            moveObj1 = {
                marginTop: -options.itemSpace
            };
            moveObj2 = {
                marginTop: 0
            }
        } else {
            moveObj1 = {
                marginLeft: -options.itemSpace
            };
            moveObj2 = {
                marginLeft: 0
            }
        }
        var allItemCnt = $(options.items).length;
        var cntIndex = options.cntIndex;
        var startFlag = true;
        var endFlag = allItemCnt <= options.showItemCnt ? true : false;
        if (!options.isLoop) {
            $(options.preId).addClass("scrollStart");
            if (endFlag) {
                $(options.nextId).addClass("scrollEnd")
            }
        }

        function ___pre() {
            if (scrolllock) {
                return
            }
            scrolllock = true;
            if (callback != null) {
                callback($(options.items + ":last-child"))
            }
            if (options.lazy) {
                $(options.items + ":last-child img").attr("src", $(options.items + ":last-child img").attr(".src"))
            }
            $(options.items + ":last-child").prependTo(options.itemparent);
            __calcIndex(false);
            $(options.items + ":first-child").css(moveObj1).animate(moveObj2, options.speed, function () {
                scrolllock = false
            })
        }

        function ___next() {
            if (scrolllock) {
                return
            }
            scrolllock = true;
            if (callback != null) {
                callback($(options.items + ":nth-child(2)"))
            }
            if (options.lazy) {
                var showCntIdx = 2 + options.showItemCnt;
                $(options.items + ":nth-child(" + showCntIdx + ") img").attr("src", $(options.items + ":nth-child(" + showCntIdx + ") img").attr(".src"))
            }
            __calcIndex(true);
            var firstObj = $($(options.items)[0]);
            firstObj.animate(moveObj1, options.speed, function () {
                firstObj.css(moveObj1).appendTo(options.itemparent).css(moveObj2);
                scrolllock = false
            })
        }

        function __calcIndex(isadd) {
            var endIndex = 1 + allItemCnt - options.showItemCnt;
            startFlag = false;
            endFlag = false;
            if (isadd) {
                if (cntIndex >= endIndex) {
                    cntIndex = endIndex;
                    endFlag = true
                } else {
                    cntIndex++
                }
                if (cntIndex == endIndex) {
                    endFlag = true
                }
            } else {
                if (cntIndex <= 1) {
                    cntIndex = 1
                } else {
                    cntIndex--
                }
            }
            if (cntIndex == 1) {
                startFlag = true
            }
            if (!options.isLoop) {
                startFlag ? $(options.preId).addClass("scrollStart") : $(options.preId).removeClass("scrollStart");
                endFlag ? $(options.nextId).addClass("scrollEnd") : $(options.nextId).removeClass("scrollEnd")
            }
        }
        if (options.preId) {
            $(options.preId).live("click", function () {
                if (startFlag && !options.isLoop) {
                    return false
                }
                if (timeout) {
                    clearInterval(timeout)
                }
                ___pre();
                if (options.auto) {
                    timeout = setInterval(___next, options.pausetm)
                }
            })
        }
        if (options.nextId) {
            $(options.nextId).live("click", function () {
                if (endFlag && !options.isLoop) {
                    return false
                }
                if (timeout) {
                    clearInterval(timeout)
                }
                ___next();
                if (options.auto) {
                    timeout = setInterval(___next, options.pausetm)
                }
            })
        }
        if (options.auto == true) {
            timeout = setInterval(___next, options.pausetm);
            if (options.overstop) {
                $(options.itemparent).hover(function () {
                    if (timeout) {
                        clearInterval(timeout)
                    }
                }, function () {
                    if (timeout) {
                        clearInterval(timeout)
                    }
                    timeout = setInterval(___next, options.pausetm)
                })
            }
        }
    }
})(jQuery);
(function ($) {
    $.fn.menuAim = function (opts) {
        this.each(function () {
            init.call(this, opts)
        });
        return this
    };

    function init(opts) {
        var $menu = $(this),
            activeRow = null,
            mouseLocs = [],
            lastDelayLoc = null,
            timeoutId = null,
            options = $.extend({
                rowSelector: "> li",
                submenuSelector: "*",
                submenuDirection: "right",
                tolerance: 75,
                enter: $.noop,
                exit: $.noop,
                activate: $.noop,
                deactivate: $.noop,
                exitMenu: $.noop
            }, opts);
        var MOUSE_LOCS_TRACKED = 3,
            DELAY = 300;
        var mousemoveDocument = function (e) {
            mouseLocs.push({
                x: e.pageX,
                y: e.pageY
            });
            if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
                mouseLocs.shift()
            }
        };
        var mouseleaveMenu = function () {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
            if (options.exitMenu(this)) {
                if (activeRow) {
                    options.deactivate(activeRow)
                }
                activeRow = null
            }
        };
        var mouseenterRow = function () {
                if (timeoutId) {
                    clearTimeout(timeoutId)
                }
                options.enter(this);
                possiblyActivate(this)
            },
            mouseleaveRow = function () {
                options.exit(this)
            };
        var clickRow = function () {
            activate(this)
        };
        var activate = function (row) {
            if (row == activeRow) {
                return
            }
            if (activeRow) {
                options.deactivate(activeRow)
            }
            options.activate(row);
            activeRow = row
        };
        var possiblyActivate = function (row) {
            var delay = activationDelay();
            if (delay) {
                timeoutId = setTimeout(function () {
                    possiblyActivate(row)
                }, delay)
            } else {
                activate(row)
            }
        };
        var activationDelay = function () {
            if (!activeRow || !$(activeRow).is(options.submenuSelector)) {
                return 0
            }
            var offset = $menu.offset(),
                upperLeft = {
                    x: offset.left,
                    y: offset.top - options.tolerance
                },
                upperRight = {
                    x: offset.left + $menu.outerWidth(),
                    y: upperLeft.y
                },
                lowerLeft = {
                    x: offset.left,
                    y: offset.top + $menu.outerHeight() + options.tolerance
                },
                lowerRight = {
                    x: offset.left + $menu.outerWidth(),
                    y: lowerLeft.y
                },
                loc = mouseLocs[mouseLocs.length - 1],
                prevLoc = mouseLocs[0];
            if (!loc) {
                return 0
            }
            if (!prevLoc) {
                prevLoc = loc
            }
            if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x || prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
                return 0
            }
            if (lastDelayLoc && loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
                return 0
            }

            function slope(a, b) {
                return (b.y - a.y) / (b.x - a.x)
            }
            var decreasingCorner = upperRight,
                increasingCorner = lowerRight;
            if (options.submenuDirection == "left") {
                decreasingCorner = lowerLeft;
                increasingCorner = upperLeft
            } else {
                if (options.submenuDirection == "below") {
                    decreasingCorner = lowerRight;
                    increasingCorner = lowerLeft
                } else {
                    if (options.submenuDirection == "above") {
                        decreasingCorner = upperLeft;
                        increasingCorner = upperRight
                    }
                }
            }
            var decreasingSlope = slope(loc, decreasingCorner),
                increasingSlope = slope(loc, increasingCorner),
                prevDecreasingSlope = slope(prevLoc, decreasingCorner),
                prevIncreasingSlope = slope(prevLoc, increasingCorner);
            if (decreasingSlope < prevDecreasingSlope && increasingSlope > prevIncreasingSlope) {
                lastDelayLoc = loc;
                return DELAY
            }
            lastDelayLoc = null;
            return 0
        };
        $menu.mouseleave(mouseleaveMenu).find(options.rowSelector).mouseenter(mouseenterRow).mouseleave(mouseleaveRow).click(clickRow);
        $(document).mousemove(mousemoveDocument)
    }
})(jQuery);
jQuery.getPos = function (e) {
    var l = 0;
    var t = 0;
    var w = jQuery.intval(jQuery.css(e, "width"));
    var h = jQuery.intval(jQuery.css(e, "height"));
    var wb = e.offsetWidth;
    var hb = e.offsetHeight;
    while (e.offsetParent) {
        l += e.offsetLeft + (e.currentStyle ? jQuery.intval(e.currentStyle.borderLeftWidth) : 0);
        t += e.offsetTop + (e.currentStyle ? jQuery.intval(e.currentStyle.borderTopWidth) : 0);
        e = e.offsetParent
    }
    l += e.offsetLeft + (e.currentStyle ? jQuery.intval(e.currentStyle.borderLeftWidth) : 0);
    t += e.offsetTop + (e.currentStyle ? jQuery.intval(e.currentStyle.borderTopWidth) : 0);
    return {
        x: l,
        y: t,
        w: w,
        h: h,
        wb: wb,
        hb: hb
    }
};
jQuery.getClient = function (e) {
    if (e) {
        w = e.clientWidth;
        h = e.clientHeight
    } else {
        w = (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth;
        h = (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight
    }
    return {
        w: w,
        h: h
    }
};
jQuery.getScroll = function (e) {
    if (e) {
        t = e.scrollTop;
        l = e.scrollLeft;
        w = e.scrollWidth;
        h = e.scrollHeight
    } else {
        if (document.documentElement && document.documentElement.scrollTop) {
            t = document.documentElement.scrollTop;
            l = document.documentElement.scrollLeft;
            w = document.documentElement.scrollWidth;
            h = document.documentElement.scrollHeight
        } else {
            if (document.body) {
                t = document.body.scrollTop;
                l = document.body.scrollLeft;
                w = document.body.scrollWidth;
                h = document.body.scrollHeight
            }
        }
    }
    return {
        t: t,
        l: l,
        w: w,
        h: h
    }
};
jQuery.intval = function (v) {
    v = parseInt(v);
    return isNaN(v) ? 0 : v
};
jQuery.fn.ScrollTo = function (s) {
    o = jQuery.speed(s);
    return this.each(function () {
        new jQuery.fx.ScrollTo(this, o)
    })
};
jQuery.fx.ScrollTo = function (e, o) {
    var z = this;
    z.o = o;
    z.e = e;
    z.p = jQuery.getPos(e);
    z.s = jQuery.getScroll();
    z.clear = function () {
        clearInterval(z.timer);
        z.timer = null
    };
    z.t = (new Date).getTime();
    z.step = function () {
        var t = (new Date).getTime();
        var p = (t - z.t) / z.o.duration;
        if (t >= z.o.duration + z.t) {
            z.clear();
            setTimeout(function () {
                z.scroll(z.p.y, z.p.x)
            }, 13)
        } else {
            st = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (z.p.y - z.s.t) + z.s.t;
            sl = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (z.p.x - z.s.l) + z.s.l;
            z.scroll(st, sl)
        }
    };
    z.scroll = function (t, l) {
        window.scrollTo(l, t)
    };
    z.timer = setInterval(function () {
        z.step()
    }, 13)
};

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
$(function () {
    if ($.inArray(subcateId, ["16", "57", "15", "81"]) === -1 || !$("#J_CompetitiveGoods").length) {
        return
    }
    getUserAreaInfo(function () {
        var url = "/xhr3_List_RightbiddingPro_subcateId=" + subcateId + "&manuId=" + manuId + "&locationId=" + userProvinceId + "&provinceId=" + userProvinceId + "&cityId=" + userCityId + ".html";
        $.ajax({
            type: "GET",
            url: getRewriteJsUrl(url),
            dataType: "html",
            success: function (data) {
                if (data) {
                    $("#J_CompetitiveGoods").html(data).show();
                    $(".competitive-goods-list li .contact-qq").on("click", function () {
                        var spmEvent = $(this).attr("data-spmevent");
                        Base.eventStatWithParams("pc_list_right_b2c_qq", {
                            spm_event: spmEvent
                        })
                    });
                    setTimeout(function () {
                        var eventName = "List_RightbiddingPro_" + subcateId + "_" + manuId + "_" + userProvinceId;
                        Base.eventStat(eventName);
                        eventName = "List_RightbiddingPro_" + subcateId + "_1000000_0";
                        Base.eventStat(eventName);
                        eventName = "List_RightbiddingPro_" + subcateId + "_" + manuId + "_0";
                        Base.eventStat(eventName);
                        eventName = "List_RightbiddingPro_" + subcateId + "_1000000_" + userProvinceId;
                        Base.eventStat(eventName);
                        if (subcateId == 57 && manuId != 0) {
                            if ($.inArray(manuId, [613, 98, 34645, 544, 1434, 1673]) < 0) {
                                eventName = "List_RightbiddingPro_" + subcateId + "_1000001_0";
                                Base.eventStat(eventName)
                            }
                        }
                    }, 1000)
                }
            }
        })
    })
});

$(function () {
    var referenceObj = $(".historyStart");
    var historyTip = $(".history-tips");
    if (referenceObj.length == 0 || historyTip.length == 0) {
        return
    }
    var refTop = referenceObj.position().top;
    var refLeft = referenceObj.position().left;
    var top = refTop + 41 + "px";
    var left = refLeft + 2 + "px";
    historyTip.css({
        "display": "block",
        "top": top,
        "left": left
    })
});
$(function () {
    if ($("a[data-tips]").length != 0) {
        var TIP_WIDTH = 235;
        var timer;
        $("body").append($('<div id="J_ParamTips" class="param-tips" style="display:none"></div>'));
        $("a[data-tips]").hover(function () {
            clearTimeout(timer);
            var isPicMode = $(this).find("br").length;
            var left;
            var offsetL = $(this).offset().left;
            var offsetT = $(this).offset().top + (isPicMode ? 68 : 20);
            var tempW = $(this).width() + 6;
            left = offsetL - Math.abs(TIP_WIDTH - tempW) / 2;
            var tipsText = $(this).attr("data-tips");
            var htmlStr = "<i></i><p>" + tipsText + "</p>";
            var series = $(this).attr("data-series");
            var isSeries = (typeof (series) !== "undefined" && series);
            if (isSeries) {
                offsetT = offsetT - 5;
                left = $(this).parents(".group").offset().left;
                $("#J_ParamTips").addClass("param-tips-series")
            } else {
                $("#J_ParamTips").removeClass("param-tips-series")
            }
            $("#J_ParamTips").html(htmlStr).css({
                "position": "absolute",
                "left": left + "px",
                "top": offsetT + "px"
            }).show()
        }, function () {
            timer = setTimeout(function () {
                $("#J_ParamTips").hide()
            }, 50)
        });
        $("#J_ParamTips").hover(function () {
            clearTimeout(timer);
            $(this).show()
        }, function () {
            var self = $(this);
            timer = setTimeout(function () {
                self.hide()
            }, 50)
        })
    }
});
$(function () {
    if ($("#scrollComment").length == 0) {
        return
    }
    var commentList = $("#scrollComment li");
    if (commentList.length == 2) {
        commentList.clone().appendTo("#scrollComment")
    }
    var commentScroll = function () {
        var scrollCommentList = $("#scrollComment li");
        var scrollObj = scrollCommentList.first();
        var h = scrollObj.height();
        scrollObj.animate({
            "margin-top": -h
        }, 550, function () {
            $(this).appendTo($(this).parent());
            $(this).css({
                "margin-top": 0
            })
        })
    };
    var scrollTimer = setInterval(commentScroll, 3000);
    $("#scrollComment li").hover(function () {
        $(this).addClass("scroll-comment-hover")
    }, function () {
        $(this).removeClass("scroll-comment-hover")
    });
    $("#scrollComment").hover(function () {
        clearInterval(scrollTimer)
    }, function () {
        scrollTimer = setInterval(commentScroll, 3000)
    })
});
$(function () {
    $(".search-hot-words a").on("click", function () {
        var index = $(this).index();
        Base.eventStat("list_search_hot_words_" + index)
    });
    $("#J_CategoryNavHeader").on("mouseenter", function () {
        Base.eventStat("list_category_nav_open")
    });
    $("#J_CategoryNavItem li:first").find("a").eq(0).on("click", function () {
        Base.eventStat("list_category_nav_mobile_phone_1")
    });
    $("#subCateBox-0 .sub-category-item:first").find("h3 > a").on("click", function () {
        Base.eventStat("list_category_nav_mobile_phone_2")
    });
    $("#subCateBox-0 .sub-category-item:first").find(".sub-category-list > a").eq(0).on("click", function () {
        Base.eventStat("list_category_nav_mobile_phone_3")
    });
    $("#J_MultiLink").on("click", function () {
        Base.eventStat("list_multi_link_confirm")
    });
    $(document).on("click", "#J_FixedSelectedBox .reset", function () {
        Base.eventStat("pc-list-filter-reset")
    });
    $(document).on("click", "#J_FixedSelectedBox .advanced-search", function () {
        Base.eventStat("list_filter_fixed_advanced")
    });
    $("#J_RecommendForYou").on("click", ".foryou-list a", function () {
        var index = $(this).parents("li").index();
        Base.eventStat("list_recommend_for_you_" + (index + 1))
    });
    $("#J_ProduceNew").find("a").on("click", function () {
        Base.eventStat("list_new_product_list")
    });
    $("#userTalkPro").on("click", ".new-product-box a", function () {
        Base.eventStat("list_user_talk_about")
    });
    $(document).on("click", "#subSerch", function () {
        var kw = $(this).parent().find("#keyword").val();
        Base.eventStatWithParams("list_search_button", {
            keyword: kw
        })
    })
});
if ($("#starListLeftHotPromotion").length) {
    var starListLeftHotPromotion = function () {
        var url = "/index.php?c=AjaxVer3_List&a=StarListLeftHotPromotion&subcateId=" + subcateId;
        $.ajax({
            url: getRewriteJsUrl(url),
            dataType: "html",
            success: function (data) {
                if (data) {
                    $("#starListLeftHotPromotion").append(data).show()
                }
            }
        })
    }()
}
$(function () {
    $(".number-library tr").live("mouseover", function () {
        $(this).addClass("hover")
    });
    $(".number-library tr").live("mouseout", function () {
        $(this).removeClass("hover")
    })
});
$("#mpnsubKw").click(function () {
    var keyword = stripscript($("#pgword").val());
    if (keyword != "" && isNaN(parseInt(keyword))) {
        $("#pgword").val("");
        return
    }
    if (keyword) {
        keyword = parseInt(keyword);
        keyword = escape(keyword)
    } else {
        keyword = 0
    }
    var url = paramVal.replace(/-kw\d+/, "-kw" + keyword);
    jumpPage(url)
});
$("#pgword").keyup(function (e) {
    if (e.keyCode == 13) {
        $("#mpnsubKw").click()
    }
});
$(".number-library .clickTd").click(function () {
    var url = $(this).siblings(".choose").children("a").attr("href");
    window.open(url)
});
$(function () {
    var listBox = $("#J_PicMode");
    if (listBox.length) {
        var isWideMode = (screen.width <= 1280) ? false : true;
        var rscript = /<script.*?>.*?<\/script>/igm;
        for (var i = 1; i <= 10; i++) {
            var adHtml = $("#J_PreloadAd_" + i).html();
            var adHtmlWithoutScript = adHtml.replace(rscript, "");
            var adWrap = $('<li class="pic-mode-ads"></li>');
            var index = i;
            adWrap.append(adHtmlWithoutScript);
            var ads = adWrap.find(".adSpace");
            var adsHide = adWrap.find(".adSpace:empty");
            if (ads.length === adsHide.length) {
                adWrap.css("display", "none")
            }
            var n = isWideMode ? 4 : 3;
            var target = listBox.find(".nth-child-" + n + "n").eq(index);
            if (target.length) {
                target.after(adWrap)
            } else {
                $("#J_PreloadAd_" + i).show()
            }
        }
    }
});
$(function () {
    var urlhash = window.location.hash;
    if (urlhash.indexOf("#list_merchant_loc") == 0 && userLocationId != locationId) {
        $("#J_ParamFilter").find("a").each(function (i) {
            !$(this).parent().hasClass("filter-series-list") && $(this).live("click", function () {
                var url = $(this).attr("href");
                $(this).attr("href", url + "#list_merchant_loc")
            })
        })
    }
    $(".qch-list-window").find(".window__item").each(function (i) {
        $(this).find("a").each(function (k) {
            $(this).on("click", function () {
                Base.eventStat("qch_pro_list_ad" + (i + 1) + "_" + (k + 1))
            })
        })
    });
    $(".qch-list-block").each(function (i) {
        $(this).find("a").each(function (k) {
            $(this).on("click", function () {
                Base.eventStat("qch_pro_list_big_ad" + (i + 1) + "_" + (k + 1))
            })
        })
    })
});
$(function () {
    var proStr = "";
    $("li[data-live]").each(function () {
        var curProId = $(this).attr("data-follow-id").replace("p", "");
        proStr = proStr == "" ? curProId : (proStr + "-" + curProId)
    });
    if (proStr != "") {
        var url = "/index.php?c=AjaxVer3_List&a=GetLiveHtml&id=" + proStr;
        $.ajax({
            type: "get",
            url: getRewriteJsUrl(url),
            dataType: "json",
            success: function (data) {
                if (data) {
                    for (var pid in data) {
                        $(data[pid]).insertBefore($('li[data-follow-id="p' + pid + '"]').find(".price-row .goods-promotion"))
                    }
                    $("li[data-live] .zhibo-btn").each(function () {
                        var event = $(this).hasClass("ed") ? "mobile_list_zhibo_huigu" : "mobile_list_zhibo";
                        $(this).on("click", function () {
                            Base.eventStat(event)
                        })
                    });
                    $("._j_zhibo_box[data-time]").each(function () {
                        $(this).parent().find(".price-tip,.price-normal").hide();
                        var zhiboBox = $(this),
                            endTime = zhiboBox.data("time"),
                            nowTime = new Date().getTime(),
                            timeStr = "";
                        if (endTime <= 0) {
                            return
                        }
                        zhiboBox.times = Math.floor((endTime - nowTime) / 1000);
                        countH = Math.floor(zhiboBox.times / (60 * 60));
                        zhiboBox.timeBox = zhiboBox.find("._j_zhibo_time");
                        if (zhiboBox.times > 0 && countH <= 10) {
                            zhiboBox.timer = setInterval(function () {
                                timeStr = countDown(zhiboBox);
                                zhiboBox.timeBox.html(timeStr)
                            }, 1000)
                        }
                    })
                }
            }
        })
    }
    $("#aside-zhibo").on("click", function () {
        Base.eventStat("mobile_list_xinpin")
    });

    function countDown(zhiboBox) {
        var day = 0,
            hour = 0,
            minute = 0,
            second = 0;
        if (zhiboBox.times >= 0) {
            day = Math.floor(zhiboBox.times / (60 * 60 * 24));
            hour = Math.floor(zhiboBox.times / (60 * 60)) - (day * 24);
            minute = Math.floor(zhiboBox.times / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(zhiboBox.times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            if (hour < 10) {
                hour = "0" + hour
            }
            if (minute < 10) {
                minute = "0" + minute
            }
            if (second < 10) {
                second = "0" + second
            }
            zhiboBox.times--
        } else {
            hour = minute = second = "00";
            clearInterval(zhiboBox.timer);
            return
        }
        return '<span class="number">' + hour + '</span>:<span class="number">' + minute + '</span>:<span class="number">' + second + "</span>"
    }
});
$(document).on("click", "#J_PicModeEmallTip", function () {
    Base.eventStat("zolmall_adsense_zol_detail_list_pc_1539")
});
$(document).on("click", ".item-sale", function () {
    Base.eventStat("zolmall_adsense_zol_detail_list_pc_1540")
});
$(document).on("click", ".zolcom-store-list a", function () {
    Base.eventStat("zolmall_adsense_zol_detail_list_pc_1097")
});
$("._j_tmall_banner_pc").on("click", function () {
    Base.eventStat("tmall_618_banner_pc")
});
$(".star-promote-contact .btn").click(function () {
    $(this).parent().toggleClass("star-promote-contact-click");
    $(".contac-person").toggle()
});
// $(function () {
//     var newsCommendUrl = "/index.php?c=AjaxVer3_List&a=GetCommendProduct&subcateId=" + subcateId;
//     $.ajax({
//         type: "get",
//         url: getRewriteJsUrl(newsCommendUrl),
//         dataType: "json",
//         success: function (data) {
//             if (data.status == 1) {
//                 $("#newsListCommend").html(data.tpl)
//             } else {
//                 $("#newsListCommend").hide()
//             }
//         }
//     })
// });
$(document).on("click", "#newsListCommend li", function () {
    Base.eventStat("detail_list_new_tuijian")
});
$("a[data-event]").on("click", function (e) {
    var eventName = $(this).attr("data-event");
    if (!eventName || eventName == "" || typeof eventName == "undefined") {
        return
    }
    window.ZUI.Count.eventCount(eventName)
});
$(function () {
    if (pageType == "List" && subPageType == "List") {
        var maxpage = 0,
            picNum = 1;

        function picHuanFun(list) {
            var html = "";
            var tagHtml, color;
            for (var i = 0; i < list.length; i++) {
                var videoFlag = false;
                if (list[i].tag == "2") {
                    tagHtml = "\u4e00\u62cd\u5373\u5408";
                    color = "orange"
                } else {
                    if (list[i].tag == "1") {
                        tagHtml = "\u539f\u521b\u56fe\u8d4f";
                        color = "red"
                    } else {
                        if (list[i].tag == "3") {
                            tagHtml = "\u7cbe\u9009\u89c6\u9891";
                            color = "blue";
                            videoFlag = true
                        }
                    }
                }
                html += "<li ";
                if (videoFlag) {
                    html += 'class ="video"'
                }
                html += '><a target="_blank" href="' + list[i].link + '"  data-event-focus="detail_list_right_pic_selected_' + list[i].id + '">' + '<span class="atlas-tag ' + color + '">' + tagHtml + "</span>" + '<img src="' + list[i].pic + '"  width="268" height="202">' + '<div class="atlas-focus-opacity">' + '<span class="atlas-pic-look"><i></i>' + list[i].look + "</span>";
                if (videoFlag) {
                    html += '<span class="atlas-pic-num">' + list[i].duration + "</span>"
                } else {
                    html += '<span class="atlas-pic-num">' + list[i].num + "\u5f20</span>"
                }
                html += "</div>" + '<span class="atlas-alink">' + list[i].title + "</span>";
                if (videoFlag) {
                    html += '<em class="button">\u64ad\u653e</em>'
                }
                html += "</a>" + "</li>"
            }
            $(".bx-wrapper").remove();
            $(".atlas-focus").html('<ul id="J_FocusSlider" class="focus-list">' + html + "</ul>");
            var focusSilde = $(".focus-list");
            if (focusSilde.find("li").length > 1) {
                var _focusbxSlider = focusSilde.bxSlider({
                    auto: true
                })
            }
        }

        function getJson() {
            var url = "/index.php?c=AjaxVer3_List&a=GetFocusPic" + "&subcateId=" + subcateId + "&manuId=" + manuId + "&page=" + picNum;
            $.ajax({
                url: getRewriteJsUrl(url),
                dataType: "json",
                success: function (data) {
                    if (data.maxPage > 0) {
                        if ($(".atlas-pic-box").is(":hidden")) {
                            $(".atlas-pic-box").show()
                        }
                        if (maxpage != data.maxPage) {
                            maxpage = data.maxPage
                        }
                        if (maxpage == 1) {
                            $("#irefreshPic").hide()
                        }
                        picHuanFun(data.data)
                    }
                }
            })
        }
        getJson();
        $(".atlas-pic-box").delegate("a[data-event-focus],.bx-pager-link", "click", function (e) {
            if ($(this).hasClass("bx-pager-link")) {
                window.ZUI.Count.eventCount("detail_list_right_pic_lunbo");
                return
            }
            var eventName = $(this).attr("data-event-focus");
            if (!eventName || eventName == "" || typeof eventName == "undefined") {
                return
            }
            window.ZUI.Count.eventCount(eventName)
        });
        $("#irefreshPic").on("click", function () {
            picNum++;
            if (picNum > maxpage) {
                picNum = 1
            }
            $(this).attr("value", picNum);
            getJson()
        })
    }
});
! function (t) {
    var e = {},
        s = {
            mode: "horizontal",
            slideSelector: "",
            infiniteLoop: !0,
            hideControlOnEnd: !1,
            speed: 500,
            easing: null,
            slideMargin: 0,
            startSlide: 0,
            randomStart: !1,
            captions: !1,
            ticker: !1,
            tickerHover: !1,
            adaptiveHeight: !1,
            adaptiveHeightSpeed: 500,
            video: !1,
            useCSS: !0,
            preloadImages: "visible",
            responsive: !0,
            slideZIndex: 50,
            touchEnabled: !0,
            swipeThreshold: 50,
            oneToOneTouch: !0,
            preventDefaultSwipeX: !0,
            preventDefaultSwipeY: !1,
            pager: !0,
            pagerType: "full",
            pagerShortSeparator: " / ",
            pagerSelector: null,
            buildPager: null,
            pagerCustom: null,
            controls: !0,
            nextText: "Next",
            prevText: "Prev",
            nextSelector: null,
            prevSelector: null,
            autoControls: !1,
            startText: "Start",
            stopText: "Stop",
            autoControlsCombine: !1,
            autoControlsSelector: null,
            auto: !1,
            pause: 4000,
            autoStart: !0,
            autoDirection: "next",
            autoHover: !1,
            autoDelay: 0,
            minSlides: 1,
            maxSlides: 1,
            moveSlides: 0,
            slideWidth: 0,
            onSliderLoad: function () {},
            onSlideBefore: function () {},
            onSlideAfter: function () {},
            onSlideNext: function () {},
            onSlidePrev: function () {},
            onSliderResize: function () {}
        };
    t.fn.bxSlider = function (n) {
        if (0 == this.length) {
            return this
        }
        if (this.length > 1) {
            return this.each(function () {
                t(this).bxSlider(n)
            }), this
        }
        var o = {},
            r = this;
        e.el = this;
        var a = t(window).width(),
            l = t(window).height(),
            d = function () {
                o.settings = t.extend({}, s, n), o.settings.slideWidth = parseInt(o.settings.slideWidth), o.children = r.children(o.settings.slideSelector), o.children.length < o.settings.minSlides && (o.settings.minSlides = o.children.length), o.children.length < o.settings.maxSlides && (o.settings.maxSlides = o.children.length), o.settings.randomStart && (o.settings.startSlide = Math.floor(Math.random() * o.children.length)), o.active = {
                    index: o.settings.startSlide
                }, o.carousel = o.settings.minSlides > 1 || o.settings.maxSlides > 1, o.carousel && (o.settings.preloadImages = "all"), o.minThreshold = o.settings.minSlides * o.settings.slideWidth + (o.settings.minSlides - 1) * o.settings.slideMargin, o.maxThreshold = o.settings.maxSlides * o.settings.slideWidth + (o.settings.maxSlides - 1) * o.settings.slideMargin, o.working = !1, o.controls = {}, o.interval = null, o.animProp = "vertical" == o.settings.mode ? "top" : "left", o.usingCSS = o.settings.useCSS && "fade" != o.settings.mode && function () {
                    var t = document.createElement("div"),
                        e = ["WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
                    for (var i in e) {
                        if (void 0 !== t.style[e[i]]) {
                            return o.cssPrefix = e[i].replace("Perspective", "").toLowerCase(), o.animProp = "-" + o.cssPrefix + "-transform", !0
                        }
                    }
                    return !1
                }(), "vertical" == o.settings.mode && (o.settings.maxSlides = o.settings.minSlides), r.data("origStyle", r.attr("style")), r.children(o.settings.slideSelector).each(function () {
                    t(this).data("origStyle", t(this).attr("style"))
                }), c()
            },
            c = function () {
                r.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>'), o.viewport = r.parent(), o.loader = t('<div class="bx-loading" />'), o.viewport.prepend(o.loader), r.css({
                    width: "horizontal" == o.settings.mode ? 100 * o.children.length + 215 + "%" : "auto",
                    position: "relative"
                }), o.usingCSS && o.settings.easing ? r.css("-" + o.cssPrefix + "-transition-timing-function", o.settings.easing) : o.settings.easing || (o.settings.easing = "swing"), f(), o.viewport.css({
                    width: "100%",
                    overflow: "hidden",
                    position: "relative"
                }), o.viewport.parent().css({
                    maxWidth: p()
                }), o.settings.pager || o.viewport.parent().css({
                    margin: "0 auto 0px"
                }), o.children.css({
                    "float": "horizontal" == o.settings.mode ? "left" : "none",
                    listStyle: "none",
                    position: "relative"
                }), o.children.css("width", u()), "horizontal" == o.settings.mode && o.settings.slideMargin > 0 && o.children.css("marginRight", o.settings.slideMargin), "vertical" == o.settings.mode && o.settings.slideMargin > 0 && o.children.css("marginBottom", o.settings.slideMargin), "fade" == o.settings.mode && (o.children.css({
                    position: "absolute",
                    zIndex: 0,
                    display: "none"
                }), o.children.eq(o.settings.startSlide).css({
                    zIndex: o.settings.slideZIndex,
                    display: "block"
                })), o.controls.el = t('<div class="bx-controls" />'), o.settings.captions && P(), o.active.last = o.settings.startSlide == x() - 1, o.settings.video && r.fitVids();
                var e = o.children.eq(o.settings.startSlide);
                "all" == o.settings.preloadImages && (e = o.children), o.settings.ticker ? o.settings.pager = !1 : (o.settings.pager && T(), o.settings.controls && C(), o.settings.auto && o.settings.autoControls && E(), (o.settings.controls || o.settings.autoControls || o.settings.pager) && o.viewport.after(o.controls.el)), g(e, h)
            },
            g = function (e, i) {
                var s = e.find('img:not([src=""]), iframe').length;
                if (0 == s) {
                    return i(), void 0
                }
                var n = 0;
                e.find('img:not([src=""]), iframe').each(function () {
                    t(this).one("load", function () {
                        ++n == s && i()
                    }).each(function () {
                        this.complete && t(this).load()
                    })
                })
            },
            h = function () {
                if (o.settings.infiniteLoop && "fade" != o.settings.mode && !o.settings.ticker) {
                    var e = "vertical" == o.settings.mode ? o.settings.minSlides : o.settings.maxSlides,
                        i = o.children.slice(0, e).clone().addClass("bx-clone"),
                        s = o.children.slice(-e).clone().addClass("bx-clone");
                    r.append(i).prepend(s)
                }
                o.loader.remove(), S(), "vertical" == o.settings.mode && (o.settings.adaptiveHeight = !0), o.viewport.height(v()), r.redrawSlider(), o.settings.onSliderLoad(o.active.index), o.initialized = !0, o.settings.responsive && t(window).bind("resize", Z), o.settings.auto && o.settings.autoStart && H(), o.settings.ticker && L(), o.settings.pager && q(o.settings.startSlide), o.settings.controls && W(), o.settings.touchEnabled && !o.settings.ticker && O()
            },
            v = function () {
                var e = 0,
                    s = t();
                if ("vertical" == o.settings.mode || o.settings.adaptiveHeight) {
                    if (o.carousel) {
                        var n = 1 == o.settings.moveSlides ? o.active.index : o.active.index * m();
                        for (s = o.children.eq(n), i = 1; i <= o.settings.maxSlides - 1; i++) {
                            s = n + i >= o.children.length ? s.add(o.children.eq(i - 1)) : s.add(o.children.eq(n + i))
                        }
                    } else {
                        s = o.children.eq(o.active.index)
                    }
                } else {
                    s = o.children
                }
                return "vertical" == o.settings.mode ? (s.each(function () {
                    e += t(this).outerHeight()
                }), o.settings.slideMargin > 0 && (e += o.settings.slideMargin * (o.settings.minSlides - 1))) : e = Math.max.apply(Math, s.map(function () {
                    return t(this).outerHeight(!1)
                }).get()), e
            },
            p = function () {
                var t = "100%";
                return o.settings.slideWidth > 0 && (t = "horizontal" == o.settings.mode ? o.settings.maxSlides * o.settings.slideWidth + (o.settings.maxSlides - 1) * o.settings.slideMargin : o.settings.slideWidth), t
            },
            u = function () {
                var t = o.settings.slideWidth,
                    e = o.viewport.width();
                return 0 == o.settings.slideWidth || o.settings.slideWidth > e && !o.carousel || "vertical" == o.settings.mode ? t = e : o.settings.maxSlides > 1 && "horizontal" == o.settings.mode && (e > o.maxThreshold || e < o.minThreshold && (t = (e - o.settings.slideMargin * (o.settings.minSlides - 1)) / o.settings.minSlides)), t
            },
            f = function () {
                var t = 1;
                if ("horizontal" == o.settings.mode && o.settings.slideWidth > 0) {
                    if (o.viewport.width() < o.minThreshold) {
                        t = o.settings.minSlides
                    } else {
                        if (o.viewport.width() > o.maxThreshold) {
                            t = o.settings.maxSlides
                        } else {
                            var e = o.children.first().width();
                            t = Math.floor(o.viewport.width() / e)
                        }
                    }
                } else {
                    "vertical" == o.settings.mode && (t = o.settings.minSlides)
                }
                return t
            },
            x = function () {
                var t = 0;
                if (o.settings.moveSlides > 0) {
                    if (o.settings.infiniteLoop) {
                        t = o.children.length / m()
                    } else {
                        for (var e = 0, i = 0; e < o.children.length;) {
                            ++t, e = i + f(), i += o.settings.moveSlides <= f() ? o.settings.moveSlides : f()
                        }
                    }
                } else {
                    t = Math.ceil(o.children.length / f())
                }
                return t
            },
            m = function () {
                return o.settings.moveSlides > 0 && o.settings.moveSlides <= f() ? o.settings.moveSlides : f()
            },
            S = function () {
                if (o.children.length > o.settings.maxSlides && o.active.last && !o.settings.infiniteLoop) {
                    if ("horizontal" == o.settings.mode) {
                        var t = o.children.last(),
                            e = t.position();
                        b(-(e.left - (o.viewport.width() - t.width())), "reset", 0)
                    } else {
                        if ("vertical" == o.settings.mode) {
                            var i = o.children.length - o.settings.minSlides,
                                e = o.children.eq(i).position();
                            b(-e.top, "reset", 0)
                        }
                    }
                } else {
                    var e = o.children.eq(o.active.index * m()).position();
                    o.active.index == x() - 1 && (o.active.last = !0), void 0 != e && ("horizontal" == o.settings.mode ? b(-e.left, "reset", 0) : "vertical" == o.settings.mode && b(-e.top, "reset", 0))
                }
            },
            b = function (t, e, i, s) {
                if (o.usingCSS) {
                    var n = "vertical" == o.settings.mode ? "translate3d(0, " + t + "px, 0)" : "translate3d(" + t + "px, 0, 0)";
                    r.css("-" + o.cssPrefix + "-transition-duration", i / 1000 + "s"), "slide" == e ? (r.css(o.animProp, n), r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
                        r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), D()
                    })) : "reset" == e ? r.css(o.animProp, n) : "ticker" == e && (r.css("-" + o.cssPrefix + "-transition-timing-function", "linear"), r.css(o.animProp, n), r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
                        r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), b(s.resetValue, "reset", 0), N()
                    }))
                } else {
                    var a = {};
                    a[o.animProp] = t, "slide" == e ? r.animate(a, i, o.settings.easing, function () {
                        D()
                    }) : "reset" == e ? r.css(o.animProp, t) : "ticker" == e && r.animate(a, speed, "linear", function () {
                        b(s.resetValue, "reset", 0), N()
                    })
                }
            },
            w = function () {
                for (var e = "", i = x(), s = 0; i > s; s++) {
                    var n = "";
                    o.settings.buildPager && t.isFunction(o.settings.buildPager) ? (n = o.settings.buildPager(s), o.pagerEl.addClass("bx-custom-pager")) : (n = s + 1, o.pagerEl.addClass("bx-default-pager")), e += '<div class="bx-pager-item"><a href="" data-slide-index="' + s + '" class="bx-pager-link">' + n + "</a></div>"
                }
                o.pagerEl.html(e)
            },
            T = function () {
                o.settings.pagerCustom ? o.pagerEl = t(o.settings.pagerCustom) : (o.pagerEl = t('<div class="bx-pager" />'), o.settings.pagerSelector ? t(o.settings.pagerSelector).html(o.pagerEl) : o.controls.el.addClass("bx-has-pager").append(o.pagerEl), w()), o.pagerEl.on("click", "a", I)
            },
            C = function () {
                o.controls.next = t('<a class="bx-next" href="">' + o.settings.nextText + "</a>"), o.controls.prev = t('<a class="bx-prev" href="">' + o.settings.prevText + "</a>"), o.controls.next.bind("click", y), o.controls.prev.bind("click", z), o.settings.nextSelector && t(o.settings.nextSelector).append(o.controls.next), o.settings.prevSelector && t(o.settings.prevSelector).append(o.controls.prev), o.settings.nextSelector || o.settings.prevSelector || (o.controls.directionEl = t('<div class="bx-controls-direction" />'), o.controls.directionEl.append(o.controls.prev).append(o.controls.next), o.controls.el.addClass("bx-has-controls-direction").append(o.controls.directionEl))
            },
            E = function () {
                o.controls.start = t('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + o.settings.startText + "</a></div>"), o.controls.stop = t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + o.settings.stopText + "</a></div>"), o.controls.autoEl = t('<div class="bx-controls-auto" />'), o.controls.autoEl.on("click", ".bx-start", k), o.controls.autoEl.on("click", ".bx-stop", M), o.settings.autoControlsCombine ? o.controls.autoEl.append(o.controls.start) : o.controls.autoEl.append(o.controls.start).append(o.controls.stop), o.settings.autoControlsSelector ? t(o.settings.autoControlsSelector).html(o.controls.autoEl) : o.controls.el.addClass("bx-has-controls-auto").append(o.controls.autoEl), A(o.settings.autoStart ? "stop" : "start")
            },
            P = function () {
                o.children.each(function () {
                    var e = t(this).find("img:first").attr("title");
                    void 0 != e && ("" + e).length && t(this).append('<div class="bx-caption"><span>' + e + "</span></div>")
                })
            },
            y = function (t) {
                o.settings.auto && r.stopAuto(), r.goToNextSlide(), t.preventDefault()
            },
            z = function (t) {
                o.settings.auto && r.stopAuto(), r.goToPrevSlide(), t.preventDefault()
            },
            k = function (t) {
                r.startAuto(), t.preventDefault()
            },
            M = function (t) {
                r.stopAuto(), t.preventDefault()
            },
            I = function (e) {
                o.settings.auto && r.stopAuto();
                var i = t(e.currentTarget),
                    s = parseInt(i.attr("data-slide-index"));
                s != o.active.index && r.goToSlide(s), e.preventDefault()
            },
            q = function (e) {
                var i = o.children.length;
                return "short" == o.settings.pagerType ? (o.settings.maxSlides > 1 && (i = Math.ceil(o.children.length / o.settings.maxSlides)), o.pagerEl.html(e + 1 + o.settings.pagerShortSeparator + i), void 0) : (o.pagerEl.find("a").removeClass("active"), o.pagerEl.each(function (i, s) {
                    t(s).find("a").eq(e).addClass("active")
                }), void 0)
            },
            D = function () {
                if (o.settings.infiniteLoop) {
                    var t = "";
                    0 == o.active.index ? t = o.children.eq(0).position() : o.active.index == x() - 1 && o.carousel ? t = o.children.eq((x() - 1) * m()).position() : o.active.index == o.children.length - 1 && (t = o.children.eq(o.children.length - 1).position()), t && ("horizontal" == o.settings.mode ? b(-t.left, "reset", 0) : "vertical" == o.settings.mode && b(-t.top, "reset", 0))
                }
                o.working = !1, o.settings.onSlideAfter(o.children.eq(o.active.index), o.oldIndex, o.active.index)
            },
            A = function (t) {
                o.settings.autoControlsCombine ? o.controls.autoEl.html(o.controls[t]) : (o.controls.autoEl.find("a").removeClass("active"), o.controls.autoEl.find("a:not(.bx-" + t + ")").addClass("active"))
            },
            W = function () {
                1 == x() ? (o.controls.prev.addClass("disabled"), o.controls.next.addClass("disabled")) : !o.settings.infiniteLoop && o.settings.hideControlOnEnd && (0 == o.active.index ? (o.controls.prev.addClass("disabled"), o.controls.next.removeClass("disabled")) : o.active.index == x() - 1 ? (o.controls.next.addClass("disabled"), o.controls.prev.removeClass("disabled")) : (o.controls.prev.removeClass("disabled"), o.controls.next.removeClass("disabled")))
            },
            H = function () {
                o.settings.autoDelay > 0 ? setTimeout(r.startAuto, o.settings.autoDelay) : r.startAuto(), o.settings.autoHover && r.hover(function () {
                    o.interval && (r.stopAuto(!0), o.autoPaused = !0)
                }, function () {
                    o.autoPaused && (r.startAuto(!0), o.autoPaused = null)
                })
            },
            L = function () {
                var e = 0;
                if ("next" == o.settings.autoDirection) {
                    r.append(o.children.clone().addClass("bx-clone"))
                } else {
                    r.prepend(o.children.clone().addClass("bx-clone"));
                    var i = o.children.first().position();
                    e = "horizontal" == o.settings.mode ? -i.left : -i.top
                }
                b(e, "reset", 0), o.settings.pager = !1, o.settings.controls = !1, o.settings.autoControls = !1, o.settings.tickerHover && !o.usingCSS && o.viewport.hover(function () {
                    r.stop()
                }, function () {
                    var e = 0;
                    o.children.each(function () {
                        e += "horizontal" == o.settings.mode ? t(this).outerWidth(!0) : t(this).outerHeight(!0)
                    });
                    var i = o.settings.speed / e,
                        s = "horizontal" == o.settings.mode ? "left" : "top",
                        n = i * (e - Math.abs(parseInt(r.css(s))));
                    N(n)
                }), N()
            },
            N = function (t) {
                speed = t ? t : o.settings.speed;
                var e = {
                        left: 0,
                        top: 0
                    },
                    i = {
                        left: 0,
                        top: 0
                    };
                "next" == o.settings.autoDirection ? e = r.find(".bx-clone").first().position() : i = o.children.first().position();
                var s = "horizontal" == o.settings.mode ? -e.left : -e.top,
                    n = "horizontal" == o.settings.mode ? -i.left : -i.top,
                    a = {
                        resetValue: n
                    };
                b(s, "ticker", speed, a)
            },
            O = function () {
                o.touch = {
                    start: {
                        x: 0,
                        y: 0
                    },
                    end: {
                        x: 0,
                        y: 0
                    }
                }, o.viewport.bind("touchstart", X)
            },
            X = function (t) {
                if (o.working) {
                    t.preventDefault()
                } else {
                    o.touch.originalPos = r.position();
                    var e = t.originalEvent;
                    o.touch.start.x = e.changedTouches[0].pageX, o.touch.start.y = e.changedTouches[0].pageY, o.viewport.bind("touchmove", Y), o.viewport.bind("touchend", V)
                }
            },
            Y = function (t) {
                var e = t.originalEvent,
                    i = Math.abs(e.changedTouches[0].pageX - o.touch.start.x),
                    s = Math.abs(e.changedTouches[0].pageY - o.touch.start.y);
                if (3 * i > s && o.settings.preventDefaultSwipeX ? t.preventDefault() : 3 * s > i && o.settings.preventDefaultSwipeY && t.preventDefault(), "fade" != o.settings.mode && o.settings.oneToOneTouch) {
                    var n = 0;
                    if ("horizontal" == o.settings.mode) {
                        var r = e.changedTouches[0].pageX - o.touch.start.x;
                        n = o.touch.originalPos.left + r
                    } else {
                        var r = e.changedTouches[0].pageY - o.touch.start.y;
                        n = o.touch.originalPos.top + r
                    }
                    b(n, "reset", 0)
                }
            },
            V = function (t) {
                o.viewport.unbind("touchmove", Y);
                var e = t.originalEvent,
                    i = 0;
                if (o.touch.end.x = e.changedTouches[0].pageX, o.touch.end.y = e.changedTouches[0].pageY, "fade" == o.settings.mode) {
                    var s = Math.abs(o.touch.start.x - o.touch.end.x);
                    s >= o.settings.swipeThreshold && (o.touch.start.x > o.touch.end.x ? r.goToNextSlide() : r.goToPrevSlide(), r.stopAuto())
                } else {
                    var s = 0;
                    "horizontal" == o.settings.mode ? (s = o.touch.end.x - o.touch.start.x, i = o.touch.originalPos.left) : (s = o.touch.end.y - o.touch.start.y, i = o.touch.originalPos.top), !o.settings.infiniteLoop && (0 == o.active.index && s > 0 || o.active.last && 0 > s) ? b(i, "reset", 200) : Math.abs(s) >= o.settings.swipeThreshold ? (0 > s ? r.goToNextSlide() : r.goToPrevSlide(), r.stopAuto()) : b(i, "reset", 200)
                }
                o.viewport.unbind("touchend", V)
            },
            Z = function () {
                var e = t(window).width(),
                    i = t(window).height();
                (a != e || l != i) && (a = e, l = i, r.redrawSlider(), o.settings.onSliderResize.call(r, o.active.index))
            };
        return r.goToSlide = function (e, i) {
            if (!o.working && o.active.index != e) {
                if (o.working = !0, o.oldIndex = o.active.index, o.active.index = 0 > e ? x() - 1 : e >= x() ? 0 : e, o.settings.onSlideBefore(o.children.eq(o.active.index), o.oldIndex, o.active.index), "next" == i ? o.settings.onSlideNext(o.children.eq(o.active.index), o.oldIndex, o.active.index) : "prev" == i && o.settings.onSlidePrev(o.children.eq(o.active.index), o.oldIndex, o.active.index), o.active.last = o.active.index >= x() - 1, o.settings.pager && q(o.active.index), o.settings.controls && W(), "fade" == o.settings.mode) {
                    o.settings.adaptiveHeight && o.viewport.height() != v() && o.viewport.animate({
                        height: v()
                    }, o.settings.adaptiveHeightSpeed), o.children.filter(":visible").fadeOut(o.settings.speed).css({
                        zIndex: 0
                    }), o.children.eq(o.active.index).css("zIndex", o.settings.slideZIndex + 1).fadeIn(o.settings.speed, function () {
                        t(this).css("zIndex", o.settings.slideZIndex), D()
                    })
                } else {
                    o.settings.adaptiveHeight && o.viewport.height() != v() && o.viewport.animate({
                        height: v()
                    }, o.settings.adaptiveHeightSpeed);
                    var s = 0,
                        n = {
                            left: 0,
                            top: 0
                        };
                    if (!o.settings.infiniteLoop && o.carousel && o.active.last) {
                        if ("horizontal" == o.settings.mode) {
                            var a = o.children.eq(o.children.length - 1);
                            n = a.position(), s = o.viewport.width() - a.outerWidth()
                        } else {
                            var l = o.children.length - o.settings.minSlides;
                            n = o.children.eq(l).position()
                        }
                    } else {
                        if (o.carousel && o.active.last && "prev" == i) {
                            var d = 1 == o.settings.moveSlides ? o.settings.maxSlides - m() : (x() - 1) * m() - (o.children.length - o.settings.maxSlides),
                                a = r.children(".bx-clone").eq(d);
                            n = a.position()
                        } else {
                            if ("next" == i && 0 == o.active.index) {
                                n = r.find("> .bx-clone").eq(o.settings.maxSlides).position(), o.active.last = !1
                            } else {
                                if (e >= 0) {
                                    var c = e * m();
                                    n = o.children.eq(c).position()
                                }
                            }
                        }
                    }
                    if ("undefined" != typeof n) {
                        var g = "horizontal" == o.settings.mode ? -(n.left - s) : -n.top;
                        b(g, "slide", o.settings.speed)
                    }
                }
            }
        }, r.goToNextSlide = function () {
            if (o.settings.infiniteLoop || !o.active.last) {
                var t = parseInt(o.active.index) + 1;
                r.goToSlide(t, "next")
            }
        }, r.goToPrevSlide = function () {
            if (o.settings.infiniteLoop || 0 != o.active.index) {
                var t = parseInt(o.active.index) - 1;
                r.goToSlide(t, "prev")
            }
        }, r.startAuto = function (t) {
            o.interval || (o.interval = setInterval(function () {
                "next" == o.settings.autoDirection ? r.goToNextSlide() : r.goToPrevSlide()
            }, o.settings.pause), o.settings.autoControls && 1 != t && A("stop"))
        }, r.stopAuto = function (t) {
            o.interval && (clearInterval(o.interval), o.interval = null, o.settings.autoControls && 1 != t && A("start"))
        }, r.getCurrentSlide = function () {
            return o.active.index
        }, r.getCurrentSlideElement = function () {
            return o.children.eq(o.active.index)
        }, r.getSlideCount = function () {
            return o.children.length
        }, r.redrawSlider = function () {
            o.children.add(r.find(".bx-clone")).outerWidth(u()), o.viewport.css("height", v()), o.settings.ticker || S(), o.active.last && (o.active.index = x() - 1), o.active.index >= x() && (o.active.last = !0), o.settings.pager && !o.settings.pagerCustom && (w(), q(o.active.index))
        }, r.destroySlider = function () {
            o.initialized && (o.initialized = !1, t(".bx-clone", this).remove(), o.children.each(function () {
                void 0 != t(this).data("origStyle") ? t(this).attr("style", t(this).data("origStyle")) : t(this).removeAttr("style")
            }), void 0 != t(this).data("origStyle") ? this.attr("style", t(this).data("origStyle")) : t(this).removeAttr("style"), t(this).unwrap().unwrap(), o.controls.el && o.controls.el.remove(), o.controls.next && o.controls.next.remove(), o.controls.prev && o.controls.prev.remove(), o.pagerEl && o.settings.controls && o.pagerEl.remove(), t(".bx-caption", this).remove(), o.controls.autoEl && o.controls.autoEl.remove(), clearInterval(o.interval), o.settings.responsive && t(window).unbind("resize", Z))
        }, r.reloadSlider = function (t) {
            void 0 != t && (n = t), r.destroySlider(), d()
        }, d(), this
    }
}(jQuery);