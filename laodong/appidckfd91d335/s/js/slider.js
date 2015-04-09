define(function(require, exports, module) {
	// require("$$");

	function Slider(opt) {
		this.container = opt.container;
		this.items = opt.items;
		this.pageBox = opt.pageBox;
		this.curClassName = opt.curClassName || 'cur';
		this.curIndex = 0;	
		this.pageTag = opt.pageTag || 'a';
		this.iBtn = true;
		this.iNum = 0;
		this.len = this.items.length;
		this.timer = null;
		this.delayTimer = null;
		this.auto = opt.auto || false;
		this.type = opt.type || 'click';
		this.current = opt.current || 0;
		this.init();
	}


	Slider.prototype.init = function() {
		this.setFirstStyle();
		// this.bind();
		this.setTime();
	}
	Slider.prototype.setFirstStyle = function() {
		// this.items.css('opacity','0');
		// this.items.hide();
		this.items.css({opacity:'0','z-index':'0'})
		this.items.eq(this.current).css({opacity:'1','z-index':'2'});
		// this.items.eq(this.current).show();
	}
	Slider.prototype.change = function(num) {
		this.prev();
		this.setIndex(num);
		this.next();
	}
	Slider.prototype.setIndex = function(num) {
		this.curIndex = num;
	}
	Slider.prototype.prev = function() {
		// this.pageBox.find(this.pageTag + ':eq('+this.curIndex+')').removeClass(this.curClassName);
		this.items.eq(this.curIndex).animate({opacity:'0'},500);
		this.items.eq(this.curIndex).css('z-index','1');
		// this.items.eq(this.curIndex).hide();
	}
	Slider.prototype.next = function() {
		// this.pageBox.find(this.pageTag + ':eq('+this.curIndex+')').addClass(this.curClassName);
		this.items.eq(this.curIndex).attr('flag','1');
		this.items.eq(this.curIndex).animate({opacity:'1'},500,function(){
			$(this).removeAttr('flag');
		});
		this.items.eq(this.curIndex).css('z-index','2');
		// this.items.eq(this.curIndex).show();
	}
	Slider.prototype.play = function() {
		this.iNum = this.curIndex + 1;
		if(this.iNum > this.len-1) {
			this.iNum = 0;
		}
		this.change(this.iNum);
	}
	Slider.prototype.setTime = function() {
		if(!this.auto) return;
		var _this = this;
		this.timer = setInterval(function(){
			_this.play();		
		},5000);

		// this.container.hover(function(){
		// 	clearInterval(_this.timer);
		// },
		// function(){
		// 	_this.timer = setInterval(function(){
		// 		_this.play();		
		// 	},1000);
		// })
	}
	module.exports = Slider;

});