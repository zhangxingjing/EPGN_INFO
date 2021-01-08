/** layuiAdmin.std-v1.4.0 LPPL License By https://www.layui.com/admin/ */
;layui.define("form", function (e) {
    var s = layui.$,
        t = (layui.layer, layui.laytpl, layui.setter, layui.view, layui.admin),
        i = layui.form,
        a = s("body");
    i.verify({
        nickname: function (e, s) {
            return new RegExp("^[a-zA-Z0-9_一-龥\\s·]+$").test(e) ? /(^\_)|(\__)|(\_+$)/.test(e) ? "用户名首尾不能出现下划线'_'" : /^\d+\d+\d$/.test(e) ? "用户名不能全为数字" : void 0 : "用户名不能有特殊字符"
        },
        pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"]
    }),
        t.sendAuthCode({
            elem: "#LAY-user-getsmscode",
            elemPhone: "#LAY-user-login-cellphone",
            elemVercode: "#LAY-user-login-vercode",
            ajax: {
                url: "http://127.0.0.1:8001/users/sms/",
            }
        }),
        a.on("click", "#LAY-user-get-vercode", function () {
            s(this);
            this.src = "http://127.0.0.1:8001/users/code/?t=" + (new Date).getTime()
        }),
        e("user", {})
});