// 计算当前日期在本年度的周数
var Calendar = function(opt) {

    this.box = $(opt.box); //render box 
    this.act = $(opt.act);
    this._isBind = false; //是否绑定过事件 
    this.nowDate = new Date(opt.curDate || this.getNowString()); //当前时间高亮
    this.clickDayCallBack = opt.clickDayCallBack || function(){};
    this.type = opt.type || 'month';
    // 记录周数据
    this.weekData = {};
    this._init();
}
Calendar.prototype = {
    _init: function(D) { //初始化的时候设置默认日期 ,用于高亮记录
        D = D || this.nowDate;
        this._setInitDate(D);
        this._setWeek();
    },
    _setWeek: function() {
         this.curWeekNum = this._getWeekOfYear(this.curDate); //当前日期是本年内第几周
        // 本月第一日是本年的第几周
        this.startWeek = this._getWeekOfYear(this._getCurFirstDay());
        // 本月最后一日是本年第几周
        this.endWeek = this._getWeekOfYear(this._getLastDay(this.curYear,this.curMonth));
        this.curMonthWeekLength = 1 + this.endWeek - this.startWeek;
    },
    render: function() {
        if(this.type == 'month'){
            this.renderMonth();
        }
        if(this.type == 'week'){
            this.renderWeek();
        }
        if (this._isBind) {} else {
            this.bind();
            this._isBind = true;
            
        }
        // 设置当前日期
        this.selectCurDate(null,[this.curYear,this.curMonth,this.curDay]);
    },
    renderWeek : function(){
        var html = this._getWeekHtml(this.curYear,this.curWeekNum);
        this.box.html(html);
    },
    //渲染下一个周
    renderNextWeek: function() {
        var me = this;
        var nextDate = (function() {
            var y = me.curYear;
            var m = me.curMonth ;
            var d = me.curDay ;
            var day = me.curDate.getDay(); //周几
            var lastWeekDay = me._getDateRangeTime((y + '/' + m + '/' + d), 7);
            var dd = lastWeekDay.getFullYear() + '/' + (lastWeekDay.getMonth()+1) + '/' + lastWeekDay.getDate();
            
            return dd;
        });
        this._init(nextDate())
        this.render();
    },
    //渲染上一个周
    renderPreWeek: function() {
        var me = this;
        var nextDate = (function() {
            var y = me.curYear;
            var m = me.curMonth ;
            var d = me.curDay ;
            var day = me.curDate.getDay(); //周几
            var lastWeekDay = me._getDateRangeTime((y + '/' + m + '/' + d), -7);
            var dd = lastWeekDay.getFullYear() + '/' + (lastWeekDay.getMonth()+1) + '/' + lastWeekDay.getDate();
            
            return dd;
        });
        this._init(nextDate())
        this.render();
    },
    //渲染下一个月
    renderNextMonth: function() {
        var me = this;
        var nextDate = (function() {
            var y = me.curYear;
            var m = me.curMonth + 1;
            var d = me.curDay;

            var nextLastDay = me._getLastDay(y,m).getDate();//下个月最后一天
            if(m == 13){  //下一年
                y = y + 1;
                m = 1;
            }
            if(d > nextLastDay){
                d = nextLastDay;
            }
            var d = y + '/' + m + '/' + d;
            return d;
        });
        this._init(nextDate())
        this.render();
    },
    //渲染上一个月
    renderPreMonth: function() {
        var me = this;
        var preDate = (function() {
            var y = me.curYear;
            var m = me.curMonth - 1;
            var d = me.curDay;
            var preLastDay = me._getLastDay(y,m).getDate();//下个月最后一天
            if(d > preLastDay){
                d = preLastDay;
            }

            if(m == 0){  //上一年
                y = y - 1;
                m = 12  ;
            }
           
            
            var d = y + '/' + m + '/' + d;
            return d;
        })
        this._init(preDate());
        this.render();
    },
    //选择某天
    selectCurDate: function(item,arr) {
        var y,m,d;
        // 点击日历每一个item
        if(item){
             y = item.data('y');
             m = item.data('m');
             d = item.data('d');
             this.box.find('li').removeClass('curDate')
             item.addClass('curDate');   
        }else{
            y = arr[0];
             m = arr[1];
             d = arr[2];
        }
        {
            
            if(item){
                if(item.hasClass('preM')){
                    this.curDay = d;
                    this.renderPreMonth();
                }
                if(item.hasClass('nextM')){
                    this.curDay = d;
                    this.renderNextMonth();
                }
            }
        }
        this.clickDayCallBack({
            y : y,
            m : m,
            d : d
        });
        this._init(y + '/' + m + '/' + d);
       
    },

    // 渲染月
    renderMonth: function() {
        var html = this._getMonthHtml(this.startWeek, this.endWeek);
        this.box.html(html);
    },
    //取一个月的html
    _getMonthHtml: function(start, end) {

        var html = [];
        for (var i = start; i <= end; i++) {

            html.push(this._getWeekHtml(this.curYear, i))
        }
        html = html.join('')
        return html;

    },
    //以当前时间为起点 取day天后的日期
    _getDateRangeTime: function(time, range) {
        var curday = new Date();
        var year = parseInt(time.split('/')[0]),
            mon = parseInt(time.split('/')[1]),
            day = parseInt(time.split('/')[2]);

        curday.setFullYear(year, mon - 1, day);
        curday.setDate(day + range);
        // var finalDay = curday.getFullYear() + '/' + (curday.getMonth() + 1) + '/' + curday.getDate();

        return curday;
    },
    _getWeekHtml: function(year, week) {
        var week1 = this._getXDate(year, week); //取周一时间
        var arr = [];
        var row = '<ul>';
        for (var i = 0; i < 7; i++) {
            var dd = new Date(week1.getTime());
            dd.setDate(week1.getDate() + i);
            var y = dd.getFullYear();
            var m = (parseInt(dd.getMonth()) + 1);
            var d = dd.getDate();
            var classNames = [];

            if (this.nowDate.toLocaleDateString() == dd.toLocaleDateString()) {
                classNames.push('today');
            } else if (this.curDate.toLocaleDateString() == dd.toLocaleDateString()) {
                classNames.push('curDate');
            }
            if (dd.getMonth() + 1 < this.curMonth) {
                classNames.push('preM');
            }
            if (dd.getMonth() + 1 > this.curMonth) {
                classNames.push('nextM');
            }
            if (classNames.join('')) {
                classNames = 'class=' + classNames.join(' ');
            }

            arr.push('<li data-y="' + y + '"  data-m="' + m + '"  data-d="' + d + '" ' + classNames + '>' + dd.getDate() + '</li>');
            dd = null;
        }
        row = row + arr.join('') + '</ul>';

        return row
    },
    //取当前时间
    getNowString: function() {
        var now = new Date();
        return now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
    },

    //初始化日期
    _setInitDate: function(curDate) {
        this.curDate = new Date(curDate);
        this.curYear = this.curDate.getFullYear(); //当前年
        this.curMonth = this.curDate.getMonth() + 1; //当前月
        this.curDay = this.curDate.getDate(); //当前日
    },


    //取本月第一天
    _getCurFirstDay: function() {
        return new Date(this.curYear, this.curMonth - 1, 1);
    },
    //取月最后一天
    _getLastDay: function(y,m) {
        return new Date(y,m, 0);
    },
    //事件绑定
    bind: function() {
        var me = this;
        this.act.on('click', '.j_month', function() {
            var act = $(this).data('act');
            if (act == 'next') {
                me.renderNextMonth();
            }
            if (act == 'pre') {
                me.renderPreMonth();
            }

        })
        this.act.on('click', '.j_week', function() {
            var act = $(this).data('act');
            if (act == 'next') {
                me.renderNextWeek();
            }
            if (act == 'pre') {
                me.renderPreWeek();
            }

        })
        this.box.on('click', 'li', function() {
            var item = $(this);
           
            me.selectCurDate(item);
        })
    },

    // weekStart：每周开始于周几：周日：0，周一：1，周二：2 ...，默认为周日
    // 当前日期是本年的第几zhou
    _getWeekOfYear: function(D) {
        var weekStart = 1;
        if (isNaN(weekStart) || weekStart > 6) {
            weekStart = 0;
        }
        var year = D.getFullYear();
        var firstDay = new Date(year, 0, 1);
        var firstWeekDays = 7 - firstDay.getDay() + weekStart;
        var dayOfYear = (((new Date(year, D.getMonth(), D.getDate())) - firstDay) / (24 * 3600 * 1000)) + 1;
        return Math.ceil((dayOfYear - firstWeekDays) / 7) + 1;

    },
    //D 是本月第几周
    // _getWeekOfMonth: function(D) {

    //     var weekStart =1;
    //     if (isNaN(weekStart) || weekStart > 6)
    //         weekStart = 0;
    //     var dayOfWeek = D.getDay();
    //     var day = D.getDate();
    //     return Math.ceil((day - dayOfWeek - 1) / 7) + ((dayOfWeek >= weekStart) ? 1 : 0);
    // },
    //根据 年周 周几（1表示周一 0 表示周日）反回日期
    _getXDate: function(year, weeks) {
        var weekDay = 1;
        weekDay %= 7;
        var date = new Date(year, "0", "1"); //当年1月1日
        var time = date.getTime();
        weekDay == 0 ? time += weeks * 7 * 24 * 3600000 : time += (weeks - 1) * 7 * 24 * 3600000; //以周日为一周的开始，如果设定周日为一周的开始，去掉这个判断，选择后者。
        date.setTime(time);
        return this._getNextDate(date, weekDay);
    },
    _getNextDate: function(nowDate, weekDay) {
        var day = nowDate.getDay();
        var time = nowDate.getTime();
        var sub = weekDay - day;
        time += sub * 24 * 3600000;
        nowDate.setTime(time);

        return nowDate;
    }
}
