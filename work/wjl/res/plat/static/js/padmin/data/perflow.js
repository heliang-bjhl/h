seajs.use("calendar_css");
seajs.use(["$","util", "calendar"], function($,util, Calendar) {
    var _o = {};
    var _p = {
        setCal : function(){
            var curday = util.getCurrentDate();
            var time1 = util.getDateRangeTime(curday, -7);
            var c1 = new Calendar({
                trigger: '#j_searchTime1',
                range: [null, curday]
            });
            var c2 = new Calendar({
                trigger: '#j_searchTime2',
                range: [time1, curday]
            });
            c1.on('selectDate', function(date) {
                if(util.getDateRange(date,curday) <= 7){
                    var s = date._i ;
                    var e = curday;
                }else{
                    var s =  date._i;
                    var e =  util.getDateRangeTime(date._i, 7);
                }
                c2.range([s, e]);
            });
            c2.on('selectDate', function(date) {
                var s = util.getDateRangeTime(date._i, -7);
                var e = date._i;
                c1.range([s, e]);
            });
        },
        setChart: function(opt) {
            $('#contain').highcharts({
                title: {
                    text: '连续7天分楼层日各时段客流量对比'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: [10,11,12,13,14,15,16,17,18,19,20,21]
                },
                yAxis: {
                    title: {
                        text: '人次'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '人次'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: opt
            });
        },
        sendAjax : function(){
            $.ajax({
                url: '/rpt_mall_timerange_visit_index_d',
                data: {
                    day1 : $('#j_searchTime1').val().split('-').join(''),
                    day2 : $('#j_searchTime2').val().split('-').join('')
                },
                dataType: 'json'
            }).done(function(json){
                if(json && json.code == 200){
                    var data1 = json.data1;
                    var data2 = json.data2;
                    var arr1 = [];
                    var arr2 = [];
                    for(var i = 0;i < data1.length;i++){
                        arr1.push( parseInt( data1[i].visitors ) || 0 );
                        arr2.push( parseInt( data2[i].visitors ) || 0 );
                    }
                    var arr = []
                    for(var f in _o.days){
                        arr.push( _o.days[f] );
                    }
                    _p.setChart([{
                        name : data1[0].event_day,
                        data : arr1
                    },{
                        name : data2[0].event_day,
                        data : arr2
                    }]);
                }
            }).fail(function(){});
        },
        bind : function(){
            $('#j_contrast').on('click',function(){
                _p.sendAjax();
            });
        }
    }
    var init = function() {
        _p.setCal();
        _p.bind();
        $('#j_contrast').trigger('click');
    }
    init();
    $$m.finish('ok');
});
