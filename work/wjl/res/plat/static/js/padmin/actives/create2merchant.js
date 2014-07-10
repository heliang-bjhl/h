$$m.length = 4;
// 下拉列表 & 文本字数限制 & radio按钮的操作
seajs.use("calendar_css");
seajs.use(["$", "textLimit", "select", "util", "calendar"], function($, textLimit, Select, util, Calendar) {
    var _o = {};
    var _p = {
        setCal: function() {
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
            var c3 = new Calendar({
                trigger: '#z_onlineTime'
            });

        },
        setChangeRadio: function() {
            var config = [
                {
                    "name": "limitType",
                    "input": 'input[name="limitQuantity"]',
                    "index": 1
                }
            ];
            util.changeRadio(config);
        },
        setTextarea : function(){
             textLimit({
                "input": "#txtDescription",
                "tip": "#lblDescriptionMsg",
                "msg": function(opt) {
                    var opts = opt || {};
                    if (opts.max - opts.count < 0) {
                        return "输入已经超过了可允许的{max}字数";
                    } else {
                        return "还能输入{rest}个字";
                    }
                },
                "max": 1500,
                "min": 0,
                "enableBr": true,
                "changeFn": function() {
                    //console.log(1)
                }
            }).init();
        }
    }

   


    var init = function() {
        _p.setChangeRadio();
        _p.setCal();
        _p.setTextarea();
    }
    init();
    $$m.itemok('ok');
});
var useArr = {

}
// 自动完成
seajs.use(["$", "autocomplete"], function($, AutoComplete) {
    var ac = new AutoComplete({
        trigger: $('#z_joinStoreName'),
        dataSource: '/t/store/alist.aj?name={{query}}&t={{timestamp}}',
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
                useArr[item.name] = item.name;
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
        console.log(o)
        $('#z_joinStoreName').data('value', current.value);
        $('#z_joinStoreId').val(current.id)
    });
    $('#z_joinStoreName').on('blur',function(){
        if(useArr[$(this).data('value')] == $(this).val()){

        }else{
            $(this).val('');
            $(this).data('value','')
        }
    })
    $$m.itemok('ok');
});

// 上传图片
seajs.use(["$", "uploadify", 'util', '_'], function($, uploadify, util, _) {

    $(function() {
        util.bindUpload("#uploader-1",{imgSize: '500kb'});
    });
    $$m.itemok('ok');

});

// 提交表单
seajs.use(['validator', '$', "util"], function(Validator, $, util) {
    $(function() {
        var frmCouponId = "frmCreate2";
        $("#frmActivesCreate").attr("id", frmCouponId);
        // // 实例验证对象
        var validator = new Validator({
            element: '#' + frmCouponId,
            onFormValidated: function(err, results, form) {
                //window.console && console.log && console.log(err, results, form);
                err != true && onSubmit();
            },
            autoSubmit: false,
            failSilently: true
        });

        // 表单验证
        validator
            .addItem({
                element: 'input[name="joinStoreName"]',
                required: true,
                errormessageRequired: '请输入指定商家。'
            })
            .addItem({
                element: 'input[name="subject"]',
                required: true,
                errormessageRequired: '请输入活动主题。'
            })
            .addItem({
                element: '#z_startDate',
                required: true,
                errormessageRequired: '请输入 券有效期的开始时间。'
            })
            .addItem({
                element: '#z_endDate',
                required: true,
                errormessageRequired: '请输入 券有效期的截止时间。'
            })
            .addItem({
                element: 'textarea[name="remark"]',
                required: true,
                errormessageRequired: '请输入详细描述。'
            })
            .addItem({
                element: '#z_onlineTime',
                required: true,
                errormessageRequired: '请输入上线时间。'
            })
            .addItem({
                element: '[name="limitType"]',
                required: true,
                errormessageRequired: '请选择参与名额。'
            })
            $('[name=limitType]').change(function(e) {
                var contact = $(this).attr('value');
                validator.removeItem('[name="limitQuantity"]');
                if(contact == '2'){
                    $('[name="limitQuantity"]').attr('data-explain', '请输入参与名额');
                    validator.addItem({
                        element: '[name="limitQuantity"]',
                        required: true,
                        rule:'',
                        errormessageRequired: '请输入参与名额'
                    });
                } else {
                    validator.removeItem('[name="limitQuantity"]');
                }
            });
            if($('[name="limitType"]:checked').val() == '2'){
                $('[name=limitType]').trigger('change');
            }
        // 提交表单的处理

        function onSubmit() {
            // var getValue = function(ele, input, defVal) {
            //     var v = $(ele).val(); //选中的value
            //     var iv = $.trim($(input).val()); //输入框的v
            //     var rv = (v == defVal ? iv : v);
            //     return $.trim(rv);
            // }
            // // // 面额
            // // var facePrice = getValue('[name="facePriceType"]:checked', '#facePrice', 0);
            // // // 可领取数量
            // var limitQuantity = getValue('[name="memberNum"]:checked', '#limitQuantity', 1);
            var pic = $("#uploadImg1 .loaded-img").first().attr("data-src");
            var tag = util.joinCheckboxVal('.join-chile-checbox-val');
            var extraData = {
                //"facePrice": facePrice,
                //"limitQuantity": limitQuantity,
                //"limitQuantity": limitQuantity,
                "pic": pic,
                "tag": tag
            }
            util.formSend("#" + frmCouponId, {
                extraData :  extraData,
                "ajaxSuccess": function(json) {
                    util.go(json);
                },
                "error": function(data) {
                    util.alert("操作超时")
                },
                "submitButton": "#btnSave"
            });
        }
    });
$$m.itemok('ok');
});
