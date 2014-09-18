var textRange = function(op) {
    this.textBox = $(op.textBox);
    this.init();
}

textRange.prototype = {
    init : function(){
        this.bind();
    },
    bind : function() {
        this._bindSelect()
    },
    _bindSelect : function(){
        this.textBox.on('mouseup',function(){
            alert(1)
        })
    }
}



new textRange({
    textBox: '#content'
});
