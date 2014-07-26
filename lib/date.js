var H = H || {};

H.date = {

    //返回几号 1-31
    getDate: function(date) {
        return date.getDate();
    },
    //返回月份
    getMonth: function(date) {
        return date.getMonth() + 1;
    },
    //返回年份
    getYear: function(date) {
        return date.getFullYear();
    },
    //返回周几
    getDay: function(date) {
        var d = date.getDay();
        var t = '星期';
        var arr = {
        	0 : '日',
        	1 : '一',
        	2 : '二',
        	3 : '三',
        	4 : '四',
        	5 : '五',
        	6 : '六'
        }
        return t + arr[d];
    },
    //取当前时间
    getCurrentDate: function() {
        var nowDate = new Date();
        return this.getYear(nowDate) + '-' + this.getMonth(nowDate) + '-' + this.getDate(nowDate);
    }
}
