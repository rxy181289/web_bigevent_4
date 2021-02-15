// 入口函数
$(function () {
    // 1.点击去注册，显示注册区域，隐藏登录区域
    $('#link-reg').on('click', function () {
        $('.reg-box').show()
        $('.login-box').hide()
    })
    // 2.点击去登陆，显示登录区域，隐藏注册区域
    $('#link-login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 3.自定义验证规则
    var form = layui.form
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,16}$/
            , '密码必须6到16位，且不能出现空格'
        ],
        // 确认密码规则
        repwd: function (value) {
            var pwd = $('.reg-box input[name=password]').val()
            // 比较
            if (value !== pwd) {
                return '两次密码输入不一致 !'
            }
        }
    })

    // 4.注册功能
    var layer = layui.layer
    $('#form_reg').on('submit', function (e) {
        // 阻止表单提交
        e.preventDefault()
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val(),
            },
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 提交成功后的处理代码
                layer.msg('注册成功，请登录！')
                // 手动切换到登录表单
                $('#link-login').click()
                // 重置form表单
                $('#form_reg')[0].reset()
            }
        })
    })

    // 5.登录功能
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 提示信息 保存token，跳转页面
                layer.msg('恭喜您，登录成功!')
                // 保存token, 未来的接口要使用token.
                localStorage.setItem('token', res.token)
                // 跳转
                location.href = '/index.html'
            }
        })
    })
})