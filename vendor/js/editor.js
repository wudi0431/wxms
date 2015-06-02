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
        pagecom:'/js/module/page/pagecom',
        pagecom_content:'/js/module/page/pagecom_content'
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
    'imgcom_style','jqui','pagecom'], function (zepto,$,bigcolorpicker,Btncom,Imgcom,btncom_content,btncom_style,imgcom_content,imgcom_style,jqui,Pagecom) {


        var Btncom = Btncom.Btncom;
        var Imgcom = Imgcom.Imgcom;
        var procon =$('#prototype-content')
            procon.tabs();
        var pagecom = new Pagecom();
            pagecom.initPage({Btncom:Btncom});

        var addtext = $('#addtext');
        var addimage = $('#addimage');
        var addbutton = $('#addbutton');
        var addpages = $('.add-page-list');

        addpages.on('click',function(){
            pagecom.addPage();
        });
        addimage.on('click',function(){
            var imgcom = new Imgcom();
            imgcom.render({
                container:zepto('#showbox')
            });
            
        });
        addbutton.on('click',function(){
            var pageId = pagecom.getSelectPage();
            var btncom = new Btncom({
                pageId:pageId
            });
            btncom.render({
                container:zepto('#showbox')
            });
        });


    $('#showbox').on('click','.W_iteam',function(){
        var $that = $(this);
        var siblings = $that.siblings();
        $that.addClass('select');
        $that.draggable();
        $that.resizable({
            handles:' n, e, s, w, ne, se, sw, nw'
        });
        siblings.removeClass('select');
        siblings.each(function(i,o){
            if($(o).resizable( "instance" )){
                $(o).resizable( "destroy" );
            }
        });
    });


    $('#showbox').on('click',function(e){
        var $li = procon.children('ul').children('li');
        var $jp = procon.find('#J_pageContent');
        var $jb = procon.find('#J_btncomContent');
        var $jm = procon.find('#J_imgcomContent');
        if(e.target.className=='showbox'){
            $li.first().show().siblings('li').addClass('item-visible');
            $jp.show();
            $jb.hide();
            $jm.hide();
        }else{
            $li.siblings('li').removeClass('item-visible');
            $jp.hide();
            var type  = $(e.target).data('type');
            if(type=='btncom'){
                $jb.show();
            }else if(type=='imgcom'){
                $jm.show();
            }
        }
    });




        
});