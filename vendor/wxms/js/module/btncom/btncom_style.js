define(['FFF', 'jquery', 'spectrum', 'jqui'], function (FFF, $) {
    var F = FFF.FFF;
    var J_btncomStyle = $('#J_btncomStyle');

    var J_btncomColor = $('#J_btncomColor');
    var J_btncomBKColor = $('#J_btncomBKColor');

    var J_btncomborderStyleSelect = $('#J_btncomborderStyleSelect');

    var J_btncomorderColor = $('#J_btncomorderColor');

    var J_BfontFamily = $('#J_BfontFamily');


    var J_btncomboxShadowColor = $('#J_btncomboxShadowColor');

    var J_btncomboxTextShadowColor = $('#J_btncomboxTextShadowColor');

    var uitl = 'px';

    J_btncomColor.spectrum({
        allowEmpty: true,
        color: "#ECC",
        showInput: true,
        containerClassName: "full-spectrum",
        showInitial: true,
        showPalette: true,
        showSelectionPalette: true,
        showAlpha: true,
        maxPaletteSize: 10,
        preferredFormat: "hex",
        localStorageKey: "spectrum.demo",
        hide: function (color) {
            console.log(color);
            var dddc = 'rgba(' + color._r.toFixed() + ',' + color._g.toFixed() + ',' + color._b.toFixed() + ',' + color._a + ')';
            _btncomStyleChange(dddc, 'color');
        }
    });

    J_btncomBKColor.spectrum({
        allowEmpty: true,
        color: "#ECC",
        showInput: true,
        containerClassName: "full-spectrum",
        showInitial: true,
        showPalette: true,
        showSelectionPalette: true,
        showAlpha: true,
        maxPaletteSize: 10,
        preferredFormat: "hex",
        localStorageKey: "spectrum.demo",
        hide: function (color) {
            console.log(color);
            var dddc = 'rgba(' + color._r.toFixed() + ',' + color._g.toFixed() + ',' + color._b.toFixed() + ',' + color._a + ')';
            _btncomStyleChange(dddc, 'backgroundColor');
        }
    });

    J_btncomorderColor.spectrum({
        allowEmpty: true,
        color: "#ECC",
        showInput: true,
        containerClassName: "full-spectrum",
        showInitial: true,
        showPalette: true,
        showSelectionPalette: true,
        showAlpha: true,
        maxPaletteSize: 10,
        preferredFormat: "hex",
        localStorageKey: "spectrum.demo",
        hide: function (color) {
            console.log(color);
            var dddc = 'rgba(' + color._r.toFixed() + ',' + color._g.toFixed() + ',' + color._b.toFixed() + ',' + color._a + ')';
            _btncomStyleChange(dddc, 'borderColor');
        }
    });

    J_btncomboxShadowColor.spectrum({
        allowEmpty: true,
        color: "#ECC",
        showInput: true,
        containerClassName: "full-spectrum",
        showInitial: true,
        showPalette: true,
        showSelectionPalette: true,
        showAlpha: true,
        maxPaletteSize: 10,
        preferredFormat: "hex",
        localStorageKey: "spectrum.demo",
        hide: function (color) {
            console.log(color);
            var dddc = 'rgba(' + color._r.toFixed() + ',' + color._g.toFixed() + ',' + color._b.toFixed() + ',' + color._a + ')';
            setShadow('color', dddc)
        }
    });

    J_btncomboxTextShadowColor.spectrum({
        allowEmpty: true,
        color: "#ECC",
        showInput: true,
        containerClassName: "full-spectrum",
        showInitial: true,
        showPalette: true,
        showSelectionPalette: true,
        showAlpha: true,
        maxPaletteSize: 10,
        preferredFormat: "hex",
        localStorageKey: "spectrum.demo",
        hide: function (color) {
            console.log(color);
            var dddc = 'rgba(' + color._r.toFixed() + ',' + color._g.toFixed() + ',' + color._b.toFixed() + ',' + color._a + ')';
            setTextShadow('color', dddc)
        }
    });

    J_btncomborderStyleSelect.selectmenu({
        width: 120,
        select: function (event, ui) {
            _btncomStyleChange(ui.item.value || 'none', 'borderStyle');
        }
    });

    J_BfontFamily.selectmenu({
        width: 120,
        select: function (event, ui) {
            _textcomStyleChange(ui.item.value || 'Microsoft YaHei', 'fontFamily');
        }
    });


    F.on('renderBtncomStyle', function (data) {
        $.each($('.J_btncom'), function (index, btncom) {
            var $btncom = $(btncom);
            var type = $btncom.data('type');
            var value = data[type];
            if (value == "" || value == undefined || value == null) {
                return false;
            }
            if (typeof value != 'string') {
                value = value.toString();
            }
            if (value && value.indexOf('px') != -1 && type != "boxShadow" && type != "textShadow") {
                value = value.replace('px', '').replace(';', '');
            }
            switch (type) {
                case 'color':
                    if (value != "") J_btncomColor.spectrum("set", value)
                    J_btncomColor.val(value);
                    break;
                case 'backgroundColor':
                    if (value != "") J_btncomBKColor.spectrum("set", value)
                    J_btncomBKColor.val(value);
                    break;
                case 'borderColor':
                    if (value != "") J_btncomorderColor.spectrum("set", value)
                    J_btncomorderColor.val(value);
                    break;
                case 'transform':
                    if (value.indexOf('rotate') != -1) {
                        $btncom.val(value.match(/(\d+)/)[0]);
                    }
                    break;
                case 'opacity':
                    value = parseInt(value * 100).toString();
                    $btncom.val(value);
                    break;
                case 'boxShadow':
                    var vals = value.split(' ')
                    J_btncomboxShadowColor.spectrum("set", vals[4]);
                    J_btncomStyle.find("[data-type=boxShadowSP]").val(vals[1].replace('px',''));
                    J_btncomStyle.find("[data-type=boxShadowBL]").val(vals[2].replace('px',''));
                    J_btncomStyle.find("[data-type=boxShadowY]").val(vals[3].replace('px',''));
                    var d =  J_btncomStyle.find("[data-type=boxShadowX]").attr('deg');
                    J_btncomStyle.find("[data-type=boxShadowX]").val(d||0);
                    $btncom.attr('boxshadow', value);
                    break;
                case 'textShadow':
                    var vals = value.split(' ')
                    J_btncomboxTextShadowColor.spectrum("set", vals[3]);
                    J_btncomStyle.find("[data-type=TextShadowSP]").val(Math.abs(vals[1].replace('px','')));
                    J_btncomStyle.find("[data-type=TextShadowBL]").val(Math.abs(vals[2].replace('px','')));
                    var d =  J_btncomStyle.find("[data-type=TextShadowX]").attr('deg');
                    J_btncomStyle.find("[data-type=TextShadowX]").val(d||0);
                    $btncom.attr('textshadow', value);
                    break;
                default :
                    $btncom.val(Math.round(value));
                    break;
            }
        });

    });

    $.each($('.J_btncom'), function (index, btncom) {
        var $btncom = $(btncom);
        $btncom.on('change', function () {
            var type = $btncom.data('type');
            var value = $btncom.val();
            if (value == "" || value == undefined || value == null ||
                type == 'color' || type == 'backgroundColor' || type == 'borderColor' || type == 'boxShadowColor'
                || type == 'boxShadow' || type == 'textShadow'
            ) {
                return false;
            }
            switch (type) {
                case 'transform':
                    $btncom.attr('deg', value)
                    value = 'rotate(' + value + 'deg)';
                    break;
                case 'opacity':
                    value = parseInt(value) / 100;
                    value = value.toString();
                    break;
                default :
                    value = value + uitl;
            }
            _btncomStyleChange(value, type);
        })
    })

    $.each($('.J_abtncom'), function (index, btncom) {
        var $btncom = $(btncom);
        $btncom.on('click', function () {
            var type = $btncom.data('type');
            var value = $btncom.val();
            var curcom = $('.select');
            var w = curcom.width(), h = curcom.height();
            var p = curcom.position();
            var f = curcom.attr('style');
            f = f.match(/\d+deg/)[0].replace('deg', '');
            var style = curcom.attr('style');
            var index = style.match(/z-index: \d/);
            if (index) {
                index = +index[0].split(':')[1];
            } else {
                index = 1;
            }
            var h = getRotateSize(p.top, p.left, p.left + w, p.top + h, f);
            if (value == undefined || value == null) {
                return false;
            }
            switch (type) {
                case 'totop':
                    value = 0 - (h.top - p.top) + uitl;
                    type = 'top';
                    break;
                case 'tomiddle':
                    value = 255 - h.height / 2 - (h.top - p.top) + uitl;
                    type = 'top';
                    break;
                case 'tobottom':
                    value = 510 - h.height - (h.top - p.top) + uitl;
                    type = 'top';
                    break;
                case 'toleft':
                    value = 0 - (h.left - p.left) + uitl;
                    type = 'left';
                    break;
                case 'toright':
                    value = 320 - h.width - (h.left - p.left) + uitl;
                    type = 'left';
                    break;
                case 'tocenter':
                    value = 160 - h.width / 2 - (h.left - p.left) + uitl;
                    type = 'left';
                    break;
                case 'uptop':
                    var indexs = getItemIndex()[0];
                    value = indexs + 1;
                    type = 'zIndex';
                    break;
                case 'up':
                    value = index + 1;
                    type = 'zIndex';
                    break;
                case 'down':
                    value = index - 1 || 1;
                    type = 'zIndex';
                    break;
                case 'upbottom':
                    var indexs = getItemIndex();
                    indexs = indexs[indexs.length - 1] - 1;
                    value = indexs || 1;
                    type = 'zIndex';
                    break;
                case 'alignleft':
                    value ='left';
                    type = 'textAlign';
                    break;
                case 'aligncenter':
                    value ='center';
                    type = 'textAlign';
                    break;
                case 'alignright':
                    value ='right';
                    type = 'textAlign';
                    break;
                case 'fontWeight':
                    value ='bold';
                    var res = isHasValue($btncom,type,value)
                    if(!res){
                        value ='normal';
                    }
                    break;
                case 'fontStyle':
                    value ='italic';
                    var res = isHasValue($btncom,type,value)
                    if(!res){
                        value ='normal';
                    }
                    break;
                case 'textDecoration':
                    value ='underline';
                    var res = isHasValue($btncom,type,value)
                    if(!res){
                        value ='none';
                    }
                    break;
            }
            if (value != "" && value != undefined && value != null) {
                _btncomStyleChange(value, type);
            }
        })
    })

    $.each($('.J_Bbtncom'), function (index, btncom) {
        var $btncom = $(btncom);
        $btncom.on('change', function () {
            var type = $btncom.data('type');
            var value = $btncom.val();
            switch (type) {
                case 'boxShadowSP':
                    setShadow(type,value);
                    break;
                case 'boxShadowBL':
                    setShadow(type,value);
                    break;
                case 'boxShadowY':
                    setShadow(type,value);
                    break;
                case 'boxShadowX':
                    setShadow(type,value);
                    $btncom.attr('deg',value);
                    break;
            }
        })
    })

    $.each($('.J_Tbtncom'), function (index, btncom) {
        var $btncom = $(btncom);
        $btncom.on('change', function () {
            var type = $btncom.data('type');
            var value = $btncom.val();
            switch (type) {
                case 'TextShadowSP':
                    setTextShadow(type,value);
                    break;
                case 'TextShadowBL':
                    setTextShadow(type,value);
                    break;
                case 'TextShadowX':
                    setTextShadow(type,value);
                    $btncom.attr('deg',value);
                    break;
            }
        })
    })



    function _btncomStyleChange(value, type) {
        F.trigger('btncomStyleChange', {
            type: type,
            value: value
        });
    }

    function d(a, b, c) {
        return {
            x1: Math.round(Math.cos(c * Math.PI / 180) * a + Math.sin(c * Math.PI / 180) * b),
            y1: Math.round(Math.cos(c * Math.PI / 180) * b - Math.sin(c * Math.PI / 180) * a)
        }
    };

    function getRotateSize(a, b, c, e, f) {
        var g = b, h = a, i = c, j = e, k = c - b, l = e - a;
        if (0 !== f) {
            var m = b + k / 2, n = a + l / 2, o = d(b - m, n - a, f), p = d(c - m, n - a, f), q = d(b - m, n - e, f), r = d(c - m, n - e, f);
            g = m - Math.abs(Math.min(o.x1, p.x1, q.x1, r.x1)), h = n - Math.abs(Math.max(o.y1, p.y1, q.y1, r.y1)), i = m + Math.abs(Math.max(o.x1, p.x1, q.x1, r.x1)), j = n + Math.abs(Math.min(o.y1, p.y1, q.y1, r.y1))
        }
        return {left: g, top: h, right: i, bottom: j, width: i - g, height: j - h}
    }

    function getItemIndex() {
        var indexs = [];
        $.each($('.W_item'), function (index, item) {
            var $item = $(item)
            var style = $item.attr('style');
            var index = style.match(/z-index: \d/);
            if (index) {
                index = +index[0].split(':')[1]
                indexs.push(index);
            }
        })
        indexs = indexs.sort(function (a, b) {
            return b - a
        })
        return indexs;
    }

    function setShadow(type, value) {
        var allvalue = J_btncomboxShadowColor.attr('boxshadow');
        if (allvalue) {
            allvalue = allvalue.split(' ')
        }
        var a = allvalue[1].replace('px', ""),
            b = allvalue[2].replace('px', ""),
            c = allvalue[3].replace('px', ""),
            d = allvalue[4],
            e = allvalue[0].replace('px', "");
        switch (type) {
            case 'color':
                d = value;
                break;
            case 'boxShadowSP':
                a=value;
                break;
            case 'boxShadowBL':
                b=value;
                break;
            case 'boxShadowY':
                c=value;
                break;
            case 'boxShadowX':
                e=value;
                break;
        }
        var f = Math.sqrt(Math.pow(e, 2) / (1 + Math.pow(Math.tan((90 - a) * Math.PI / 180), 2))),
            g = Math.sqrt(Math.pow(e, 2) - Math.pow(f, 2));
            a > 0 && 90 >= a ? (f = f, g = 0 - g) : a > 90 && 180 >= a ? (f = f, g = g) : a > 180 && 270 >= a ? (f = 0 - f, g = g) : (f = 0 - f, g = 0 - g);

        var va = Math.round(f) + "px " + Math.round(g) + "px " + b + "px " + c + "px " + d;
        if (va != "" && va != undefined && va != null) {
            _btncomStyleChange(va, 'boxShadow');
        }
        J_btncomboxShadowColor.attr('boxshadow', va);

    }

    function setTextShadow(type, value) {
        var allvalue = J_btncomboxTextShadowColor.attr('textshadow');
        if (allvalue) {
            allvalue = allvalue.split(' ')
        }
        var a = allvalue[0].replace('px', ""),
            b = allvalue[1].replace('px', ""),
            c = allvalue[3],
            d = allvalue[2].replace('px', "");
        switch (type) {
            case 'color':
                c = value;
                break;
            case 'TextShadowSP':
                d=value;
                break;
            case 'TextShadowBL':
                b=value;
                break;
            case 'TextShadowX':
                a=value;
                break;
        }
        var e = Math.sqrt(Math.pow(d, 2) / (1 + Math.pow(Math.tan((90 - a) * Math.PI / 180), 2))),
            f = Math.sqrt(Math.pow(d, 2) - Math.pow(e, 2));
        a > 0 && 90 >= a ? (e = e, f = 0 - f) : a > 90 && 180 >= a ? (e = e, f = f) : a > 180 && 270 >= a ? (e = 0 - e, f = f) : (e = 0 - e, f = 0 - f);

        var va= Math.round(e) + "px " + Math.round(f) + "px " + Math.abs(b) + "px " + c;
        if (va != "" && va != undefined && va != null) {
            _btncomStyleChange(va, 'textShadow');
        }
        J_btncomboxTextShadowColor.attr('textshadow', va);

    }

    function isHasValue(curdom,attr,value){
        var curvalue = curdom.attr(attr);
        if(value==curvalue){
            curdom.removeClass('selectBtnstyle');
            curdom.attr(attr,"");
            return false;
        }else{
            curdom.addClass('selectBtnstyle');
            curdom.attr(attr,value);
            return true;
        }
    }
});