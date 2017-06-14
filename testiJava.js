var aikaerotus,
	juoksu=0,
	muDate,
	puhdistus=false,
	tyoalku,
	jaljella,
	tulostettu = 0;
var tunnitlista=[];
$( document ).ready(function() {
window.onbeforeunload = function() {
		tallenna();
        return "Älä mene!"
      }
//alku asetukset
$("#tunnit2").append('<div id="rivi0"><input type="text" id="sarakeA'+juoksu+'"/><input type="text" id="sarakeB'+juoksu+'"/><span id="sarakeC'+juoksu+'"></span><br><span id="sarakeD'+juoksu+'"></span><br></div>');
$("button, input:submit, input:button").toggleClass("ui-state-default");
$('input:text').val("");
//lataafun();
//Dialog
$("#tehtavadiv").dialog({
	autoOpen : false,
	modal : true,
	open:function(event,ui){
		$(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
		lisaatehtavat();
			$('#tehtavadiv').keypress(function(e) {
				if (e.keyCode == $.ui.keyCode.ENTER) {
					$(this).dialog("close");
				}
			});
	},
	close:function(event,ui){
		$("#sarakeD"+(juoksu-1)).text($("#PoPuPvastaus").val());
		if (puhdistus){
			tyhjennys(1);
			taytaTaulkko();
			tyhjennys(0);
			//juoksu=0;
		}
	},
	buttons: {
		"Ok":function(){
			$(this).dialog("close");
		}
	}
	});
setInterval(function(){ // Laskee juoksevan ajan
	aika();

	$("#timer").text(myDate.getHours() + ':' +("0"+myDate.getMinutes()).slice(-2) + ':'+ ("0"+myDate.getSeconds()).slice(-2));
	if(tyoalku > 0){

		jaljella=(new Date()).getTime()-tyoalku;

		$("#olut").text(("0"+Math.floor((jaljella/(1000*60*60))%24)).slice(-2)+':'+("0"+Math.floor((jaljella/ (1000*60))%60)).slice(-2)+':'+("0"+Math.floor((jaljella/ 1000)%60)).slice(-2));
	}
	}, 1000);
//painikkeet
    $( "#Alku" ).click(function() { //Päivan aloitus
		aika();
        $("#sarakeA"+juoksu).val(myDate.toTimeString().substr(0,5));
		tyoalku=(new Date()).getTime();
		$("#oltu").append('<b>Oltu aika</b> <span id="olut">00:00:00</span>');
    });
	$( "#loppu" ).click(function() { //Päivän lopetus
		puhdistus=true;
		aika();
        $("#sarakeB"+juoksu).val(myDate.toTimeString().substr(0,5));
		laske();
		$("#sarakeC"+juoksu).text(aikaerotus);
		juoksu++;
		$("#PoPuPvastaus").val('');
		$("#tehtavadiv").dialog('open');
	});
	$( "#lisaa" ).click(function() { //Päivän välitehtävät
		puhdistus=false;
		$("#sarakeB"+juoksu).val(myDate.toTimeString().substr(0,5));
		laske();
		$("#sarakeC"+juoksu).text(aikaerotus);
		$("#PoPuPvastaus").val('');
		$("#tehtavadiv").dialog('open');
		lisaaRivi();
	});
	$( "#TunnitTulostus" ).click(function() { //Tulostaa tehdyt tunnit
		$("#TunnitLista").dialog({
			modal:true,
			show: {effect: "slide",duration: 200},
			hide: {effect: "slide",duration: 200},
			height : 500,
			buttons: {
				Close: function(){
					$(this).dialog("close");
				},
				"Poista kaikki tunnit": function(){
					$("#hoursprint").empty();
					localStorage.clear("tunnitlocal");
				}
			}
		});
		if( tulostettu == 0){
			tulostettu = printhours();
		}
	});
	$( "#tyhjennys2" ).click(function() {
		tyhjennys(1);
		tyhjennys(0);
    });
	$("#valinnat").change(function(){
		var str="";
		$("select option:selected").each(function(){
			str+= $(this).text();
		});
		$("#PoPuPvastaus").val(str);
	}).trigger("change");

});
//funktiot
function aika() {
	myDate = new Date();
}

function laske(){
	var alkuaika = toSeconds($("#sarakeA"+juoksu).val());
	var loppuaika = toSeconds($("#sarakeB"+juoksu).val());
	var erotus = loppuaika-alkuaika;

	if (erotus>0){
	aikaerotus = AddZero(Math.floor(erotus/3600)) + ':' + AddZero(Math.floor((erotus % 3600)/60));
	}
	else{
		aikaerotus ='00:00';
	}
}

function lisaaRivi(){
	juoksu++;
	$("#tunnit2").append('<div id="rivi0"><input type="text" id="sarakeA'+juoksu+'"/><input type="text" id="sarakeB'+juoksu+'"/><span id="sarakeC'+juoksu+'"></span><br><span id="sarakeD'+juoksu+'"></span><br></div>');
	aika();
	$("#sarakeA"+juoksu).val(myDate.toTimeString().substr(0,5));
}

function toSeconds(time_str) {
    // Extract hours, minutes and seconds
	//console.log(time_str)
    var parts = time_str.split(':');
    // compute  and return total seconds
    return parts[0] * 3600 + // an hour has 3600 seconds
           parts[1] * 60;  // a minute has 60 seconds
}

function taytaTaulkko(){
	var tulostunnit=0;
	tunnitlista=[];
	var jarjetys = 0;
	$("#tunnit2 div").each( function( index){

		id_luku = Find_Array($("#sarakeD"+index).text(), tunnitlista);

		if (id_luku !== false){
			//console.log(id_luku);
			aika1 = toSeconds(tunnitlista[id_luku].aika);
			aika2 = toSeconds($("#sarakeC"+index).text());
			aikaYht = aika1 + aika2;
			//console.log(aikaYht)
			tunnitlista[id_luku].aika = AddZero(Math.floor(aikaYht/3600)) + ':' + AddZero(Math.floor((aikaYht % 3600)/60));
			$("#aikakoko"+id_luku).text(tunnitlista[id_luku].aika);
		} else {
			$("#tuntitulokset").append('<span id="aikakoko'+jarjetys+'">'+$("#sarakeC"+index).text()+'</span> '+$("#sarakeD"+index).text()+'<br>');
			tunnitlista.push({aika:$("#sarakeC"+index).text(),tehtava:$("#sarakeD"+index).text()})
			jarjetys ++;
			//result = Find_Array("juu", tunnitlista);
			//console.log(Find_Array("juu", tunnitlista));
		 }
		 tulostunnit+=toSeconds($("#sarakeC"+index).text());
	});
	//localStorage.setItem('tunnitlocal', JSON.stringify(tunnitlista));
	save_times(tunnitlista);
	$("#tunnit4").text(AddZero(Math.floor(tulostunnit/3600)) + ':' + AddZero(Math.floor((tulostunnit % 3600)/60)));
}

function tyhjennys(ehto){
	if(ehto==1){
		$("#tuntitulokset").empty();
		$("#tunnit4").text("");
		$("#oltu").empty();
		tyoalku=-1;
	}
	else{
		$("#Tunnit #tunnit2").empty();
		juoksu=0;
		$("#tunnit2").append('<div id="rivi0"><input type="text" id="sarakeA'+juoksu+'"/><input type="text" id="sarakeB'+juoksu+'"/><span id="sarakeC'+juoksu+'"></span><br><span id="sarakeD'+juoksu+'"></span><br></div>');
		$("input:text").val("");
	}

}

function lataafun(){
	tulostunnit=0;
	if(localStorage.getItem('tunnitlocal')){
		tunnitlista=JSON.parse(localStorage.getItem("tunnitlocal"));
		$.each(tunnitlista, function(index){
				$("#tuntitulokset").append('<span class="aikakoko">'+tunnitlista[index].aika+'</span> '+tunnitlista[index].tehtava+'<br>');
			tulostunnit+=toSeconds(tunnitlista[index].aika);
		});
		$("#tunnit4").text(AddZero(Math.floor(tulostunnit/3600)) + ':' + AddZero(Math.floor((tulostunnit % 3600)/60)));
	}
}

function lisaatehtavat(){
	$("#valinnat").empty();
	if(tehtavat.length!=0){
		$("#valinnat").show();
		$.each(tehtavat,function(index){
			$("#valinnat").append('<option>'+tehtavat[index].kuvaus+'</option>');
		});
	}
}

function AddZero(timeNumber){

	if (timeNumber < 10) {
		return '0' + timeNumber;
	} else {
		return timeNumber;
	}
}

function Find_Array(tekija, lista){

	for(var i = 0, len = lista.length; i < len; i ++){

		if (lista[i].tehtava == tekija){
			return i
		}
	}
	return false
}

function save_times(lista){
	paivatunnit =[];
	date = myDate.toTimeString().substr(0,5)+"/"+myDate.getDate().toString()+"."+(myDate.getMonth()+1).toString()+"."+myDate.getFullYear().toString();
	paivatunnit.push({aikaleima:date,tehtavat:lista})
	if(localStorage.getItem("tunnitlocal")){
		tunnitlista = JSON.parse(localStorage.getItem("tunnitlocal"));
	}
	else {
		tunnitlista =[];
	}
	tunnitlista.push(paivatunnit)
	localStorage.setItem('tunnitlocal', JSON.stringify(tunnitlista));
	tulostettu = 0;
	$("#hoursprint").empty();
}

function printhours(){
	if(localStorage.getItem('tunnitlocal')){
		tyopaiva = $.parseJSON(localStorage.getItem("tunnitlocal"));
		$.each(tyopaiva, function(index){
				tulostunnit=0;
				$("#hoursprint").append('<ul id="aikaleima'+index+'" class="aikaleima"><b>'+tyopaiva[index][0].aikaleima+'</b>');
				$.each(tyopaiva[index][0].tehtavat, function(index2){
					$("#aikaleima"+index).append('<li>'+tyopaiva[index][0].tehtavat[index2].aika+' '+ tyopaiva[index][0].tehtavat[index2].tehtava+'</li>');
					tulostunnit+=toSeconds(tyopaiva[index][0].tehtavat[index2].aika);
				});
				tulostunnit = AddZero(Math.floor(tulostunnit/3600)) + ':' + AddZero(Math.floor((tulostunnit % 3600)/60));
				$("#aikaleima"+index).append('<li> Tehdyt tunnit: '+tulostunnit+'</li>');
				$("#hoursprint").append('</ul>');
		});
	}
	return 1;
}
