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
     }).addItem({
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
             "ajaxSuccess": function(json) {
                 util.go(json)
             },
             "ajaxFail": function(data) {
                 alert(data.msg || "登录失败");
             }
         });
     };
 });