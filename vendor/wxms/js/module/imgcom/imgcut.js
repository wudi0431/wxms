/**
 * Created by wudi on 15/6/3.
 */
define(['jquery','FFF','wxms_config'], function ($,FFF,WXMS_config) {
    // variables
    var canvas, ctx;
    var image;
    var iMouseX, iMouseY = 1;
    var theSelection;
    var F = FFF.FFF;
    WXMS_config.domain = WXMS_config.domain || '';


// define Selection constructor
    function Selection(x, y, w, h){
        this.x = x; // initial positions
        this.y = y;
        this.w = w; // and size
        this.h = h;

        this.px = x; // extra variables to dragging calculations
        this.py = y;

        this.csize = 6; // resize cubes size
        this.csizeh = 10; // resize cubes size (on hover)

        this.bHow = [false, false, false, false]; // hover statuses
        this.iCSize = [this.csize, this.csize, this.csize, this.csize]; // resize cubes sizes
        this.bDrag = [false, false, false, false]; // drag statuses
        this.bDragAll = false; // drag whole selection
    }

// define Selection draw method
    Selection.prototype.draw = function(){

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        // draw part of original image
        if (this.w > 0 && this.h > 0) {
            var temp_canvas = document.createElement('canvas');
            var temp_ctx = temp_canvas.getContext('2d');
            temp_canvas.width = 171;
            temp_canvas.height = 270;
            temp_ctx.drawImage(image, 0, 0, temp_canvas.width, temp_canvas.height);
            ctx.drawImage(temp_canvas, this.x, this.y, this.w, this.h, this.x, this.y, this.w, this.h);
        }

        // draw resize cubes
        ctx.fillStyle = '#f00';
        ctx.fillRect(this.x - this.iCSize[0], this.y - this.iCSize[0], this.iCSize[0] * 2, this.iCSize[0] * 2);
        ctx.fillRect(this.x + this.w - this.iCSize[1], this.y - this.iCSize[1], this.iCSize[1] * 2, this.iCSize[1] * 2);
        ctx.fillRect(this.x + this.w - this.iCSize[2], this.y + this.h - this.iCSize[2], this.iCSize[2] * 2, this.iCSize[2] * 2);
        ctx.fillRect(this.x - this.iCSize[3], this.y + this.h - this.iCSize[3], this.iCSize[3] * 2, this.iCSize[3] * 2);
    }

    function drawScene() { // main drawScene function
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clear canvas

        // draw source image
        ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);

        // and make it darker
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // draw selection
        theSelection.draw();
    }

    function getResults() {
        var temp_ctx, temp_canvas;
        temp_canvas = document.createElement('canvas');
        temp_ctx = temp_canvas.getContext('2d');
        temp_canvas.width = theSelection.w;
        temp_canvas.height = theSelection.h;

        var img_canvas = document.createElement('canvas');
        var img_ctx = img_canvas.getContext('2d');
        img_canvas.width=171;
        img_canvas.height=270;
        img_ctx.drawImage(image, 0, 0, img_canvas.width, img_canvas.height);
        temp_ctx.drawImage(img_canvas, theSelection.x, theSelection.y, theSelection.w, theSelection.h, 0, 0, theSelection.w, theSelection.h);
        var vdata = temp_canvas.toDataURL();



        // dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
        vdata=vdata.split(',')[1];
       var idata = {
           "isbase64":true,
           "imgData":vdata
       };
        $.ajax({
            cache: false,
            type: 'post',
            url: WXMS_config.domain+'/upLoadImg',
            data: idata, 
            success: function (msg) {
                F.trigger('imgcomContextChange',msg.model);
                initImgCut(msg.model.path);
            }
        });

    }


    function initImgCut(scr){

        var canvas = $('<canvas id="imgcom_panel" width="171" height="270"></canvas>');
        var $canvas = $('#imgcom_canvas');

        if(!$('#imgcom_panel').length){
            $canvas.append(canvas);
        }
        if(scr==""){
            $('#imgcom_panel').remove()
            return false ;
        }
        // loading source image
        image = new Image();
        image.onload = function () {
        }
        image.src = scr;

        // creating canvas and context objects
        canvas = document.getElementById('imgcom_panel');
        ctx = canvas.getContext('2d');

        // create initial selection
        theSelection = new Selection(35, 80, 100, 100);

        $('#imgcom_panel').mousemove(function(e) { // binding mouse move event
            var canvasOffset = $(canvas).offset();
            iMouseX = Math.floor(e.pageX - canvasOffset.left);
            iMouseY = Math.floor(e.pageY - canvasOffset.top);

            // in case of drag of whole selector
            if (theSelection.bDragAll) {
                theSelection.x = iMouseX - theSelection.px;
                theSelection.y = iMouseY - theSelection.py;
            }

            for (i = 0; i < 4; i++) {
                theSelection.bHow[i] = false;
                theSelection.iCSize[i] = theSelection.csize;
            }

            // hovering over resize cubes
            if (iMouseX > theSelection.x - theSelection.csizeh && iMouseX < theSelection.x + theSelection.csizeh &&
                iMouseY > theSelection.y - theSelection.csizeh && iMouseY < theSelection.y + theSelection.csizeh) {

                theSelection.bHow[0] = true;
                theSelection.iCSize[0] = theSelection.csizeh;
            }
            if (iMouseX > theSelection.x + theSelection.w-theSelection.csizeh && iMouseX < theSelection.x + theSelection.w + theSelection.csizeh &&
                iMouseY > theSelection.y - theSelection.csizeh && iMouseY < theSelection.y + theSelection.csizeh) {

                theSelection.bHow[1] = true;
                theSelection.iCSize[1] = theSelection.csizeh;
            }
            if (iMouseX > theSelection.x + theSelection.w-theSelection.csizeh && iMouseX < theSelection.x + theSelection.w + theSelection.csizeh &&
                iMouseY > theSelection.y + theSelection.h-theSelection.csizeh && iMouseY < theSelection.y + theSelection.h + theSelection.csizeh) {

                theSelection.bHow[2] = true;
                theSelection.iCSize[2] = theSelection.csizeh;
            }
            if (iMouseX > theSelection.x - theSelection.csizeh && iMouseX < theSelection.x + theSelection.csizeh &&
                iMouseY > theSelection.y + theSelection.h-theSelection.csizeh && iMouseY < theSelection.y + theSelection.h + theSelection.csizeh) {

                theSelection.bHow[3] = true;
                theSelection.iCSize[3] = theSelection.csizeh;
            }

            // in case of dragging of resize cubes
            var iFW, iFH;
            if (theSelection.bDrag[0]) {
                var iFX = iMouseX - theSelection.px;
                var iFY = iMouseY - theSelection.py;
                iFW = theSelection.w + theSelection.x - iFX;
                iFH = theSelection.h + theSelection.y - iFY;
            }
            if (theSelection.bDrag[1]) {
                var iFX = theSelection.x;
                var iFY = iMouseY - theSelection.py;
                iFW = iMouseX - theSelection.px - iFX;
                iFH = theSelection.h + theSelection.y - iFY;
            }
            if (theSelection.bDrag[2]) {
                var iFX = theSelection.x;
                var iFY = theSelection.y;
                iFW = iMouseX - theSelection.px - iFX;
                iFH = iMouseY - theSelection.py - iFY;
            }
            if (theSelection.bDrag[3]) {
                var iFX = iMouseX - theSelection.px;
                var iFY = theSelection.y;
                iFW = theSelection.w + theSelection.x - iFX;
                iFH = iMouseY - theSelection.py - iFY;
            }

            if (iFW > theSelection.csizeh * 2 && iFH > theSelection.csizeh * 2) {
                theSelection.w = iFW;
                theSelection.h = iFH;

                theSelection.x = iFX;
                theSelection.y = iFY;
            }

            drawScene();
        });

        $('#imgcom_panel').mousedown(function(e) { // binding mousedown event
            var canvasOffset = $(canvas).offset();
            iMouseX = Math.floor(e.pageX - canvasOffset.left);
            iMouseY = Math.floor(e.pageY - canvasOffset.top);

            theSelection.px = iMouseX - theSelection.x;
            theSelection.py = iMouseY - theSelection.y;

            if (theSelection.bHow[0]) {
                theSelection.px = iMouseX - theSelection.x;
                theSelection.py = iMouseY - theSelection.y;
            }
            if (theSelection.bHow[1]) {
                theSelection.px = iMouseX - theSelection.x - theSelection.w;
                theSelection.py = iMouseY - theSelection.y;
            }
            if (theSelection.bHow[2]) {
                theSelection.px = iMouseX - theSelection.x - theSelection.w;
                theSelection.py = iMouseY - theSelection.y - theSelection.h;
            }
            if (theSelection.bHow[3]) {
                theSelection.px = iMouseX - theSelection.x;
                theSelection.py = iMouseY - theSelection.y - theSelection.h;
            }


            if (iMouseX > theSelection.x + theSelection.csizeh && iMouseX < theSelection.x+theSelection.w - theSelection.csizeh &&
                iMouseY > theSelection.y + theSelection.csizeh && iMouseY < theSelection.y+theSelection.h - theSelection.csizeh) {

                theSelection.bDragAll = true;
            }

            for (i = 0; i < 4; i++) {
                if (theSelection.bHow[i]) {
                    theSelection.bDrag[i] = true;
                }
            }
        });

        $('#imgcom_panel').mouseup(function(e) { // binding mouseup event
            theSelection.bDragAll = false;

            for (i = 0; i < 4; i++) {
                theSelection.bDrag[i] = false;
            }
            theSelection.px = 0;
            theSelection.py = 0;
        });

        drawScene();

    }

  return {
      initImgCut:initImgCut,
      getResults:getResults
  };
});