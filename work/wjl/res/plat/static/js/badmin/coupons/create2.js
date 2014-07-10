// 下拉列表 & 文本字数限制 & radio按钮的操作
seajs.use(["$", "textLimit", "select", "util"], function($, textLimit, Select, util) {
    $(function() {

        
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

        var config = [
            // 面额大小
            {
                "name": "facePriceType",
                "input": 'input[name="facePrice"]',
                "index": 5
            }
            
            // 可领取数量
            , {
                "name": "quantity",
                "input": 'input[name="limitQuantity"]',
                "index": 1
            }
        ];

        // 设置状态 & 绑定状态改变时要触发的设置事件
        util.changeRadio(config);

    });
});

// 日期
seajs.use("calendar_css");
seajs.use("calendar", function(Calendar) {
    var c1 = new Calendar({
        trigger: '#txtBeginDate'
    });
    var c2 = new Calendar({
        trigger: '#txtEndDate'
    });
    c1.on('selectDate', function(date) {
        c2.range([date, null]);
    });

    c2.on('selectDate', function(date) {
        c1.range([null, date]);
    });
});

// 上传图片
seajs.use(["$", "uploadify", 'util', '_'], function($, uploadify, util, _) {

    $(function() {
        util.bindUpload("#uploader-1");
    });

});

// 提交表单
seajs.use(['validator', '$', "util"], function(Validator, $, util) {
    $(function() {
        var frmCouponId = "frmCreate2";
        $("#frmStoreCreate").attr("id", frmCouponId);
        // 实例验证对象
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
                element: 'input[name="title"]',
                required: true,
                errormessageRequired: '请输入优惠券名称。'
            })
            .addItem({
                element: '#txtBeginDate',
                required: true,
                errormessageRequired: '请输入 券有效期的开始时间。'
            })
            .addItem({
                element: 'input[name="useArea"]',
                required: true,
                errormessageRequired: '请输入指定店铺。'
            })
            .addItem({
                element: '#sltStatus',
                required: true,
                errormessageRequired: '请输入指定业态 。'
            })
            .addItem({
                element: '#txtEndDate',
                required: true,
                errormessageRequired: '请输入 券有效期的截止时间。'
            })
            .addItem({
                element: 'textarea[name="remark"]',
                required: true,
                errormessageRequired: '请输入详细描述。'
            })

        // 提交表单的处理
        function onSubmit() {
            var getValue = function(ele, input, defVal) {
                var v = $(ele).val();
                var iv = $.trim($(input).val());
                var rv = (v == defVal ? iv : v);
                return $.trim(rv);
            }
            // 面额
            var facePrice = getValue('[name="facePriceType"]:checked', '[name="facePrice"]', 0);
            // 可领取数量
            var limitQuantity = getValue('[name="quantity"]:checked', '[name="limitQuantity"]', 1);
            var pic = $("#uploadImg1 .loaded-img").first().attr("data-src");
            var useAreatype = $('[name="useAreatype"]:checked').val();
            var useArea = null;
            if (useAreatype == 0) {
                useArea = "";
            } else if (useAreatype == 1) {
                useArea = $("#sltStatus").val();
            } else {
                useArea = $('[name="useArea"]').val();
            }

            util.formSend("#" + frmCouponId, {
                "extraData": {
                    "facePrice": facePrice,
                    "limitQuantity": limitQuantity,
                    "useArea": useArea,
                    "pic": pic
                },
                "ajaxSuccess": function(json) {
                    var json = json || {};
                    if (json.data && json.data.url) {
                        location.href = json.data.url;
                    } else {
                        location.href = '/t/store/list.j'
                    }
                },
                "error": function() {
                    alert("操作超时")
                },
                "submitButton": "#btnSave"
            });
        }
    });
});