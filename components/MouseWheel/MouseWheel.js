var isMoving = false;
var t = null;
var num = 0;

var setTime = function() {
   var s = num;
   clearTimeout(t);
   t = setTimeout(function(){
        var e = num;
        if(e == s){
            console.log(1)
        }
   },100)
}

function MouseWheelHandler() {
    isMoving = true;
    num++;
    setTime();
    
    if (!isMoving) {
        console.log(1)
    }
}

function addMouseWheelHandler() {
    if (document.addEventListener) {
        document.addEventListener("mousewheel", MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
        document.addEventListener("wheel", MouseWheelHandler, false); //Firefox
    } else {
        document.attachEvent("onmousewheel", MouseWheelHandler); //IE 6/7/8
    }
}
addMouseWheelHandler();
