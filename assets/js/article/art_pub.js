$(function () {
    var layer = layui.layer
    var form = layui.form

    initCate()
    // 1.定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }

    //2.初始化富文本编辑器
    initEditor()

    // 3.1 初始化图片裁剪器
    var $image = $('#image')

    // 3.2 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮， 选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 5.设置图片
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var file = e.target.files[0]
        // 判断用户是否选择了文件
        if (file == undefined) {
            return;
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 6.设置状态
    var state = '已发布'
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    // 7.添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 创建formData对象，收集数据
        var fd = new FormData(this)
        // 放入状态
        fd.append('state', state)
        // 放入图片
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                console.log(...fd);
                // 发起 ajax 数据请求
                publishArticle(fd)
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click()
                }, 1500)
            }
        })
    }
})