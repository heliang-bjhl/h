// 下拉列表初始化 & 审核对话框 & 审核处理
seajs.use(["$", 'select',"confirmbox", "util","autocomplete"], function($, Select,ConfirmBox, util,AutoComplete) {
    var _o = {};
    var useArr = {};
    var useArr2 = {};
	var _p = {
        setSel: function(){
             new Select({
                trigger: '#j_onlinestyle'
            }).render();
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
                $('#activityId').val(current.id)
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
    };
    var init = function() {
        _p.setSel();
        _p.setAc();
    };
    init();
    $$m.finish('ok');
});