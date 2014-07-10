seajs.use("calendar_css");
seajs.use(["$", "textLimit", "select", "util", "calendar", 'validator', 'uploadify',"autocomplete",'confirmbox'], function($, textLimit, Select, util, Calendar, Validator, uploadify,AutoComplete,ConfirmBox) {
    var _o = {};
    var frmCouponId = "frmUpdate";
    $("#frmStoreCreate").attr("id", frmCouponId);
    var validator = new Validator({
        element: '#' + frmCouponId,
        onFormValidated: function(err, results, form) {
            err != true && _p.sb();
        },
        autoSubmit: false,
        failSilently: true
    });
    var useArr = {};
    var _p = {
        setSlt: function() {
            //下拉菜单美化
            //活动开始时间
            _o.start_Time_Hour = new Select({
                trigger: '#start_Time_Hour'
            }).render();
            _o.start_Time_Minute = new Select({
                trigger: '#start_Time_Minute'
            }).render();
            //活动结束时间
            _o.end_Time_Hour = new Select({
                trigger: '#end_Time_Hour'
            }).render();
            _o.end_Time_Minute = new Select({
                trigger: '#end_Time_Minute'
            }).render();
            //报名开始时间
            _o.z_startDateHour = new Select({
                trigger: '#z_startDateHour'
            }).render();
            _o.z_startDateMinute = new Select({
                trigger: '#z_startDateMinute'
            }).render();
            //报名结束时间
            _o.z_endDateHour = new Select({
                trigger: '#z_endDateHour'
            }).render();
            _o.z_endDateMinute = new Select({
                trigger: '#z_endDateMinute'
            }).render();
        },
        setCal: function() {
            //日历控件
            //报名开始日期
            var z_startDate_val = $('#z_startDate').val();
            //报名结束日期
            var z_endDate_value = $('#z_endDate').val();
            //活动开始日期
            var start_Time_value = $('#start_Time').val();
            //活动结束日期
            var end_Time_value = $('#end_Time').val();
            if(z_startDate_val && z_endDate_value){
                var c1 = new Calendar({trigger: '#z_startDate', range: [null, z_endDate_value]});
                var c2 = new Calendar({trigger: '#z_endDate', range: [z_startDate_val, null]});
            }else{
                var c1 = new Calendar({trigger: '#z_startDate'});
                var c2 = new Calendar({trigger: '#z_endDate'});
            }
            if(start_Time_value && end_Time_value){
                var c3 = new Calendar({trigger: '#start_Time', range: [null, end_Time_value]});
                var c4 = new Calendar({trigger: '#end_Time', range: [start_Time_value, null]});
            }else{
                var c3 = new Calendar({trigger: '#start_Time'});
                var c4 = new Calendar({trigger: '#end_Time'});
            }
            c1.on('selectDate', function(date) {
                c2.range([date, null]);
            });
            c2.on('selectDate', function(date) {
                c1.range([null, date]);
            });
            c3.on('selectDate', function(date) {
                c4.range([date, null]);
            });
            c4.on('selectDate', function(date) {
                c3.range([null, date]);
            });
        },
        getHtml:function(msg){
            var errHtml = [
                '<div class="dialog-form">',
                '<p>',msg,'</p>',
                '</div>'
            ].join("");
            return errHtml;
        },
        sb: function() {
            function imgerror(){
                $('.m-upload').closest('.ui-form-item').addClass('ui-form-item-error').find('.ui-form-explain').text('必须上传主题图片。');
            }
            var checkboxArr = [];
            if($('.m-upload li').length <= 1){
                return imgerror();
            }
            var checkboxArr = [];
            var startTime = util.timeToString({
                date: '#start_Time',
                hour: '#start_Time_Hour',
                minute: '#start_Time_Minute',
                type: 'date'
            });
            var endTime = util.timeToString({
                date: '#end_Time',
                hour: '#end_Time_Hour',
                minute: '#end_Time_Minute',
                type: 'date'
            });
            var registrarStartTime = util.timeToString({
                date: '#z_startDate',
                hour: '#z_startDateHour',
                minute: '#z_startDateMinute',
                type: 'date'
            });
            var registrarEndTime = util.timeToString({
                date: '#z_endDate',
                hour: '#z_endDateHour',
                minute: '#z_endDateMinute',
                type: 'date'
            });
            $('.j_tag:checked').each(function(){
                    checkboxArr.push($(this).val());
            });
            var activityType = checkboxArr.join(',');
            var activityPic = []; // 图片多个url用’,‘链接
            $.each($("#uploadImg1 .loaded-img"), function() {
                activityPic.push($(this).attr("data-src"));
            });
            var extraData = {
                startTime : startTime,
                endTime : endTime,
                activityPic : activityPic.join(","),
                activityType : activityType
            }
            if($('input[name=onlineRegistration]:checked').attr('value') == 1){
                extraData.registrarStartTime = registrarStartTime;
                extraData.registrarEndTime = registrarEndTime;
                if($('input[name=registrarLimit]:checked').attr('value') == -1){

                }else{
                    $('input[name=registrarLimit]').attr('value',$('#c_no_need_memnum').val());
                }
            }else{
                $('input[name=registrarLimit]').attr('value','-1');
                $('#c_no_need_memnum').val('');
            }
            
            util.formSend("#frmUpdate" , {
                extraData: extraData,
                "ajaxSuccess": function(json) {
                    if(json.code === 1 && json.msg){
                        Util.confirm.open({
                            title: '操作有误',
                            message: _p.getHtml(json.msg),
                            confirmTpl: '',
                            cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2">关闭</span>',
                            width:300,
                            onConfirm: function() { // 通过
                            },
                            onCancel: function() { // 拒绝
                                util.confirm.close();
                            },
                            onClose: function() {

                            }
                        });
                    }else{
                        util.go(json);
                    }
                },
                "error": function(data) {
                    util.alert("操作超时")
                }
            });
        },
        setValidator: function() {
            
            validator
                .addItem({
                    element: '#z_subject',
                    required: true,
                    rule: 'maxlength{max: 50}',
                    errormessageRequired: '活动主题为必填字段，最多50个字符。'
                })
                .addItem({
                    element: '#z_spec',
                    required: true,
                    rule: 'maxlength{max: 50}',
                    errormessageRequired: '活动特色为必填字段，最多50个字符。'
                })
                .addItem({
                    element: '#z_place',
                    required: true,
                    rule: 'maxlength{max: 30}',
                    errormessageRequired: '活动地点为必填字段，最多30个字符。'
                })
                .addItem({
                    element: '#start_Time',
                    required: true,
                    errormessageRequired: '活动时间为必填字段。'
                })
                .addItem({
                    element: '.j_tag',
                    required: true,
                    errormessageRequired: '活动类型为必选。'
                })
                .addItem({
                    element: '#end_Time',
                    required: true,
                    errormessageRequired: '活动时间为必填字段。'
                });
        },
        setAc : function(){
            var ac = new AutoComplete({
                trigger: $('#z_bussinessnum'),
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
                $('#z_bussinessnum').data('value', current.value);
                $('#z_joinStoreId').val(current.id)
            });
            $('#z_bussinessnum').on('blur',function(){
                if($(this).data('value') == $(this).val()){

                }else{
                    $(this).val('');
                    $(this).data('value','')
                }
            });
        },
        setChangeRadio: function() {
            if ($('input[name="onlineRegistration"]:checked').data('need') == 'noneed') {
                $('.c_unsee').hide();
            } else if ($('input[name="onlineRegistration"]:checked').data('need') == 'need') {
                $('.c_unsee').show();
                validator.addItem({
                    element: '#z_startDate',
                    required: true,
                    errormessageRequired: '报名时间为必填字段。'
                })
                    .addItem({
                        element: '#z_endDate',
                        required: true,
                        errormessageRequired: '报名时间为必填字段。'
                    });
                $('input[name="registrarLimit"]').change(function(e) {
                    validator.removeItem('#registrar_limit');
                    if ($(this).data('chanval')) {
                        $('.c_unsee').show();
                        validator.addItem({
                            element: '#c_no_need_memnum',
                            required: true,
                            errormessageRequired: '报名人数为必填字段。'
                        });
                    } else {

                    }
                });
            }
            var config = [{
                "name": "organizer",
                "input": '#z_bussinessnum',
                "index": 1
            }, {
                "name": "registrarLimit",
                "input": '#c_no_need_memnum',
                "index": 1
            }];
            util.changeRadio(config);
            $('input[name="onlineRegistration"]').change(function(e) {
                validator.removeItem('#z_startDate');
                $('input[name="registrar_limit"]').unbind('change');
                validator.removeItem('#z_endDate');
                validator.removeItem('#c_no_need_memnum');
                if ($(this).data('need') == 'need') {
                    $('input[name="registrar_limit"]').change(function(e) {
                        validator.removeItem('#c_no_need_memnum');
                        if ($(this).data('chanval')) {
                            validator.addItem({
                                element: '#c_no_need_memnum',
                                required: true,
                                errormessageRequired: '报名人数为必填字段。'
                            });
                        } else {}
                    });
                    validator.addItem({
                        element: '#z_startDate',
                        required: true,
                        errormessageRequired: '报名时间为必填字段。'
                    })
                        .addItem({
                            element: '#z_endDate',
                            required: true,
                            errormessageRequired: '报名时间为必填字段。'
                        });
                    var config2 = [{
                        "name": "c_no_need_memnum",
                        "input": '#registrar_limit',
                        "index": 1
                    }]
                    util.changeRadio(config2);
                    $('.c_unsee').show();
                } else {
                    $('.c_unsee').hide();
                }
            });
            $('input[name="organizer"]').change(function(e) {
                validator.removeItem('#z_bussinessnum');
                if ($(this).data('chanval')) {
                    validator
                        .addItem({
                            element: '#z_bussinessnum',
                            required: true,
                            errormessageRequired: '举办方为必填字段。'
                        })
                } else {}
            });
        },
        setEdt: function() {
            _p.ue = UM.getEditor('jedt', {
                toolbar: [
                    'bold',
                        'italic',
                        'underline',
                        'fontfamily',
                        'fontsize',
                        'paragraph',
                        '|',
                        'forecolor',
                        'backcolor',

                        '|',
                        'insertorderedlist',
                        'insertunorderedlist',
                        '|',
                        'justifyleft',
                        'justifyright',
                        'justifycenter',
                        '|',
                        'link',
                        'emotion'
                    
                ],
                autoHeightEnabled: true,
                autoFloatEnabled: true,
                initialFrameHeight: 300,
                elementPathEnabled: false,
                maximumWords: 1000
            });
            _p.ue.ready(function() {
                //设置编辑器的内容
                // _p.ue.setContent('hello');
                _p.ue.addListener('blur', function(e) {
                    _p.setDetailValidator()

                }); //加选择改变事件监听
                _p.setCon($('#text_activityInfo').val());
            });


        },
        setCon : function(str){
            _p.ue.setContent(str);
        },
        setDetailValidator: function() {
            //获取html内容，返回: <p>hello</p>
            var html = _p.ue.getContent();
            //获取纯文本内容，返回: hello
            var txt = _p.ue.getContentTxt();
            if (html == '') {
                $('#j_edt_box').addClass('ui-form-item-error');
            } else {
                $('#j_edt_box').removeClass('ui-form-item-error');
            }
        }
    };
    var init = function() {
        _p.setChangeRadio();
        _p.setSlt();
        _p.setCal();
        _p.setValidator();
        _p.setEdt();
        _p.setAc();
        //上传图片
        util.bindUpload("#uploader-1", {
            imgSize: '500kb',
            max: 6
        });
    };
    init();
    //文本框输入设定为整形的数值
    util.limitnum({
        parentClass: '.j-for-int-num',
        mold: 'int'
    });
    $$m.finish('ok');
});