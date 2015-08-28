/*var config = {
    port:9898,
    passport: 'http://yhd.adanghome.com/passport',
    domain:'http://120.132.50.71/wxms',
    previewDomain:'http://mxc.yhd.com/wxms_client'
};*/

var config = {
    port: 9898,
    passport: 'http://yhd.adanghome.com/passport',
    previewDomain: 'http://mxc.yhd.com/wxms_client',
  domain:'http://127.0.0.1'
};

if ( typeof module === "object" && typeof module.exports === "object" ) {
    module.exports = config;
} else {
    if ( typeof define === "function") {
        define( "wxms_config", [], function () { return config; } );
    }
}
