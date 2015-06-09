require.config({
    paths: {
        jquery: '/lib/jqueryui/external/jquery/jquery',
        spectrum: '/lib/jquerycolorpicker/spectrum',
        jqui: '/lib/jqueryui/jquery-ui',
        btncom:'/js/module/btncom/btncom',
        btncom_content:'/js/module/btncom/btncom_content',
        btncom_style:'/js/module/btncom/btncom_style',
        imgcom:'/js/module/imgcom/imgcom',
        imgcom_content:'/js/module/imgcom/imgcom_content',
        imgcom_style:'/js/module/imgcom/imgcom_style',
        imgs: '/js/module/imgs/imgs',
        pagecom:'/js/module/page/pagecom',
        pagecom_content:'/js/module/page/pagecom_content',
        imgcut:'/js/module/page/imgcut'
    },
    shim: {
        'jqui': {
            deps: ['jquery']
        },
        'spectrum': {
            deps: ['jquery']
        }
    }
});

require(['zepto','jquery','spectrum','btncom', 'imgcom',
    'btncom_content','btncom_style','imgcom_content',
    'imgcom_style','jqui','pagecom','imgs'], function (zepto,$,bigcolorpicker,Btncom,Imgcom,btncom_content,btncom_style,imgcom_content,imgcom_style,jqui,Pagecom,Imgs) {

    var Btncom = Btncom.Btncom;
    var Imgcom = Imgcom.Imgcom;
    var procon = $('#prototype-content');
    procon.tabs();
    var pagecom = new Pagecom();
    pagecom.initPage({Btncom: Btncom,Imgcom:Imgcom});
    var selectImgDialog = $('#selectImgDialog');
    selectImgDialog.tabs();



    var addtext = $('#addtext');
    var addimage = $('#addimage');
    var addbutton = $('#addbutton');
    var addpages = $('.add-page-list');

    addpages.on('click', function () {
        pagecom.addPage();
    });
    addimage.on('click', function () {

        Imgs.onImgSelect=function(imgSrc){
            var imgcom = new Imgcom({
                imgSrc:imgSrc
            });
            imgcom.render({
                container: zepto('#showbox')
            });
        };
        Imgs.show();

    });


    addbutton.on('click', function () {
        var pageId = pagecom.getSelectPage();
        var btncom = new Btncom({
            pageId: pageId
        });
        btncom.render({
            container: zepto('#showbox')
        });
    });

    $('#showbox').on('click','.W_item',function (e) {
        var $that = $(this);
        $('#J_pageContent').hide();
        var siblings = $that.siblings();
        $that.addClass('select');
        $that.draggable({
            cursor: 'move',
            containment: 'parent',
            cancel: false
        });
        $that.resizable({
            handles: ' n, e, s, w, ne, se, sw, nw',
            maxWidth: 300,
            minWidth: 50,
            maxHeight: 200,
            minHeight: 20
        });
        $that.disableSelection();
        siblings.removeClass('select');
        siblings.each(function (i, o) {
            if ($(o).resizable('instance')) {
                $(o).resizable('destroy');
            }
            if ($(o).draggable('instance')) {
                $(o).draggable('destroy');
            }

        });
    });
    $('#showbox').on('click',function (e) {
        var issWich = true;
        var $Witem = $(e.target).children();
        $.each($Witem,function(index,item){
            if($(item).hasClass('select')){
                $(item).removeClass('select').resizable('destroy');
            }
          });
        if(issWich){
            var $li = procon.children('ul').children('li');
            var $jp = procon.find('#J_pageContent');
            var $jb = procon.find('#J_btncomContent');
            var $jm = procon.find('#J_imgcomContent');
            if (e.target.className == 'showbox') {
                $li.first().show().siblings('li').addClass('item-visible');
                $jp.show();
                $jb.hide();
                $jm.hide();
            } else {
                $li.siblings('li').removeClass('item-visible');
                $jp.hide();
                var type = $(e.target).data('type');
                if (type == 'btncom') {
                    $jb.show();
                } else if (type == 'imgcom') {
                    $jm.show();
                }
            }
         }  
        e.stopPropagation();
    });


});