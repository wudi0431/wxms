var express = require('express');
var router = express.Router();
var filter = require('../passport.js');
var Btncom = require('../../db/btncom');


router.post('/', function (req, res, next) {
    filter.authorize(req, res, function (req, res) {
        var btncom = req.body;
        Btncom.updateBtncom(btncom, function (err, btncomEntity) {
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
                    model: btncomEntity
                });
            }
        });
    });
});

module.exports = router;