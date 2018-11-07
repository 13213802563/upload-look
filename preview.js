$(function() {
    const typeList = ['png', 'jpg', 'txt', 'xls', 'doc', 'ppt', 'pdf','docx','pptx','xlsx'];
    getFileList = function() {
        $(".list").empty();
        $.get("/file/list", function(data) {
            data = JSON.parse(data);
            for (let file of data) {
                let htmlStr = '<a class="point file" data-file="' + file.name + '" data-size="' + file.size + '" data-type="'+ file.type +'">';
                if (file.type.toLowerCase() == 'png' || file.type.toLowerCase() == 'jpg') {
                    htmlStr = '<a class="file" target="_blank" href="./filelist/' + file.name + '">';
                } else if (file.type.toLowerCase() == 'pdf') {
                    htmlStr = '<a class="file" target="_blank" href="http://localhost:8080/plugIns/pdfjs/web/viewer.html?file=../../../../filelist/' + file.name + '">';
                } else if (file.type.toLowerCase() == 'mp4') {
                    htmlStr = '<a class="file" target="_blank" href="video?path=../../filelist/' + file.name + '">';
                }
                let imgName = file.type=='docx'||file.type=='xlsx'||file.type=='pptx'?file.type.substr(0,file.type.length-1):file.type;
                $(".list").append(
                    '<div class="col-xs-6 col-md-2">' + htmlStr +
                    '<embed src="./images/svg/' + imgName + '.svg" type="image/svg+xml" /><span>' + file.name +
                    '</span></a>&nbsp;<i class="fa fa-eye"></i>&nbsp;<span class="number">'+file.number+'</span></div>'
                );
            }
        });
    }
    getFileList();

    /**
     * 无法直接查看的文件，需要server先进行转换
     */
    $(".list").on("click", ".point", function() {
        let date = new Date().getTime();
        let param = $(this).data("file");
        let type = $(this).data("type");
        if (typeList.indexOf(type)==-1) {
            alert("暂不支持预览的文件类型！");
            return;
        }
        if ($(this).data("size") >= 11534336) {
            alert("文件太大，暂不支持预览！");
            return;
        }
        $('.load').addClass('active');
        $.ajax({
            type: 'post',
            url: '/file/preview',
            data: param,
            contentType: 'application/json',
            dataType: 'text',
            success: function(data) {
                $('.load').removeClass('active');
                console.log("转换耗时===>" + (new Date().getTime() - date) + "ms");
                window.open("http://localhost:8080/plugIns/pdfjs/web/viewer.html?file=../../../../filelist/temp/" + data + ".pdf");
            },
            error: function(error) {
                $('.load').removeClass('active');
                alert("error!");
            }
        });
    });

    /**
     * 查看文件，浏览量累加
     */
    $(".list").on("click", ".file", function() {
        let nSpan = $(this).parent().find('.number');
        nSpan.text(nSpan.text()/1+1);
    });
});

