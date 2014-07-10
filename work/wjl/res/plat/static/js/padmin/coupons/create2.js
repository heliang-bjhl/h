$$m.length = 4;
// 下拉列表 & 文本字数限制 & radio按钮的操作
seajs.use("calendar_css");
seajs.use(["$", "textLimit", "select", "util", "calendar"], function($, textLimit, Select, util, Calendar) {
    var _o = {};
    var _p = {
        setSlt: function() {
            // 使用时间
            _o.useStartTime_m = new Select({
                trigger: '#useStartTime-m'
            }).render();
            _o.useStartTime_s = new Select({
                trigger: '#useStartTime-s'
            }).render();
            _o.useEndTime_m = new Select({
                trigger: '#useEndTime-m'
            }).render();
            _o.useEndTime_s = new Select({
                trigger: '#useEndTime-s'
            }).render();
            // 下拉列表，指定业态
            _o.selectElement = new Select({
                trigger: '#sltStatus'
            }).render();
            //领取开始时间
            _o.sltStartHour = new Select({
                trigger: '#sltStartHour'
            }).render();
            _o.sltStartMinute = new Select({
                trigger: '#sltStartMinute'
            }).render();
            //领取结束时间
            _o.sltEndHour = new Select({
                trigger: '#sltEndHour'
            }).render();
            _o.sltEndMinute = new Select({
                trigger: '#sltEndMinute'
            }).render();

            //上架时间
            _o.sltSaleTimeHour = new Select({
                trigger: '#onsaleTimeHour'
            }).render();
            _o.sltSaleTimeMinute = new Select({
                trigger: '#onsaleTimeMinute'
            }).render();
            //下架时间
            _o.sltSaleEndtimeHour = new Select({
                trigger: '#onsaleEndtimeHour'
            }).render();
            _o.sltEndSaleEndtimeMinute= new Select({
                trigger: '#onsaleEndtimeMinute'
            }).render();
        },
        setCal: function() {
            var c1 = new Calendar({
                trigger: '#txtBeginDate'
            });
            var c2 = new Calendar({
                trigger: '#txtEndDate'
            });
            var c3 = new Calendar({
                trigger: '#onsaleTime'
            });
            var c4 = new Calendar({
                trigger: '#pullStart'
            });
            var c5 = new Calendar({
                trigger: '#pullEnd'
            });
            var c6 = new Calendar({
                trigger: '#onsaleEndtime'
            });
            c1.on('selectDate', function(date) {
                c2.range([date, null]);
                c4.range([null, date]);
            });

            c2.on('selectDate', function(date) {
                c1.range([null, date]);
                c5.range([null, date]);
            });
            c3.on('selectDate', function(date) {
                c4.range([date, null]);
            });
            c4.on('selectDate', function(date) {
                c5.range([date, null]);
                c1.range([date, null]);
            });
            c5.on('selectDate', function(date) {
                c6.range([date, null]);
                c2.range([date, null]);
            });
            c4.on('selectDate', function(date) {
                c3.range([null, date]);
            });
            c5.on('selectDate', function(date) {
                c4.range([null, date]);
            });
            c6.on('selectDate', function(date) {
                c5.range([null, date]);
            });
            c3.on('selectDate', function(date) {
                c1.range([date, null]);
            });
            c1.on('selectDate', function(date) {
                c3.range([null, date]);
            });
        },
        setChangeRadio: function() {
            var config = [
            //     // 面额大小
            //     {
            //         "name": "facePriceType",
            //         "input": '#facePrice',
            //         "index": 5
            //     }
            //     // 使用范围
            //     , {
            //         "name": "useAreatype",
            //         "enable": function() {
            //             // 选择框启用
            //             _o.selectElement.set("disabled", false);
            //         },
            //         "disable": function() {
            //             // 选择框禁用
            //             _o.selectElement.set("disabled", true);
            //         },
            //         "index": 1
            //     }
            //     // 使用范围
            //     , {
            //         "name": "useAreatype",
            //         "input": 'input[name="useArea"]',
            //         "index": 2
            //     }
            //     // 可领取数量
            //     , {
            //         "name": "quantity",
            //         "input": '#limitQuantity',
            //         "index": 1
            //     },
            //     // 渠道每日
                {
                    "name": "dayNo",
                    "input": 'input[name="dayNoValue"]',
                    "index": 1
                },
            //     // 用户每日
                {
                    "name": "dayUserNo",
                    "input": 'input[name="dayUserNoValue"]',
                    "index": 1
                },
            //     // 用户最大
                {
                    "name": "userNo",
                    "input": 'input[name="userNoValue"]',
                    "index": 1
                }
                // ,
            //     // 指定上架时间
            //     {
            //         "name": "onsaleTimetype",
            //         "input": 'input[name="onsaleTime"]',
            //         "index": 1
            //     },
            //     // 指定下架时间
            //     {
            //         "name": "onsaleEndtimetype",
            //         "input": 'input[name="onsaleEndtime"]',
            //         "index": 2
            //     },
            //     // 领取开始时间 - 年月日 时分
            //     {
            //         "name": "pullStarttype",
            //         "input": "#pullStart",
            //         "enable": function() {
            //             // 选择框启用
            //             _o.sltStartHour.set("disabled", false);
            //             _o.sltStartMinute.set("disabled", false);
            //         },
            //         "disable": function() {
            //             // 选择框禁用
            //             _o.sltStartHour.set("disabled", true);
            //             _o.sltStartMinute.set("disabled", true);
            //         }
            //     }
            //     // 领取结束时间 - 年月日 时分
            //     , {
            //         "name": "pullEndtype",
            //         "input": "#pullEnd",
            //         "enable": function() {
            //             // 选择框启用
            //             _o.sltEndMinute.set("disabled", false);
            //             _o.sltEndHour.set("disabled", false);
            //         },
            //         "disable": function() {
            //             // 选择框禁用
            //             _o.sltEndMinute.set("disabled", true);
            //             _o.sltEndHour.set("disabled", true);
            //         },
            //         index: 2
            //     }
            ];
            util.changeRadio(config);
            new util.ChangeRadio({
                radioName: 'facePriceType'
            });
            new util.ChangeRadio({
                radioName: 'quantity'
            });
            new util.ChangeRadio({
                radioName: 'dayNo'
            });
            new util.ChangeRadio({
                radioName: 'dayUserNo'
            });
            new util.ChangeRadio({
                radioName: 'userNo'
            });




            new util.ChangeRadio({
                radioName: 'useAreatype',
                selects: {
                    j_useAreatype_2_k: [_o.selectElement]
                }
            });


        },
        setTextarea: function() {

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

        _p.setSlt();
        _p.setCal();
        _p.setChangeRadio();
        _p.setTextarea();
    }
    init();
    util.limitnum({
        parentClass: '.j-for-float-num'
    });
    util.limitnum({
        parentClass: '.j-for-int-num',
        mold: 'int'
    });
    $$m.itemok('ok');
});


// 上传图片
seajs.use(["$", "uploadify", 'util', '_'], function($, uploadify, util, _) {

    $(function() {
        util.bindUpload("#uploader-1",{imgSize: '500kb'});
    });
    $$m.itemok('ok');
});
var useArr = {

}
// 自动完成
seajs.use(["$", "autocomplete"], function($, AutoComplete) {
    var ac = new AutoComplete({
        trigger: $('[name="useArea"]'),
        dataSource: '/t/store/alist.aj?name={{query}}&t={{timestamp}}',
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

    ac.on('itemSelected', function(current, prev) {
        var o = current;
        $('#j_useArea').data('value', current.id);

    });
    $('#j_useAreatype_3_k input').on('blur',function(){
        if(useArr[$(this).data('value')] == $(this).val()){

        }else{
            $(this).val('');
            $(this).data('value','')
        }
    })
    $$m.itemok('ok');
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
                element: '#txtEndDate',
                required: true,
                errormessageRequired: '请输入 券有效期的截止时间。'
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
                element: '#onsaleTime',
                required: true,
                errormessageRequired: '请输入上架日期。'
            })
            .addItem({
                element: '#onsaleEndtime',
                required: true,
                errormessageRequired: '请输入下架时间。'
            })
            .addItem({
                element: '#pullStart',
                required: true,
                errormessageRequired: '请输入领取开始时间。'
            })
            .addItem({
                element: '#pullEnd',
                required: true,
                errormessageRequired: '请输入领取结束时间。'
            })
            .addItem({
                element: 'textarea[name="remark"]',
                required: true,
                errormessageRequired: '请输入详细描述。'
            })
            .addItem({
                element: '[name=facePriceType]',
                required: true,
                errormessageRequired: '请选择面额大小。'
            })
            .addItem({
                element: '[name="quantity"]',
                required: true,
                errormessageRequired: '请选择发行数量。'
            })
            .addItem({
                element: '[name="dayNo"]',
                required: true,
                errormessageRequired: '请选择渠道每日领取量。'
            })
            .addItem({
                element: '[name="dayUserNo"]',
                required: true,
                errormessageRequired: '请选择用户每日领取量。'
            })
            .addItem({
                element: '[name="userNo"]',
                required: true,
                errormessageRequired: '请选择用户最大领取量。'
            })

            $('[name=facePriceType]').change(function(e) {
                var contact = $(this).attr('value');
                validator.removeItem('#facePrice');
                if(contact == '0'){
                    $('#facePrice').attr('data-explain', '请输入面额大小');
                    validator.addItem({
                        element: '#facePrice',
                        required: true,
                        rule:'',
                        errormessageRequired: '请输入面额大小'
                    });
                } else {
                    validator.removeItem('#facePrice');
                }
            });
            $('[name=quantity]').change(function(e) {
                var contact = $(this).attr('value');
                validator.removeItem('#limitQuantity');
                if(contact == '1'){
                    $('#limitQuantity').attr('name', 'limitQuantity');
                    $('#limitQuantity').attr('data-explain', '请输入发行数量');
                    validator.addItem({
                        element: '#limitQuantity',
                        required: true,
                        rule:'',
                        errormessageRequired: '请输入发行数量'
                    });
                } else {
                    validator.removeItem('#limitQuantity');
                    $('#limitQuantity').attr('name', '');
                }
            });
            $('[name=dayNo]').change(function(e) {
                var contact = $(this).attr('value');
                validator.removeItem('[name="dayNoValue"]');
                if(contact == '0'){
                    $('[name="dayNoValue"]').attr('data-explain', '请输入渠道每日领取量');
                    validator.addItem({
                        element: '[name="dayNoValue"]',
                        required: true,
                        rule:'',
                        errormessageRequired: '请输入渠道每日领取量'
                    });
                } else {
                    validator.removeItem('[name="dayNoValue"]');
                }
            });
            $('[name=dayUserNo]').change(function(e) {
                var contact = $(this).attr('value');
                validator.removeItem('[name="dayUserNoValue"]');
                if(contact == '0'){
                    $('[name="dayUserNoValue"]').attr('data-explain', '请输入用户每日领取量');
                    validator.addItem({
                        element: '[name="dayUserNoValue"]',
                        required: true,
                        rule:'',
                        errormessageRequired: '请输入用户每日领取量'
                    });
                } else {
                    validator.removeItem('[name="dayUserNoValue"]');
                }
            });
            $('[name=dayNo]').change(function(e) {
                var contact = $(this).attr('value');
                validator.removeItem('[name="userNoValue"]');
                if(contact == '0'){
                    $('[name="userNoValue"]').attr('data-explain', '请输入用户最大领取量');
                    validator.addItem({
                        element: '[name="userNoValue"]',
                        required: true,
                        rule:'',
                        errormessageRequired: '请输入用户最大领取量'
                    });
                } else {
                    validator.removeItem('[name="userNoValue"]');
                }
            });
            if($('[name="facePriceType"]:checked').val() == '0'){
                $('[name=facePriceType]').trigger('change');
            }     
            if($('[name="quantity"]:checked').val() == '1'){
                $('[name=quantity]').trigger('change');
            }     
            if($('[name="dayNo"]:checked').val() == '0'){
                $('[name=dayNo]').trigger('change');
            }     
            if($('[name="dayUserNo"]:checked').val() == '0'){
                $('[name=dayUserNo]').trigger('change');
            }     
            if($('[name="dayNo"]:checked').val() == '0'){
                $('[name=dayNo]').trigger('change');
            }
        // 提交表单的处理

        function onSubmit() {
            var getValue = function(ele, input, defVal) {
                var v = $(ele).val(); //选中的value
                var iv = $.trim($(input).val()); //输入框的v
                var rv = (v == defVal ? iv : v);
                return $.trim(rv);
            }
            //使用时间
            var useTimeStart = util.timeToString({
                hour: '#useStartTime-m',
                minute: '#useStartTime-s'
            })
            var useTimeEnd = util.timeToString({
                hour: '#useEndTime-m',
                minute: '#useEndTime-s'
            })
            //领取开始时间
            var pullStart = util.timeToString({
                date: '#pullStart',
                hour: '#sltStartHour',
                minute: '#sltStartMinute',
                type: 'date'
            })
            //领取结束时间
            var pullEnd = util.timeToString({
                date: '#pullEnd',
                hour: '#sltEndHour',
                minute: '#sltEndMinute',
                type: 'date'
            })
            //上架时间
            var pullStart = util.timeToString({
                date: '#pullStart',
                hour: '#sltStartHour',
                minute: '#sltStartMinute',
                type: 'date'
            })
            var onsaleTime = util.timeToString({
                date: '#onsaleTime',
                hour: '#onsaleTimeHour',
                minute: '#onsaleTimeMinute',
                type: 'date'
            })
            //下架时间
            var onsaleEndtime = util.timeToString({
                date: '#onsaleEndtime',
                hour: '#onsaleEndtimeHour',
                minute: '#onsaleEndtimeMinute',
                type: 'date'
            })
            // // 面额
            // var facePrice = getValue('[name="facePriceType"]:checked', '#facePrice', 0);
            // // 可领取数量
            // var limitQuantity = getValue('[name="quantity"]:checked', '#limitQuantity', 1);
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
            var extraData = {
                // "facePrice": facePrice,
                // "limitQuantity": limitQuantity,
                "pic": pic,
                "useStartTime": useTimeStart,
                "useEndTime": useTimeEnd,
                "onsaleTime" : onsaleTime,
                "onsaleEndtime" : onsaleEndtime,
                "pullEnd":pullEnd,
                "pullStart":pullStart
            }
            util.formSend("#" + frmCouponId, {
                extraData: extraData,
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
