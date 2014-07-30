// 计算当前日期在本年度的周数
var Calendar = function(opt) {

    this.box = $(opt.box);
    this._isBind = false;
    this.defaultDate = opt.curDate || this.getNowString();

    this.setDate(this.defaultDate)

}
Calendar.prototype = {
    //render 
    render: function() {
        var a = this._getCurMdays();
        var html = this._getHtml();

        this.box.html(html);
        if (this._isBind) {

        } else {
            this.bind();
            this._isBind = true;
        }

    },

    //取当前时间
    getNowString: function() {
        var now = new Date();
        return now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
    },

    //初始化日期

    setDate: function(curDate) {
        this.curDate = new Date(curDate);
        this.curYear = this.curDate.getFullYear(); //当前年
        this.curMonth = this.curDate.getMonth() + 1; //当前月
        this.curDay = this.curDate.getDate(); //当前日
    },

    // 取得拼接日历的html模板
    _getHtml: function() {
        var top = [
            '<span class="j_month" data-act="pre">上月</span>',
            '<span>' + this.curYear + '- ' + this.curMonth + '</span>',
            '<span class="j_month" data-act="next">下月</span>'
        ].join('');
        var s = '<table>';
        var thead = [
            '<tr>',
            '<th>一</th>',
            '<th>二</th>',
            '<th>三</th>',
            '<th>四</th>',
            '<th>五</th>',
            '<th>六</th>',
            '<th>日</th>',
            '</tr>'
        ].join('');
        var e = '</table>';
        var html = [];
        var days = this._getCurMdays();
        var firstDay = this._getCurMfirstDay();

        var row = 0; // row =7 插入tr
        var tr = 0; // 共有几行
        var td = 0; //共有多少个td 用于补起最后一行用
        //创建首行
        html.push('<tr>');
        tr++;

        //首行补充空td
        for (var k = firstDay-1; k > 0; k--) {
            var pre = this._getDateRangeTime(this.curYear + '/' + this.curMonth + '/' + firstDay, (-k - firstDay + 1));

            var tdDate = new Date(pre).getDate();
            html.push('<td class="preM" data-m="pre">' + tdDate + '</td>');
            row++;
            td++;
        }
        //插入主体日期
        for (var i = 1; i <= days; i++) {

            if (
                (parseInt(this.defaultDate.split('/')[0]) == parseInt(this.curYear)) && (parseInt(this.defaultDate.split('/')[1]) == parseInt(this.curMonth)) && (parseInt(this.defaultDate.split('/')[2]) == parseInt(i))
            ) {
                html.push('<td style="background:#c00">' + i + '</td>');
            } else {
                html.push('<td>' + i + '</td>');
            }
            row++;
            if (row == 7) {
                row = 0;
                html.push('</tr><tr>')
                tr++
            }
            td++;
        }
        //最后一行补全
        if (td < tr * 7) {
            var num = tr * 7 - td;

            for (var p = 0; p < num; p++) {
                var myNext = this.curYear + '/' + this.curMonth + '/' + this._getCurMdays()
                var next = this._getDateRangeTime(myNext,p+1);
                var tdDate = new Date(next).getDate();
                
                html.push('<td class="nextM" data-m="next">'+tdDate+'</td>');
            }
        }
        html.push('</tr>');

        return top + s + thead + html.join('') + e;

    },

    //以当前时间为起点 取day天后的日期
    _getDateRangeTime: function(time, range) {
        var curday = new Date();
        var year = parseInt(time.split('/')[0]),
            mon = parseInt(time.split('/')[1]),
            day = parseInt(time.split('/')[2]);

        curday.setFullYear(year, mon - 1, day);
        curday.setDate(day + range);
        var finalDay = curday.getFullYear() + '/' + (curday.getMonth() + 1) + '/' + curday.getDate();
        return finalDay;
    },
    //取当月有多少天
    _getCurMdays: function() {
        // 下个月的第0天 
        return new Date(this.curYear, this.curMonth, 0).getDate();
    },

    //取本月第一天是周几
    _getCurMfirstDay: function() {
        return new Date(this.curYear, this.curMonth - 1, 1).getDay();
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
        this.box.on('click', 'td', function() {
            var m  = me.curMonth;
            if($(this).data('m') == 'pre'){
                m = m-1;
            }
            if($(this).data('m') == 'next'){
                m = m+1;
            }
            var date = me.curYear + '/' + m + '/' + $(this).html();
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
        })
        this.setDate(nextDate())
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
        this.setDate(preDate())
        this.render();
    },
    // weekStart：每周开始于周几：周日：0，周一：1，周二：2 ...，默认为周日
    getWeekOfYear: function(weekStart) {
        weekStart = (weekStart || 0) - 0;
        if (isNaN(weekStart) || weekStart > 6)
            weekStart = 0;

        var year = this.curDate.getFullYear();
        var firstDay = new Date(year, 0, 1);
        var firstWeekDays = 7 - firstDay.getDay() + weekStart;
        var dayOfYear = (((new Date(year, this.curDate.getMonth(), this.curDate.getDate())) - firstDay) / (24 * 3600 * 1000)) + 1;
        return Math.ceil((dayOfYear - firstWeekDays) / 7) + 1;
    },
    getWeekOfMonth: function(weekStart) {
        weekStart = (weekStart || 0) - 0;
        if (isNaN(weekStart) || weekStart > 6)
            weekStart = 0;

        var dayOfWeek = this.curDate.getDay();
        var day = this.curDate.getDate();
        return Math.ceil((day - dayOfWeek - 1) / 7) + ((dayOfWeek >= weekStart) ? 1 : 0);
    }

}


var d = new Calendar({
    box: '#rili'
    // curDate : '2013-1-1'
})

d.render()



