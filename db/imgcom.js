var mongoose = require('mongoose');

var ImgComSchema = new mongoose.Schema({
    imgurl:String,
    zindex:Number,
    top:String,
    left:String,
    width:String,
    height:String,
    opcity:String,
    transform:String,
    bordercolo:String,
    borderwidth:String,
    borderstyle:String,
    borderradius:String,
    boxshadowcolor:String,
    boxshadowwidth:String,
    boxshadowblur:String,
    boxshadowsize:String,
    boxshadowdegree:String,
    paddingtop:String,
    paddingleft:String,
    paddingright:String,
    paddingbottom:String,
    transformrotate:String,
    animationname:String,
    animationduration:String,
    animationdelay:String,
    animationcount:String,
    verticalalign:String,
    href:String,
    hreftype:String,
    dataurl:String,
    datamapping:String,
    page: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page'
    }
});

ImgComSchema.static('deleteImgcom', function (imgcomId,cb) {
    return this.findByIdAndRemove(imgcomId, cb)
});

ImgComSchema.static('getImgcom', function (imgcomId,cb) {
    return this.findById(imgcomId, cb)
});

ImgComSchema.static('getImgcomListByPageId', function (pageId,cb) {
    return this.find({
        page: pageId
    }, cb)
});


ImgComSchema.static('updateImgcom', function (imgcom, cb) {
    var imgcomId = imgcom._id;
    delete imgcom._id;
    delete imgcom.__v;
    delete imgcom.page;
    return this.findOneAndUpdate({
        _id: imgcomId
    }, imgcom,{ 'new': true },cb)
});

var ImgComModel = mongoose.model('ImgCom', ImgComSchema);
module.exports = ImgComModel;