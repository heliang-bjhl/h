// 下拉列表初始化 & 审核对话框 & 审核处理
var useArr = {

}
seajs.use("calendar_css");
seajs.use(["$", 'select', "confirmbox", "calendar", "autocomplete", "util"], function($, Select, ConfirmBox, Calendar, AutoComplete, util) {
    var _o = {}
    var _p = {
        setCal: function() {
            var c1 = new Calendar({
                trigger: '#jStartTime'
            });
            var c2 = new Calendar({
                trigger: '#jEndTime'
            });
            c1.on('selectDate', function(date) {
                c2.range([date, null]);
            });
            c2.on('selectDate', function(date) {
                c1.range([null, date]);
            });
        },
        setSlt: function() {
            // 下拉列表，状态初始化
            new Select({
                trigger: '#qstate'
            }).render();
        },
        getCreateHtml: function(opt) {
            var html = [
                '<div class="dialog-form">',
                '<form action="relate.aj" id="j_create">',
                '<div class="ui-form-item dialog-form-item">',
                '<label>券名称: </label>',
                '<span>',
                opt.couname,
                '</span>',
                '</div>',
                '<div class="ui-form-item dialog-form-item">',
                '<label>券编号: </label>',
                '<span>',
                opt.counum,
                '</span>',
                '</div>',
                '<div class="ui-form-item dialog-form-item">',
                '<label>商户名称: </label>',
                '<span>',
                opt.merchname,
                '</span>',
                '<div class="ui-form-explain"></div>',
                '</div>',
                '<input type="hidden" class="j-chan-storeid" value="', opt.storeID, '" name="storeId" />',
                '<input type="hidden" value="', opt.tickNo, '" name="tickNo" />',
                '</form>',
                '</div>'
            ].join('');
            return html
        },
        auto: function() {
            var ac = new AutoComplete({
                trigger: $('.dialog-form .j-setorid'),
                dataSource: '/t/store/alist.aj?name={{query}}&t={{timestamp}}' ,
                locator: function(data) {
                    data = data || {};
                    var dt = data.data || {};
                    var list = dt.list || {};
                    var redata = [];
                    $.each(list, function(m, item) {
                        redata.push({
                            value: item.name,
                            id: item.storeId
                        });
                        useArr[item.storeId] = item.name;
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
            ac.element.css({
               'z-index' : '10000'
            });
            ac.on('itemSelected', function(current, prev) {
                var o = current;
                $('.dialog-form').find('.j-chan-storeid').val(current.id);
                $('.dialog-form').find('.j-chan-storeid').attr('data-value', current.id);
            });
            $('.dialog-form .j-setorid').on('blur', function() {
                if (useArr[$('.dialog-form').find('.j-chan-storeid').data('value')] == $(this).val()) {

                } else {
                    $(this).val('');
                    $(this).data('value', '')
                }
            })
        },
        bind: function() {
            $('.j-reconciliation').on('click', function() {
                var couname = $(this).closest('tr').find('td').eq(1).text();
                var counum = $(this).closest('tr').find('td').eq(2).text();
                var merchname = $(this).closest('tr').find('td').eq(4).text();
                var storeID = $(this).data('storeid');
                var tickNo = $(this).data('tickno');
                var html;
                if (merchname.length > 0) {
                    html = _p.getCreateHtml({
                        couname: couname,
                        counum: counum,
                        merchname: merchname,
                        storeID: storeID,
                        tickNo: tickNo
                    });
                } else {
                    html = _p.getCreateHtml({
                        couname: couname,
                        counum: counum,
                        merchname: '<input type="text" class="ui-input ui-input-large j-setorid" />',
                        storeID: storeID,
                        tickNo: tickNo
                    });
                }
                Util.confirm.open({
                    title: '现金对账',
                    message: html,
                    confirmTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_yes">确定</span>',
                    cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_no">取消</span>',
                    onConfirm: function() { // 通过
                        if(!$('.dialog-form').find('.j-chan-storeid').val()){
                            $('.dialog-form').find('.ui-form-explain').css({
                                color : '#ff5243'
                            }).empty().html('请输入商户名称！');
                        }else{
                            _p.sb({
                                form: '#j_create',
                                submitButton: '#j_bt_yes'
                            })
                        }
                    },
                    onCancel: function() { // 拒绝
                        util.confirm.close();
                    },
                    onClose: function() {

                    }
                });
                _p.auto();
                $('.dialog-form').find('.j-setorid').on('focus',function(){
                    $('.dialog-form').find('.ui-form-explain').css({
                        color : '#ff5243'
                    }).empty();
                });
                $('.dialog-form').find('.j-setorid').on('blur',function(){
                    if(!$('.dialog-form').find('.j-chan-storeid').val()){
                        $('.dialog-form').find('.ui-form-explain').css({
                            color : '#ff5243'
                        }).empty().html('请输入商户名称！');
                    }
                });
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
        }
    }
    var init = function() {
        _p.setCal();
        _p.setSlt();
        _p.bind();
    }
    init();
    
    $$m.finish('ok');
});
