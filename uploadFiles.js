
define(["jquery","config","plupload"],function($,conf,upload){
	
	$("body").off("click").on("click", ".deleteImg", function() {
			$(this).parent().remove();
			if($(".pdfFileDiv").html() == ""){
			   $(".pdfFileDiv").css({
									border: '1px solid #fff'
								});
			}
	});
	$("body").on("click",".loadFile_editConent",function(){
		console.log("我想编辑");
		$(this).css("display","none");
		$(this).parents('.pdfFileDiv').find(".loadFile_editFileNameInput").css("display","inline-block");
		$(this).parents('.pdfFileDiv').find(".fileNameAbbreviation").css("display","none");
		$(this).next().css("display","inline-block");
		$(this).siblings("input").select();

	});

	// 取消编辑操作
	$("body").on("click",".loadFile_cancel",function(){
	
		$(this).parent().css("display","none");
		$(this).parent().prev().css("display","inline-block");
		$(this).parents('.pdfFileDiv').find(".loadFile_editFileNameInput").css("display","none");
		$(this).parents('.pdfFileDiv').find(".fileNameAbbreviation").css("display","inline-block");
	});
	
	//点击确定按钮进行修改数据操作
	$("body").on("click",".loadFile_sure",function(){
		$(this).parent().css("display","none");
		$(this).parent().prev().css("display","inline-block");
		$(this).parents('.pdfFileDiv').find(".loadFile_editFileNameInput").css("display","none");
		$(this).parents('.pdfFileDiv').find(".fileNameAbbreviation").css("display","inline-block");
		var changeInputV = $(this).parents('.pdfFileDiv').find(".loadFile_editFileNameInput").val();
		$(this).parents('.pdfFileDiv').find(".fileNameAbbreviation").attr("title",changeInputV).html(changeInputV);
	    
	    var cll=changeInputV.split('.', 1);
//	    console.log(changeInputV);
	    $(".standing_name").val(cll);
	})
	
	var upload = {};
	
	upload.getUploadImgList = function(field){
		//得到上传的图片
		var imgArray = [];
		$(".file_type_pic_warp").find("li").each(function(){
			if(!$(this).hasClass("UploadProgress")){
				var evImg = {};
				evImg[field] = $(this).find(".fileImg").attr("uploadsrc");
				imgArray.push(evImg);				
			}

		});	
		return imgArray;
	}
	
		
  upload.loadUploadFile = function(browse_button,FileInfoWarp,filterName,onlyOne,deleteImgUrl,UploadCompleteFun,UploadProgressFun) {
		
		/*
		*
		* browse_button   添加文件的按钮盒子id
		* FileInfoWarp    放置文件盒子的id
		* filterName      选择文件名称 img/pdf/word/excel/doc/docx.....
		* onlyOne         选择可上传文件数量(true仅可一个)/(false可上传一个或多个,默认false)
		* deleteImgUrl    上传文件为img时,图片右上角的删除图标
		* 
		*/
		var deleteImgUrl = deleteImgUrl || "./../source/public/img/";
		
		
		if(UploadCompleteFun == undefined )var UploadCompleteFun = function(){};
		if(UploadProgressFun == undefined )var UploadProgressFun = function(){};
		
		
		if(filterName == undefined)var filterName = 'img';
//		var filterName = 'other';
		
		if(filterName == 'img'){
			var filters = [{ //只允许上传图片
				title : "Image files", extensions : "jpg,gif,png" } 
				];
			var onlyOneImg = onlyOne == undefined ? false : true;
		}
		if(filterName == 'other'){
			
			var filters = [{ title : "Pdf files", extensions : "pdf" },{ title: "excel", extensions: "xls" },
							{ title: "Word documents", extensions: "doc,docx,docm,dotx,dotm" },
							{ title: "Compression documents", extensions: "zip,rar,7z,apk" },
						  ];
			var onlyOnePdf = !onlyOne ? true : false;
			
		}
		if(filterName == 'allFile'){
			var filters = [{ title : "Pdf files", extensions : "pdf" },
							{title : "Image files", extensions : "jpg,gif,png" },
							{ title: "Word documents", extensions: "doc,docx,docm,dotx,dotm" },
							{ title: "excel", extensions: "xls" },
							{ title: "Compression documents", extensions: "zip,rar,7z,apk" },
						  ];
			var onlyOnePdf = !onlyOne ? true : false;
		}		
		

		var status = {};
		
				
		function previewImage(file, callback) { //file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
			if(!file || !/image\//.test(file.type)) return; //确保文件是图片
			if(file.type == 'image/gif') { //gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
				var fr = new mOxie.FileReader();
				fr.onload = function() {
					callback(fr.result);
					fr.destroy();
					fr = null;
				}
				fr.readAsDataURL(file.getSource());
			} else {
				var preloader = new mOxie.Image();
				preloader.onload = function() {
					preloader.downsize(100, 100); //先压缩一下要预览的图片,宽300，高300
					var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
					callback && callback(imgsrc); //callback传入的参数为预览图片的url
					preloader.destroy();
					preloader = null;
				};
				preloader.load(file.getSource());
			}
		}
		
		var uploader = new plupload.Uploader({
			chunk_size: "200kb",
			browse_button: browse_button, //触发文件选择对话框的按钮，为那个元素id
			url: conf.baseUrl + 'prj/uploadFiles', //服务器端的上传页面地址
		
		    headers:{"token": $.cookie("token")},
		 
			flash_swf_url: 'js/Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
			silverlight_xap_url: 'js/Moxie.xap', //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
			unique_names: true,
			multi_selection:!onlyOneImg,
//			resize: {   //文件上传的大小限制
//				width: 200,
//				height: 200,
//				crop: true,
//				quality: 60,
//				preserve_headers: false
//			},
			filters: {
					mime_types : filters,
				},
			views: {
				list: true,
				thumbs: true, // Show thumbs
				active: 'thumbs'
			},
			init: {				
				PostInit: function() {
					if(filterName == 'allFile'){
						if($('#'+FileInfoWarp).find(".imgFileDiv").length === 0 && $('#'+FileInfoWarp).find(".imgFileDiv").length === 0){
							$('#'+FileInfoWarp).html("<div class = 'imgFileDiv'></div><div class = 'pdfFileDiv'></div>");
						}
					}
				},
				FilesAdded: function(up, files) {
					var iconFontFilter ;
					// 执行只上传一个图片
					if(onlyOneImg){						
						$('#'+FileInfoWarp).html("");
						$.each(up.files, function (i,file) { 
						 
			               if (up.files.length > 1) { 
			                    up.removeFile(file); 
			                    $("#file-"+file.id).remove();
			                }
			            }); 
		           }
					$("#"+FileInfoWarp).siblings('.upfile').prop("required","true");
					if(filterName == 'img'){
						for(var i = 0, len = files.length; i < len; i++) {							
							var file_name = files[i].name; //文件名
							//构造html来更新UI
							var html = '<li id="file-' + files[i].id + '" class = "UploadProgress"></li>';
							$('#'+FileInfoWarp).append(html);
							! function(i) {
								previewImage(files[i], function(imgsrc) {
									var filesTypeName = files[i].name.substr(files[i].name.indexOf("."));
									$('#file-' + files[i].id).append('<div class="process_bar"></div><img  dataname = '+files[0].name+' uploadSrc = "' + files[i].id  + filesTypeName + '" src="' + imgsrc + '" class = "fileImg"/><img src="' + deleteImgUrl + "deleteImg.png" + '" class="deleteImg">');
								})
							}(i);
						}
					}
					if(filterName == 'allFile'){					
						for(var i = 0, len = files.length; i < len; i++) {

							if(files[i].type.indexOf("word")!=-1){
								iconFontFilter = 'word';
							}
							if(files[i].type.indexOf("pdf")!=-1){
								iconFontFilter = 'pdf';
							}
							if(files[i].type.indexOf("Compression")!=-1){
								iconFontFilter = 'Compression';
							}
							if(files[i].type.indexOf("excel")!=-1){
								iconFontFilter = 'xls';
							}
							if(files[i].type.indexOf("image")!=-1){
								
								var file_name = files[i].name; //文件名
								//构造html来更新UI
								var html = '<li id="file-' + files[i].id + '" class = "UploadProgress"></li>';
								$('#'+FileInfoWarp).find(".imgFileDiv").append(html);
								! function(i) {
									previewImage(files[i], function(imgsrc) {
										var filesTypeName = files[i].name.substr(files[i].name.indexOf("."));
										$('#file-' + files[i].id).append('<div class="process_bar"></div><img dataname = '+files[0].name+' uploadSrc = "' + files[i].id  + filesTypeName + '" src="' + imgsrc + '" class = "fileImg"/><img src="'+deleteImgUrl+'deleteImg.png" class="deleteImg">');
									})
								}(i);								
							}else{
								$(".pdfFileDiv").css({
									border: '1px solid #DBE0E9'
								});
								var filesTypeName = files[i].name.substr(files[i].name.indexOf("."));
								var deleteImgHtml = '<img src = "'+deleteImgUrl + 'xxxx.png" class="deleteImg" style = "margin-left:10px">';
								var iconFileHtml = '<img src = "'+ deleteImgUrl + iconFontFilter+'.png">';
								var fileNameHtmlR = '<span title = '+files[0].name+' class = "fileNameAbbreviation">' + files[0].name + ' </span><input class = "loadFile_editFileNameInput" value = '+files[0].name+' select/>(' + plupload.formatSize(up.files[0].size) + ') <b></b>';
								var editFileButton = "<span class = 'loadFile_editConent'>修改内容</span><span class = 'loadFile_editButtonWarp'><span class = 'loadFile_sure'>确定</span><span class = 'loadFile_cancel'>取消</span></span>"
								
								$("#"+FileInfoWarp).find(".pdfFileDiv").append('<div attachment = '+ files[0].id +filesTypeName +' class = "otherFileWarp " id="' + files[0].id + '">'+iconFileHtml+fileNameHtmlR+deleteImgHtml+editFileButton+'</div>');
							}

						}
					}

		            // 执行只让一个pdf进行上传，上传第二个pdf时候进行终止
		            if(onlyOnePdf){
						if(filterName == 'other'){
							var iconFontFilter;
							if(files[0].type.indexOf("word")!=-1){
									iconFontFilter = 'word';
								}
								if(files[0].type.indexOf("pdf")!=-1){
									iconFontFilter = 'pdf';
								}
								if(files[i].type.indexOf("Compression")!=-1){
								    iconFontFilter = 'Compression';
							    }
								if(files[0].type.indexOf("excel")!=-1){
									iconFontFilter = 'xls';
								}
							
							$("#"+FileInfoWarp).append('<div class = "otherFileWarp " id="' + files[0].id + '"><img style="margin-right:5px" src = "'+ deleteImgUrl +iconFontFilter+'.png"><span>' + files[0].name + ' </span>(' + plupload.formatSize(up.files[0].size) + ') <b></b><img src="'+deleteImgUrl+'deleteImg.png" class="deleteImg" style = "margin-left:10px"></div>');
						}		            	
		            }else{
		            	
						if(filterName == 'other'){
							$('#'+FileInfoWarp).html("");
							$.each(up.files, function (i,file) {
								var iconFontFilter;
								if(files[0].type.indexOf("word")!=-1){
									iconFontFilter = 'word';
								}
								if(files[i].type.indexOf("Compression")!=-1){
								    iconFontFilter = 'Compression';
							    }
								if(files[0].type.indexOf("pdf")!=-1){
									iconFontFilter = 'pdf';
								}
								if(files[0].type.indexOf("excel")!=-1){
									iconFontFilter = 'xls';
								}
								
								if (up.files.length > 1) { 
				                    up.removeFile(file); 	
				                }
									document.getElementById(FileInfoWarp).innerHTML = '<div class = "otherFileWarp " id="' + up.files[0].id + '"><img src = "'+ deleteImgUrl +iconFontFilter+'.png"><span>' + up.files[0].name + ' </span>(' + plupload.formatSize(up.files[0].size) + ') <b></b></div>';
							});						
						}		            	
		            }

					uploader.start();
				},

				Error: function(up, err) {
					if(err.code == -601){
						alert("不允许上传该文件类型！");
					}
					//document.getElementById('uploadfiles').appendChild(document.createTextNode("\nError #" + err.code + ": " + err.message));
				},
				FileUploaded: function(up, file, res) {
					var filesTypeName = file.name.substr(file.name.indexOf("."));
					if(filterName == 'img'){
						$("#file-" + file.id).removeClass("UploadProgress");
					}
					if(filterName == 'other'){
						$("#"+ file.id).attr("attachment",file.id+filesTypeName);
						attachment = JSON.parse(res.response).message;
					}
					
				},
			}
		});
		
		uploader.bind('UploadComplete',function(uploader,files){
			
			$("#"+FileInfoWarp).siblings('.upfile').removeProp("required");
			$("#"+FileInfoWarp).siblings(".help-block").empty();
			
			for(var i in files){
				if(files[i].type == "image/jpeg" || files[i].type == "image/png"){
					$("#file-"+files[i].id).find(".img_upload").remove();

				}
				console.log(files);
			}

		});
		uploader.bind('UploadProgress',function(up, file){
			
			var processHtml = "<div class='img_upload'><p class='process_number'>"+file.percent+"%</p><div style='margin: 0px 0 0 10px;'><span class = 'process_warp'><span class='proess'></span></span></div></div>"
        
			$("#file-" + file.id).find(".process_bar").html(processHtml);	
			$("#file-" + file.id).find(".proess").css("left",(file.percent*0.8)-80+"px");
			if(file.type !== "image/jpeg"){
				
				$("#" + file.id).find("b").html('<span>' + file.percent + "%</span>");
			}					
		});
						
		
		uploader.init();
		
		return function(){
			var result = {};
			var upPercent  = 101;
			result.uploader = uploader;
			if(uploader.files.length != 0){
				upPercent = uploader.files[uploader.files.length-1].percent;
				result.percent = upPercent;
			}
			return result;
		}
		;
	};
	

	upload.getAttachment = function(){
		return $(".otherFileWarp").attr("attachment");
	}
	
	return upload;

});

