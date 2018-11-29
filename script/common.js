// // vue 懒加载
// Vue.use(VueLazyload, {
//     error: '../../wgt/img_loadx@2x.jpg',
//     loading: '../../wgt/img_loadx@2x.jpg'
// });
// 清除 移动端点击的300ms 延迟，点透事件
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
};

// 判断是否登录
function checkLogin() {
    var isLogin = wPref.getPrefs({
        key: "isLogin"
    });
    var userInfo = wPref.getPrefs({
        key: 'userInfo'
    })
    return (isLogin == 1 && userInfo) ? true : false;
};
// 空页面公共组件
// txt => 内容
Vue.component('empty-con', {
    template: '<div class="w-empty" v-if="isShow" @touchstart="touchstart(event)">' +
        '<div class="w-em-img w-fill-img">' +
        '<slot></slot>' +
        '</div>' +
        '<div class="w-em-p" v-text="txt"></div>' +
        '</div>',
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        txt: {
            type: String,
            default: ''
        }
    },
    methods: {
        touchstart: function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
});
// 再次封装 openWin openFrame
// 页面跳转
var wHrefJs = {
    // 关闭当前页面
    backWin: function() {
        api.closeWin({});
    },
    // 点击返回 推送消息
    backWinSendData: function(par) {
        this.sendEvent(par);
        setTimeout(function() {
            api.closeWin({});
        }, 200);
    },
    // 点击返回 在别的window、frame 执行一个事件
    backWinExecData: function(par) {
        this.execScript(par);
        setTimeout(function() {
            api.closeWin({});
        }, 200);
    },
    andriodBackMain: function(par) {
        api.addEventListener({
            name: 'keyback'
        }, function(ret, err) {
            par.cb && typeof par.cb === 'function' && par.cb();
        });
    },
    // 安卓手机自带返回，keyback
    andriodBack: function() {
        api.addEventListener({
            name: 'keyback'
        }, function(ret, err) {
            api.closeWin({});
        });
    },
    // 安卓手机自带返回，keyback execScript
    andriodBackExecData: function(par) {
        var _this = this;
        api.addEventListener({
            name: 'keyback'
        }, function(ret, err) {
            _this.execScript(par);
            setTimeout(function() {
                api.closeWin({});
            }, 200);
        });
    },
    // 安卓手机自带返回，keyback sendEvent
    andriodBackSendData: function(par) {
        var _this = this;
        api.addEventListener({
            name: 'keyback'
        }, function(ret, err) {
            _this.sendEvent(par);
            setTimeout(function() {
                api.closeWin({});
            }, 200);
        });
    },
    backTo: function(name) {
        api.closeToWin({
            name: name
        });
    },
    backToExecData: function(name, par) {
        this.execScript(par);
        setTimeout(function() {
            api.closeToWin({
                name: name
            });
        }, 200);
    },
    backToSendData: function(name, par) {
        this.sendEvent(par);
        setTimeout(function() {
            api.closeToWin({
                name: name
            });
        }, 200);
    },
    backFrame: function() {
        api.closeFrame({});
    },
    backFrameSendData: function(par) {
        this.sendEvent(par);
        setTimeout(function() {
            api.closeFrame({});
        }, 200);
    },
    backFrameExecData: function(par) {
        this.execScript(par);
        setTimeout(function() {
            api.closeFrame({});
        }, 200);
    },
    // 发送推送 api.sendEvent
    sendEvent: function(par) {
        par = par || {};
        par.data = typeof par.data === 'undefined' || Boolean(par.data) === false ? {} : par.data;
        if (par.data) {
            api.sendEvent({
                name: par.name,
                extra: par.data
            });
        } else {
            console.log('api.sendEvent  未传入推送的参数');
        }
    },
    // 在某一个window、frame 执行一个 方法
    execScript: function(par) {
        par = par || {};
        par.name = par.name || '';
        par.frameName = par.frameName || '';
        // par.func 是一个函数名
        par.func = par.func || '';
        if (par.func) {
            api.execScript({
                name: par.name,
                frameName: par.frameName,
                script: par.func
            });
        } else {
            console.log('api.execScript 未传入函数名')
        }
    },
    // 打开一个新的win页面
    // name    必填项 窗口名字  String
    // path    必填项 窗口路径  String
    // param   非必填项  传入的路径  Object
    // bounces 非必填项  窗口是否可以弹动 Boolean
    // allowEdit  非必填项  窗口是否可以编辑，复制，粘贴功能  Boolean
    // reload  非必填项   窗口是否重新加载 Boolean
    openWin: function(par) {
        par = par || {};
        par.param = par.param === undefined || par.param == false ? {} : par.param;
        par.bounces = par.bounces === undefined || par.bounces == false ? false : par.bounces;
        par.allowEdit = par.allowEdit === undefined || par.allowEdit == false ? false : par.allowEdit;
        par.reload = par.reload === undefined || par.reload == false ? false : par.reload;
        api.openWin({
            name: par.name,
            url: par.path,
            pageParam: par.param,
            bounces: par.bounces,
            progress: {
                type: 'page',
                title: '正在加载中...',
                text: '请等待...',
                color: ''
            },
            vScrollBarEnabled: false,
            hScrollBarEnabled: false,
            allowEdit: par.allowEdit,
            reload: par.reload,
            slidBackEnabled: false
        });
    },
    // 打开一个frame par.name par.bounces 必须填
    openFrame: function(par) {
        par = par || {};
        par.param = par.param === undefined || par.param == false ? {} : par.param;
        par.bounces = par.bounces === undefined || par.bounces == false ? false : par.bounces;
        par.allowEdit = par.allowEdit === undefined || par.allowEdit == false ? true : par.allowEdit;
        par.reload = par.reload === undefined || par.reload == false ? false : par.reload;
        par.x = typeof x === 'undefined' || par.x == false ? 0 : par.x;
        par.y = typeof y === 'undefined' || par.y == false ? 0 : par.y;
        par.w = typeof w === 'undefined' || par.w == false ? 'auto' : par.w;
        par.h = typeof h === 'undefined' || par.h == false ? 'auto' : par.h;
        par.bgColor = typeof par.bgColor === 'undefined' || par.bgColor == false ? 'rgba(0,0,0,.5)' : par.bgColor;
        par.animation = typeof par.animation === 'undefined' || par.animation == false ? {} : par.animation;
        par.animation['type'] = par.animation['type'] || 'movein';
        par.animation['subType'] = par.animation['subType'] || 'from_right';
        par.animation['duration'] = par.animation['duration'] || 300;
        /**
		 *	par.animation = {
		 *		type:'none'   默认 none  //无动画效果
		 					  push       //新视图将旧视图推开
							  movein     //新视图移到旧视图上面
							  fade       //交叉淡化过渡（不支持过渡方向）
							  flip       //翻转效果
							  reveal     //将旧视图移开,显示下面的新视图
							  ripple     //滴水效果（不支持过渡方向）
							  curl       //向上翻一页
							  un_curl    //向下翻一页
							  suck       //收缩效果（不支持过渡方向）
							  cube       //立方体翻滚效果

				subType       from_right        //从右边开始动画
							  from_left        //从左边开始动画
							  from_top        //从顶部开始动画
							  from_bottom        //从底部开始动画
			    duration      300
	 	 * }
		 */
        api.openFrame({
            name: par.name,
            url: par.path,
            rect: {
                x: par.x,
                y: par.y,
                w: par.w,
                h: par.h
            },
            pageParam: par.param,
            bounces: par.bounces,
            bgColor: par.bgColor,
            vScrollBarEnabled: false,
            hScrollBarEnabled: false,
            allowEdit: par.allowEdit,
            reload: par.reload,
            animation: par.animation
        });

    }
};

// 只是关闭当前页面
function wBackThisFunc() {
    wHrefJs.backWin();
}
// 错误状态码   0 表示为空   101 表示验证失败   1表示验证成功  102表示长度过短   103表示长度过长  104表示对比验证两个值不相等
var wValidate = {
    flag: {},
    checkPhone: function(phone) {
        var phoneExp = /^1[3456789]\d{9}$/;
        if (phone == 0 || phone == null || phone == undefined) {
            this.flag.code = 0;
            this.flag.status = false;
            return this.flag;
        } else if (!phoneExp.test(phone)) {
            this.flag.code = 101;
            this.flag.status = false;
            return this.flag;
        } else {
            this.flag.code = 1;
            this.flag.status = true;
            return this.flag;
        }
    },
    checkName: function(name) {
        // var nameExp = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,16}/;
        if (name == 0 || name == null || name == undefined) {
            this.flag.code = 0;
            this.flag.status = false;
            return this.flag;
        } else if (name.length < 2) {
            this.flag.code = 102;
            this.flag.status = false;
            return this.flag;
        } else if (name.length > 16) {
            this.flag.code = 103;
            this.flag.status = false;
            return this.flag;
        }
        // else if(!nameExp.test(name)){
        //     this.flag.code = 101;
        //     this.flag.status = false;
        //     return this.flag;
        // }
        else {
            this.flag.code = 1;
            this.flag.status = true;
            return this.flag;
        }
    },
    checkPwd: function(pwd) {
        var pwdExp = /^[a-zA-Z0-9]+$/;
        if (pwd == 0 || pwd == null || pwd == undefined || pwd == '') {
            this.flag.code = 0;
            this.flag.status = false;
            return this.flag;
        } else if (!pwdExp.test(pwd)) {
            this.flag.code = 101;
            this.flag.status = false;
            return this.flag;
        } else if (pwd.length < 6) {
            this.flag.code = 102;
            this.flag.status = false;
            return this.flag;
        } else if (pwd.length > 16) {
            this.flag.code = 103;
            this.flag.status = false;
            return this.flag;
        } else {
            this.flag.code = 1;
            this.flag.status = true;
            return this.flag;
        }
    },
    checkContrastPwd: function(pwd0, pwd1) {
        if (pwd0 === pwd1) {
            this.flag.code = 1;
            this.flag.status = true;
            return this.flag;
        } else {
            this.flag.code = 104;
            this.flag.status = false;
            return this.flag;
        }
    },
    checkIdCard: function(card) {
        // var expCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        if (card == '' || card == null || card == 0 || card == undefined) {
            this.flag.code = 0;
            this.flag.status = false;
            return this.flag;
        }
        // else if(!expCard.test(expCard)){
        //     this.flag.code = 101;
        //     this.flag.status = false;
        //     return this.flag;
        // }
        else {
            this.flag.code = 1;
            this.flag.status = true;
            return this.flag;
        }
    },
    checkAge: function(age) {
        if (age == '' || age == null || age == 0 || age == undefined) {
            this.flag.code = 0;
            this.flag.status = false;
            return this.flag;
        } else {
            this.flag.code = 1;
            this.flag.status = true;
            return this.flag;
        }
    }
};

/**
 * @Author   wp
 * @DateTime 2018-08-07
 * @version  1.0.0
 * @desc     封装 localStorage 方法
 */
var myLocalStorage = {
    local: window.localStorage,
    init: function() {
        if (this.local) {
            return true;
        } else {
            console.log('不支持localStorage方法')
            return false;;
        }
    },
    setItem: function(key, value) {
        if (this.init()) {
            this.local.setItem(key, value);
        }
    },
    getItem: function(key) {
        return this.local.getItem(key);
    },
    clearItem: function(key) {
        this.local.removeItem(key);
    },
    clearAll: function() {
        this.local.clear();
    }
};

/**
 * @Author   wp
 * @DateTime 2018-08-08
 * @version  1.0.0
 * @desc     textarea 自适应
 */
function textareaHeightAdaptionFn(o) {
    o.style.height = o.scrollTop + o.scrollHeight + "px";
};
/**
 *  封装 apicloud 自带的 弹框组件
 *  msg 必填
 */
var wDialog = {
    toast: function(par) {
        par = par || {};
        par.duration = par.duration ? isNaN(Number(par.duration)) == true ? 800 : par.duration : 800;
        par.location = par.location || 'bottom';
        // global 设置为 true 安卓手机上面弹出的位置将会固定在底部区域
        par.global = par.global || true;
        api.toast({
            msg: par.msg,
            duration: par.duration,
            location: par.location,
            global: par.global
        });
    },
    alert: function(par) {
        par = par || {};
        api.alert({
            title: par.title || '',
            msg: par.msg,
            buttons: par.button || ['确定']
        }, function(ret, err) {
            if (ret.buttonIndex == 1) {
                par.cb && typeof par.cb === 'function' && par.cb();
            }
        });
    },
    confirm: function(par) {
        par = par || {};
        api.confirm({
            title: '',
            msg: par.msg,
            buttons: par.button || ['确定', '取消']
        }, function(ret, err) {
            if (ret.buttonIndex == 1) {
                par.sureCb && typeof par.sureCb === 'function' && par.sureCb();
            } else {
                par.cancelCb && typeof par.cancelCb === 'function' && par.cancelCb();
            }
        });
    },
    // 弹出带两个或三个按钮和输入框的对话框
    prompt: function(par) {
        par = par || {};
        api.prompt({
            title: par.title || '',
            msg: par.msg,
            text: par.text || '',
            type: par.type || 'text',
            buttons: par.button || ['确定', '取消'] //若小于两个按钮，会补齐两个按钮；若大于三个按钮，则使用前三个按钮
        }, function(ret, err) {
            console.log(JSON.stringify(ret))
            par.cb && typeof par.cb === 'function' && par.cb(ret);
        });
    },
    // 底部弹出框
    actionSheet: function(par) {
        par = par || {};
        api.actionSheet({
            title: par.title || '',
            cancelTitle: par.cancel || '取消',
            destructiveTitle: par.dest || '',
            buttons: par.button || ['拍照', '从相册中选择'],
            style: {
                layerColor: '', //遮蔽层颜色，仅支持 rgba颜色，默认值：rgba（0, 0, 0, 0.4）
                itemNormalColor: '#F1F1F1', //选项按钮正常状态背景颜色 默认值：#F1F1F1
                itemPressColor: '#F1F1F1', //选项按钮按下时背景颜色，默认值：#E6E6E6
                fontNormalColor: '#007AFF', //选项按钮正常状态文字颜色，默认值：#007AFF
                fontPressColor: '#007AFF', //选项按钮按下时文字颜色，支持#000、#000000、rgb、rgba，默认值：#0060F0
                titleFontColor: '' //标题文字颜色，默认值：#8F8F8F
            }
        }, function(ret, err) {
            if (ret.buttonIndex) {
                par.cb && typeof par.cb === 'function' && par.cb(ret);
            } else {
                console.log('actionSheet 弹出框错误')
            }
        });
    },
    // 显示进度提示框
    showProgress: function(par) {
        par = par || {};
        api.showProgress({
            style: 'default',
            animationType: par.animateType || 'fade',
            title: par.title || '努力加载中...',
            text: par.text || '请稍等...',
            modal: par.modal || true
        });
    },
    // 隐藏进度提示框
    hideProgress: function() {
        api.hideProgress();
    }
};

/**
 *  再次封装 api.setPrefs / api.getPrefs / api.removePrefs
 */
var wPref = {
    // 设置偏好
    setPrefs: function(par) {
        par = par || {};
        api.setPrefs({
            key: par.key,
            value: par.value
        });
    },
    // 获取偏好数据
    getPrefs: function(par) {
        par = par || {};
        if (par.sync === false) {
            api.getPrefs({
                key: par.key
            }, function(ret, err) {
                par.cb && typeof par.cb === 'function' && par.cb(ret);
            });
        } else {
            console.log
            return api.getPrefs({
                sync: par.sync || true,
                key: par.key
            });
        }
    },
    // 移除偏好数据
    removePrefs: function(par) {
        par = par || {};
        api.removePrefs({
            key: par.key
        });

    }
};
/**
 *	封装 UIActionSelector 模块
 */
function funcApiSelector(par) {
    var UIActionSelector = api.require('UIActionSelector');
    UIActionSelector.open({
        datas: par.data,
        layout: {
            row: 5,
            col: par.col || 3,
            height: 30,
            size: 14,
            sizeActive: 16,
            rowSpacing: 5,
            colSpacing: 8,
            maskBg: 'rgba(12,9,51,0.5)',
            bg: '#fff',
            color: '#BBBABA',
            colorActive: '#333',
            colorSelected: '#333'
        },
        animation: true,
        cancel: {
            text: par.cancelTxt || '取消',
            size: 15,
            w: 65,
            h: 40,
            bg: 'rgba(0,0,0,0)',
            bgActive: 'rgba(0,0,0,0)',
            color: '#999',
            colorActive: '#999'
        },
        ok: {
            text: par.okTxt || '确定',
            size: 15,
            w: 65,
            h: 40,
            bg: 'rgba(0,0,0,0)',
            bgActive: 'rgba(0,0,0,0)',
            color: '#7971EA',
            colorActive: '#7971EA'
        },
        title: {
            text: par.title || '',
            size: 12,
            h: 40,
            bg: '#f6f6f6',
            color: '#333'
        },
        fixedOn: api.frameName
    }, function(ret, err) {
        if (ret.eventType === 'ok') {
            par.cb && typeof par.cb === 'function' && par.cb(ret);
        }
    });
};
// 上传图片弹窗弹窗
function uploadImageDialog(par) {
    wDialog.actionSheet({
        cb: function(res) {
            // 拍照
            if (res.buttonIndex == 1) {
                par.cameraFn && typeof par.cameraFn === 'function' && par.cameraFn();
            }
            // 相册
            else if (res.buttonIndex == 2) {
                par.albumFn && typeof par.albumFn === 'function' && par.albumFn();
            }
            // 取消
            else {
                return
            }
        }
    })
}
/**
 *  上传图片
 **/
var wUploadPicture = {
    camera: function(par) {
        par = par || {};
        api.getPicture({
            sourceType: 'camera',
            encodingType: 'jpg',
            mediaValue: 'pic',
            destinationType: par.type || 'url',
            allowEdit: par.allowEdit || true,
            quality: par.quality || 60,
            targetWidth: par.targetWidth || '',
            targetHeight: par.targetHeight || '',
            saveToPhotoAlbum: par.saveToPhote || true
        }, function(ret, err) {
            // alert(JSON.stringify(ret));
            console.log(JSON.stringify(ret));
            if (ret.data || ret.base64Data) {
                par.cb && typeof par.cb === 'function' && par.cb(ret);
            } else {
                console.log('未拍照')
            }
        });

    },
    album: function(par) {
        var UIAlbumBrowser = api.require("UIAlbumBrowser");
        var _this = this;
        UIAlbumBrowser.open({
            max: par.max || 9,
            type: par.type || 'image',
            isOpenPreview: true,
            classify: true,
            selectedAll: true,
            styles: {
                bg: '#000000',
                mark: {
                    icon: '',
                    position: 'top_right',
                    size: 20
                },
                nav: {
                    bg: '#000',
                    titleColor: '#ffffff',
                    titleSize: 18,
                    cancelColor: '#00ff00',
                    cancelSize: 16,
                    finishColor: '#00ff00',
                    finishSize: 16
                }
            },
            rotation: false
        }, function(ret, err) {
            // alert(JSON.stringify(ret))
            console.log(JSON.stringify(ret));
            // console.log(JSON.stringify(err));
            if (ret.eventType == 'confirm' && ret.list.length) {
                _this.transPath(ret.list, par);
            }
        })
    },
    // 转换图片路径城绝对路径
    transPath: function(pathLis, par) {
        var UIAlbumBrowser = api.require("UIAlbumBrowser");
        var arr = [];
        pathLis.forEach(function(v) {
                UIAlbumBrowser.transPath({
                    path: v.path
                }, function(res) {
                    if (res) {
                        arr.push(res.path)
                    }
                })
            })
            // console.log(JSON.stringify(arr))
        par.cb && typeof par.cb === 'function' && setTimeout(function() {
            par.cb(arr)
        }, 300);
    }
};
/**
 *  预览图片 photoBrowser
 */
var wPhotoBrowser = {
    photoBrowser: '',
    init: function() {
        this.photoBrowser = api.require('photoBrowser');
    },
    open: function(par) {
        this.init();
        var _this = this;
        this.photoBrowser.open({
            images: par.imgList || [],
            placeholderImg: par.placeImg || '',
            bgColor: par.bg || '#000',
            activeIndex: par.activeIndex || 0,
            zoomEnabled: par.zoom || true,
            mode: par.mode || 1,
        }, function(ret, err) {
            if (ret.eventType == 'click') {
                par.cb && typeof par.cb === 'function' && par.cb();
                _this.photoBrowser.close();
            }
        });
    },
    close: function() {
        this.init();
        this.photoBrowser.close()
    }
};
