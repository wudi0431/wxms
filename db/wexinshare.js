var mongoose = require('mongoose');


var WeiXinShareSchema = new mongoose.Schema({
    title: {type: String, default: ''},
    desc: {type: String, default: ''},
    imgUrl: {type:String,default:''},
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }
});


WeiXinShareSchema.static('deleteWeiXinShare', function (shareid, cb) {
    return this.findByIdAndRemove(shareid, function (err, weixinshareEntity) {
            if (cb) {
                cb(err, weixinshareEntity);
            }
        }
    )
});

WeiXinShareSchema.static('getWeiXinShareByProjectId', function (projectId, cb) {
    return this.findOne({
        project: projectId
    }, cb);
});



var WeiXinShareModel = mongoose.model('WeiXinShare', WeiXinShareSchema);

module.exports = WeiXinShareModel;



