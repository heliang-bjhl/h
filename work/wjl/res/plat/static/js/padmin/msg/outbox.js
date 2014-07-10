// 下拉列表 & 文本字数限制 & radio按钮的操作
seajs.use("calendar_css");
seajs.use(["$", "select", "util", "calendar"], function($, Select, util, Calendar) {
    var _p = {
        setCal: function() {
            var c1 = new Calendar({
                trigger: '#jStartDate'
            });
            var c2 = new Calendar({
                trigger: '#jEndDate'
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


