seajs.use("placeholders");

// 下拉列表初始化
seajs.use(["select"], function(Select) {

    // 下拉列表，优惠开始时间 - 小时
    new Select({
        trigger: '#sltStartHour'
    }).render();

    // 下拉列表，优惠开始时间 - 分
    new Select({
        trigger: '#sltStartMinute'
    }).render();

    // 下拉列表，优惠开始时间 - 秒
    new Select({
        trigger: '#sltStartSecond'
    }).render();

    // 下拉列表，优惠起止时间 - 小时
    new Select({
        trigger: '#sltEndHour'
    }).render();

    // 下拉列表，优惠起止时间 - 分
    new Select({
        trigger: '#sltEndMinute'
    }).render();

    // 下拉列表，优惠起止时间 - 秒
    new Select({
        trigger: '#sltEndSecond'
    }).render();
})

// 供应量人交互
seajs.use(["$"], function($, uploadify, _) {
    function setCheck(index, ele) {
        if (index == 0) {
            $(ele).val("").attr("readonly", "true");
        } else {
            $(ele).removeAttr("readonly");
        }
    }
    $('input[name="quantity"]').click(function() {
        setCheck($(this).index('input[name="quantity"]'), 'input[name="quantityValue"]');
    });
    $('input[name="limitQuantity"]').click(function() {
        setCheck($(this).index('input[name="limitQuantity"]'), 'input[name="limitQuantityValue"]');
    });

    setCheck($('input[name="quantity"]:checked').index('input[name="quantity"]'), 'input[name="quantityValue"]');
    setCheck($('input[name="limitQuantity"]:checked').index('input[name="limitQuantity"]'), 'input[name="limitQuantityValue"]');

});

seajs.use(["$", "uploadify", '_'], function($, uploadify, _) {
    $("#uploader-3").uploadify({
        height: 152,
        width: 153,
        preventCaching: false,
        buttonImage: $$c.staticUrl + "/static/images/upload.png",
        swf: $$c.staticUrl + "/static/images/uploadify.swf",
        uploader: '/upload',
        fileObjName: 'image',
        onUploadSuccess: function(file, data, response) {
            var html = "";
            data = $.parseJSON(data);
            _.each(data.url, function(item) {
                html += "<li><img class='loaded-img' src=" + item + " /></li>"
            })
            $("#uploadImg .btn-upload").before(html);
        }
    });
})
seajs.use("calendar_css");
seajs.use("calendar", function(Calendar) {
    var c1 = new Calendar({
        trigger: '#startDate'
    });
    var c2 = new Calendar({
        trigger: '#endDate'
    });
    c1.on('selectDate', function(date) {
        c2.range([date, null]);
    });

    c2.on('selectDate', function(date) {
        c1.range([null, date]);
    });

});

//表单验证
seajs.use(['validator', '$', "util"], function(Validator, $, util) {
    $(function() {
        var frmCouponId = "frmCoupon";
        $("#activityForm").attr("id", frmCouponId);
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
                element: '#input-title',
                required: true,
                errormessageRequired: '请输入标题。'
            })
            .addItem({
                element: '#startDate',
                required: true,
                errormessageRequired: '请输入结束时间。'
            })
            .addItem({
                element: '#endDate',
                required: true,
                errormessageRequired: '请输入结束时间。'
            })
            .addItem({
                element: '#description',
                required: true,
                errormessageRequired: '请输入描述。'
            })
            .addItem({
                element: '[name=price]',
                required: true,
                errormessageRequired: '请至少选择一项。'
            })

        // 提交表单的处理
        function onSubmit() {
            var joinTime = function() {
                var time = [];
                $.each(arguments, function(m, s) {
                    time.push($(s).val());
                });
                return time.join(":");
            }
            // 表单对象
            var frmCoupon = $("#" + frmCouponId);
            // 获取提交方式 - 修改该在保存草稿和确认按钮事件中
            var type = frmCoupon.attr("data-type");
            var startTime = $("#startDate").val() + " " + joinTime("#sltStartHour", "#sltStartMinute", "#sltStartSecond");
            var endTime = $("#endDate").val() + " " + joinTime("#sltEndHour", "#sltEndMinute", "#sltEndSecond");
            /* 
                quantity : '供应量', // 0不限  1限量
                quantityValue : '限量值', //供应量限量值
                limitQuantity : '每用户限量', // 0不限  1限量
                limitQuantityValue : '限量值',
                pic : '图片地址',
                remark : '图片描述',
                onsaleTime : '上架时间类型', //0 立刻 1:设定
                */
            try {

                util.formSend("#" + frmCouponId, {
                    "extraData": {
                        // 保存方式
                        "bcType": type
                        // 优惠券开始时间
                        ,
                        "startDate": startTime
                        // 优惠券开始时间
                        ,
                        "endDate": endTime
                    },
                    "ajaxSuccess": function(data) {
                        data = data || {};
                        alert(data.msg || "提交成功");
                    },
                    /*
                    "ajaxFail": function(data) {
                        data = data || {};
                        alert(data.msg || "提交失败");
                    },*/
                    "error": function() {
                        alert("操作超时")
                    },
                    "submitButton": "#btnSave"
                });

            } catch (e) {
                alert(e.message || "系统出错了");
            }
        }

        // 保存草稿按钮 || 确认按钮
        $("#btnSave,#btnConfirm").click(function() {
            // 默认提交方式是保存草稿(1)-点击保存草稿按钮
            var type = 1;
            // 点击确认按钮
            if ($.trim($(this).attr("id")) == "btnSave") {
                type = 2
            }
            // 修改保存方式之后提交表单
            $(this).parents("form").first().attr("data-type", type).submit();
        });

    });
});