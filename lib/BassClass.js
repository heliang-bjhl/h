var H = H || {};

H.Bass = {

    /**
     * [instanceof 判断o 是不是 oClass的实例]
     * @param  {[Object]} 实力
     * @param  {[Object]} 类
     * @return {[type]}
     */
    instanceof: function(o, myClass) {
        return o instanceof myClass;
    },
    /**
     * [extend 类继承]
     * @param  {[type]} Sublass   [子类]
     * @param  {[type]} BassClass [父类]
     * @return {[type]}           [description]
     */
    extend: function(Sublass, BassClass) {
        var F = function() {}
            //防止继承BassClass构造函数中的属性
        F.prototype = BassClass.prototype;
        Sublass.prototype = new F();
        Sublass.prototype.constructor = Sublass;
    }
}
