(function() {
	window.Swipe = function(opt){
		this.dom = opt.dom;
		this.start = {};
		this.delta = {};
		this.init();
	}
	Swipe.prototype = {
		init : function(){
			this.bind();
		},
		bind : function(){
			this._bindTouch();
		},
		startE : function(e){
			var touches = e.touches[0];
            this.start = {
                x: touches.pageX,
                y: touches.pageY,
                time: +new Date()
            };
            this._bindMove();
       		this._bindEnd(); 
		},
		moveE : function(e){
			var touches = event.touches[0];
            this.delta = {
                x: touches.pageX - this.start.x,
                y: touches.pageY - this.start.y
            }
            console.log(this.delta)
		},
		endE : function(){
			this.dom.off('touchmove')
            this.dom.off('touchend')
		},
		_bindTouch : function(){
			var me = this;
			this.dom.on('touchstart',function(e){
				me.startE(e)
			})
		},
		_bindMove : function(){
			var me = this;
			this.dom.on('touchmove', function(e){
				me.moveE(e)
			});
		},
		_bindEnd : function(){
			var me = this;
			this.dom.on('touchend', function(e){
				me.endE();
			});
		}
	}
})()