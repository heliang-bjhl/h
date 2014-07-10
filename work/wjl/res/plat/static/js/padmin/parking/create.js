// 下拉列表 & 文本字数限制 & radio按钮的操作
$$m.length = 2;
seajs.use("calendar_css");
seajs.use(["$", "textLimit", "select", "util", "calendar"], function($, textLimit, Select, util, Calendar) {
    var _o = {};
    var _p = {
        setSlt: function() {
            // 使用时间
            _o.useStartTime_m = new Select({
                trigger: '#startTime-h'
            }).render();
            _o.useStartTime_s = new Select({
                trigger: '#startTime-m'
            }).render();
            _o.useEndTime_m = new Select({
                trigger: '#endTime-h'
            }).render();
            _o.useEndTime_s = new Select({
                trigger: '#endTime-m'
            }).render();
        },
        setCal: function() {
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

        },
        setChangeRadio: function() {
            new util.ChangeRadio({
                radioName: 'tickType'
            });
        }
    }




    var init = function() {
        _p.setSlt();
        _p.setCal();
        _p.setChangeRadio();
    }
    init();
    $$m.itemok('ok');
});

// 提交表单
seajs.use(['validator', '$', "util"], function(Validator, $, util) {
    $(function() {
        var formid = "frmParkingCreate";
        //$("#frmParkingCreate").attr("id", frmCouponId);
        // 实例验证对象
        var validator = new Validator({
            element: '#' + formid,
            onFormValidated: function(err, results, form) {
                err != true && onSubmit();
            },
            autoSubmit: false,
            failSilently: true
        });

        //使用时间



        // 表单验证
        $('#j_consumeTime1_level_k').find('input').attr('data-explain', '请输入 全场统一消费时长');
        validator
            .addItem({
                element: 'input[name="title"]',
                required: true,
                errormessageRequired: '请输入主题名称。'
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
                element: '[name="tickType"]',
                required: true,
                errormessageRequired: '请选择消费时长类型。'
            })
            .addItem({
                element: $('#j_consumeTime1_level_k').find('input'),
                required: true,
                rule:'',
                errormessageRequired: '请输入 全场统一消费时长'
            });
            $('[name=tickType]').change(function(e) {
                var contact = $(this).attr('value');
                
                if(contact == '1'){
                    validator.removeItem($('#j_consumeTime1_level_k').find('input'));
                    $('#j_consumeTime1_level_k').find('input').attr('data-explain', '请输入 全场统一消费时长');
                    validator.addItem({
                        element: $('#j_consumeTime1_level_k').find('input'),
                        required: true,
                        rule:'',
                        errormessageRequired: '请输入 全场统一消费时长'
                    });
                } else {
                    validator.removeItem('[name="userNoValue"]');
                    $('#j_consumeTime2_level_k p').eq(0).find('input').attr('data-explain', '请输入 全场统一消费时长');
                    validator.addItem({
                        element: $('#j_consumeTime2_level_k p').eq(0).find('input').eq(0),
                        required: true,
                        rule:'',
                        errormessageRequired: '请输入正确的内容'
                    });
                    validator.addItem({
                        element: $('#j_consumeTime2_level_k p').eq(0).find('input').eq(1),
                        required: true,
                        rule:'',
                        errormessageRequired: '请输入正确的内容'
                    });
                }
            });
        $('[name=tickType]').trigger('change');
        // 提交表单的处理

        function onSubmit() {
            var useTimeStart = util.timeToString({
                hour: '#startTime-h',
                minute: '#startTime-m'
            })
            var useTimeEnd = util.timeToString({
                hour: '#endTime-h',
                minute: '#endTime-m'
            })
            var parkingTime = [];
            {
                var tickType_v = $('input[name="tickType"]:checked').val();
                if(tickType_v == 1){
                    parkingTime = $('#j_consumeTime1_level_k').find('input').val()
                }else{
                    
                    $('#j_consumeTime2_level_k p').each(function(){
                        var item = $(this).find('input:eq(0)').val() + '-' + $(this).find('input:eq(1)').val();
                        parkingTime.push(item);

                    })
                    parkingTime = parkingTime.join(',')
                }
            }

            var extraData = {
                //"facePrice": facePrice,
                //"limitQuantity": limitQuantity,
                parkingTime : parkingTime,
                "useStartTime": useTimeStart,
                "useEndTime": useTimeEnd
            }
            util.formSend("#" + formid, {
                extraData: extraData,
                "ajaxSuccess": function(json) {

                    util.go(json);
                },
                "submitButton": "#btnSave"
            });
        }
    });
$$m.itemok('ok');
});
