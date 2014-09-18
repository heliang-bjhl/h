/**
 * [Pizhu description]
 * @param {[Object]} op {
 *                          content : 批注容器
 *                          hiddenSlelectDom: 选择的区域片段插入到一个隐藏的容器中便于操作
 *
 * }
 */
var Pizhu = function(op) {
    this.content = $(op.content);
    this.hiddenSlelectDom = $(op.hiddenSlelectDom);
    //选中的段落集合
    this.pArray = [];
    this.lineNum = 25;
    this._init();
}
Pizhu.prototype = {
    _init: function() {
        this.bind();
    },

    //鼠标抬起选中事件
    _mouseup: function() {
        var range = window.getSelection().getRangeAt(0);
        //获取选中的
        var html = this.getHiddenHtml(range);


        this.setHiddenHTML(html);
        this._setData();
        this.drawLine();
    },
    //重置必要数据
    _setData: function() {
        var me = this;
        this.pArray = [];

        $.each(me.hiddenSlelectDom.find('p'), function() {
            //将选中的段落存储
            me.pArray.push($(this));

        });





    },
    bind: function() {
        var me = this;
        this.content.on('mouseup', function() {
            me._mouseup();
        })
    },
    //获取选中区的
    getHiddenHtml: function(range) {
        var html = range.cloneContents();
        this.hiddenSlelectDom.html(html);
        html = this.hiddenSlelectDom.html();
        //如果有p
        if (/\<\/p\>/gi.test(html)) {

        } else {
            var pid = $(range.commonAncestorContainer).data('pid');

            html = '<p data-pid="' + pid + '">' + html + '</p>';
        }
        return html;
    },
    //格式化选中的
    setHiddenHTML: function(html) {
        this.hiddenSlelectDom.html(html);

    },
    //画线
    drawLine: function() {
        var me = this;

        for (var i = 0; i < this.pArray.length; i++) {
            var pitem = me.pArray[i];
            var o = {
                pid: pitem.data('pid'),
                start: pitem.find('span:eq(0)').data('offset'),
                end: pitem.find('span:eq(-1)').data('offset')
            }
            me.drawItem(o);

        }
    },
    //在每一个p里面划线
    drawItem: function(o) {
        
        var p = this.content.find("[data-pid='" + o.pid + "']");

        var me = this;
        var start = o.start;
        var end = o.end;
        //算出总共有几行

        var _lines = [];
        var getLineIndex  = function(span){
            if(span % me.lineNum ==0){
                return span / me.lineNum
            }else{
                return Math.ceil(span/me.lineNum)
            }
        }
        var sIndex = getLineIndex(start);
        var eIndex = getLineIndex(end);

        
        
        for ( var j = sIndex ; j <= eIndex ; j++){
            var  len = eIndex - sIndex;

            _lines.push({
                start:  (j-1) * me.lineNum ,
                end: (j-1)*me.lineNum + (me.lineNum-1),
                h : j
            })

        }
        _lines[0].start = start;
        _lines[_lines.length-1].end = end
         // console.log(_lines)
        for (var i = 0; i < _lines.length; i++) {
            var line = $('<div class="line" data-pid="' + o.pid + '__' +  _lines[i].h +'"></div>');
            var top = p.position().top + _lines[i].h * 20;
            var s =  _lines[i].start;
            var e = _lines[i].end ;
            line.css({
                width: 14 * ( e - s + 1),
                height: 1,
                background: '#c00',
                top: top  ,
                left : p.find("[data-offset='" + s + "']").position().left,
                position: 'absolute'
            })
            $('#drawline').append(line)
        }
        // var left = p.find()

    }

}

new Pizhu({
    content: '#j_content',
    hiddenSlelectDom: '#j_range'
})

// $(function() {
//     $(".content").mouseup(function(e) {
//         var selectedText;
//         if (window.getSelection) {
//             selectedText = window.getSelection().toString();
//         } else if (document.selection && document.selection.createRange) {
//             selectedText = document.selection.createRange().text;
//         }
//         var other_range;
//         if (window.getSelection) {
//             other_range = window.getSelection().getRangeAt(0);
//         }




//     });


// });
// //添加批注
// function addPostil() {
//     //IE支持的range对象
//     var ie_range;
//     //其他浏览器的range对象
//     var other_range;
//     if (window.getSelection) {
//         other_range = window.getSelection().getRangeAt(0);
//     } else if (document.selection && document.selection.createRange) {
//         ie_range = document.selection.createRange();
//     }
//     art.dialog({
//         id: 'inputDialog',
//         title: '添加批注',
//         content: '<textarea id="postil" rows="10" cols="30"></textarea>',
//         lock: true

//     }, function() {
//         var value = document.getElementById("postil").value;
//         if (!value) {
//             art.dialog({
//                 content: '批注内容不能为空！',
//                 time: 1
//             });
//             return false;
//         }
//         if (other_range) {
//             /*
//          //IE之外的浏览器，如果在选择内容包含其他标签的一部分的时候会报异常
//          var mark = document.createElement("ins");
//          mark.setAttribute("comment", value);
//          mark.className = "postil";
//          mark.id=new Date().getTime();
//          other_range.surroundContents(mark);
//          */
//             var selected = other_range.extractContents().textContent;
//             var text = "[ins id='" + (new Date().getTime()) + "' comment='" + value + "']" + selected + "[/ins]";
//             var textNode = document.createTextNode(text);
//             other_range.insertNode(textNode);
//             var content = $(".content").html();
//             var reg = /\[ins id='(\d*)' comment='([\w\W]*)']([\w\W]*)\[\/ins]/gi;
//             reg.test(content);
//             var id = RegExp.$1,
//                 comment = RegExp.$2,
//                 c = RegExp.$3;
//             var reHtml = "<ins id='" + id + "' comment='" + comment + "' class='postil' >" + c + "</ins>";
//             content = content.replace(reg, reHtml);
//             $(".content").html(content);
//         } else if (ie_range) {
//             ie_range.pasteHTML("<ins comment='" + value + "' class='postil' id='" + new Date().getTime() + "'>" + ie_range.htmlText + "</ins>");
//             ie_range = null;
//         }
//         loader();
//     });
// }
// //解析批注
// function loader() {
//     var $list = $(".list");
//     $list.children().remove();
//     $.each($(".content ins"), function(a, b) {
//         var content = $(b).attr("comment");
//         var $postil = $("<div forid='" + $(b).get(0).id + "'>" + content + "<span onClick='removePostil(this)'>　　x</span></div>");
//         $postil.hover(function() {
//                 $(this).css("border-color", "red");
//                 $("#" + $(this).attr("forid") + "").removeClass().addClass("postilFocus");
//             },
//             function() {
//                 $(this).css("border-color", "#ddd");
//                 $("#" + $(this).attr("forid") + "").removeClass().addClass("postil");
//             });
//         $(b).hover(function() {
//                 $(this).removeClass().addClass("postilFocus");
//                 $("div[forid='" + $(this).get(0).id + "']").css("border-color", "red");
//             },
//             function() {
//                 $(this).removeClass().addClass("postil");
//                 $("div[forid='" + $(this).get(0).id + "']").css("border-color", "#ddd");
//             });
//         $list.append($postil);
//     });
// }
// //删除批注
// function removePostil(arg) {
//     var $div = $(arg).parent();
//     var id = $div.attr("forid");
//     var $source = $("#" + id);
//     var text = $source.after($source.html());
//     $source.remove();
//     loader();
// }
