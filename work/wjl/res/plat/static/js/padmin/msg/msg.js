seajs.use(["$","insertText"], function($, insertText) {


	$('#insert').on('click',function(){
		insertText($('#j_content')[0],'{add}')
	})
	$$m.finish('ok');
	
})