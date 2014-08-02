// 计算当前日期在本年度的周数
var Calendar = function(opt) {

    this.box = $(opt.box); //render box 
    this._isBind = false; //是否绑定过事件 
    this.defaultDate = opt.curDate || this.getNowString(); //当前时间高亮
    // 记录周数据
    this.weekData = {};
    this._init();
}
Calendar.prototype = {
    _init: function(D) { //初始化的时候设置默认日期 ,用于高亮记录
        D = D || this.defaultDate;
        this._setDate(D);
        this._setWeek();
    },
    _setWeek: function() {
        // this.weekNum = this._getWeekOfYear(1); //当前日期是本年内第几周
        // 本月第一日是本年的第几周
        this.startWeek = this._getWeekOfYear(this._getCurFirstDay()); 
        // 本月最后一日是本年第几周
        this.endWeek = this._getWeekOfYear(this._getCurLastDay());
        this.curMonthWeekLength = 1 + this.endWeek - this.startWeek;
    },
    render2: function() {
        this.renderMonth();
        if (this._isBind) {
        } else {
            this.bind();
            this._isBind = true;
        }
    },
    // 渲染月日
    renderMonth: function() {
        var html  = this._getMonthHtml(this.startWeek,this.endWeek);
        this.box.html(html);
    },
    _getMonthHtml: function(start,end) {
        
        var html = [];
        for(var i = start ; i <= end ; i++){
            
            html.push(this._getWeekHtml(this.curYear, i))
        }
        html = html.join('')
        return html;
        
    },
    _getWeekHtml: function(year, week) {
        var week1 = this._getXDate(year, week); //取周一时间
        var arr = [];
        var row = '<ul>';
        for (var i = 0; i < 7; i++) {
            var dd = new Date(week1.getTime());
            dd.setDate(week1.getDate() + i);
            var today = '';
            if(this.curDate.toLocaleDateString() == dd.toLocaleDateString()){
                today = ' class="today"';
            }
            
            arr.push('<li data-y="' + dd.getFullYear() + '"  data-m="' + (parseInt(dd.getMonth()) + 1) + '" '+ today+'>' + dd.getDate() + '</li>');
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
    _setDate: function(curDate) {
        this.curDate = new Date(curDate);
        this.curYear = this.curDate.getFullYear(); //当前年
        this.curMonth = this.curDate.getMonth() + 1; //当前月
        this.curDay = this.curDate.getDate(); //当前日
    },
    // getCalendarHeader
    _getCalendarHeader: function() {
        var thead = [
            '<tr>',
            '<th>周一</th>',
            '<th>周二</th>',
            '<th>周三</th>',
            '<th>周四</th>',
            '<th>周五</th>',
            '<th>周六</th>',
            '<th>周日</th>',
            '</tr>'
        ].join('');
        return thead;
    },
    
    //取本月第一天
    _getCurFirstDay: function() {
        return new Date(this.curYear, this.curMonth - 1, 1);
    },
    //取本月最后一天
    _getCurLastDay: function() {
        return new Date(this.curYear, this.curMonth, 0);
    },
    //事件绑定
    bind: function() {
        var me = this;
        this.box.on('click', '.j_month', function() {
            var act = $(this).data('act');
            if (act == 'next') {
                me.renderNextMonth();
            }
            if (act == 'pre') {
                me.renderPreMonth();
            }
        })
        this.box.on('click', 'li', function() {
            var date = $(this).data('y') + '/' + $(this).data('m') + '/' + $(this).html();
            alert(date)
        })
    },
    //渲染下一个月
    renderNextMonth: function() {
        var me = this;
        var nextDate = (function() {
            var d = me.curYear + '/' + (me.curMonth + 1) + '/' + 1;
            if (me.curMonth == 12) {
                d = (me.curYear + 1) + '/' + 1 + '/' + 1;
            }
            return d;
        });
        this._init(nextDate())
        this.render();
    },
    //渲染上一个月
    renderPreMonth: function() {
        var me = this;
        var preDate = (function() {
            var d = me.curYear + '/' + (me.curMonth - 1) + '/' + 1;
            if (me.curMonth == 1) {
                d = (me.curYear - 1) + '/' + 12 + '/' + 1;
            }
            return d;
        })
        this._init(preDate())
        this.render();
    },
    // weekStart：每周开始于周几：周日：0，周一：1，周二：2 ...，默认为周日
    // 当前日期是本年的第几zhou
    _getWeekOfYear: function(D) {
        var weekStart = 1;

        if (isNaN(weekStart) || weekStart > 6){
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
        weekDay == 0 ? time += weeks * 7 * 24 * 3600000 : time += (weeks - 1) * 7 * 24 * 3600000; //以周日为一周的结束，如果设定周日为一周的开始，去掉这个判断，选择后者。
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
var c = new Calendar({
    box: '#rili2',
    curDate : '2014/7/1'
})
c.render2();
