var __CONFIG__ = {
    // baseUrl:'http://192.168.0.235/',
    baseUrl:'http://192.168.0.157:9000/',
    fixstr:'dhi5ht798eh87dy9JLIdasfdHKHYUyjA'
}
var beUrl='https://192.168.0.214:8088/';
var besUrl='http://192.168.0.157:9000/';

function wApiAjax(par){
    par.data = par.data || '';
    par.data = createSign(par);
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
    api.ajax({
        url: __CONFIG__.baseUrl + par.url,
        method: par.method || 'post',
        timeout:20,
        dataType:par.dataType || 'json',
        headers:par.header || 'application/json;charset=utf-8',
        report:par.report || false,
        data: {
            values: par.data || {},
            files: par.files || {}
        },
    },function(ret, err){
        if (ret) {
            par.success && typeof par.success === 'function' && par.success(ret);
        } else {
            wDialog.toast({
                msg:'请求失败，请重试'
            })
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
