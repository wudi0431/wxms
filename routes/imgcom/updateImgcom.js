var express = require('express');
var router = express.Router();
var filter = require('../passport.js');
var Imgcom = require('../../db/imgcom');



router.post('/', function (req, res, next) {
    filter.authorize(req, res, function (req, res) {
        var imgcom = req.body;
        console.log(imgcom)
        Imgcom.updateImgcom(imgcom, function (err, imgcomEntity) {
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
                    model: imgcomEntity
                });
            }
        });
    });
});

module.exports = router;