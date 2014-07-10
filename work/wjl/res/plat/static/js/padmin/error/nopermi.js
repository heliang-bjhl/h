seajs.use(["$","util"], function($, util) {
    util.countDown({
    	time : 5000,
    	timeCallBack : function(time){
    		$('#count-down').empty().html(time);
    	},
    	finalyCallBack : function(){
    		window.location.href = "/login.j";
    	}
    });
});