seajs.use("calendar_css");
seajs.use(["$","util", "calendar"], function($,util, Calendar) {
    var _o = {};
    var _p = {
        setCal : function(){
            var curday = util.getCurrentDate();
            var c1 = new Calendar({
                trigger: '#j_searchTime1',
                range: [null, curday]
            });
            var c2 = new Calendar({
                trigger: '#j_searchTime2',
                range: [null, curday]
            });
            c1.on('selectDate', function(date) {
                c2.range([null, curday]);
            });
            c2.on('selectDate', function(date) {
                var e = date._i;
                c1.range([null, curday]);
            });
        },
        setChart1: function(opt) {
            var option = {
                chart: {
                    renderTo: 'contain2',
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
                    text: '平均停留时间分层统计'
                },
                xAxis: {
                    categories: opt.floorArr
                },
                yAxis: {
                    title: {
                        text: '停留时长（分钟）'
                    }
                },
                series: opt.fullArr,
                credits: { //版权
                    enabled: 0
                }
            }
            _o.chart1 = new Highcharts.Chart(option);
        },
        setChart2: function(opt) {
            $('#contain1').highcharts({
                title: {
                    text: '连续7天分楼层日客流量对比'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: opt.dataArr
                },
                yAxis: {
                    title: {
                        text: '人数'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '人'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: opt.floorArr
            });
        },
        getAjx1 : function(){
            $.ajax({
                url: '/rpt_mall_flr_visit_index_d_visitors_by_floor/',
                dataType: 'json'
            }).done(function(json){
                if(json && json.code == 200){
                    var dataObj = {};
                    var data = json.data;
                    var dataArr = [];
                    for(var i = 0;i < data.length;i++){
                        if(!dataObj[ data[i].eve_day ]){
                            dataObj[ data[i].eve_day ] = 1;
                            dataArr.push( data[i].eve_day );
                        }
                        if(!dataObj[ json.data[i].floor ]){
                            dataObj[ json.data[i].floor ] = 1;
                        }
                    }
                    _o.floordata = {};
                    _o.realdatas = {};
                    var lineArr = [];
                    for(var i = 0;i < json.data.length;i++){
                        if(_o.floordata[ json.data[i].floor ]){
                            _o.realdatas[ json.data[i].floor ].data.push( parseInt(json.data[i].visitors) || 0 );
                        }else{
                            _o.floordata[ json.data[i].floor ] = 1;
                            _o.realdatas[ json.data[i].floor ] = {};
                            _o.realdatas[ json.data[i].floor ].data = [ parseInt(json.data[i].visitors) || 0 ];
                            _o.realdatas[ json.data[i].floor ].name = json.data[i].floor
                        }
                    }
                    for(var o in _o.floordata){
                        lineArr.push( _o.realdatas[o] );
                    }
                    _p.setChart2({
                        dataArr : dataArr,
                        floorArr : lineArr
                    });
                }else{
                    obj = false;
                }
            }).fail(function(){});
        },
        sendAjax : function(day1,day2){
            $.ajax({
                url: '/rpt_mall_flr_visit_index_d_avg_staytime_by_floor',
                data: {
                    day1 : day1,
                    day2 : day2
                },
                dataType: 'json'
            }).done(function(json){
                if(json && json.code == 200){
                    _o.chart1 = null;
                    $('#contain2').empty();
                    var floorArr = [];
                    var arr1 =[];
                    var arr2 = [];
                    for(var i = 0;i < json.data1.length;i++){
                        arr1.push( parseInt(json.data1[i].stay_time) || 0 );
                        floorArr.push( json.data1[i].floor );
                    }
                    for(var j = 0;j < json.data2.length;j++){
                        arr2.push( parseInt(json.data2[j].stay_time) || 0 );
                    }
                    var obj1 = {
                        stack : 'male',
                        name : json.data1[0].event_day,
                        data : arr1
                    };
                    var obj2 = {
                        stack : 'male',
                        name : json.data2[0].event_day,
                        data : arr2
                    };
                    var fullArr = [obj1,obj2]
                    _p.setChart1({
                        floorArr : floorArr,
                        fullArr : fullArr
                    });
                }
            }).fail(function(){});
        },
        bind : function(){
            $('#j_compare').on('click',function(){
                if($('#j_searchTime1').val() && $('#j_searchTime2').val()){
                    var day1 = $('#j_searchTime1').val().split('-').join('');
                    var day2 = $('#j_searchTime2').val().split('-').join('');
                    _p.sendAjax(day1,day2);
                }
            });
        }
    }
    var init = function() {
        _p.setCal();
        _p.getAjx1();
        _p.bind();
        $('#j_compare').trigger('click');
    }
    init();
    $$m.finish('ok');
});
