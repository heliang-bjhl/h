seajs.use("calendar_css");
seajs.use(["$","util", "calendar","confirmbox","uploadify", "_","validator","select"], function($,util, Calendar,ConfirmBox,uploadify, _,Validator,Select) {
    var _o = {};
    var _p = {
        setSel : function(){
            new Select({
                trigger: '#j_upHour'
            }).render();
            new Select({
                trigger: '#j_upMinute'
            }).render();
            new Select({
                trigger: '#j_downHour'
            }).render();
            new Select({
                trigger: '#j_downMinute'
            }).render();
        },
        setCal : function(){
            var c1 = new Calendar({
                trigger: '#j_upTime'
            });
            var c2 = new Calendar({
                trigger: '#j_downTime'
            });
            c1.on('selectDate', function(date){
                c2.range([date, null]);
            });

            c2.on('selectDate', function(date){
                c1.range([null, date]);
            });
        },
        setVal : function(){
            var validator = new Validator({
                element: '#createFrm',
                onFormValidated: function(err, results, form) {
                    err != true && onSubmit();
                },
                autoSubmit: false,
                failSilently: true
            });
            validator
            .addItem({
                element: '#j_msgName',
                required: true,
                errormessageRequired: '请输入广告名称。'
            })
            .addItem({
                element: '#j_upTime',
                required: true,
                errormessageRequired: '请输入上线时间。'
            })
            .addItem({
                element: '#j_downTime',
                required: true,
                errormessageRequired: '请输入下线时间。'
            })
        },
        bind : function(){
            $('#j_default').on('click',function(){
                if($(this).val() == '设为默认'){
                    $(this).val('取消默认');
                }else{
                    $(this).val('设为默认');
                }
            });
        }
    }
    var init = function() {
        _p.setCal();
        _p.setSel();
        _p.setVal();
        _p.bind();
    }
    init();
    util.bindUpload("#uploader-1",{imgSize: '500kb',max : 1,min: 1});
    $$m.finish('ok');
});
