// 下拉列表 & 文本字数限制 & radio按钮的操作
seajs.use("calendar_css");
seajs.use(["$", "textLimit", "select", "util", "calendar"], function($, textLimit, Select, util, Calendar) {
    // 下拉列表，状态初始化
    new Select({
        trigger: '#qtype'
    }).render();
    new Select({
        trigger: '#qrange'
    }).render();
    new Select({
        trigger: '#qstate'
    }).render();
    $$m.finish('ok');
});