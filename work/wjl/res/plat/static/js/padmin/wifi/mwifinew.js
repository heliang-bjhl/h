seajs.use(["$","util","uploadify", "_","validator"], function($,util,uploadify, _,Validator) {
    var _o = {};
    var _p = {
        setVal : function(){
            var validator = new Validator({
                element: '#createFrm',
                onFormValidated: function(err, results, form) {
                    err != true && _p.sb({
						form : '#createFrm',
						submitButton : '#btn_save'
					});
                },
                autoSubmit: false,
                failSilently: true
            });
            validator
            .addItem({
                element: '#j_msgName',
                required: true,
                rule: 'maxlength{max:100}',
                display: '广告名称',
                errormessageRequired: '请输入广告名称。'
            });
        },
        sb: function(op) {
            function imgerror(){
                $('.m-upload').closest('.ui-form-item').addClass('ui-form-item-error').find('.ui-form-explain').text('必须上传图片。');
            }
            var checkboxArr = [];
            if($('.m-upload li').length <= 1){
                return imgerror();
            }
            var extraData = {
                adpicurl : $("#uploadImg1 .loaded-img").attr("data-src")
            }
            util.formSend(op.form , {
                extraData: extraData,
                "ajaxSuccess": function(json) {
                    if(data.code == 200){
						util.go(data); 
					}else{
						setTimeout(function(){
							$('body').find('.ui-poptip').show();
							setTimeout(function(){
								$('body').find('.ui-poptip').hide();
							},1000);
						},200);
					}
                },
                "error": function(data) {
                    util.alert("操作超时")
                },
				submitButton : op.submitButton
            });
        },
		bind : function(){
			$('input[name="adchannel"]').on('change',function(){
				$('#pic_guige').removeClass('ui-form-item-error').empty().append($(this).data('msg'));
				$('#uploadImg1').find('.close').trigger('click');
			});
		}
    }
    var init = function() {
        _p.setVal();
		_p.bind();
    }
    init();
    util.bindUpload("#uploader-1",{imgSize: '500kb',max : 1});
    $$m.finish('ok');
});
