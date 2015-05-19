if (typeof exports === 'undefined') {
    exports = {};
}
exports.config = {
    "name": "searchImgcom",
    "desc": "查询图片组件",
    // 线上地址
    "url": "http://xxx/searchImgcom",
    // 日常地址
    "urlDaily": "http://xxxx/searchImgcom",
    // 预发地址
    "urlPrepub": "http://example.com/searchImgcom",
    // 支持的 Method 集合
    "method": ['POST']
};
exports.request = {
    "id" : "123"    // 如果不传ID,则查询所有图片组件
};
exports.response = {
    "success": true, // 标记成功
    "model": {
        ImgcomList:[
            ImgcomSchema //db的imgcom表
        ]
    }
};
exports.responseError = {
    "success": false, // 标记失败
    "model": {
        "error": "Error message"
    }
};