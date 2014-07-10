(function(){
	var fullH = $('body').height();
	$('.mask').css({
		height : fullH,
		opacity: 0.7
	});
	$('#j_getPwd').on('blur',function(){
		if(!$(this).val()){
			$(this).val('请输入密码');
		}
	});
	$('#j_getPwd').on('focus',function(){
		if($(this).val() == '请输入密码'){
			$(this).val('');
		}
	});
	$('#j_subPwd').on('click',function(){
		if($('#j_getPwd').val() != '123456'){
			alert('密码错误')
		}else{
			$('.lbycontent').hide();
			$('.mask').hide();
		}
	});
})()