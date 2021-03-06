if (typeof exports === 'undefined') {
    exports = {};
}
exports.config = {
    "name": "addBtncom",
    "desc": "新增按钮组件",
    // 线上地址
    "url": "http://xxx/addBtncom",
    // 日常地址
    "urlDaily": "http://xxxx/addBtncom",
    // 预发地址
    "urlPrepub": "http://example.com/addBtncom",
    // 支持的 Method 集合
    "method": ['POST']
};
exports.request = {
    pageId:'1332edf',  //关联 pageid
    btnCom:BtnComSchema //db的btncom表;
};
exports.response = {
    "success": true, // 标记成功
    "model": BtnComSchema //db的btncom表;
};
exports.responseError = {
    "success": false, // 标记失败
    "model": {
        "error": "Error message"
    }
};