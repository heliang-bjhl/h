seajs.use("calendar_css");
seajs.use(["$","util", "calendar","select"], function($,util, Calendar,Select) {
    var _o = {};
    var _p = {
        setSel : function(){
            _o.mounth1 = new Select({
                trigger: '#j_Mounth1'
            }).render();
            _o.mounth2 = new Select({
                trigger: '#j_Mounth2'
            }).render();
        },
        setChart: function(opt) {
            var option = {
                chart: {
                    renderTo: 'contain',
                    type: 'column',
                    animation: {
                        duration: 1000
                    }
                },
                subtitle: {
                    text: '',
                    align: 'right',
                    x: -10
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: '月度对比'
                },
                xAxis: {
                    categories: [opt.mounth1,opt.mounth2]
                },
                yAxis: {
                    title: {
                        text: '人数'
                    }
                },
                series: [{
                    name: '月独立访客数',
                    data: opt.arr2,
                    stack: '月独立访客数'
                }, {
                    name: '月活跃用户数',
                    data: opt.arr1,
                    stack: '月活跃用户数'
                }, {
                    name: '月会员到访数',
                    data: opt.arr3,
                    stack: '月会员到访数'
                }],
                credits: { //版权
                    enabled: 0
                }
            }
            _o.chart1 = new Highcharts.Chart(option);
        },
        sendAjax : function(opt){
            $.ajax({
                url: '/rpt_mall_total_visit_index_p_month_compare',
                data : {
                    month1 : opt.month1,
                    month2 : opt.month2
                },
                dataType: 'json'
            }).done(function(json){
                if(json && json.code == 200){
                    _o.chart1 = null;
                    $('#contain').empty();
                    var getdata1 = json.data1[0];
                    var getdata2 = json.data2[0];
                    var active_visitors1 = parseInt(getdata1.active_visitors) || 0;
                    var active_visitors2 = parseInt(getdata2.active_visitors) || 0;
                    var visitors1 = parseInt(getdata1.visitors) || 0;
                    var visitors2 = parseInt(getdata2.visitors) || 0;
                    var member1 = parseInt(getdata1.member) || 0;
                    var member2 = parseInt(getdata2.member) || 0;
                    _p.setChart({
                        mounth1 : getdata1.eve_month,
                        mounth2 : getdata2.eve_month,
                        arr1 : [active_visitors1,active_visitors2],
                        arr2 : [visitors1,visitors2],
                        arr3 : [member1,member2]
                    });
                    
                }else{
                    obj = false;
                }
            }).fail(function(){});
        },
        bind : function(){
            $('#j_contrast').on('click',function(){
                _p.sendAjax({
                    month1 : $('#j_Mounth1').val(),
                    month2 : $('#j_Mounth2').val()
                });
            });
        }
    }
    var init = function() {
        _p.setSel();
        _p.bind();
        $('#j_contrast').trigger('click');
    }
    init();
    $$m.finish('ok');
});
