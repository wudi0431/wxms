var express = require('express');
var router = express.Router();
var filter = require('../passport.js');
var Page = require('../../db/page');
/* GET home page. */
router.get('/', function (req, res, next) {
    var pageId = req.query.pageId;
    filter.authorize(req, res, function (req, res) {
        Page.getPage(pageId,function (err, pageEntity) {
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
                    model: pageEntity
                });
            }
        });
    });
});


module.exports = router;