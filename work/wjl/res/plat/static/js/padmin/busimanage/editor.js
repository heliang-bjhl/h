$$m.length = 3;
seajs.use(["$", "textLimit", "select", "util"], function($, textLimit, Select, util) {
    $(function() {
        // 限制输入文本为数字
        util.limitnum({
            parentClass : '.ui-form'
        });
        // 下拉列表，行业
        new Select({
            trigger: '#sltIndustry'
        }).render();
        // 下拉列表，楼层
        new Select({
            trigger: '#sltFloor'
        }).render();
         // 下拉列表，营业开始时间-小时
        new Select({
            trigger: '#sltStartHour'
        }).render();

        // 下拉列表，营业开始时间-分钟
        new Select({
            trigger: '#sltStartMinute'
        }).render();

        // 下拉列表，营业结束时间-小时
        new Select({
            trigger: '#sltEndHour'
        }).render();

        // 下拉列表，营业结束时间-分钟
        new Select({
            trigger: '#sltEndMinute'
        }).render();
        // 文本字数限制
        textLimit({
            "input": "#txtDescription",
            "tip": "#lblDescriptionMsg"
            //,"msg":"字数 {count}/{max}"
            ,
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
    });
    $$m.itemok('ok');
});
// 上传图片
seajs.use(["$", "uploadify", 'util', '_'], function($, uploadify, util, _) {

    $(function() {
        util.bindUpload("#uploader-1",{max:1,init:1,imgSize: '1024kb'});
        util.bindUpload("#uploader-2",{imgSize: '500kb'});
        // util.bindUpload("#uploader-1,#uploader-2");
    });
    $$m.itemok('ok');
});
// 表单提交
seajs.use(['$', 'validator', "util"], function($, Validator, util) {

    // 表单验证
    var validator = new Validator({
        element: '#frmStoreCreate',
        onFormValidated: function(err, results, form) {
            //window.console && console.log && console.log(err, results, form);
            err != true && onSubmit();
        },
        autoSubmit: false,
        failSilently: true
    });


    // 验证各项目
    validator
        .addItem({
            element: '#txtStore',
            required: true,
            errormessageRequired: '请输入商户名。'
        })
        .addItem({
            element: '#sltIndustry',
            required: true,
            errormessageRequired: '请选择行业。'
        })
        .addItem({
            element: '#txtBrand',
            required: true,
            errormessageRequired: '请输入经营品牌。'
        })
        .addItem({
            element: '#txtStation',
            required: true,
            errormessageRequired: '请输入位置编号。'
        })
        .addItem({
            element: '#txtTelephoneOne',
            required: true,
            errormessageRequired: '请输入电话的区号。'
        })
        .addItem({
            element: '#txtTelephoneTwo',
            required: true,
            errormessageRequired: '请输入电话的号码。'
        })
        .addItem({
            element: '#txtSummary',
            required: true,
            errormessageRequired: '请输入门店概要。'
        })
        .addItem({
            element: '#txtDescription',
            required: true,
            errormessageRequired: '请输入门店介绍。'
        })
        .addItem({
            element: '#txtCompany',
            required: true,
            errormessageRequired: '请输入公司名。'
        })
        .addItem({
            element: '#txtEmail',
            required: false,
            errormessageRequired: '请输入正确的邮箱。'
        })
        .addItem({
            element: '#txtMobilePhone',
            required: true,
            errormessageRequired: '请输入手机号。'
        })
        

    function onSubmit() {
        var startTime, // 营业开始时间
            endTime, // 营业结束时间
            storePay, // 支付类型,账号,返佣比例
            logo, // 上传logo后logo的url
            tel, // 固定电话
            piclist = []; // 图片多个url用’,‘链接
        try {
            // 固定电话
            tel = $("#txtTelephoneOne").val() + "-" + $("#txtTelephoneTwo").val();
            // 营业开始时间
            startTime = $("#sltStartHour").val() + ":" + $("#sltStartMinute").val();
            // 营业结束时间
            endTime = $("#sltEndHour").val() + ":" + $("#sltEndMinute").val();
            // 支付类型,账号,返佣比例
            storePay = [];
            // 拼接 支付类型,账号,返佣比例
            $.each($("#tblList tr:not(:first)"), function() {
                var lineInfo = [];
                $.each($(this).find("td:not(.hand)"), function() {
                    lineInfo.push($.trim($(this).html()).replace(/%$/, ""));
                });
                storePay.push(lineInfo.join(","));
            });
            // 上传logo后logo的url
            //logo图片
            if($('#uploadImg1').length != 0){
               if($('#uploadImg1 > li').length <= 1){
                    $('#uploadImg1').closest('.ui-form-item-focus').find('.ui-form-explain').css({
                        color: '#FF5243'
                    }).text('请上传门店logo图片！');
                    return;
               }
            }
            if($('#uploadImg2').length != 0){
               if($('#uploadImg2 > li').length <= 1){
                    $('#uploadImg2').closest('.ui-form-item-focus').find('.ui-form-explain').css({
                        color: '#FF5243'
                    }).text('请上传店铺图片！');
                    return;
               }
            }
            logo = $("#uploadImg1 .loaded-img").first().attr("data-src");
            // 图片多个url用’,‘链接
            $.each($("#uploadImg2 .loaded-img"), function() {
                piclist.push($(this).attr("data-src"));
            });

            util.formSend("#frmStoreCreate", {
                "extraData": {
                    // 支付类型,账号,返佣比例 'bankType,bankNo,returnFee;bankType,bankNo,returnFee'
                    "storePay": storePay.join(";")
                    // 是两个select框 , - 小时 - 分钟
                    ,
                    "startTime": startTime
                    // 是两个select框 , - 小时 - 分钟 
                    ,
                    "endTime": endTime
                    // '上传logo后logo的url'
                    ,
                    "logo": logo
                    // 图片多个url用’,‘连接
                    ,
                    "piclist": piclist.join(",")
                    // 固定电话
                    ,
                    "tel": tel
                },
                "ajaxSuccess": function(json) {
                    var json = json || {};
                    if (json.data && json.data.url) {
                        location.href = json.data.url;
                    } 

                },
                /*
                "ajaxFail": function(data) {
                    data = data || {};
                    alert(data.msg || "提交失败");
                },*/
                "error": function() {
                    util.alert("操作超时")
                },
                "submitButton": "#btnSave"
            });

        } catch (e) {
            util.alert(e.message || "系统出错了");
        }
        return false;
    };
    $$m.itemok('ok');
});