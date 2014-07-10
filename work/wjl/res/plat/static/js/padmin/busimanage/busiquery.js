// 下拉列表初始化 & 审核对话框 & 审核处理
seajs.use("calendar_css");
seajs.use(["$", 'select', "calendar", "util"], function($, Select, Calendar, util) {
	var _p = {
        setSlt: function() {
            new Select({
                trigger: '#qtype'
            }).render();
            new Select({
                trigger: '#qstate'
            }).render();
        }
    }
    var init = function() {
        _p.setSlt();
    }
    init();
    $$m.finish('ok');
});