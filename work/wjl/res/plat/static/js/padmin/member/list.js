// 下拉列表初始化 & 审核对话框 & 审核处理
seajs.use("calendar_css");
seajs.use(["$", 'calendar',"confirmbox", "util","select"], function($, Calendar,ConfirmBox, util,Select) {
    var _o = {};
	var _p = {
        setSel : function(){
            new Select({
                trigger: '#channel'
            }).render();
        },
        setCal: function(){
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
    };
    var init = function() {
        _p.setSel();
        _p.setCal();
    };
    init();
    //文本框输入设定为整形的数值
    util.limitnum({
        parentClass: '.j-for-int-num',
        mold: 'int'
    });
    $$m.finish('ok');
});