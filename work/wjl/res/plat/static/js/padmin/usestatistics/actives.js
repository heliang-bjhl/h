// 下拉列表初始化 & 审核对话框 & 审核处理
seajs.use(["$", 'select', "confirmbox", "util"], function($, Select, ConfirmBox, util) {

    // 下拉列表，状态初始化
    new Select({
        trigger: '#jTypeSel'
    }).render();
    new Select({
        trigger: '#jStateSel'
    }).render();
    $$m.finish('ok');
});