var H = H || {};

H.array = {
	// 删除
    del: function(arr, index) {
        arr.splice(index, 1)
    },
    //简单clone
    clone: function(arr) { //并非深度clone
        return arr.slice(0);
    },

    sort : function(arr,type){
    	var type = type || 'asc';
    	if(type == 'asc'){
    		arr.sort(function(a,b){
    			return a-b
    		})
    	}else if (type == 'desc'){
    		arr.sort(function(a,b){
    			return b-a
    		})
    	}
    }


}

// // 来源：http://www.cnblogs.com/birdshome/archive/2005/03/20/122246.html
// Object.prototype.clone = function() {
//     var objClone;
//     return
//     if (this.constructor == Object) {
//     	objClone = new this.constructor();
//     }else {
//     	objClone = new this.constructor(this.valueOf());
//     }
//     for (var key in this) {
//         if (objClone[key] != this[key]) {
//             if (typeof(this[key]) == 'object') {
//                 objClone[key] = this[key].Clone();
//             } else {
//                 objClone[key] = this[key];
//             }
//         }
//     }
//     objClone.toString = this.toString;
//     objClone.valueOf = this.valueOf;
//     return objClone;
// }
