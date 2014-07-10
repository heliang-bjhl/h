seajs.use("calendar_css");
seajs.use(["$", "textLimit", "select", "util", "calendar", 'validator', 'uploadify',"autocomplete",'confirmbox'], function($, textLimit, Select, util, Calendar, Validator, uploadify,AutoComplete,ConfirmBox) {
    var _o = {};
    Validator.addRule('phoneArrs', function(options){
        var v = options.element.val();
        if(!v){
            return false;
        }
        var arr = v.split(',');
        var reg = /\D/g;
        for(var i = 0;i < arr.length;i++){
            if(reg.test(arr[i])){
                return false;
            }
        }
        return true;
    }, '请按照规则输入');
    var validator = new Validator({
        element: '#frmSearch' ,
        onFormValidated: function(err, results, form) {
            err != true && _p.sb();
        },
        autoSubmit: false,
        failSilently: true
    });
    
    var _p = {
    	setCal : function(){
    		//日历控件
            //生日起点时间
            _o.nowDate = util.getCurrentDate();
            var c1 = new Calendar({
                trigger: '#birthday_Start_Date',
                range: [null,_o.nowDate]
            });
            //生日截止时间
            var c2 = new Calendar({
                trigger: '#birthday_End_Date',
                range: [null,_o.nowDate]
            });
            c1.on('selectDate', function(date) {
                c2.range([date, _o.nowDate]);
            });
            c2.on('selectDate', function(date) {
                c1.range([null, date]);
            });
            //注册起点时间
            var c3 = new Calendar({
                trigger: '#regist_Start_Date',
                range: [null,_o.nowDate]
            });
            //注册截止时间
            var c4 = new Calendar({
                trigger: '#regist_End_Date',
                range: [null,_o.nowDate]
            });
            c3.on('selectDate', function(date) {
                c4.range([date, _o.nowDate]);
            });
            c4.on('selectDate', function(date) {
                c3.range([null, date]);
            });
            //定时发送日期
            // var curday = util.getCurrentDate();
            // var time1 = util.getDateRangeTime(util.getCurrentDate(), -30);
            var c5 = new Calendar({
                trigger: '#send_Time',
                range: [util.getCurrentDate(),util.getDateRangeTime(util.getCurrentDate(), 30)]
            });
    	},
        disSel : function(){
            for(var i = 0;i < 8;i++){
                _o.send_Time_Hour.disableOption(i);
            }
            for(var j = 18;j < 24;j++){
                _o.send_Time_Hour.disableOption(j);
            }
        },
    	setSel : function(){
    		//下拉菜单美化
            //性别
            _o.z_gender = new Select({
                trigger: '#z_gender'
            }).render();
            //短信类型
            _o.z_sms_style = new Select({
                trigger: '#z_sms_style'
            }).render();
            //定时发送的小时
            _o.send_Time_Hour = new Select({
                trigger: '#send_Time_Hour'
            }).render();
            //定时发送的分钟
            _o.send_Time_Minute = new Select({
                trigger: '#send_Time_Minute'
            }).render();
    	},
    	setVal : function(){
            var wlen = 200 - $('#endtitleofsms').val().length
    		validator.addItem({
                element: '#z_sms_detail',
                required: true,
                rule: 'minlength{min:1} maxlength{max:' + wlen + '}',
                display : '短信',
                errormessageRequired: '短信内容为必填字段。'
            })
            .addItem({
                element: '#z_sms_sel_hide_area',
                required: true,
                errormessageRequired: '短信类型为必选。'
            })
            .addItem({
                element: '#send_Time',
                required: true,
                errormessageRequired: '发送时间为必填字段。'
            })
            .addItem({
                element: 'input[name="sendType"]',
                required: true,
                errormessageRequired: '正告：请在8:00-18:00期间发送短信！'
            });
    	},
        setTextarea : function(){
            var wlen = $('#endtitleofsms').val().length
             textLimit({
                "input": "#z_sms_detail",
                "tip": "#lblDescriptionMsg",
                "msg": function(opt) {
                    var opts = opt || {};
                    var i = 0;
                    if(opt.count <= (70 - wlen)){
                    	i = 1;
                        _o.num = i;
                        $('#upnums').val(opt.count + wlen);
                        $('#uplistnums').val(i);
                        return '字数为{count},短信分为' + i + '条。';
                    }else if(opt.count <= (200 - wlen) && opt.count > (70 - wlen)){
                    	i = Math.ceil((opt.count + wlen)/67);
                        _o.num = i;
                        $('#upnums').val(opt.count + wlen);
                        $('#uplistnums').val(i);
                        return '字数为{count},短信分为' + i + '条。';
                    }else{
                        return "不能超过{max}个字";
                    }
                    
                },
                "max": (200 - wlen),
                "min": 0,
                "enableBr": true,
                "changeFn": function(){
                }
            }).init();
        },
    	search : function(){

    	},
        getHtml:function(num){
            var saveHtml = [
                '<div class="dialog-form">',
                '<p>您将要发送' + num + '×' + _o.num + '条短信</p>',
                '<p>是否确认发送？</p>',
                '</form>',
                '</div>'
            ].join("");
            return saveHtml;
        },
        getSendObjs : function(){
            var extraData = {
            };
            if($('input[name="sendType"]:checked').val() == '2'){
                var sendTime = util.timeToString({
                    date: '#send_Time',
                    hour: '#send_Time_Hour',
                    minute: '#send_Time_Minute',
                    type: 'date'
                }) + ':00';
                extraData.sendTime = sendTime;
            }else{
                extraData.sendTime = '';
            }
            if($('input[name="sendmethods"]:checked').val() == '1'){
                var startTime,endTime;
                if($('#regist_Start_Date').val()){
                    startTime = $('#regist_Start_Date').val() + ' 00:00:00';
                }else{
                    startTime = '';
                }
                if($('#regist_End_Date').val()){
                    endTime = $('#regist_End_Date').val() + ' 23:59:59';
                }else{
                    endTime = '';
                }
                extraData.startTime = startTime;
                extraData.endTime = endTime;
            }
            extraData.sendContent = $('#z_sms_detail').val() + $('#endtitleofsms').val();
            return extraData;
        },
    	sb: function() {
            extraData = _p.getSendObjs();
            util.formSend("#frmSearch" , {
                extraData: extraData,
                "success": function(json) {
                    if(!_o.searchReady){
                        var num = json.data.count;
                        var submitTime = json.data.submitTime;
                        $('#submitTime').val(submitTime);
                        Util.confirm.open({
                            title: '确认操作',
                            message: _p.getHtml(num),
                            confirmTpl: '<span class="ui-button ui-button-morange" id="j_bt_yes">确定</span>',
                            cancelTpl: '<span class="ui-button ui-button-morange" id="j_bt_no">取消</span>',
                            width:300,
                            onConfirm: function() { // 通过
                                $('#frmSearch').attr('action','/t/sms/send');
                                _p.sb2();
                                _o.searchReady = true;
                            },
                            onCancel: function() { // 拒绝
                                $('#frmSearch').attr('action','/t/sms/count');
                                _o.searchReady = false;
                                util.confirm.close();
                            },
                            onClose: function() {
                                $('#frmSearch').attr('action','/t/sms/count');
                                _o.searchReady = false;
                            }
                        });
                    }
                },
                "error": function(data) {
                    util.alert("操作超时");
                }
            });
        },
        sb2: function() {
            var extraData = _p.getSendObjs();
            util.formSend("#frmSearch" , {
                extraData: extraData,
                submitButton:'#j_bt_yes',
                "ajaxSuccess": function(json) {
                    util.go(json);
                },
                "error": function(data) {
                    util.alert("操作超时");
                }
            });
        },
    	bind : function(){
    		_o.z_sms_style.on('change',function(target){
    			$('#z_sms_sel_hide_area').val(target.attr('data-value'));
    		});
    		$('#z_all_checkbox').on('change',function(){
    			if(this.checked){
    				$('.z_style_box').prop('checked','checked');
    			}else{
    				$('.z_style_box').prop('checked','');
    			}
    			
    		});
    		$('.z_style_box').on('click',function(){
    			var i = 0;
    			if(!this.checked){
    				$('#z_all_checkbox').prop('checked',false);
    			}else{
    				$('.z_style_box').each(function(){
    					if(this.checked){
    						i += 1;
    					}
    				});
    				if(i == $('.z_style_box').length){
    					$('#z_all_checkbox').prop('checked',true);
    				}
    			}
    		});
    		$('input[name="sendmethods"]').change(function(e){
    			validator.removeItem('.z_style_box')
    					 .removeItem('#hand_copy_tels');
    			if($(this).val() == '1'){
    				$('#mes_for_merchant').hide();
    				$('#mes_for_hand').hide();
    				$('#mes_for_member').show();
    			}else if($(this).val() == '2'){
					validator.addItem({
		                element: '.z_style_box',
		                required: true,
		                errormessageRequired: '商户业态为必选。'
		            });
    				$('#mes_for_member').hide();
    				$('#mes_for_hand').hide();
		            $('#mes_for_merchant').show();
    			}else if($(this).val() == '3'){
    				validator.addItem({
		                element: '#hand_copy_tels',
		                required: true,
                        rule : 'phoneArrs',
		                errormessageRequired: '号码为必填。'
		            });
    				$('#mes_for_member').hide();
		            $('#mes_for_merchant').hide();
    				$('#mes_for_hand').show();
    			}
    		});
    		$('input[name="sendType"]').change(function(e){
    			validator.removeItem('#send_Time');
    			if($(this).val() == '2'){
    				validator.addItem({
		                element: '#send_Time',
		                required: true,
		                errormessageRequired: '发送时间为必填字段。'
		            });
		            $('#z_Send_Style').show();
    			}else if($(this).val() == '1'){
    				$('#z_Send_Style').hide();
    			}
    		});
    	}
    };
    var init = function(){
    	_p.setCal();
    	_p.setSel();
    	_p.setVal();
    	_p.setTextarea();
        _p.disSel();
    	_p.bind();
    };
    init();
    $$m.finish('ok');
});