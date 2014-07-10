seajs.use(["$", "tab"], function($, Tabs) {

    tabs = new Tabs({
        element: '#get_coupon_rule',
        triggers: '#get_coupon_rule .ui-tab-items li',
        panels: '#get_coupon_rule .ui-switchable-content div',
        activeTriggerClass: "ui-tab-item-current",
        activeIndex: 0,
        effect: 'fade',
        triggerType: "click"
    });
});

// 下拉列表的初始化 & radio按钮的操作
seajs.use(["$", "select", "util"], function($, Select, util) {
    $(function() {

        // 下拉列表，营业开始时间-小时
        var sltStartHour = new Select({
            trigger: '#sltStartHour',
            height: 300
        }).render();

        // 下拉列表，营业开始时间-分钟
        var sltStartMinute = new Select({
            trigger: '#sltStartMinute'
        }).render();

        // 下拉列表，营业结束时间-小时
        var sltEndHour = new Select({
            trigger: '#sltEndHour'
        }).render();

        // 下拉列表，营业结束时间-分钟
        var sltEndMinute = new Select({
            trigger: '#sltEndMinute'
        }).render();

        // 下拉列表， 上架时间-小时
        var sltGroundingHour = new Select({
            trigger: '#sltGroundingHour'
        }).render();

        // 下拉列表， 上架时间-分钟
        var sltGroundingMinute = new Select({
            trigger: '#sltGroundingMinute'
        }).render();

        // 下拉列表，  下架时间-小时
        var sltUndercarriageHour = new Select({
            trigger: '#sltUndercarriageHour'
        }).render();

        // 下拉列表，  下架时间-分钟
        var sltUndercarriageMinute = new Select({
            trigger: '#sltUndercarriageMinute'
        }).render();

        // 控件的切换控制
        var config = [
            // 领取开始时间 - 年月日 时分
            {
                "name": "pullStarttype",
                "input": "#txtStartGroundingDate",
                "enable": function() {
                    // 选择框启用
                    sltStartHour.set("disabled", false);
                    sltStartMinute.set("disabled", false);
                },
                "disable": function() {
                    // 选择框禁用
                    sltStartHour.set("disabled", true);
                    sltStartMinute.set("disabled", true);
                }
            }
            // 领取结束时间 - 年月日 时分
            , {
                "name": "pullEndtype",
                "input": "#txtEndGroundingDate",
                "enable": function() {
                    // 选择框启用
                    sltEndMinute.set("disabled", false);
                    sltEndHour.set("disabled", false);
                },
                "disable": function() {
                    // 选择框禁用
                    sltEndMinute.set("disabled", true);
                    sltEndHour.set("disabled", true);
                }
            }
            // 微信渠道 - 用户可领用总数量
            , {
                "name": "appNo",
                "input": "#txtGroup1Date"
            }
            // 微信渠道 - 每日券可领用总数量
            , {
                "name": "appDayNo",
                "input": "#txtGroup2Date"
            }
            // 微信渠道 - 用户领用限制
            , {
                "name": "appUserNo",
                "input": "#txtGroup3Date"
            }
            // 移动APP - 用户可领用总数量
            , {
                "name": "wxNo",
                "input": '[name="wxNoValue"]'
            }
            // 移动APP - 每日券可领用总数量
            , {
                "name": "wxDayNo",
                "input": '[name="wxDayNoValue"]'
            }
            // 移动APP - 用户领用限制
            , {
                "name": "wxUserNo",
                "input": '[name="wxUserNoValue"]'
            }
            // 上架时间 - 年月日 时分
            , {
                "name": "onsaleTimetype",
                "input": "#txtGroundingDate",
                "enable": function() {
                    // 选择框启用
                    sltGroundingHour.set("disabled", false);
                    sltGroundingMinute.set("disabled", false);
                },
                "disable": function() {
                    // 选择框禁用
                    sltGroundingHour.set("disabled", true);
                    sltGroundingMinute.set("disabled", true);
                }
            }
            // 下架时间 - 年月日 时分
            , {
                "name": "onsaleEndtimetype",
                "input": "#txtUndercarriageDate",
                "enable": function() {
                    // 选择框启用
                    sltUndercarriageHour.set("disabled", false);
                    sltUndercarriageMinute.set("disabled", false);
                },
                "disable": function() {
                    // 选择框禁用
                    sltUndercarriageHour.set("disabled", true);
                    sltUndercarriageMinute.set("disabled", true);
                }
            }
        ];

        // 设置状态 & 绑定状态改变时要触发的设置事件
        util.changeRadio(config);
    });
});

// 初始化日期
seajs.use("calendar_css");
seajs.use("calendar", function(Calendar) {
    // 领取开始时间
    var c1 = new Calendar({
        trigger: '#txtStartGroundingDate'
    });
    // 领取结束时间
    var c2 = new Calendar({
        trigger: '#txtEndGroundingDate'
    });
    // 用户可领用总数量
    var c3 = new Calendar({
        trigger: '#txtGroundingDate'
    });
    // 每日券可领用总数量
    var c4 = new Calendar({
        trigger: '#txtUndercarriageDate'
    });
    /*
	// 用户领用限制
    var c5 = new Calendar({
        trigger: '#txtGroup1Date'
    });
	// 上架时间
    var c6 = new Calendar({
        trigger: '#txtGroup2Date'
    });
	// 下架时间
    var c7 = new Calendar({
        trigger: '#txtGroup3Date'
    });
    */
    /*
    c1.on('selectDate', function(date) {
        c2.range([date, null]);
    });

    c2.on('selectDate', function(date) {
        c1.range([null, date]);
    });
    */
});

// 提交表单
seajs.use(['validator', '$', "util"], function(Validator, $, util) {
    $(function() {
        var frmCouponId = "frmCreate3";
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
                element: '#txtStartGroundingDate',
                required: true,
                errormessageRequired: '请输入领取开始时间。'
            })
            .addItem({
                element: '#sltStartHour',
                required: true,
                errormessageRequired: '请选择领取开始时间。'
            })
            .addItem({
                element: '#sltStartMinute',
                required: true,
                errormessageRequired: '请选择领取开始时间。'
            })
            .addItem({
                element: '#txtEndGroundingDate',
                required: true,
                errormessageRequired: '请输入领取结束时间。'
            })
            .addItem({
                element: '#sltEndHour',
                required: true,
                errormessageRequired: '请选择领取结束时间。'
            })
            .addItem({
                element: '#sltEndMinute',
                required: true,
                errormessageRequired: '请选择领取结束时间。'
            })
            .addItem({
                element: '#txtGroup1Date',
                required: true,
                errormessageRequired: '请输入用户可领用总数量。'
            })
            .addItem({
                element: '#appDayNoValue',
                required: true,
                errormessageRequired: '请输入每日券可领用总数量。'
            })
            .addItem({
                element: '#appUserNoValue',
                required: true,
                errormessageRequired: '请输入用户领用限制。'
            })
            .addItem({
                element: '[name="wxNoValue"]',
                required: true,
                errormessageRequired: '请输入用户可领用总数量。'
            })
            .addItem({
                element: '[name="wxDayNoValue"]',
                required: true,
                errormessageRequired: '请输入每日券可领用总数量。'
            })
            .addItem({
                element: '[name="wxUserNoValue"]',
                required: true,
                errormessageRequired: '请输入用户领用限制。'
            })
            .addItem({
                element: '#txtGroundingDate',
                required: true,
                errormessageRequired: '请输入上架时间。'
            })
            .addItem({
                element: '#sltGroundingHour',
                required: true,
                errormessageRequired: '请选择上架时间。'
            })
            .addItem({
                element: '#sltGroundingMinute',
                required: true,
                errormessageRequired: '请选择上架时间。'
            })
            .addItem({
                element: '#txtUndercarriageDate',
                required: true,
                errormessageRequired: '请输入下架时间。'
            })
            .addItem({
                element: '#sltUndercarriageHour',
                required: true,
                errormessageRequired: '请选择下架时间。'
            })
            .addItem({
                element: '#sltUndercarriageMinute',
                required: true,
                errormessageRequired: '请选择下架时间。'
            })

        // 获取时间的共用方法
        function getTime(time, hour, minute) {
            var rev = "";
            rev = $.trim($(time).val()) + " " + $(hour).val() + ":" + $(minute).val();
            return rev;
        }

        // 获取相应的值
        function getValue(ele, input, defVal) {
            var v = $(ele).val();
            var iv = $.trim($(input).val());
            var rv = (v == defVal ? iv : v);
            return $.trim(rv);
        }

        // 提交表单的处理
        function onSubmit() {
            // 自定义时传递时间的值
            var pullStart = getTime("#txtStartGroundingDate", '#sltStartHour', '#sltStartMinute');
            // 自定义时传递时间的值
            var pullEnd = getTime("#txtEndGroundingDate", '#sltEndHour', '#sltEndMinute');
            // 上架时间
            var onsaleTime = getTime("#txtGroundingDate", '#sltGroundingHour', '#sltGroundingMinute');
            // 下架时间
            var onsaleEndtime = getTime("#txtUndercarriageDate", '#sltUndercarriageHour', '#sltUndercarriageMinute');

            // 微信渠道 用户可领用总数量
            var appNo = getValue('[name="appNo"]:checked', '[name="appNoValue"]', 1);
            // 微信渠道 每日券可领用总数量
            var appDayNo = getValue('[name="appDayNo"]:checked', '[name="appDayNoValue"]', 1);
            // 微信渠道 用户领用限制
            var appUserNo = getValue('[name="appUserNo"]:checked', '[name="appUserNoValue"]', 1);
            // 移动APP 用户可领用总数量
            var wxNo = getValue('[name="wxNo"]:checked', '[name="wxNoValue"]', 1);
            // 移动APP 每日券可领用总数量
            var wxDayNo = getValue('[name="wxDayNo"]:checked', '[name="wxDayNoValue"]', 1);
            // 移动APP 用户领用限制
            var wxUserNo = getValue('[name="wxUserNo"]:checked', '[name="wxNoValue"]', 1);

            // 扩展提交数据
            var extraData = {
                "appNo": appNo,
                "appDayNo": appDayNo,
                "appUserNo": appUserNo,
                "wxNo": wxNo,
                "wxDayNo": wxDayNo,
                "wxUserNo": wxUserNo
                //,"pullStart":pullStart
                //,"pullEnd":pullEnd
                //,"onsaleTime":onsaleTime
                //,"onsaleEndtime":onsaleEndtime
            };

            // 提交数据筛选
            //  领取开始时间的自定义选中是才附加该参数
            if ($('[name="pullStarttype"]:checked').val() == "1") {
                extraData["pullStart"] = pullStart;
            }

            // 领取结束时间的自定义选中是才附加该参数
            if ($('[name="pullEndtype"]:checked').val() == "1") {
                extraData["pullEnd"] = pullEnd;
            }

            /*
            // 微信渠道 - 用户可领用总数量的自定义
            if($('[name="appNo"]').val() == "1"){
            	extraData["appNo"] = appNo;
            }
            // 微信渠道 - 每日券可领用总数量的自定义
            if($('[name="appDayNo"]').val() == "1"){
            	extraData["appDayNo"] = appDayNo;
            }
            // 微信渠道 - 用户领用限制的自定义
            if($('[name="appUserNo"]').val() == "1"){
            	extraData["appUserNo"] = appUserNo;
            }
            
            // 移动APP - 用户可领用总数量的自定义
            if($('[name="wxNo"]').val() == "1"){
            	extraData["wxNo"] = wxNo;
            }
            // 移动APP - 每日券可领用总数量的自定义
            if($('[name="wxDayNo"]').val() == "1"){
            	extraData["wxDayNo"] = wxDayNo;
            }
            // 移动APP - 用户领用限制的自定义
            if($('[name="wxUserNo"]').val() == "1"){
            	extraData["wxUserNo"] = wxUserNo;
            }
            */

            // 上架时间的自定义选中是才附加该参数
            if ($('[name="onsaleTimetype"]:checked').val() == "1") {
                extraData["onsaleTime"] = onsaleTime;
            }

            // 下架时间的自定义选中是才附加该参数
            if ($('[name="onsaleEndtimetype"]:checked').val() == "1") {
                extraData["onsaleEndtime"] = onsaleEndtime;
            }

            util.formSend("#" + frmCouponId, {
                "extraData": extraData,
                "ajaxSuccess": function(json) {
                    var json = json || {};
                    if (json.data && json.data.url) {
                        location.href = json.data.url;
                    } 
                },
                "error": function() {
                    alert("操作超时")
                },
                "submitButton": "#save"
            });
        }
    });
});