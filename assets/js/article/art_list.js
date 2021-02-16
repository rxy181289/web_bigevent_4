$(function () {
    // 为art-template定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 1.需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 2.初始化文章列表
    var layer = layui.layer;
    initTable();
    // 封装初始化文章列表函数
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                // 获取成功，渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用分页
                renderPage(res.total)
            }
        })
    }

    // 3.初始化分类
    var form = layui.form; // 导入form
    initCate()
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 赋值，渲染form
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 4.筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val()
        // 赋值
        q.state = state
        q.cate_id = cate_id
        // 初始化文章列表
        initTable()
    })

    // 5.分页
    var laypage = layui.laypage
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,// 设置默认被选中的分页

            // 分页模块设置，显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条

            // 分页发生切换的时候，触发 jump 回调
            // 触发jump回调的方式有两种：
            // 1.点击页码的时候，回触发jump回调
            // 2.只要调用了laypage.render() 方法，就会出发jump回调
            jump: function (obj, first) {
                // obj： 所有参数所在的对象；first：是否是第一次初始化分页
                // 可以通过first的值，来判断是通过哪种方式，触发的jump回调
                // 如果first的值为true，证明是方式2触发的
                // 否则就是方式1触发的


                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                q.pagesize = obj.limit
                if (!first) {
                    // 初始化文章列表
                    initTable()
                }

            }
        })
    }

    // 6.删除
    var layer = layui.layer
    $('tbody').on('click', '.btn-delete', function () {
        // 获取到文章的 id
        var Id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 页面汇总删除按钮个数等于1，页码大于1
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--
                    initTable()
                }
            })

            layer.close(index)
        })
    })
})