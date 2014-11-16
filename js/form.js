$(document).ready(function(){

	if(!window.webkitNotifications) {
		alert('Sorry , your browser does not support desktop notification. Try Google Chrome.');
	}
	
	var arrayLineas = [{"linea":"l1"},{"linea":"l2"},{"linea":"l3"},{"linea":"l4"},{"linea":"l5"},{"linea":"l6"},{"linea":"l7"},{"linea":"l8"},{"linea":"l9"},{"linea":"l10"},{"linea":"l11"},{"linea":"l12"},{"linea":"r"},{"linea":"ml1"},{"linea":"ml2"},{"linea":"ml3"}];
	var ArrayAviso = [{"tipo":"Circulación lenta"},{"tipo":"Tiempo estimado"},{"tipo":"Servicio interrumpido"},{"tipo":"Restablecido el servicio"}];

	var a = 0;
	$(ArrayAviso).each(function(){
		$("<li>").html("<input type='checkbox' name='aviso' id='aviso"+a+"' value='"+a+"' /><label for='aviso"+a+"'>"+converUtf8Str(this.tipo)+"</label>").appendTo("#checkboxAvisos")
		a++;
	});
	
	var l = 0;
	$(arrayLineas).each(function(){
		$("<li>").html("<input type='checkbox' name='linea' id='"+this.linea+"' value='"+this.linea+"' /><label for='"+this.linea+"'>"+this.linea.toUpperCase()+"</label>").appendTo("#checkboxLineas")
		l++;
	});

	var jsonQueryStringLineas = jQuery.parseJSON(localStorage.getItem('queryStringLineas'));
	$(jsonQueryStringLineas).each(function(){
		$("input#"+this.value).attr("checked", "checked");
	});
	
	var jsonQueryStringAvisos = jQuery.parseJSON(localStorage.getItem('queryStringAvisos'));
	$(jsonQueryStringAvisos).each(function(){
		$("input#aviso"+this.value).attr("checked", "checked");
	});



	$(formulario).submit(function(){
		localStorage.setItem("queryStringAvisos", JSON.stringify($(this.aviso).serializeArray()));
		localStorage.setItem("queryStringLineas", JSON.stringify($(this.linea).serializeArray()));
  		return false;
	});

});