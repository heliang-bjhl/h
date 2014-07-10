seajs.use("calendar_css");
seajs.use(["$", "calendar"], function($, Calendar) {
    var _p = {
        setCal: function() {
            // var c1 = new Calendar({
            //     trigger: '#z_startDate'
            // });
            // var c2 = new Calendar({
            //     trigger: '#z_endDate'
            // });

            // c1.on('selectDate', function(date) {
            //     c2.range([date, null]);

            // });

            // c2.on('selectDate', function(date) {
            //     c1.range([null, date]);

            // });

        },
        setChart1: function() {
            var option = {
                chart: {
                    renderTo: 'contain1',
                    type: 'column',
                    animation: {
                        duration: 1000
                    }
                },
                subtitle: {
                    text: '总数 4',
                    align: 'right',
                    x: -10
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: '会员渠道数据统计'
                },
                xAxis: {
                    categories: ['wifi', '微信']
                },
                yAxis: {
                    title: {
                        text: '会员数量'
                    }
                },
                series: [{
                    name: '数量',
                    data: [1, 3],
                    colorByPoint: 1
                }],
                credits: { //版权
                    enabled: 0
                }
            }
            var chart1 = new Highcharts.Chart(option);
        },
        setChart2: function() {
            var option = {
                chart: {
                    renderTo: 'contain2',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                subtitle: {
                    text: '总数 4',
                    align: 'right',
                    x: -10
                },
                title: {
                    text: '会员数量'
                },
                tooltip: {

                },
                credits: { //版权
                    enabled: 0
                },
                series: [{
                    type: 'pie',
                    name: '比例',
                    data: [
                        ['wifi', 20],
                        ['微信', 80]
                    ]
                }]
            }
            var chart1 = new Highcharts.Chart(option);
        },
        setChart3: function() {
            var usdeur = [
                [Date.UTC(2010, 0, 1), 0.6976],
                [Date.UTC(2010, 0, 4), 0.6932],
                [Date.UTC(2010, 0, 5), 0.6962],
                [Date.UTC(2010, 0, 6), 0.6944],
                [Date.UTC(2010, 0, 7), 0.6985],
                [Date.UTC(2010, 0, 8), 0.694],
                [Date.UTC(2010, 0, 11), 0.6893],
                [Date.UTC(2010, 0, 12), 0.6908],
                [Date.UTC(2010, 0, 13), 0.6886],
                [Date.UTC(2010, 0, 14), 0.6897],
                [Date.UTC(2010, 0, 15), 0.6951],
                [Date.UTC(2010, 0, 18), 0.6943],
                [Date.UTC(2010, 0, 19), 0.7003],
                [Date.UTC(2010, 0, 20), 0.7086],
                [Date.UTC(2010, 0, 21), 0.7093],
                [Date.UTC(2010, 0, 22), 0.7074],
                [Date.UTC(2010, 0, 25), 0.7069],
                [Date.UTC(2010, 0, 26), 0.7101],
                [Date.UTC(2010, 0, 27), 0.7128],
                [Date.UTC(2010, 0, 28), 0.7162],
                [Date.UTC(2010, 0, 29), 0.7214],
                [Date.UTC(2010, 1, 1), 0.7184],
                [Date.UTC(2010, 1, 2), 0.7156],
                [Date.UTC(2010, 1, 3), 0.7195],
                [Date.UTC(2010, 1, 4), 0.7278],
                [Date.UTC(2010, 1, 5), 0.7312],
                [Date.UTC(2010, 1, 8), 0.7324],
                [Date.UTC(2010, 1, 9), 0.7256],
                [Date.UTC(2010, 1, 10), 0.7274],
                [Date.UTC(2010, 1, 11), 0.7307],
                [Date.UTC(2010, 1, 12), 0.7336],
                [Date.UTC(2010, 1, 15), 0.7355],
                [Date.UTC(2010, 1, 16), 0.7267]
            ];
            $(function() {
                var chart = new Highcharts.StockChart({
                    chart: {
                        renderTo: 'contain3' //指向的div的id属性
                    },

                    title: {
                        text: '会员注册走势情况分析' //图表标题
                    },
                    xAxis: {
                        tickPixelInterval: 200, //x轴上的间隔
                        //  title :{
                        //      text:"title"
                        //  },
                        type: 'datetime', //定义x轴上日期的显示格式
                        labels: {
                            formatter: function() {
                                var vDate = new Date(this.value);
                                //alert(this.value);
                                return vDate.getFullYear() + "-" + (vDate.getMonth() + 1) + "-" + vDate.getDate();
                            },
                            align: 'center'
                        }
                    },
                    yAxis: {

                        title: {
                            text: 'Rate(汇率)' //y轴上的标题
                        }
                    },
                    tooltip: {
                        xDateFormat: '%Y-%m-%d, %A' //鼠标移动到趋势线上时显示的日期格式
                    },
                    credits: { //版权
                    enabled: 0
                },
                    rangeSelector: {
                        buttons: [{ //定义一组buttons,下标从0开始
                            type: 'week',
                            count: 1,
                            text: '1周'
                        }, {
                            type: 'month',
                            count: 1,
                            text: '1月'
                        }, {
                            type: 'year',
                            count: 1,
                            text: '1年'
                        }, {
                            type: 'all',
                            text: '全部'
                        }],
                        selected: 3 //表示以上定义button的index,从0开始
                    },

                    series: [{
                        name: 'USD to EUR(美元对欧元)', //鼠标移到趋势线上时显示的属性名
                        data: usdeur //属性值
                        //marker : {
                        //      enabled : true,
                        //      radius : 3
                        //  },
                        //shadow : true
                    }]
                });
            });
        },
        setChart: function() {
            _p.setChart1();
            _p.setChart2();
            _p.setChart3();
        },
        bind : function(){
            
        }
    }
    var init = function() {
        _p.setCal();
        _p.setChart()
    }
    init();
    $$m.finish('ok');
});
