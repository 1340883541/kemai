var __CONFIG__ = {
    // baseUrl:'https://192.168.0.157:9000/', // 本地
    // baseUrl:'https://192.168.0.222:8765/', // 本地
    // baseUrl:'https://192.168.0.222:9000/', // 本地 小麦
    // baseUrl:'https://192.168.0.112:9000/', // 本地  埃文
    // baseUrl:'https://192.168.0.222:9100/', // 本地
    // baseUrl: 'https://calltest.jindinghaiju.com:9000/',  // 测试
    baseUrl: 'https://call.jindinghaiju.com/', // 正式
    fixstr: 'dhi5ht798eh87dy9JLIdasfdHKHYUyjA',
    // WebSocket
    // wsUrl:'wss://192.168.0.222:9000/websocket/', //本地
    // wsUrl:'wss://192.168.0.222:9100/websocket/', //本地 正式库
    // wsUrl: 'wss://calltest.jindinghaiju.com:9000/websocket/',  // 测试
    wsUrl: 'wss://call.jindinghaiju.com/websocket/', // 正式
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
var isLoginPastDue = false,
    isCanLetApp = false;
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
    // console.log(JSON.stringify(Object.assign({},par.data,{url:par.url})))
    // console.log('url-------------------'+JSON.stringify(par.url))
    api.ajax({
        url: __CONFIG__.baseUrl + par.url,
        method: par.method || 'post',
        timeout: 120,
        dataType: par.dataType || 'json',
        headers: newHeaders,
        report: par.report || false,
        tag:par.url,
        data: {
            values: par.data || {},
            files: par.files || {}
        },
    }, function(ret, err) {
        // console.log(JSON.stringify(ret))
        if(ret && ret.count){
            if(ret.pageNo == 1){
                api.toast({
                    msg: '总共'+ret.count + '条数据',
                    duration: 2000,
                    location: 'bottom'
                });
            }
        }
        // if(ret && ret.reqTime){
        //     api.toast({
        //         msg: '请求 '+ret.reqTime + 'ms时长',
        //         duration: 2000,
        //         location: 'bottom'
        //     });
        // }
        if (ret && ret.code != 500) {
            // console.log(JSON.stringify(ret))
            // console.log(JSON.stringify(newHeaders))
            // console.log(JSON.stringify(par.url))
            if(ret.code == 1001 || ret.code == 1002 || ret.code == 1003){
                if(!isLoginPastDue){
                    isLoginPastDue = true;
                    wDialog.hideProgress();
                    // 清除全局token
                    myLocalStorage.clearItem('token');
                    wPref.removePrefs({key:'userInfo'});
                    wPref.removePrefs({key:'isLogin'});

                    // 清除推送
                    var ajpush = api.require('ajpush');
                    ajpush.bindAliasAndTags({
                        alias:'',
                    },function(res){
                        // 设置别名
                        if(res.statusCode == 0){

                        }
                    })
                    wDialog.alert({
                        msg:'用户信息过期，请重新登录',
                        cb:function(){
                            api.openWin({
                                name: 'login',
                                url: '../login/login.html'
                            });

                        }
                    })
                }
            }
            else if(ret.code == 1005){
                console.log(JSON.stringify(ret))
                if(!isCanLetApp){
                    isCanLetApp = true;
                    setTimeout(function(){
                        isCanLetApp = false;
                    },2000)
                    wDialog.hideProgress();
                    wDialog.toast({
                        msg:'系统正在维护中'
                    })
                }
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
