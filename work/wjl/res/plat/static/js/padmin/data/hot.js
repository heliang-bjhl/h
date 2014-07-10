seajs.use("calendar_css");
seajs.use(["$","util", "calendar","select"], function($,util, Calendar,Select) {
    var _o = {};
    var _p = {
        setCal : function(){
            var c1 = new Calendar({
                trigger: '#j_searchTime1',
            });
        },
        setSel: function() {
            new Select({
                trigger: '#j_forFloor'
            }).render();
			new Select({
                trigger: '#j_forHour'
            }).render();
        },
        sendAjax : function(){
            $.ajax({
                url: '/density_map_detail_count',
                data: {
                    floor : $('#j_forFloor').val(),
					day : $('#j_searchTime1').val().split('-').join(''),
					hour : $('#j_forHour').val()
                },
                dataType: 'json'
            }).done(function(json){
                if(json.code == 200){
					var max = json.max;
					if(max == -1){
						max = 0;
					}
					var data = json.data || [];
					$("#heatmap").empty();
					$('#heatmapbox>img').attr('src',json.pic);
					_p.setHot({
						max : max,
						data : data
					});
				}else{
					_p.setHot({
						max : 0,
						data : []
					});
				}
            }).fail(function(){});
        },
		setHot : function(opt){
			var config = {
				"radius": 30,
				"element": "heatmap",
				"visible": true,
				"opacity": 30,
				offset : 1000,
				legend: {
					position: 'left:100px;top:450px;',
					title: '客流密度'
				}
			};
			var heatmap = heatmapFactory.create(config);
			// set a dataset
			heatmap.store.setDataSet({
				max: opt.max,
				data: opt.data
			});
			$('.loading').hide();
			$('.j_showhide').css({
				visibility : 'visible'
			});
		},
		bind : function(){
			$('#j_forSearch').on('click',function(){
				$('.j_showhide').css({
					visibility : 'hidden'
				});
				$('.loading').show();
				_p.sendAjax();
			});
			$('#j_forSearch').trigger('click');
		}
    }
    var init = function() {
        _p.setCal();
		_p.setSel();
		_p.bind();
    }
    init();
    $$m.finish('ok');
});
