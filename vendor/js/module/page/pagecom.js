/**
 * Created by wudi on 15/5/27.
 */
define(['jquery','jqui','zepto'], function($,jqui,zepto) {


var index =0;

var projectId =  getQueryString("projectId");

function Pagecom(){
    this.index=index;
    this.pageList=[];
    this.isfistadd=true;
};

Pagecom.prototype={
    constructor:Pagecom,
    // 初始化page页面
    initPage:function(ops){
        var that =this;
        $.ajax({
            method: "GET",
            url: "/getPageList?projectId="+projectId
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
                        $.ajax({
                            method: "GET",
                            url: "/getBtncomListByPageId?pageId="+page._id
                        }).done(function (msg) {
                            console.log(msg);
                            if(msg.success){
                                if(ops.Btncom){

                                    msg.model.btncomtList.forEach(function(btn){
                                        var newBtncom = new ops.Btncom({data:btn});
                                        newBtncom.render({
                                               container:zepto('#showbox')
                                           });
                                    });
                                }
                            }
                        }).fail(function (msg) {
                            console.log(msg)
                        });

                    });
                }


            }
        }).fail(function (msg) {
            console.log(msg)
        });


    },
    // 添加页面
    addPage:function(){
        var that =this;
        var $addPageDailog =$('#addPageDailog').dialog({
            resizable: false,
            width:500,
            height:600,
            title:"选择模板",
            modal: true,
            dialogClass: "fasdfasdfasdfsd"
        });

        $(".tmpl-item").on('click',function(){
            if($(this).attr('tmpl-index')==-1){
                $addPageDailog.dialog( "close" );
                that.addPageTitle(that.index,true)
                that.clearIphone();
                that.savePage();
            }
        });

    },
    // 默认添加页面
    addFirstPage:function(){
        this.isfistadd && this.addPageTitle(index,true) ;
        this.isfistadd=false;
        this.savePage();
    },
    //页面模板
    addPageTitle:function(index,isadd,name){
        if(isadd) {
            this.index = ++index;
        }else{
            this.index=index;
        }
        var defname ='第'+this.index+'页';
        if(name){
            defname=name;
        }
        this.addpage =$('.add-page-list');
        var html=$('<div class="page-item ui-sortable-handle" data-index='+ this.index+'>'+
            '<a data-set="selected" class="sort-page js-sort-page cur-sort-page" href="javascript:;"></a>'+
            '<span data-set="selected" class="disp">'+defname+'</span>'+
            '<div class="page-edit" style="display: none;" data-role="title-edit">'+
            '<input placeholder="请输入不超过100个字" maxlength="100" class="edit" type="text" value="'+defname+'">'+
            '<a data-role="btn-edit-cancel" title="取消" class="ico-del" href="javascript:;" style="text-decoration: none;"></a>'+
            '<a data-role="btn-edit-post" title="确定" class="ico-right" href="javascript:;" style="text-decoration: none;"></a>'+
            '</div>'+
            '<a data-role="btn-del-scene" title="删除" class="ico-del" href="javascript:;"></a>'+
            ' <a data-role="scene-copy" title="复制" class="ico-copy" href="javascript:;"></a>'+
            '<a data-role="btn-edit-scene" title="修改" class="ico-edit" href="javascript:;"></a>'+
            '</div>');

        this.addpage.before(html);
    },
    //保存页面
    savePage: function () {
        var that =this;
        var pageEntity = {
            name: "第"+ this.index+"页",
            sortindex:this.index,
            background:'#fff'
        };
        $.ajax({
            method: "POST",
            url: "/addPage",
            data: {
                projectId:projectId,
                page:pageEntity
            }
        }).done(function (msg) {
            console.log(msg);
            that.pageList.push(msg.model);
            that.bindUI();

        }).fail(function (msg) {
            console.log(msg)
        });

    },
    //更新页面
    updataPage:function(pageEntity){
        $.ajax({
            method: "POST",
            url: "/updatePage",
            data:pageEntity
        }).done(function (msg) {
            console.log(msg)
        }).fail(function (msg) {
            console.log(msg)
        });

    },
    //删除页面
    deletePage:function(pageId){
        var that =this;
        $.ajax({
            method: "POST",
            url: "/deletePage",
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
                    $ed.show();
                    $ed.nextAll().addClass("item-visible");
                    break;
                case "btn-edit-cancel":
                    $ed.hide();
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
                    that.addpage.before($(this));
                    break;
                case "btn-del-scene":
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
                            var nextpindex =pindex-1;
                            that.addSelectPage(nextpindex==0?1:nextpindex);
                        }

                    }
                    break;
                default :
                    that.addSelectPage(pindex);
                    break;
            }
        })
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
        $.each(that.$items,function(index,item){
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
        $.each(that.$items,function(index,item){
            var $item = $(item),flag=true;
            var $a = $item.children().first();
            if($item.attr('data-index')== pindex && flag){
                $a.addClass('cur-sort-page');
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