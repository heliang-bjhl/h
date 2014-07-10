// 下拉列表初始化 & 审核对话框 & 审核处理
seajs.use(["$", 'select',"confirmbox", "util","autocomplete"], function($, Select,ConfirmBox, util,AutoComplete) {
    var useArr = {};
    var useArr2 = {};
	var _p = {
        setSel: function(){
             new Select({
                trigger: '#j_onlinestyle'
            }).render();
        },
        getHtml:function(opt){
            var cancelHtml = [
                '<div class="dialog-form">',
                '<form action="',opt.url,'" id="j_fall">',
                '<p>是否确认',opt.onoff,'</p>',
                '<input type="hidden" value="', opt.dataid, '" name="activityId" />',
                '</form>',
                '</div>'
            ].join("");
            return cancelHtml;
        },
        bind : function(){
            $('.j_onoroff').on('click',function(){
                var dataid = $(this).data('activityid');
                var onoff = $(this).text();
                var url = $(this).data('url');
                Util.confirm.open({
                    title: '确认操作',
                    message: _p.getHtml({
                        dataid : dataid,
                        onoff : onoff,
                        url : url
                    }),
                    confirmTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_yes">确定</span>',
                    cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_no">取消</span>',
                    width:300,
                    onConfirm: function() { // 通过
                        _p.sb({
                            form: '#j_fall',
                            submitButton: '#j_bt_yes'
                        })
                    },
                    onCancel: function() { // 拒绝
                        util.confirm.close();
                    },
                    onClose: function() {

                    }
                });
            });
        },
        setAc : function(){
            var ac = new AutoComplete({
                trigger: $('#querySubject'),
                dataSource: '/t/actives/query.aj?subject={{query}}',
                locator: function(data) {
                    data = data || {};
                    var dt = data.data || {};
                    var list = dt.list || {};
                    var redata = [];
                    $.each(list, function(m, item) {
                        redata.push({
                            value : item.activitySubject,
                            id : item.activityId
                        });
                        useArr[item.activityId] = item.activitySubject;
                    });
                    return redata;
                },
                submitOnEnter: false,
                filter: function(data, query) {
                    
                    if ($.trim(query) == "") {
                        return [];
                    } else {
                        return data;
                    }
                }
            }).render();

            ac.on('itemSelected', function(current, prev) {
                var o = current;
                $('#querySubject').data('value', current.id);
            });
            var ac2 = new AutoComplete({
                trigger: $('#queryOrganizer'),
                dataSource: '/t/actives/alist.aj?name={{query}}',
                locator: function(data) {
                    data = data || {};
                    var dt = data.data || {};
                    var list = dt.list || {};
                    var redata = [];
                    $.each(list, function(m, item) {
                        redata.push({
                            value : item.name,
                            id : item.storeId
                        });
                        useArr2[item.storeId] = item.name;
                    });
                    return redata;
                },
                submitOnEnter: false,
                filter: function(data, query) {
                    
                    if ($.trim(query) == "") {
                        return [];
                    } else {
                        return data;
                    }
                }
            }).render();

            ac2.on('itemSelected', function(current, prev) {
                var o = current;
                $('#queryOrganizer').data('value', current.id);
            });
        },
        sb : function(op){
            util.formSend(op.form, {
                "ajaxSuccess": function(data) {
                    util.go(data);
                },

                "error": function() {
                    util.alert("操作超时");
                    //dialog.hide();
                },
                submitButton: op.submitButton
            });
        }
    }
    var init = function() {
        _p.setSel();
        _p.bind();
        _p.setAc();
    }
    init();
    // 下拉列表，状态初始化
    $$m.finish('ok');
});