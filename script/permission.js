/**
 *  配置权限
 */
var permissionList = myLocalStorage.getItem('permissionList');
var getSessionPermission = permissionList ? JSON.parse(permissionList) : '';
console.log(permissionList)
var permissionSetting = {
    init:function(){
        if(getSessionPermission){
            var _this = this;
            var perList = getSessionPermission.filter(function(v){
                if(_this.code === v.coding) return v;
            })
            this.perList = perList[0] ? perList[0]['function'] : [];
        }else{
            console.log('获取权限配置列表失败')
        }
    },
    // 客户详情
    CUSDETAIL:{
        code:'007000',
        perList:[],
        // wechat
        fnWechat:function(markType){
            permissionSetting.init.call(this);
            if(this.perList.length !== 0){
                var code = '';
                var some = this.perList.some(function(v){
                    if(v.coding == '007001' || v.coding == '007002' || v.coding == '007003' || v.coding == '007004'){
                        code = v.coding;
                    }
                    return (v.coding == '007001' || v.coding == '007002' || v.coding == '007003' || v.coding == '007004')
                });
                // 有这个权限
                if(some){
                    // 微信号查看 - 销售负责人为自己/不为自己  - 明文/密文
                    if(code == '007001'){
                        if(markType == 0){
                            return true;
                        }else{
                            return false;
                        }
                    }
                    // 微信号查看 - 销售负责人为自己/不为自己  - 密文/密文
                    if(code == '007002'){
                        return false;
                    }
                    // 微信号查看 - 销售负责人为自己/不为自己  - 明文/明文
                    if(code == '007003'){
                        return true;
                    }
                    // 微信号查看 - 销售负责人为自己/不为自己  - 密文/明文
                    if(code == '007004'){
                        if(markType == 0){
                            return false;
                        }else{
                            return true
                        }
                    }
                }
                // 没有  默认是007001
                else{
                    return markType == 0 ? true : false;
                }
            }else{
                return markType == 0 ? true : false;
            }
        },
        // 销售负责人变更
        fnMarketAllot:function(){
            permissionSetting.init.call(this);
            if(this.perList.length !== 0){
                var some = this.perList.some(function(v){
                    return (v.coding == '007005')
                });
                return some;
            }else{
                return false;
            }
        },
        // 渠道负责人变更
        fnChannelAllot:function(){
            permissionSetting.init.call(this);
            if(this.perList.length !== 0){
                var some = this.perList.some(function(v){
                    return (v.coding == '007006')
                });
                return some;
            }else{
                return false;
            }
        }
    },
    // 跟进记录
    FOLLOWRECORD:{
        code:'008000',
        perList:[],
        // wechat
        fnWechat:function(markType){
            permissionSetting.init.call(this);
            if(this.perList.length !== 0){
                var code = '';
                var some = this.perList.some(function(v){
                    if(v.coding == '008001' || v.coding == '008002' || v.coding == '008003' || v.coding == '008004'){
                        code = v.coding;
                    }
                    return (v.coding == '008001' || v.coding == '008002' || v.coding == '008003' || v.coding == '008004')
                });
                console.log(code)
                console.log(markType)
                // 有这个权限
                if(some){
                    console.log('innnnnnnnnnnn')
                    // 微信号查看 - 销售负责人为自己/不为自己  - 明文/密文
                    if(code == '008001'){
                        if(markType == 0){
                            return true;
                        }else{
                            return false;
                        }
                    }
                    // 微信号查看 - 销售负责人为自己/不为自己  - 密文/密文
                    if(code == '008002'){
                        return false;
                    }
                    // 微信号查看 - 销售负责人为自己/不为自己  - 明文/明文
                    if(code == '008003'){
                        return true;
                    }
                    // 微信号查看 - 销售负责人为自己/不为自己  - 密文/明文
                    if(code == '008004'){
                        if(markType == 0){
                            return false;
                        }else{
                            return true
                        }
                    }
                }
                // 没有  默认是00700101
                else{
                    return markType == 0 ? true : false;
                }
            }else{
                return markType == 0 ? true : false;
            }
        },
    }
}
