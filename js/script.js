$(document).ready(function(){
	var arrayLinea7 = [{"linea":"MetroEste"}];
	var arrayLinea9 = [{"linea":"TFM"}];
	var arrayLinea10 = [{"linea":"MetroSur"},{"linea":"L10B"},{"linea":"Metronorte"}];
	

	var ArrayAviso0 = [{"tipo":"Circulación lenta"},{"tipo":"intervalo superior al habitual"}];
	var ArrayAviso1 = [{"tipo":"El tiempo estimado"},{"tipo":"quedará restablecido en"}];
	var ArrayAviso2 = [{"tipo":"Interrumpido el servicio"},{"tipo":"Interrumpida la circulación"},{"tipo":"Servicio interrumpido"}];
	var ArrayAviso3 = [{"tipo":"Subsanada la incidencia"},{"tipo":"Restablecido el servicio"},{"tipo":"Circulación normalizada"},{"tipo":"se normaliza la circulación"},{"tipo":"Normalizada la circulación"},{"tipo":"Se restablece del servicio"},{"tipo":"queda normalizada"},{"tipo":"se ha normalizado"},{"tipo":"queda restablecido el servicio"}];
	
	var r = 0;
	var arrayLineasActivas =[];
	var jsonQueryStringLineas = jQuery.parseJSON(localStorage.getItem('queryStringLineas'));
	$(jsonQueryStringLineas).each(function(){
		arrayLineasActivas[r++] = this.value;
	});
	
	var p = 0;
	var arrayAvisosActivos =[];
	var jsonQueryStringAvisos = jQuery.parseJSON(localStorage.getItem('queryStringAvisos'));
	$(jsonQueryStringAvisos).each(function(){
		arrayAvisosActivos[p++] = this.value;
	});
	
	setInterval(function(){  
		var u = 0;
		$(arrayAvisosActivos).each(function(){
			if(this[0] == 0) $(ArrayAviso0).each(function(){arrayAvisosActivos[u++]= converUtf8Str(this.tipo)});
			if(this[0] == 1) $(ArrayAviso1).each(function(){arrayAvisosActivos[u++]= converUtf8Str(this.tipo)});
			if(this[0] == 2) $(ArrayAviso2).each(function(){arrayAvisosActivos[u++]= converUtf8Str(this.tipo)});
			if(this[0] == 3) $(ArrayAviso3).each(function(){arrayAvisosActivos[u++]= converUtf8Str(this.tipo)});
		});
	
		var pattLineas = new RegExp("[\\s,.]("+arrayLineasActivas.join().replace(/,/g, "|")+")[\\s,.]", "gi");
		var pattAvisos = new RegExp("[\\s,.]("+arrayAvisosActivos.join().replace(/,/g, "|")+")[\\s,.]", "gi");
		var noMenciones = new RegExp("^@", "gi");
		var noReTwitt = new RegExp("^RT", "gi");
		var h = 0;
		var arrayMarkData = [];
		var t = 0;
	
		$.ajax({
			url: "http://search.twitter.com/search.json?q=from:metro_madrid",
			dataType :"json",
			success: function(data){
				var readMarkData = jQuery.parseJSON(localStorage.getItem('markData'));
				$(data.results).each(function(){
					var str = converUtf8Str(this.text);			
					if(!localStorage.getItem("markData")){
						arrayMarkData[h++] = {"strId": convertToId(this.created_at)};
						localStorage.setItem("markData", JSON.stringify(arrayMarkData));
					}
					//if(convertToId(data.results[t].created_at) != readMarkData[0].strId){
						t++;
						//if(str.match(pattLineas) && str.match(pattAvisos) && !str.match(noMenciones) && !str.match(noReTwitt)){
						if(!str.match(noMenciones) && !str.match(noReTwitt)){
							displayNotification("Metro de Madrid, "+formatDate(this.created_at), this.text);
							$("audio")[0].play();
						}
					//}
					arrayMarkData[h++] = {"strId": convertToId(this.created_at)};
				});
				localStorage.setItem("markData", JSON.stringify(arrayMarkData));
			}
		}).error(function(error){
			console.log("URL "+error.statusText);
		});
	},(30*1000));
});

function formatDate(value){
	value = value.replace(/Jan/gi, "Ene").replace(/Feb/gi, "Feb").replace(/Mar/gi, "Mar").replace(/Apr/gi, "Abr").replace(/May/gi, "May").replace(/Jun/gi, "Jun").replace(/Jul/gi, "Jul").replace(/Aug/gi, "Ago").replace(/Sep/gi, "Sep").replace(/Oct/gi, "Oct").replace(/Nov/gi, "Nov").replace(/Dec/gi, "Dic");
	var valueYear = value.substr(12,4);
	var valueMonth = value.substr(8,3);
	var valueDay = value.substr(5,2);
	var valueHour = value.substr(17,2);
	var valueMin = value.substr(20,2);
	return valueHour+":"+valueMin+" - "+valueDay+" "+valueMonth+" "+valueYear;
}



function convertToId(value){
	value = value.replace(/Jan/gi, "01").replace(/Feb/gi, "02").replace(/Mar/gi, "03").replace(/Apr/gi, "04").replace(/May/gi, "05").replace(/Jun/gi, "06").replace(/Jul/gi, "07").replace(/Aug/gi, "08").replace(/Sep/gi, "09").replace(/Oct/gi, "10").replace(/Nov/gi, "11").replace(/Dec/gi, "12");
	var valueYear = value.substr(11,4);
	var valueMonth = value.substr(8,2);
	var valueDay = value.substr(5,2);
	var valueHour = value.substr(16,2);
	var valueMin = value.substr(19,2);
	var valueSeg = value.substr(22,2);
	return valueYear+""+valueMonth+""+valueDay+""+valueHour+""+valueMin+""+valueSeg;
}

function displayNotification(title, body){
	if(window.webkitNotifications.checkPermission() > 0){
		sendPermissionRequest(displayNotification);
	}else{
		var icon  = 'img/logo.jpg';
		var popup = window.webkitNotifications.createNotification(icon, title, body);
		popup.show();
		setTimeout(function(){
			popup.cancel();
		}, '15000');
	}
}

function sendPermissionRequest(callback){
	window.webkitNotifications.requestPermission(callback);
}

function displayHtmlNotification(){
	if (window.webkitNotifications.checkPermission() > 0) {
		sendPermissionRequest(displayHtmlNotification);
	} else {
		var popup = window.webkitNotifications.createHTMLNotification('http://blog.routydevelopment.com');
		popup.show();
		setTimeout(function(){
			popup.cancel();
		}, '15000');
	}
} 
function converUtf8Str(value){
	return value.replace(/Á/gi, "&Aacute;").replace(/É/gi, "&Eacute;").replace(/Í/gi, "&Iacute;").replace(/Ó/gi, "&Oacute;").replace(/Ú/gi, "&Uacute;").replace(/á/gi, "&aacute;").replace(/é/gi, "&eacute;").replace(/í/gi, "&iacute;").replace(/ó/gi, "&oacute;").replace(/ú/gi, "&uacute;").replace(/ñ/gi, "&ntilde;").replace(/Ñ/gi, "&Ntilde;").replace(/ü/gi, "&uuml;");
}
