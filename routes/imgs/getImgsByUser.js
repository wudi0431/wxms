var express = require('express');
var router = express.Router();
var Imgs = require('../../db/imgs');
var filter = require('../passport.js');
router.get('/', function(req, res, next) {
    var user =  req.session.user;
    filter.authorize(req, res, function (req, res) {
        Imgs.getImgsByUser(user,function (err, imgsEntity) {
            if (err) {
                res.status('500');
                res.send({
                    success: false, // 标记失败
                    model: {
                        error: '系统错误'
                    }
                });
            } else {
                res.status('200');
                res.send({
                    success: true,
                    model: {imgList: imgsEntity}
                });
            }
        });
    });

});

module.exports = router;