var H = H || {};

H.dom = {

	gid : function(id){
		return document.getElementById(id)
	},



	// insertBefore
	insertBefore : function  (newElement , targetElement) {
		targetElement.parentNode.insertBefore(newElement,targetElement)
	},

	insertAfter : function(newElement,targetElement){
		var parent =  targetElement.parentNode;
		if(parent.lastChild == targetElement){
			
			parent.appendChild(newElement);
		}else{

			parent.insertBefore(newElement,targetElement.nextSibling)
		}
	}

}