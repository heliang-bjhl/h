     seajs.use(['util'], function(util) {
         var _p = {
             bindform: function() {
                 util.form.sb({
                     form: 'j_form',
                     sb: 'j_sb',
                     extendVal: function(form) { //所有表单默认规则都通过
                        form.submit();
                     }
                 });
             },
             beforeSend: function() {
                 $('#j_getcode').addClass('m-bt-grey');
                 $('#j_getcode').val('验证码获取中...');
             },
             success: function() {
                 var t = 10;
                 var tm;
                 var cal = function() {
                     $('#j_getcode').removeClass('m-bt-grey');
                     $('#j_getcode').val('获取验证码');
                 }

                 function timer() {
                     if (t == 1) {
                         clearTimeout(tm);
                         cal();
                         return
                     }
                     $('#j_getcode').val((--t) + '秒后重新获取');
                     tm = setTimeout(timer, 1000);
                 }
                 timer();

             },
             clickGetCode: function() {
                 $('#j_getcode').bind(util.mousedown, function() {
                     var ipt = $(this);
                     if (ipt.hasClass('m-bt-grey')) {
                         return
                     }
                     util.form.val(['j_phone'], function() {
                         var aj = new util.Go({
                             url: '/aj/member/getauthcode',
                             data: {
                                 mobile: $('#j_phone').val(),
                                 timer : new Date().getTime()
                             },
                             beforeSend: function() {
                                 _p.beforeSend();
                             },
                             success: function(data) {
                                 if (data.code == 200) {
                                     _p.success();
                                 }
                             }
                         })
                     });

                 })

             },
             _init: function() {
                 _p.clickGetCode();
                 _p.bindform();
             }
         }
         _p._init();
     });



