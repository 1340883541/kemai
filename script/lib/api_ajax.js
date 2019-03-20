var __CONFIG__ = {
    // baseUrl:'https://192.168.0.157:9000/', // 本地
    // baseUrl:'https://192.168.0.157:8081/', // 本地
    // baseUrl:'https://192.168.0.222:9000/', // 本地
    baseUrl: 'https://calltest.jindinghaiju.com:9000/',  // 测试
    // baseUrl: 'https://call.jindinghaiju.com/',  // 正式
    fixstr: 'dhi5ht798eh87dy9JLIdasfdHKHYUyjA'
}
// Object.assign pollify
if (typeof Object.assign != 'function') {
    Object.assign = function(target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}
var requestCount = 0;
function wApiAjax(par) {
    par.data = par.data || '';
    // par.data = createSign(par);
    if (Object.prototype.toString.call(par.files).toLowerCase() === '[object array]') {
        var file = {};
        for (var i = 0, len = par.files.length; i < len; i++) {
            file['file' + i] = par.files[i]
        }
        par.files = file;
        console.log(JSON.stringify(par.files))
    } else {
        if (par.files) {
            var file = {
                image: par.files
            };
            par.files = file;
            console.log(JSON.stringify(par.files))
        }
    }
    var defaultHeader = {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        newHeaders = null;
    if (par.headers) {
        newHeaders = Object.assign({}, defaultHeader, par.headers)
    } else {
        newHeaders = defaultHeader;
    }
    // console.log(JSON.stringify(newHeaders))
    console.log(JSON.stringify(Object.assign({},par.data,{url:par.url})))
    // console.log(JSON.stringify(par.url))
    // if(true){
    //     wDialog.toast({
    //         msg:'系统维护中'
    //     })
    //     wDialog.hideProgress();
    // }else{
        api.ajax({
            url: __CONFIG__.baseUrl + par.url,
            method: par.method || 'post',
            timeout: 20,
            dataType: par.dataType || 'json',
            headers: newHeaders,
            report: par.report || false,
            data: {
                values: par.data || {},
                files: par.files || {}
            },
        }, function(ret, err) {
            // console.log(JSON.stringify(ret))
            // console.log(JSON.stringify(err))
            // TOKEN_DATA = myLocalStorage.getItem('token')
            if (ret && ret.code != 500) {
                if(ret.code == 1001 || ret.code == 1002){
                    wDialog.hideProgress();
                    // 清除全局token
                    myLocalStorage.clearItem('token')
                    wPref.removePrefs({key:'userInfo'})
                    wPref.removePrefs({key:'isLogin'})
                    wDialog.alert({
                        msg:ret.message,
                        cb:function(){
                            api.openWin({
                                name: 'login',
                                url: '../login/login.html'
                            });

                        }
                    })
                }
                else{
                    par.success && typeof par.success === 'function' && par.success(ret);
                }
            } else {
                wDialog.toast({
                    msg: '请求失败，请重试'
                })
                console.log(JSON.stringify(par.url))
                console.log(JSON.stringify(err))
                wDialog.hideProgress();
                par.fail && typeof par.fail === 'function' && par.fail(err);
            }
        });
    // }
}
/**
 * 创建一个sign
 */
function createSign(par) {
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    today = today.getTime() / 1000;
    var md5_str, parameters;
    // console.log(today)
    if (par.data == '') {
        md5_str = hex_md5(today + __CONFIG__.fixstr);
        parameters = {};
    } else {
        md5_str = hex_md5(par.url + today + __CONFIG__.fixstr);
        parameters = par.data;
    }
    parameters.sign = md5_str;
    // console.log(JSON.stringify(parameters))
    return parameters;
}
