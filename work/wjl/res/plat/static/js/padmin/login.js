 seajs.use(['$', 'validator', "util"], function($, Validator, util) {

     var validator = new Validator({
         element: '#frmLogin',
         onFormValidated: function(err, results, form) {
             err != true && onSubmit();
         },
         autoSubmit: false,
         failSilently: true
     });

    validator.addItem({
        element: '[name=username]',
        required: true
    })
    .addItem({
        element: '#password',
        required: true,
        ule: 'minlength{min:5}'
    });

     /*
     .addItem({
         element: '#password',
         required: true,
         rule: 'confirmation{target: "#password"}'
     });
     */
     function onSubmit() {
         util.formSend("#frmLogin", {
             successTxt: "登录成功",
             "ajaxSuccess": function(json) {
                 util.go(json);
                 
              }
             // "submitButton": "#btnSave"
             /*
             ,"ajaxFail": function(data) {
                 alert(data.msg || "登录失败");
             }
             */
         });
     };

     $('#j_tab').on('click', 'span', function(json) {
         if ($(this).hasClass('on')) {
             return
         } else {
             if ($(this).data('type') == 1) { //商管
                 $('#j_type').val(1);
                 $('#j_info').html('忘记密码，请联系万江龙客服人员。');
             } else { //商户
                 $('#j_type').val(2);
                 $('#j_info').html('忘记密码，请联系商管人员。')
             }
             $(this).parent().find('span').removeClass('on');
             $(this).addClass('on');
             $('#password').val('')
         }
     })

 });