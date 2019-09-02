
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
        par.bgColor = par.bgColor === undefined || par.bgColor == false ? '#fff' : par.bgColor;
        api.openWin({
            name: par.name,
            url: par.path || par.url,
            pageParam: par.param,
            bounces: par.bounces,
            bgColor:par.bgColor,
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
        par.x = typeof par.x === 'undefined' || par.x == false ? 0 : par.x;
        par.y = typeof par.y === 'undefined' || par.y == false ? 0 : par.y;
        par.w = typeof par.w === 'undefined' || par.w == false ? 'auto' : par.w;
        par.h = typeof par.h === 'undefined' || par.h == false ? 'auto' : par.h;
        par.bgColor = typeof par.bgColor === 'undefined' || par.bgColor == false ? 'rgba(0,0,0,.3)' : par.bgColor;
        par.animation = typeof par.animation === 'undefined' || par.animation == false ? {} : par.animation;
        par.animation['type'] = par.animation['type'] || 'none';
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
            url: par.path||par.url,
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
