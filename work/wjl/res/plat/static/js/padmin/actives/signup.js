// 下拉列表初始化 & 审核对话框 & 审核处理
seajs.use("calendar_css");
seajs.use(["$", "calendar", "util"], function($, Calendar, util) {
	var _p = {
        setCal : function(){
            //关注日期
            var c1 = new Calendar({
                trigger: '#z_startDate'
            });
            var c2 = new Calendar({
                trigger: '#z_endDate'
            });
            c1.on('selectDate', function(date) {
                c2.range([date, null]);
            });
            c2.on('selectDate', function(date) {
                c1.range([null, date]);
            });
        }
    }
    var init = function() {
        _p.setCal();
    }
    init();
    $$m.finish('ok');
});