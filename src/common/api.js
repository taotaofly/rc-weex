/**
 * Created by baidu on 16/6/8.
 */


var stream
__weex_define__('@weex-temp/api', function (__weex_require__) {
    stream = __weex_require__('@weex-module/stream')
});

var apiURL = {
    baseurl: 'http://dev.redcouch.cn',
    homePage: '/article/list',
    loginPage: '/login'
};

function getData(url, callback) {
    stream.fetch({
        method: 'GET',
        url: url,
        type: 'json'
    }, function (ret) {
        // var retdata = JSON.parse(ret);
        callback(ret.data);
    }, function(response){
        console.log('get in progress:'+response.length);
    });
}

exports.getHomeUrl = function (callback) {
    return apiURL.baseurl + apiURL.homePage;
    // getData(apiURL.baseurl + apiURL.homePage, callback);
};

exports.getBaseUrl = function (bundleUrl, isnav) {
    bundleUrl = new String(bundleUrl);
    var nativeBase;
    var isAndroidAssets = bundleUrl.indexOf('file://assets/') >= 0;

    var isiOSAssets = bundleUrl.indexOf('file:///') >= 0 && bundleUrl.indexOf('WeexDemo.app') > 0;
    if (isAndroidAssets) {
        nativeBase = 'file://assets/dist/';
    }
    else if (isiOSAssets) {
        nativeBase = bundleUrl.substring(0, bundleUrl.lastIndexOf('/') + 1);
    }
    else {
        var host = 'http://localhost:8080';
        var matches = /\/\/([^\/]+?)\//.exec(bundleUrl);
        if (matches && matches.length >= 2) {
            host = matches[1];
        }

        //此处需注意一下,tabbar 用的直接是jsbundle 的路径,但是navigator是直接跳转到新页面上的.
        if (typeof window === 'object') {
            nativeBase = isnav ? 'http://' + host + '/index.html?page=./dist/' : '/dist/';
        } else {
            nativeBase = 'http://' + host + '/dist/';
        }
    }

    return nativeBase;
};

function postData(body, url, callback){
    var bodystr = JSON.stringify(body);
    stream.fetch({
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        type: 'json',
        body: bodystr
    }, function (ret) {
        callback(ret.data);
    }, function(response){
        console.log('get in progress:'+response.length);
    });
}

exports.getToken = function (body, callback) {
    postData(body, apiURL.baseurl + apiURL.loginPage, callback);
};

exports.getBaseClientInfo = function(bundleUrl){
    var nativePlatform;
    var isAndroidAssets = bundleUrl.indexOf('file://assets/') >= 0;
    var isiOSAssets = bundleUrl.indexOf('file:///') >= 0 && bundleUrl.indexOf('WeexDemo.app') > 0;
    if (isAndroidAssets) {
        nativePlatform = 'Android';
    } else if (isiOSAssets) {
        nativePlatform = 'iOS';
    } else {
        nativePlatform = 'H5';
    }
    return nativePlatform;
}