var vm = new Vue({
    el: "#LAY_app_body",
    delimiters: ['[[', ']]'],
    data: {
        user_id: sessionStorage.user_id || localStorage.user_id,
        token: sessionStorage.token || localStorage.token,
        username: '',
        job_number: '',
    },
    mounted: function () {
        // 判断用户的登录状态
        if (this.user_id && this.token) {
            axios.get('/user/', {
                // 向后端传递JWT token的方法
                headers: {
                    'Authorization': 'JWT ' + this.token
                },
                responseType: 'json',
                withCredentials: true
            })
                .then(response => {
                    // 加载用户数据
                    this.user_id = response.data.id;
                    this.job_number = response.data.job_number;
                    this.username = response.data.username;
                    console.log(this.user_id, this.job_number, this.username);  // 这里是有值的
                })
                .catch(error => {
                    if (error.response.status == 401 || error.response.status == 403) {
                        location.href = '../../../epgn_front_end/login_2.html';
                    }
                });
        } else {
            location.href = '/login/';
        }
    },
    methods: {
        // 登录
        login: function () {
            location.href = '../../../epgn_front_end/login_2.html';
        },
        // 退出
        logout: function () {
            sessionStorage.clear();
            localStorage.clear();
            location.href = '../../../epgn_front_end/login_2.html';
        },
    }
})