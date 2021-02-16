$(function () {
    // 1.文章类别列表展示
    initArtCateList();
    // 封装函数
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                var str = template('tpl-art-cate', res)
                $('tbody').html(str)
            }
        })
    }

    // 2.显示添加文章分类列表
    var indexAdd = null
    var layer = layui.layer;
    $('#btnAdd').on('click', function () {
        // 利用框架代码，显示提示添加文章类别区域
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        })
    })

    // 3.提交文章分类添加(事件委托)
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                    // 因为我们成功了, 所以要重新获取对应的元素
                }
                initArtCateList()
                layer.msg('文章类别添加成功!')
                layer.close(indexAdd)
            }
        })
    })

    // 4.修改-展示表单
    var indexEdit = null;
    var form = layui.form
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        // 4.2获取Id, 发送ajax获取数据，渲染到页面上
        var Id = $(this).attr('data-id')
        // alert(Id)
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 4.提交-修改
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 5.删除
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id')
        // 显示对话框
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})