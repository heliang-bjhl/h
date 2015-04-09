
seajs.use(['slider'], function(Slider) {
	

	var _P = {
		container:$('#j_slider'),
		setSlider:function() {
			
			var opt1 = {
		        container:$('#pageBanner'),
		        items:$('#pageBanner .banner'),

		        auto:true
		    }
		    var s1 = new Slider(opt1);
		},
		
		_init:function(){
			_P.setSlider();
		}
	}
	
	_P._init();

})