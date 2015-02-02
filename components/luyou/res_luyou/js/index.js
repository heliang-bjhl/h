(function(dot, Go) {
    var D = [];
    var page = {
        resizeTimer: null
    }
    var P = function() {
        var me = this;
        this.treeData = D;
        this.treeSetting = {
            callback: {
                onClick: function(event, treeId, treeNode, clickFlag) {
                    mTree.clickTreeNode(treeNode);
                }
            }
        };
        this._init();
    }
    P.prototype = {
        setHeight: function() {
            var h = $('body').height() - $('#j_header').height();
            $('#j_sidebar').height(h);
            $('#j_wrap').height(h);
            $('#j_frame').height(h);
            // $('#j_frame .j_iframe_item').height(h - 32);
        },
        bindResize: function() {
            var me = this;
            $(window).on('resize', function() {
                clearTimeout(page.resizeTimer);
                page.resizeTimer = setTimeout(function() {
                    me.setHeight();
                }, 500);
            })
        },
        bindTree : function(){
            $('#j_tree').on('click','li',function(){
                var url = $(this).data('url');
                $('#j_frame_item iframe').attr('src',url)
            })
        },
        _init: function() {
            var me = this;
            this.setHeight();
            this.bindResize();
            this.bindTree();
            
        }
    };
    new P();
})()
