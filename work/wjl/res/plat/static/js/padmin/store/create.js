$$m.length = 4;
// 下拉列表 & 文本字数限制 & 添加帐号
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

        // 下拉列表，支持类型
        new Select({
            trigger: '#sltPaymentType'
        }).render();

        // 下拉列表，银行类型
        new Select({
            trigger: '#sltBank'
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

        // 下拉列表，楼层
        new Select({
            trigger: '#sltFloor'
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

        /*
        // 统计字数
        $("#btnSubmit").click(function() {
            $("#txtContent").setValue("通过js程序赋值，并可计数");
        });
        */

        
        // 添加帐号的保存事务
        function SaveDeal(){
            this.list = [
                {
                    "e":"#sltPaymentType"
                    ,"msg":"帐号类型"
                    ,"key":null
                }
                ,{
                    "e":"#sltBank"
                    ,"msg":"银行类型"
                    ,"key":null
                }
                ,{
                    "e":"#txtAccount"
                    ,"msg":"帐号"
                    ,"key":null
                }
                ,{
                    "e":"#txtConfirmAccountAd"
                    ,"msg":"确认帐号"
                    ,"key":"#txtAccount"
                }
                ,{
                    "e":"#txtReturnFee"
                    ,"msg":"返佣比例"
                    ,"key":null
                }
            ];
        }
        SaveDeal.prototype = {
            init:function(){
                var me = this;
                $.each(me.list,function(){
                    me.add(this);
                });
            }
            ,add:function(item){
                var me = this;
                $(item.e).focus(function(){
                    $(this).parents(".ui-form-item").first().removeClass("ui-form-item-error");
                    $(this).siblings(".ui-form-explain").html(item.msg + "是必" + ($(this).get(0).nodeName.toUpperCase() == "SELECT" ? "选择" : "输入") + "项");
                }).blur(function(){
                    me.validata.call(this,item);
                });
                /*
                setTimeout(function(){
                    $(element).siblings("a.ui-select-trigger")
                },1000);
                */
            }
            ,isError:function(){
                var me = this;
                var isError = false;
                $.each(me.list,function(){
                    isError = me.validata.call($(this).get(0),this) || isError
                });
                return isError;
            }
            ,validata:function(item){
                var me = this;
                var isError = false;
                if($(item.e).is(":hidden")){
                    return;
                }
                if($.trim($(item.e).val()) == ""){
                    isError = true;
                    $(item.e).parents(".ui-form-item").first().removeClass("ui-form-item-success").addClass("ui-form-item-error");
                    $(item.e).siblings(".ui-form-explain").html(($(item.e).get(0).nodeName.toUpperCase() == "SELECT" ? "请选择" : "请输入") + item.msg);
                }else{
                    $(item.e).parents(".ui-form-item").first().removeClass("ui-form-item-error").addClass("ui-form-item-success");
                    $(item.e).siblings(".ui-form-explain").html(item.msg + "是必" + ($(item.e).get(0).nodeName.toUpperCase() == "SELECT" ? "选择" : "输入") + "项");
                }
                return isError;
            }
        }
        
        var saveDeal = new SaveDeal();
        saveDeal.init();

        // 添加帐号事件中的开关函数
        function bankOnOff() {
            if ($("#sltPaymentType").val() != "银行") {
                $(".J_addAccount").eq(1).hide();
            } else {
                $(".J_addAccount").eq(1).show();
            }
        }
        // 添加帐号
        $("#btnAddAccount").bind("click", function() {
            // 开关
            if ($(".J_addAccount").eq(0).is(":visible")) {
                $(".J_addAccount").hide();
            } else {
                $(".J_addAccount").show();
            }
            bankOnOff();
        });
        // 情非得已，暂时使用这种方式
        setTimeout(function() {
            // 注意， 当他的下拉层变化时，代码要跟着变
            $('.ui-select[data-widget-cid="widget-15"]').on("click", function() {
                bankOnOff();
            });
            // 目前这步没起作用
            $("#sltPaymentType").on("change", function(){
                bankOnOff();
            })
        }, 1500);

        var tblTpl = [
            '<table class="ui-table" id="tblList">', '<tbody>', '<tr>', '<th>支付类型</th>', '<th>帐号</th>', '<th>返佣比例</th>', '<th class="hand">操作</th>', '</tr>{content}', '</tbody>', '</table>'
        ].join("");
        var infoTpl = [
            '<tr class="ui-table-split">', '<td>', '{name}'

            , '</td>', '<td>{card}</td>', '<td>{returnFee}</td>', '<td class="hand">', '<input type="button" class="ui-button ui-button-sorange" value="删除">', '</td>', '</tr>'
        ].join("");

        // 绑定删除事件
        function bindDelEvent() {
            if ($("#tblList").length == 0 || arguments.callee.isBind === true) {
                return false;
            }
            arguments.callee.isBind = true;
            $("#tblList").click(function(e) {
                var target = $(e.srcElement || e.target);
                if (target.is(".ui-button")) {
                    // --- debug ---
                    if (window.confirm("确认删除")) {
                        target.parents("tr").first().remove();
                        if ($("#tblList tr").length < 2) {
                            $("#tblList").hide();
                        }
                    }
                }
            });
        }

        // 初始化
        bindDelEvent();

        // 添加列表信息
        function addBankInfo(opt) {
            var tbtpl = null;
            var trtpl = infoTpl;
            trtpl = trtpl.replace(/{(\w*)}/g, function() {
                return opt[arguments[1]]
            });
            if ($("#tblList").length == 0) {
                tbtpl = tblTpl;
                tbtpl = tbtpl.replace(/{content}/g, trtpl);
                $("#lblInfoBefore").after(tbtpl);
                bindDelEvent();
            } else {
                $("#tblList").show().find("tr:last").after(trtpl);
            }
        }
        

        // 添加帐号列表
        $("#btnAccountList").click(function() {
            var isOk = true;
            // 帐号类型
            var paymentType = $.trim($("#sltPaymentType").val());
            // 银行类型
            var bank = $.trim($("#sltBank").val());
            // 返佣比例
            var returnFee = $.trim($("#txtReturnFee").val());
            // 帐号
            var account = $.trim($("#txtAccount").val());
            // 确认帐号
            var reAccount = $.trim($("#txtConfirmAccountAd").val());
            var name = paymentType;
            if (paymentType == "银行") {
                name = bank;
            }
            // --- debug ---;
            /*
            if (paymentType == "") {
                util.alert("选择帐号类型");
                return false;
            } else if (paymentType == "银行" && bank == "") {
                util.alert("选择银行类型");
                return false;
            } else if (account == "") {
                util.alert("填写帐号");
                return false;
            } else if (reAccount == "") {
                util.alert("填写确认帐号");
                return false;
            } else if (account != reAccount) {
                util.alert("两次输入的帐号不一样");
                return false;
            } else if (returnFee == "") {
                util.alert("填写返佣比例");
                return false;
            }
            */
            if(saveDeal.isError()){
                return true;
            }
            $.each($("#tblList tr:not(:first)"), function() {
                var rename = $.trim($(this).find("td:eq(0)").html());
                var recard = $.trim($(this).find("td:eq(1)").html());
                if (rename == name && recard == account) {
                    isOk = false;
                    return false;
                }
            });

            returnFee += "%";

            if (!isOk) {
                // --- debug ---
                util.alert("该帐号已经存在！");
                return false;
            }

            $("#txtReturnFee").val("");
            $("#txtAccount").val("");
            $("#txtConfirmAccountAd").val("");
            addBankInfo({
                "name": name,
                "card": account,
                "returnFee": returnFee
            });
        });

    });
$$m.itemok('ok');
});

// 上传图片
seajs.use(["$", "uploadify", 'util', '_'], function($, uploadify, util, _) {

    $(function() {
        util.bindUpload("#uploader-1",{max:1,imgSize:'1024kb'});
        util.bindUpload("#uploader-2",{imgSize: '500kb'});
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
            errormessageRequired: '请输入门店名。'
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
        .addItem({
            element: '#sltIndustry',
            required: true,
            errormessageRequired: '请选择行业。'
        })
        .addItem({
            element: '#txtCompany',
            required: true,
            errormessageRequired: '请输入公司名。'
        })
        .addItem({
            element: '#txtBrand',
            required: true,
            errormessageRequired: '请输入公司名。'
        })
        .addItem({
            element: '#txtAddress',
            required: true,
            errormessageRequired: '请输入门店地址。'
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
            element: '#chargeMan',
            required: true,
            errormessageRequired: '请输入负责人。'
        });
        if($('#txtDescription').length > 0){
            validator.addItem({
                element: '#txtDescription',
                required: true,
                errormessageRequired: '请输入详情描述。'
            });
        }

    function onSubmit() {
        var startTime, // 营业开始时间
            endTime, // 营业结束时间
            storePay, // 支付类型,账号,返佣比例
            logo, // 上传logo后logo的url
            tel, // 固定电话
            piclist = []; // 图片多个url用’,‘链接
        try {
            // 固定电话
            if($("#txtTelephoneOne").val() && $("#txtTelephoneOne").val()){
                tel = $("#txtTelephoneOne").val() + "-" + $("#txtTelephoneTwo").val();
            }
            // if($('#txtTelephoneTwo').val()){
            //     tel = $('#txtTelephoneTwo').val();
            // }
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
            logo = $("#uploadImg1 .loaded-img").first().attr("data-src");
            // 图片多个url用’,‘链接
            $.each($("#uploadImg2 .loaded-img"), function() {
                piclist.push($(this).attr("data-src"));
            });
            var extraData = {
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
                }
                if(tel){
                    extraData.tel = tel;
                }
            util.formSend("#frmStoreCreate", {
                "extraData":extraData ,
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

// 锚点定位
seajs.use(["$", "setAnchor"], function($, setAnchor) {
    var html = [
        '<div class="ui-select J_anchor" style="z-index: 99; position: fixed; left: 50%;margin-left:495px; top: 200px;">', '<ul data-role="content" class="ui-select-content">', '{item}', '</ul>', '</div>'
    ].join("");
    var item = [];
    $.each($("h4"), function() {
        var id = $.trim($(this).attr("id"));
        // 这种写法可能会影响别的程序
        if (id == "") {
            id = "lblAnchor_" + parseInt(Math.random() * 100000);
            $(this).attr("id", id);
        }
        item.push('<li><a href="#' + id + '" class="ui-select-item  ui-select-selected">' + $.trim($(this).html()) + '</a></li>');
    });
    html = html.replace(/{item}/g, item.join(""));
    setAnchor({
        "ele": "h4",
        "callback": function(index) {
            if ($(".J_anchor").length < 1) {
                $("body").append(html);
            }
            var selectEle = $(".J_anchor").find("li").eq(index);
            selectEle.siblings().removeClass("anchor-selected");
            selectEle.addClass("anchor-selected");
        },
        "offset": -20
    }).init();
    $$m.itemok('ok');
});