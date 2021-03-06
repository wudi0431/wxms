/**
 * Created by wudi on 15/5/27.
 */
define(['jquery','jqui','zepto','pagecom_content','FFF','imgcut','tpl','wxms_config','audio'],
    function($,jqui,zepto,pagecom_content,FFF,imgcut,TPL,WXMS_config,Audio) {


var index = 0,
    F = FFF.FFF;

        WXMS_config.domain = WXMS_config.domain || '';


var projectId =  getQueryString("projectId");

function Pagecom(){
    this.index=index;
    this.pageList=[];
    this.btnComList=[];
    this.imgComtList = [];
    this.textComtList = [];
    this.audioCom=null;
    this.isfistadd=true;
};
Pagecom.prototype={
    constructor:Pagecom,
    // 初始化page页面
    initPage:function(ops){
        var that =this;
        that.ops=ops;
        that.$showbox =$('#showbox');
        $('.maps_centerShowContainerLoading').addClass('show');
        $.ajax({
            method: "GET",
            url: WXMS_config.domain+"/getPageList?projectId="+projectId
        }).done(function (msg) {

            if(msg.success){
                if(msg.model.pageList.length===0){
                    that.addFirstPage();
                }else{
                    that.isfistadd=false;
                    msg.model.pageList.map(function(page){
                        that.addPageTitle(page.sortindex,false,page.name);
                        that.pageList.push(page);
                        that.bindUI();
                    });
                    that._initCom();
                }
                pagecom_content({curpage:that});

                that.addSelectPage(1);
                setTimeout(function(){
                    $('.maps_centerShowContainerLoading').removeClass('show');
                },300)
            }
        }).fail(function (msg) {
            console.log(msg)
        });
        that._setWeixinShare();

    },
    _initCom: function (isTpl) {
        var that =this;
        if(isTpl){
            var lastPageDate = that.pageList[that.pageList.length-1];
            that._getComData(lastPageDate._id,lastPageDate.sortindex,isTpl);
        }else{
            that.pageList.forEach(function (page,index) {
                that._getComData(page._id,page.sortindex);
            });
            that.initAuidocom();
            F.on('comChange', function (obj) {
                that.updateCom(obj);
            });
        }


    },
    _getComData:function(id,index,isTpl){
        var that =this;
        $.ajax({
            method: "GET",
            url: WXMS_config.domain+"/getBtncomListByPageId?pageId="+id
        }).done(function (msg) {
            //console.log(msg);
            if(msg.success && index===1){
                if(that.ops.Btncom){
                    msg.model.btncomtList.forEach(function(btn){
                        new that.ops.Btncom({data:btn}).render({
                            container:zepto('#showbox')
                        });
                        that.btnComList.push(btn);
                    });
                }
            }else{
                msg.model.btncomtList.forEach(function (btn) {
                    that.btnComList.push(btn);
                });
            }
        }).fail(function (msg) {
            console.log(msg)
        });

        $.ajax({
            method: "GET",
            url: WXMS_config.domain+"/getImgcomListByPageId?pageId="+id
        }).done(function (msg) {
            if(msg.success && index===1){
                if(that.ops.Imgcom){
                    msg.model.imgcomtList.forEach(function(img){
                        new that.ops.Imgcom({data:img}).render({
                            container:zepto('#showbox')
                        });
                        that.imgComtList.push(img);
                    });
                }
            }else{
                msg.model.imgcomtList.forEach(function (img) {
                    that.imgComtList.push(img);
                });
            }
        }).fail(function (msg) {
            console.log(msg)
        });

        $.ajax({
            method: "GET",
            url: WXMS_config.domain+"/getTextcomListByPageId?pageId="+id
        }).done(function (msg) {
            if(msg.success && index===1){
                if(that.ops.Textcom){
                    msg.model.textcomtList.forEach(function(text){
                        new that.ops.Textcom({data:text}).render({
                            container:zepto('#showbox')
                        });
                        that.textComtList.push(text);
                    });
                }
            }else{
                msg.model.textcomtList.forEach(function (text) {
                    that.textComtList.push(text);
                });
                if(isTpl){
                    that.addSelectPage(index);
                }
            }
        }).fail(function (msg) {
            console.log(msg)
        });
    },
    updateCom: function (obj) {
        var that =this;
        if(obj.type=='btncom'){
            if(obj.isAdd){
                that.btnComList.push(obj.comData);
            }else{
                that.btnComList.forEach(function (btn,index) {
                    if(btn._id===obj.comData._id){
                        btn=obj.comData;
                        if(obj.isRemove){
                            that.btnComList.splice(index,1);
                        }
                    }
                });
            }


        }else if(obj.type=='imgcom') {
            if (obj.isAdd) {
                that.imgComtList.push(obj.comData);
            } else {
                that.imgComtList.forEach(function (img,index) {
                    if (img._id === obj.comData._id) {
                        img = obj.comData;
                        if (obj.isRemove) {
                            that.imgComtList.splice(index, 1);
                        }
                    }
                });
            }
        }else if(obj.type=='textcom') {
            if (obj.isAdd) {
                that.textComtList.push(obj.comData);
            } else {
                that.textComtList.forEach(function (text,index) {
                    if (text._id === obj.comData._id) {
                        text = obj.comData;
                        if (obj.isRemove) {
                            that.textComtList.splice(index, 1);
                        }
                    }
                });
            }
        }else if(obj.type=='Audiocom') {
            if (obj.isRemove) {
                that.audioCom=null;
            } else {
                that.audioCom=obj.comData;
            }
        }
    },
    _addCom: function (pageid) {
        var that=this;
        that.btnComList.forEach(function (btn) {
            if(btn.page===pageid){
                new that.ops.Btncom({data:btn}).render({
                    container:zepto('#showbox')
                });
            }
        });
        that.imgComtList.forEach(function (img) {
            if(img.page===pageid){
                new that.ops.Imgcom({data:img}).render({
                    container:zepto('#showbox')
                });
            }
        });
        that.textComtList.forEach(function (text) {
            if(text.page===pageid){
                new that.ops.Textcom({data:text}).render({
                    container:zepto('#showbox')
                });
            }
        })
    },
    initAuidocom: function () {
        var that =this;
        $.ajax({
            method: "GET",
            url: WXMS_config.domain+"/getAudiocomByprojectId?projectId="+projectId
        }).done(function (msg) {
            if(msg.success && msg.model){
                if(that.ops.Audiocom){
                    new that.ops.Audiocom({data:msg.model,Audio:Audio, audioId:msg.model.audio}).render({
                        container:zepto('#showbox')
                    });
                    that.audioCom=msg.model;
                    Audio.setData(msg.model);
                }
            }

        }).fail(function (msg) {
            console.log(msg)
        });
    },
    // 添加页面
    addPage:function(istpl){
        var that =this;
        //TODO 模板数据处理
        TPL.onTplSelect = function (tplData) {
            var cindex =++that.index;

            tplData.sortindex=cindex;

            tplData.name ='第'+cindex+'页';

            $.ajax({
                type: 'POST',
                url: WXMS_config.domain+'/generationPage',
                data:{
                    allData:tplData,
                    projectId:projectId
                },
                success: function (msg) {
                   console.log(msg);
                    if(that.isfistadd){
                        that.addPageTitle(that.index,true) ;
                    }else{
                        that.addPageTitle(msg.model.sortindex);
                        that.pageList.push(msg.model);
                        that.bindUI();
                        that._initCom(true);
                    }
                }
            });
        };
        TPL.show();

    },
    // 默认添加页面
    addFirstPage:function(){
        this.isfistadd && this.addPageTitle(index,true) ;
        this.isfistadd=false;
        this.savePage();
    },
    //页面模板
    addPageTitle:function(index,isadd,name){
        var that =this;
        if(isadd) {
            that.index = ++index;
        }else{
            that.index=index;
        }
        var defname ='第'+that.index+'页';
        if(name){
            defname=name;
        }
        that.addpage =$('.add-page-list');
        var html=$('<div class="page-item ui-sortable-handle" data-index='+ that.index+'>'+
            '<a data-set="selected" class="sort-page js-sort-page" href="javascript:;"></a>'+
            '<span data-set="selected" class="disp">'+defname+'</span>'+
            '<div class="page-edit" style="display: none;" data-role="title-edit">'+
            '<input data-role="input" placeholder="请输入不超过100个字" maxlength="100" class="edit" type="text" value="'+defname+'">'+
            '<a data-role="btn-edit-cancel" title="取消" class="iconfont icon-close" href="javascript:;" style="text-decoration: none;"></a>'+
            '<a data-role="btn-edit-post" title="确定" class="iconfont icon-check" href="javascript:;" style="text-decoration: none;"></a>'+
            '</div>'+
            '<a data-role="btn-del-scene" title="删除" class="iconfont icon-shanchu" href="javascript:;"></a>'+
            ' <a data-role="scene-copy" title="复制" class="iconfont icon-yhdcopy" href="javascript:;"></a>'+
            '<a data-role="btn-edit-scene" title="修改" class="iconfont icon-bianji" href="javascript:;"></a>'+
            '</div>');

        that.addpage.before(html);
    },
    //保存页面
    savePage: function () {
        var that =this;
        var pageEntity = {
            name: "第"+ this.index+"页",
            sortindex:this.index,
            backgroundcolor:'#bdbdbd',
            backgroundimage:""
        };
        $.ajax({
            method: "POST",
            url: WXMS_config.domain+"/addPage",
            data: {
                projectId:projectId,
                page:pageEntity
            }
        }).done(function (msg) {
            //console .log(msg);
            that.pageList.push(msg.model);
            that.addSelectPage(that.index);
            that.bindUI();

        }).fail(function (msg) {
            console.log(msg)
        });

    },
    //更新页面
    updataPage:function(pageEntity,isSetSytle){
        var that =this;
        $.ajax({
            method: "POST",
            url:WXMS_config.domain+ "/updatePage",
            data:pageEntity
        }).done(function (msg) {
            isSetSytle && that.setPageStyle(msg.model);

        }).fail(function (msg) {
            console.log(msg)
        });

    },
    //删除页面
    deletePage:function(pageId){
        var that =this;
        $.ajax({
            method: "POST",
            url: WXMS_config.domain+"/deletePage",
            data: {
                pageId: pageId
            }
        }).done(function (msg) {
            if(msg.success){
                console.log('删除页面成功');
            }

        }).fail(function (msg) {

        });

    },
    //页面事件绑定
    bindUI:function(){
        var that =this;
        that.$items =$('.page-item');
        that.$pagelist =$('.page-list');
        that.facopy =$('.j_tool_page_copy');
        that.faremove =$('.j_tool_page_remove');
        that.deleteSelectPage();
        that.$pagelist.sortable({
            placeholder: "ui-state-highlight",
            axis: 'y',
            cancel:'div.add-page-list',
            stop: function( event, ui ) {
                if(!ui.item.prev('div').hasClass('add-page-list')){
                    that.updateIndex();
                }else{
                    that.$pagelist.sortable( "cancel" );
                }
            }
        });
        that.addpage.removeClass('ui-sortable-handle');
        that.$pagelist.disableSelection();

        that.$items.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var curitem =$(this);
            var pindex =+curitem.attr('data-index');
            var pageid =curitem.attr('data-pageid');
            var curPageData = that.getPageListByIndex(null,pageid);
            var $ed = curitem.find('[data-role="title-edit"]');
            switch(e.target.dataset.role){
                case "btn-edit-scene":
                    $.each(that.$items,function(index,item){
                        $(item).find('[data-role="title-edit"]').hide();
                    });
                    $ed.css('display','inline-block');
                    $ed.nextAll().addClass("item-visible");
                    break;
                case "btn-edit-cancel":
                    $ed.css('display','none');
                    $ed.nextAll().removeClass("item-visible");
                    break;
                case "btn-edit-post":
                    var title = $ed.find('.edit').val();
                    curPageData.name = title;
                    that.updataPage(curPageData);
                    $ed.hide();
                    $ed.nextAll().removeClass("item-visible");
                    $ed.find('.edit').attr('value',title);
                    curitem.find('.disp').text(title);
                    break;
                case "scene-copy":
                    that.copePage(curPageData);
                    break;
                case "input":
                    $(e.target).focus();
                    break;
                case "btn-del-scene":
                  var d = dialog({
                    id: 'dialog-del-scene',
                    title: '提示',
                    width:200,
                    content: '确定删除?',
                    okValue: '确定',
                    ok: function () {
                      if(curPageData){
                        that.deletePage(curPageData._id,pindex);
                        curitem.remove();
                        that.clearIphone();
                        that.delePageListByIndex(null,pageid);
                        if(that.pageList.length===0){
                          index =  that.pageList.length;
                          that.index =that.pageList.length;
                          that.isfistadd=true;
                          that.addFirstPage();
                        }else{
                          var  $a = curitem.children().first();
                          if($a.hasClass('cur-sort-page')){
                            that.addSelectPage(pindex-1);
                          }
                        }

                      }
                    },
                    cancelValue: '取消',
                    cancel: function () {

                    }
                  });
                  d.show();
                    break;
                default :
                    that.addSelectPage(pindex);
                    break;
            }
        })

        that.facopy.on('click', function () {
            var curpagedata = that.getSelectPageData();
            that.copePage(curpagedata)
        });

        that.faremove.on('click', function () {
          var d = dialog({
            id: 'dialog-faremove',
            title: '提示',
            width:200,
            content: '确定删除?',
            okValue: '确定',
            ok: function () {
              var curpagedata = that.getSelectPageData();
              if(curpagedata){
                that.deletePage(curpagedata._id,curpagedata.sortindex);
                $.each(that.$items, function (index,item) {
                  var curitem =$(item);
                  var pageid =curitem.attr('data-pageid');
                  if(pageid==curpagedata._id){
                    curitem.remove();
                  }
                });
                that.clearIphone();
                that.delePageListByIndex(null,curpagedata._id);
                if(that.pageList.length===0){
                  index =  that.pageList.length;
                  that.index =that.pageList.length;
                  that.isfistadd=true;
                  that.addFirstPage();
                }else{

                  var nextpindex =curpagedata.sortindex-1;
                  that.addSelectPage(nextpindex==0?1:nextpindex);
                }

              }
            },
            cancelValue: '取消',
            cancel: function () {

            }
          });
          d.show();



        });




    },
    //清除iPhone的页面
    clearIphone:function(){
        $('#showbox').html("");
    },
    //获得选中的page数据
    getPageListByIndex:function(index,pageid){
        var onePagedata=null;
        this.pageList.map(function(item){
            if(index && item.sortindex===index){
                onePagedata=item;
            }
            if(pageid && item._id===pageid){
                onePagedata=item;
            }
        });
        return onePagedata;
    },
    //删除page数据
    delePageListByIndex: function (index,pageid) {
        for(var i=0;i<this.pageList.length;i++){
            if(index && this.pageList[i].sortindex==index){
                this.pageList.splice(i,1);
            }
            if(pageid && this.pageList[i]._id==pageid){
                this.pageList.splice(i,1);
            }
        }
        index =  this.pageList.length;
        this.index =this.pageList.length;
    },
    //删除页面
    deleteSelectPage: function () {
        var that =this;
        $.each($('.page-item'),function(index,item){
            var $item = $(item);
            var $a = $item.children().first();
            if($item.attr('data-index')!= that.index){
                $a.removeClass('cur-sort-page');
            }else{
                var curpage = that.getPageListByIndex(that.index);
                curpage && $item.attr('data-pageid',curpage._id);
            }
        });
    },
    //选中单个页面
    addSelectPage: function (pindex) {
        var that =this;
        $.each($('.page-item'),function(index,item){
            var $item = $(item),flag=true;
            var $a = $item.children().first();
            if($item.attr('data-index')== pindex && flag){
                that.clearIphone();
                $a.addClass('cur-sort-page');
                var curpage = that.getPageListByIndex(pindex);
                if(curpage){
                    that.setPageStyle(curpage);
                    that._addCom(curpage._id);
                }
                flag=false;
            }else{
                $a.hasClass('cur-sort-page') &&  $a.removeClass('cur-sort-page');
            }
        });
    },
    //获得被选中的pageid
    getSelectPage:function(){
        var that =this;
        var pageId = null;
        $.each(that.$items,function(index,item){
            var $item = $(item),flag=true;
            var $a = $item.children().first();
            if($a.hasClass('cur-sort-page')){
                pageId = $item.data('pageid');
            }
        });
        return pageId;
    },
    //更新page的排序
    updateIndex: function () {
        var that =this;
        var $pageietm  =$('.page-item');
        $.each($pageietm,function(index,page){
            var pageid =$(page).attr('data-pageid');
            var curpage = that.getPageListByIndex(null,pageid);
            var cindex = ++index;
            curpage.sortindex=cindex;
            $(page).attr('data-index',cindex);
            var $title = $(page).find('.disp');
            if($title.text().indexOf('第')!=-1){
                var n  ="第"+cindex+"页";
                curpage.name=n;
                $title.text(n);
                $(page).find('.edit').attr('value',n);
            }
            that.updataPage(curpage)

        })
    },
    //获取所有page数据
    getPageListData: function () {
        return this.pageList || [];
    },
    //获取选中page数据
    getSelectPageData: function () {
        var curpageid  = this.getSelectPage();
        return this.getPageListByIndex(null,curpageid);
    },
    //设置page样式
    setPageStyle: function (curpage) {
        var that =this;
        var $cont = $('#conten-1');
        var $porcom = $('#prototype-content');
        $porcom.children('ul').children('li').addClass('item-visible').eq(0).removeClass('item-visible')
        $cont.children('div').hide().eq(0).show();
        $porcom.tabs( "option", "active",0);
        if(curpage ==undefined || curpage==null) return false;
        if(curpage.backgroundcolor && curpage.backgroundcolor!=""){
            that.$showbox.css({
                "background-color":curpage.backgroundcolor
            });
            that.$showbox.attr('data-color',curpage.backgroundcolor);
        }else{
            that.$showbox.css({
                "background-color":"#bdbdbd"
            });
            that.$showbox.attr('data-color','#bdbdbd');
        }
        if(curpage.backgroundimage && curpage.backgroundimage!=""){
            that.$showbox.css({
                "background-image":"url("+curpage.backgroundimage+")",
                "background-size":"cover",
                "background-position":"50% 50%"
            });
            that.$showbox.attr('data-image',curpage.backgroundimage);
            imgcut.initImgCut(curpage.backgroundimage);
        }else{
            that.$showbox.css({
                "background-image":"none",
                "background-size":"cover",
                "background-position":"50% 50%"
            });
            that.$showbox.attr('data-image','');
            imgcut.initImgCut(curpage.backgroundimage);
        }
    },
    //复制页面
    copePage: function (pagedata) {
        var that=this,btncomtLis=[],imgcomList=[],textcomList=[];
        if(that.copyid && that.copyid==pagedata._id) return false;
        console.log('that.copyid++++'+that.copyid)
        var pageid = pagedata._id;
        that.copyid=pageid;

        that.btnComList.forEach(function (btn) {
            if(btn.page===pageid){
                btncomtLis.push(btn)
            }
        });
        that.imgComtList.forEach(function (img) {
            if(img.page===pageid){
                imgcomList.push(img)
            }
        });
        that.textComtList.forEach(function (text) {
            if(text.page===pageid){
                textcomList.push(text)
            }
        })

        var tpldata ={
            backgroundcolor: pagedata.backgroundcolor,
            backgroundimage: pagedata.backgroundimage ,
            btncomtList: btncomtLis,
            imgcomList:imgcomList,
            name: pagedata.name,
            textcomList:textcomList
        }
        var $list = $('.page-item');
        var linstindex = +$($list[$list.length-1]).attr('data-index');
        var cindex =linstindex+1;
        that.index=cindex
        tpldata.sortindex=cindex;
        if(tpldata.name.indexOf('第')!=-1){
            var n  ="第"+cindex+"页";
            tpldata.name=n;
        }
        $.ajax({
            type: 'POST',
            url:WXMS_config.domain+'/generationPage',
            data:{
                allData:tpldata,
                projectId:projectId
            },
            success: function (msg) {
                console.log(msg);
                if(that.isfistadd){
                    that.addPageTitle(cindex,true) ;
                }else{
                    that.addPageTitle(msg.model.sortindex);
                    that.pageList.push(msg.model);
                    that.bindUI();
                    that._initCom(true);
                    that.copyid=null;
                }
            }
        });

    },
    //设置分享
    _setWeixinShare: function () {
        $.ajax({
            method: "GET",
            url: WXMS_config.domain+"/getWeiXinShareByProjectId?projectId="+projectId
        }).done(function (msg) {
            if(msg.success && msg.model){
              var $weixinshare  = $('#wxsharedailog');
                $weixinshare.find('#name').val(msg.model.title)
                $weixinshare.find('#description').val(msg.model.desc)
                $weixinshare.find('#description').attr('shareid',msg.model._id)
                $weixinshare.find('#imgUrl').attr('src',msg.model.imgUrl);
            }
        }).fail(function (msg) {
            console.log(msg)
        });
    }
}
//根据 url 的名字 获得 值
function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

return Pagecom;


});
