/**
 * Created by baidu on 16/6/8.
 */


var stream
__weex_define__('@weex-temp/api', function (__weex_require__) {
    stream = __weex_require__('@weex-module/stream')
});

var storage
__weex_define__('@weex-temp/api', function (__weex_require__) {
    storage = __weex_require__('@weex-module/storage')
});

var apiURL = {
    baseurl: 'http://dev.redcouch.cn',
    homePage: '/article/list',
    favoritePage: '/favorite/list',
    loginPage: '/auth/login',
    favoriteAction: '/favorite'
};

function getData(url, callbackSuccess, callbackFailure) {
    stream.fetch({
        method: 'GET',
        url: url,
        type: 'json'
    }, function (res) {
        try {
            callbackSuccess(res.data);
        } catch (e) {
            callbackFailure(res);
        }
    }, function(response){
    });
}

exports.getHomeUrl = function () {
    return apiURL.baseurl + apiURL.homePage;
};

exports.getFavoriteUrl = function() {
    return apiURL.baseurl + apiURL.favoritePage;
}

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

function postData(body, url, callbackSuccess, callbackFailure, header){
    var bodystr = JSON.stringify(body);
    console.log('header: ', header, 'body', bodystr);
    stream.fetch({
        method: 'POST',
        url: url,
        headers: header,
        type: 'json',
        body: bodystr
    }, function (res) {
        try {
            callbackSuccess(res.data);
        } catch (e) {
            callbackFailure(res);
        }
    }, function(response){
    });
}

exports.getToken = function (body, callbackSuccess, callbackFailure) {
    postData(
        body, 
        apiURL.baseurl + apiURL.loginPage, 
        callbackSuccess, 
        callbackFailure, 
        { 'Content-Type': 'application/json'}
    );
};

exports.doFavorite = function(body, callbackSuccess, callbackFailure){
    storage.getItem('accessToken', function(e){
        let header = e.data || '';
        header = header ? 
            {
                'Authorization': 'Bearer ' + header,
                'Content-Type': 'application/json'
            } 
            : 
            {
                'Content-Type': 'application/json'
            };
        postData(body, apiURL.baseurl + apiURL.favoriteAction, callbackSuccess, callbackFailure, header);
    });
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

exports.needLogin = function(res) {
    return res.status === 401;
}
