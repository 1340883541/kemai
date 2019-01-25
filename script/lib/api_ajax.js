var __CONFIG__ = {
    // baseUrl:'https://192.168.0.157:9000/',
    // baseUrl:'https://192.168.0.157:8088/',
    // baseUrl:'https://192.168.0.222:9000/',
    baseUrl:'https://calltest.jindinghaiju.com:9000/',
    fixstr:'dhi5ht798eh87dy9JLIdasfdHKHYUyjA'
}

function wApiAjax(par){
    par.data = par.data || '';
    // par.data = createSign(par);
    if(Object.prototype.toString.call(par.files).toLowerCase() === '[object array]'){
        var file = {};
        for(var i = 0, len = par.files.length;i < len;i++){
            file['file'+i] = par.files[i]
        }
        par.files = file;
        console.log(JSON.stringify(par.files))
    }else{
        if(par.files){
            var file = {
                image:par.files
            };
            par.files = file;
            console.log(JSON.stringify(par.files))
        }
    }
    var defaultHeader = {"Content-Type": "application/x-www-form-urlencoded"},
        newHeaders = null;
    if(par.headers){
        newHeaders = Object.assign(defaultHeader,par.headers)
    }else{
        newHeaders = defaultHeader;
    }
    // console.log(JSON.stringify(newHeaders))
    // console.log(JSON.stringify(par.data))
    // console.log(JSON.stringify(par.url))
    api.ajax({
        url: __CONFIG__.baseUrl + par.url,
        method: par.method || 'post',
        timeout:20,
        dataType:par.dataType || 'json',
        headers:newHeaders,
        report:par.report || false,
        data: {
            values: par.data || {},
            files: par.files || {}
        },
    },function(ret, err){
        // console.log(JSON.stringify(ret))
        // console.log(JSON.stringify(err))
        if (ret) {
            par.success && typeof par.success === 'function' && par.success(ret);
        } else {
            wDialog.toast({
                msg:'请求失败，请重试'
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
function createSign(par){
    var today = new Date();
	today.setHours(0);
	today.setMinutes(0);
	today.setSeconds(0);
	today.setMilliseconds(0);
	today = today.getTime()/1000;
	var md5_str,parameters;
    // console.log(today)
	if(par.data == '') {
		md5_str = hex_md5( today + __CONFIG__.fixstr);
		parameters = {};
	} else {
		md5_str = hex_md5(par.url + today + __CONFIG__.fixstr);
		parameters = par.data;
	}
	parameters.sign = md5_str;
    // console.log(JSON.stringify(parameters))
	return parameters;
}
