seajs.use("calendar_css");
seajs.use(["$", "calendar","select"], function($, Calendar,Select) {
	var _o = {};
    var _p = {
        setSel: function() {
			new Select({
                trigger: '#j_selData'
            }).render();
        },
        setChart1: function(opt) {
			$('#contain2').highcharts({
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: opt.dataArr
                },
                yAxis: {
                    title: {
                        text: '新增注册会员数（人）'
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
                series: opt.channalArr
            });
        },
        setChart2: function(arrs) {
            var option = {
                chart: {
                    renderTo: 'contain1',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                subtitle: {
                    text: '',
                    align: 'right',
                    x: -10
                },
                title: {
                    text: ''
                },
                tooltip: {

                },
                credits: { //版权
                    enabled: 0
                },
                series: [{
                    type: 'pie',
                    name: '比例',
                    data: arrs
                }]
            }
            _o.chart2 = new Highcharts.Chart(option);
        },
        sendAjax : function(){
            $.ajax({
                url: '/rpt_mall_member_index_d_register_channel',
                data: {},
                dataType: 'json'
            }).done(function(json){
                if(json && json.code == 200){
                    var arr = [];
                    var num = 0;
                    var data = json.data;
                    var num1 = 0;
                    for(var i = 0;i < data.length;i++){
                        num += parseInt( data[i].member_count );
                    }
                    for(var j = 0;j < data.length;j++){
                        num1 = parseFloat((100*parseInt(data[j].member_count || 0)/num).toFixed(2));
                        arr.push([data[j].register_channel,num1]);
                    }
                    _p.setChart2(arr);
                }
            }).fail(function(){});
        },
        sendAjax2 : function(){
            $.ajax({
                url: '/member_account_register_channel',
                data: {
					days : $('#j_selData').val()
				},
                dataType: 'json'
            }).done(function(json){
                if(json.code == 200){
					var data = json.data;
					var obj = {
						dataArr : [],
						datas : {},
						monthMark : {},
						dataMark : {}
					};
					for(var i = 0;i < data.length;i++){
						if( !obj.monthMark[ data[i].event_day ] ){
							obj.dataArr.push( data[i].event_day );
							obj.monthMark[ data[i].event_day ] = 1;
						}
						if( !obj.dataMark[ data[i].register_channel ] ){
							obj.datas[ data[i].register_channel ] = [ data[i].cnt ];
							obj.dataMark[ data[i].register_channel ] = 1;
						}else{
							obj.datas[ data[i].register_channel ].push( data[i].cnt );
						}
					}
					var channalArr = [];
					for(var o in obj.datas){
						channalArr.push( {
							name : o,
							data : obj.datas[ o ]
						} )
					}
					_p.setChart1({
						dataArr : obj.dataArr,
						channalArr : channalArr
					});
				}
            }).fail(function(){});
        },
		bind : function(){
			$('#j_contrast').on('click',function(){
				_p.sendAjax2()
			});
			$('#j_contrast').trigger('click');
		}
    }
    var init = function() {
        _p.setSel();
        _p.sendAjax();
		_p.bind();
    }
    init();
    $$m.finish('ok');
});
