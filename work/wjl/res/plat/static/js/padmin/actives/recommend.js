// 下拉列表初始化 & 审核对话框 & 审核处理
seajs.use(["$", "confirmbox", "util","autocomplete"], function($, ConfirmBox, util,AutoComplete) {
    var useArr = {

    }
    function onSubmit() {
        var frmCouponId = 'frmAdd';
        util.formSend("#" + frmCouponId, {
            "ajaxSuccess": function(json) {
                util.go(json);
            },
            "error": function(data) {
                util.alert("操作超时")
            },
            "submitButton": "#btnAdd"
        });
    }
    var _p = {
        getSaveHtml: function(val) {
            var saveHtml = [
                '<div class="dialog-form">',
                '<form action="save.aj" id="j_fsaveall">',
                '<p>是否确认保存</p>',
                '<input type="hidden" name="activityIds" value="',val,'" />',
                '</form>',
                '</div>'
            ].join("");
            return saveHtml;
        },
        getNullHtml : function(){
            var nullHtml = [
                '<div class="dialog-form">',
                '<p>请输入要添加的活动！</p>',
                '</div>'
            ].join("");
            return nullHtml;
        },
        setAc : function(){
            var ac = new AutoComplete({
                trigger: $('#querySubject'),
                dataSource: '/t/recactives/query.aj?subject={{query}}',
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
                $('#activityId').val(current.id)
            });
            $('#querySubject').on('blur',function(){
                if(useArr[$(this).data('value')] == $(this).val()){

                }else{
                    $(this).val('');
                    $(this).data('value','')
                }
            });
        },
        bind: function() {
            $('.j_remove').on('click', function() {
                $(this).closest('tr').remove();
                if($('#z_save').hasClass('ui-button-lwhite')){
                    $('#z_save').removeClass('ui-button-lwhite').addClass('ui-button-lorange');
                    $('#z_save').on('click', function() {
                        var arr = [];
                        $('#tblList tbody tr').each(function(){
                            if($(this).data('actid')){
                                arr.push($(this).data('actid'));
                            }
                        });
                        Util.confirm.open({
                            title: '确认保存',
                            message: _p.getSaveHtml(arr),
                            confirmTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_yes">确定</span>',
                            cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_no">取消</span>',
                            width: 300,
                            onConfirm: function() { // 通过
                                _p.sb({
                                    form: '#j_fsaveall',
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
                }
            });
            $('#querySubject').on('keydown',function(e){
                var code;  
                if(!e){  
                    var e=window.event;  
                }  
                if(e.keyCode){    
                    code=e.keyCode;  
                }  
                else if(e.which){  
                    code   =   e.which;  
                }
                if(code==13){
                    $('#querySubject').trigger('blur');
                    $('#btnAdd').trigger('click');
                    return false;
                }
            });
            $('#btnAdd').on('click',function(){
                if($('#querySubject').val()){
                    _p.sb({
                        form: '#frmAdd',
                        submitButton: '#btnAdd'
                    })
                }else{
                    Util.confirm.open({
                        title: '提示：',
                        message: _p.getNullHtml(),
                        confirmTpl: '',
                        cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2">关闭</span>',
                        width: 300,
                        onConfirm: function() { // 通过
                            
                        },
                        onCancel: function() { // 拒绝
                            util.confirm.close();
                        },
                        onClose: function() {

                        }
                    });
                }
            });
        },
        sb: function(op) {
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
        },
        sort: function() {
            $("#tblList").sortable({
                revert: true,
                items: 'tbody tr',
                update: function(e, ui) {

                },
                change : function(){
                    if($('#z_save').hasClass('ui-button-lwhite')){
                        $('#z_save').removeClass('ui-button-lwhite').addClass('ui-button-lorange');
                        $('#z_save').on('click', function() {
                            var arr = [];
                            $('#tblList tbody tr').each(function(){
                                if($(this).data('actid')){
                                    arr.push($(this).data('actid'));
                                }
                            });
                            Util.confirm.open({
                                title: '确认保存',
                                message: _p.getSaveHtml(arr),
                                confirmTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_yes">确定</span>',
                                cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_no">取消</span>',
                                width: 300,
                                onConfirm: function() { // 通过
                                    _p.sb({
                                        form: '#j_fsaveall',
                                        submitButton: '#j_bt_yes'
                                    });
                                },
                                onCancel: function() { // 拒绝
                                    util.confirm.close();
                                },
                                onClose: function() {

                                }
                            });
                        });
                    }
                }
            });
        }
    }
    var init = function() {
        _p.bind();
        _p.sort();
        _p.setAc();
    }
    init();
    // 下拉列表，状态初始化
    $$m.finish('ok');
});
