seajs.use("calendar_css");
seajs.use(["$", 'util', 'calendar'], function($, util, Calendar) {
    var _o = {};
    var _p = {
        setCal: function() {
            var curday = util.getCurrentDate();
            var time1 = util.getDateRangeTime(curday, -30);
            var c1 = new Calendar({
                trigger: '#jStartTime',
                range: [null, curday]
            });
            var c2 = new Calendar({
                trigger: '#jEndTime',
                range: [time1, curday]
            });
            c1.on('selectDate', function(date) {
                if(util.getDateRange(date,curday) <= 30){
                    var s = date._i ;
                    var e = curday;
                }else{
                    var s =  date._i;
                    var e =  util.getDateRangeTime(date._i, 30);
                }
                c2.range([s, e]);
                
            });
            c2.on('selectDate', function(date) {
               var s = util.getDateRangeTime(date._i, -30);
               var e = date._i;
               c1.range([s, e]);
            });
        },
        setChart3: function(arr1,arr2,num) {
            $(function(){
                _o.setChart3 = new Highcharts.Chart({
                    chart: {
                        renderTo: 'contain3', //指向的div的id属性
                        zoomType: 'x'
                    },

                    title: {
                        text: '发送条数走势' //图表标题
                    },
                    xAxis: {
                        // tickPixelInterval : 1000,
                        tickInterval: 5,
                        title: {
                            text: "日期"
                        },
                        labels: {
                            //  step: 3
                        },
                        categories: arr1
                    },
                    yAxis: {

                        title: {
                            text: '短信条数' //y轴上的标题
                        }
                    },
                    subtitle: {
                        text: '总数' + num,
                        align: 'right',
                        x: -10
                    },
                    credits: { //版权
                        enabled: 0
                    },
                    series: [{
                        name: '发送条数', //鼠标移到趋势线上时显示的属性名
                        data: arr2
                    }]
                });
            });
        },
        setChart2: function(arr) {
            var option = {
                chart: {
                    renderTo: 'contain2',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            //distance: 0,
                            format: '<b>{point.name}</b><br/>{point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                title: {
                    text: '短信类型比例'
                },
                tooltip: {

                },
                credits: {
                    enabled: 0
                },
                series: [{
                    type: 'pie',
                    name: '比例',
                    data: arr
                }]
            };
            _o.setChart2 = new Highcharts.Chart(option);
        },
        setChart1: function(arr) {
            var option = {
                chart: {
                    renderTo: 'contain1',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                plotOptions: {
                    pie: {

                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },


                title: {
                    text: '接收对象比例'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                credits: { //版权
                    enabled: 0
                },
                series: [{
                    type: 'pie',
                    name: '比例',
                    data: arr
                }]
            };
            _o.setChart1 = new Highcharts.Chart(option);
        },
        sendAjax : function(){
            var endTime = $('#jEndTime').val() || util.getCurrentDate();
            var startTime = $('#jStartTime').val() || util.getDateRangeTime(endTime, -30);
            $.ajax({
                url: '/t/sms/reportchart',
                data: {
                    startTime: startTime,
                    endTime: endTime,
                }
            }).done(function(json){
                if(json && json.code == 200){
                    var data = json.data.data;
                    _o.setChart1 = null;
                    _o.setChart2 = null;
                    _o.setChart3 = null;
                    $('#contain3').empty();
                    $('#contain2').empty();
                    $('#contain1').empty();
                    var setChart3Data1 = data.setChart3.categories;
                    var setChart3Data2 = data.setChart3.xAxis;
                    var setChart2Num = parseInt(data.setChart2['1'] || 0) + parseInt(data.setChart2['2'] || 0) + parseInt(data.setChart2['3'] || 0) + parseInt(data.setChart2['4'] || 0) + parseInt(data.setChart2['5'] || 0) + parseInt(data.setChart2['6'] || 0);
                    var setChart2Data = [
                        ['活动告知', (100*parseInt(data.setChart2['1'] || 0))/setChart2Num],
                        ['新服务', (100*parseInt(data.setChart2['2'] || 0))/setChart2Num],
                        ['新品发布', (100*parseInt(data.setChart2['3'] || 0))/setChart2Num],
                        ['打折特价', (100*parseInt(data.setChart2['4'] || 0))/setChart2Num],
                        ['会员生日', (100*parseInt(data.setChart2['5'] || 0))/setChart2Num],
                        ['节日祝福', (100*parseInt(data.setChart2['6'] || 0))/setChart2Num]
                    ]
                    var setChart1Num = parseInt(data.setChart1['1'] || 0) + parseInt(data.setChart1['2'] || 0) + parseInt(data.setChart1['3'] || 0);
                    var setChart1Data = [
                        ['会员',(100*parseInt(data.setChart1['1'] || 0))/setChart1Num],
                        ['商户',(100*parseInt(data.setChart1['2'] || 0))/setChart1Num],
                        ['手输',(100*parseInt(data.setChart1['3'] || 0))/setChart1Num]
                    ]
                    _p.setChart3(setChart3Data1,setChart3Data2,setChart1Num);
                    _p.setChart2(setChart2Data);
                    _p.setChart1(setChart1Data);
                }
            }).fail(function(){});
        },
        bind: function(){
            $('#j_subdatabtn').on('click',function(){
                _p.sendAjax();
            });
        }
    }
    var init = function() {
        _p.setCal();
        // _p.setChart3();
        // _p.setChart2();
        // _p.setChart1();
        _p.bind();
        $('#j_subdatabtn').trigger('click');
    }
    init();
    $$m.finish('ok');
});
