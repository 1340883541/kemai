(function($) {
    $.fn.mdater = function(config) {
        var defaults = {
            maxDate: null,
            minDate: new Date(1970, 0, 1),
            sureCb:null
        };
        var option = $.extend(defaults, config);
        var input = this;
        var F = {
            getDaysInMonth: function(year, month) {
                return new Date(year, month + 1, 0).getDate();
            },
            getWeekInMonth: function(year, month) {
                return new Date(year, month, 1).getDay();
            },
            getMonth: function(m) {
                return ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][m];
            },
            getLastDayInMonth: function(year, month) {
                return new Date(year, month, this.getDaysInMonth(year, month));
            }
        }
        $.fn.delegates = function(configs) {
            el = $(this[0]);
            for (var name in configs) {
                var value = configs[name];
                if (typeof value == 'function') {
                    var obj = {};
                    obj.click = value;
                    value = obj;
                };
                for (var type in value) {
                    el.on(type,name, value[type]);
                }
            }
            return this;
        }
        var mdater = {
            value: {
                year: '',
                month: '',
                date: ''
            },
            lastCheckedDate: '',
            init: function() {
                this.renderHTML();
                this.initListeners();
            },
            renderHTML: function() {
                var $html = $('<div class="md_mask"></div><div class="md_panel"><div class="md_head"><div class="md_selectarea"><a class="md_prev change_year" href="javascript:void(0);">&lt;</a> <a class="md_headtext yeartag" href="javascript:void(0);"></a> <a class="md_next change_year" href="javascript:void(0);">&gt;</a></div><div class="md_selectarea"><a class="md_prev change_month" href="javascript:void(0);">&lt;</a> <a class="md_headtext monthtag" href="javascript:void(0);">月</a> <a class="md_next change_month" href="javascript:void(0);">&gt;</a></div></div><div class="md_body"><ul class="md_weekarea"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul><ul class="md_datearea in"></ul></div><div class="md_foot"><a href="javascript:void(0);" class="md_cancel">取消</a> <a href="javascript:void(0);" class="md_ok">确定</a></div></div>');
                $(document.body).append($html);
            },
            _showPanel: function(container) {
                this.refreshView();
                $('.md_panel, .md_mask').addClass('show');
            },
            _hidePanel: function() {
                $('.md_panel, .md_mask').removeClass('show');
            },
            _changeMonth: function(add, checkDate) {
                this.saveCheckedDate();
                var monthTag = $('.md_selectarea').find('.monthtag'),
                    num = ~~monthTag.data('month') + add;
                if (num > 11) {
                    num = 0;
                    this.value.year++;
                    $('.yeartag').text(this.value.year).data('year', this.value.year);
                } else if (num < 0) {
                    num = 11;
                    this.value.year--;
                    $('.yeartag').text(this.value.year).data('year', this.value.year);
                }
                var nextMonth = F.getMonth(num) + '月';
                monthTag.text(nextMonth).data('month', num);
                this.value.month = num;
                if (checkDate) {
                    this.value.date = checkDate;
                } else {
                    this.setCheckedDate();
                }
                this.updateDate(add);
            },
            _changeYear: function(add) {
                this.saveCheckedDate();
                var yearTag = $('.md_selectarea').find('.yeartag'),
                    num = ~~yearTag.data('year') + add;
                yearTag.text(num + '年').data('year', num);
                this.value.year = num;
                this.setCheckedDate();
                this.updateDate(add);
            },
            saveCheckedDate: function() {
                if (this.value.date) {
                    this.lastCheckedDate = {
                        year: this.value.year,
                        month: this.value.month,
                        date: this.value.date
                    }
                }
            },
            setCheckedDate: function() {
                if (this.lastCheckedDate && this.lastCheckedDate.year == this.value.year && this.lastCheckedDate.month == this.value.month) {
                    this.value.date = this.lastCheckedDate.date;
                } else {
                    this.value.date = '';
                }
            },
            getDateStr: function(y, m, d) {
                var dayStr = '';
                var week = F.getWeekInMonth(y, m);
                var lastMonthDays = F.getDaysInMonth(y, m - 1);
                for (var j = week - 1; j >= 0; j--) {
                    dayStr += '<li class="prevdate" data-day="' + (lastMonthDays - j) + '">' + (lastMonthDays - j) + '</li>';
                }
                var currentMonthDays = F.getDaysInMonth(y, m);
                var startDay = 1,
                    endDay = currentMonthDays,
                    thisDate = new Date(y, m, d),
                    firstDate = new Date(y, m, 1);
                lastDate = new Date(y, m, currentMonthDays),
                    minDateDay = option.minDate.getDate();
                if (option.minDate > lastDate) {
                    startDay = currentMonthDays + 1;
                } else if (option.minDate >= firstDate && option.minDate <= lastDate) {
                    startDay = minDateDay;
                }
                if (option.maxDate) {
                    var maxDateDay = option.maxDate.getDate();
                    if (option.maxDate < firstDate) {
                        endDay = startDay - 1;
                    } else if (option.maxDate >= firstDate && option.maxDate <= lastDate) {
                        endDay = maxDateDay;
                    }
                }
                for (var i = 1; i < startDay; i++) {
                    dayStr += '<li class="disabled" data-day="' + i + '">' + i + '</li>';
                }
                for (var j = startDay; j <= endDay; j++) {
                    var current = '',
                    	curr = '';
                    if (y == this.value.year && m == this.value.month && d == j) {
                        current = 'current';
                    }
                    var now = new Date();
                    if(y == now.getFullYear() && m == now.getMonth() && j == now.getDate()){
                    	curr = ' curr';
                    }
                    dayStr += '<li class="' + current + curr + '" data-day="' + j + '">' + j + '</li>';
                }
                for (var k = endDay + 1; k <= currentMonthDays; k++) {
                    dayStr += '<li class="disabled" data-day="' + k + '">' + k + '</li>';
                }
                var nextMonthStartWeek = (currentMonthDays + week) % 7;
                if (nextMonthStartWeek !== 0) {
                    for (var i = 1; i <= 7 - nextMonthStartWeek; i++) {
                        dayStr += '<li class="nextdate" data-day="' + i + '">' + i + '</li>';
                    }
                }
                return dayStr;
            },
            updateDate: function(add) {
                var dateArea = $('.md_datearea.in');
                if (add == 1) {
                    var c1 = 'out_left';
                    var c2 = 'out_right';
                } else {
                    var c1 = 'out_right';
                    var c2 = 'out_left';
                }
                var newDateArea = $('<ul class="md_datearea ' + c2 + '"></ul>');
                newDateArea.html(this.getDateStr(this.value.year, this.value.month, this.value.date));
                $('.md_body').append(newDateArea);
                setTimeout(function() {
                    newDateArea.removeClass(c2).addClass('in');
                    dateArea.removeClass('in').addClass(c1);
                }, 0);
            },
            refreshView: function() {
                var initVal = input.val(),
                    date = null;
                if (initVal) {
                    var arr = initVal.split('-');
                    date = new Date(arr[0], arr[1] - 1, arr[2]);
                } else {
                    date = new Date();
                }
                var y = this.value.year = date.getFullYear(),
                    m = this.value.month = date.getMonth(),
                    d = this.value.date = date.getDate();
                $('.yeartag').text(y).data('year', y);
                $('.monthtag').text(F.getMonth(m) + '月').data('month', m);
                var dayStr = this.getDateStr(y, m, d);
                $('.md_datearea').html(dayStr);
            },
            initListeners: function() {
                var panel = $('.md_panel'),
                    mask = $('.md_mask'),
                    _this = this;
                input.on('click', function() {
                    if (panel.hasClass('show')) {
                        _this._hidePanel();
                    } else {
                        _this._showPanel();
                    }
                });
                mask.on('click', function() {
                    _this._hidePanel();
                });
                panel.delegates({
                    '.change_month': function() {
                        var add = $(this).hasClass('md_next') ? 1 : -1;
                        _this._changeMonth(add);
                    },
                    '.change_year': function() {
                        var add = $(this).hasClass('md_next') ? 1 : -1;
                        _this._changeYear(add);
                    },
                    '.out_left, .out_right': {
                        'webkitTransitionEnd': function() {
                            $(this).remove();
                        }
                    },
                    '.md_datearea li': function() {
                        var $this = $(this);
                        if ($this.hasClass('disabled')) {
                            return;
                        }
                        _this.value.date = $this.data('day');
                        var add = 0;
                        if ($this.hasClass('nextdate')) {
                            add = 1;
                        } else if ($this.hasClass('prevdate')) {
                            add = -1;
                        }
                        if (add !== 0) {
                            _this._changeMonth(add, _this.value.date);
                        } else {
                            $this.addClass('current').siblings('.current').removeClass('current');
                        }
                    },
                    '.md_ok': function() {
                        var monthValue = ~~_this.value.month + 1;
                        if (monthValue < 10) {
                            monthValue = '0' + monthValue;
                        }
                        var dateValue = _this.value.date;
                        if (dateValue === '') {
                            dateValue = _this.value.date = 1;
                        }
                        if (dateValue < 10) {
                            dateValue = '0' + dateValue;
                        }
                        var rDate = _this.value.year + '-' + monthValue + '-' + dateValue;
                        if(option.sureCb){
                        	option.sureCb && typeof option.sureCb === 'function' && option.sureCb.call(input,rDate);
                        }else{
                        	input.val(rDate);
                        }
                        _this._hidePanel();
                    },
                    '.md_cancel': function() {
                        _this._hidePanel();
                    }
                });
            }
        }
        mdater.init();
    }
})(jQuery);
