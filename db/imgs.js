var mongoose = require('mongoose');

var ImgsSchema = new mongoose.Schema({
    name: String,
    updatetime: Date,
    category: Number,
    path: String,
    user: {
        id: String,
        name: String
    }
});

ImgsSchema.static('getImgsByUser', function (user, cb) {
    return this.find({
        user: user
    }, cb);
});

ImgsSchema.static('getPubImgs', function (cb) {
    return this.find({}).exec(function (err, obj) {
        obj = obj.filter(function (o) {
            return o.user.name === 'admin';
        });
        cb(err, obj);
    });
});


var ImgsModel = mongoose.model('Imgs', ImgsSchema);
module.exports = ImgsModel;