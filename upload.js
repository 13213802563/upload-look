$(function() {
    var $list = $('#thelist'),
        $btn = $('#ctlBtn'),
        state = 'pending';
    var uploader = WebUploader.create({
        // swf文件路径
        swf: './plugIns/webuploader-0.1.5/Uploader.swf',
        // 文件接收服务端。
        server: '/file/upload',
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#picker',
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,
        // 开起分片上传。
        chunked: true,
        //fileSingleSizeLimit: 10*1024*1024,//限制大小10M，单文件
        //fileSizeLimit: allMaxSize*1024*1024,//限制大小10M，所有被选文件，超出选择不上
        //设置允许上传的文件类型，不过点击选择文件的时候会很卡
        // accept: {
        //     title: 'Images',
        //     extensions: 'jpg,png',
        //     mimeTypes: 'image/*'
        // }
    });
    // 当有文件被添加进队列的时候
    uploader.on('fileQueued', function(file) {
        let typeList = ['png', 'jpg', 'txt', 'xls', 'doc', 'ppt', 'pdf', 'mp4','docx','pptx','xlsx'];
        if(!typeList.includes(file.name.split('.')[1])){
            alert("不支持的文件类型！");
            uploader.removeFile( file );
            return;
        }


        $list.append('<div id="' + file.id + '" class="item">' +
            '<h4 class="info">' + file.name + '</h4>' +
            '<p class="state">等待上传...</p>' +
            '</div>');
    });
    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function(file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if (!$percent.length) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css('width', percentage * 100 + '%');
    });
    uploader.on('uploadSuccess', function(file) {
        getFileList();
        $('#' + file.id).find('p.state').text('已上传');
    });

    uploader.on('uploadError', function(file) {
        $('#' + file.id).find('p.state').text('上传出错');
    });

    uploader.on('uploadComplete', function(file) {
        $('#' + file.id).find('.progress').fadeOut();
    });

    uploader.on('all', function(type) {
        if (type === 'startUpload') {
            state = 'uploading';
        } else if (type === 'stopUpload') {
            state = 'paused';
        } else if (type === 'uploadFinished') {
            state = 'done';
        }

        if (state === 'uploading') {
            $btn.text('暂停上传');
        } else {
            $btn.text('开始上传');
        }
    });

    $btn.on('click', function() {
        if (state === 'uploading') {
            uploader.stop();
        } else {
            uploader.upload();
        }
    });
});
