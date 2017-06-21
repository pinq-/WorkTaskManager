// Git testi2
var tehtavat=[];
var juoksu2;
var tuolstettuTyoTunnit = 0;
$( document ).ready(function() {
	//Alkuasetukset
	var spinner = $( "#spinner" ).spinner({min:0,max:5});
	$( "#datepicker" ).datepicker();
	$( "#datepicker" ).datepicker("option", "dateFormat","dd/mm/yy");
	latausf();
	// testi();
//alert(tehtavat[0].kuvaus);
//Panikkeet
	$( "#LisaaTehtava").click(function() {
		varKuvaus=$("#kuvaus").val();

		if(varKuvaus=="" || varKuvaus==" "){
			return false;
		}
		varPriot=$("#spinner").val();
		if (varPriot==""){
			varPriot=0;
		}
		varPaiva=$("#datepicker").val();
		if(varPaiva==""){
			varPaiva="-";
		}
		$("#tehtavat ul").append('<li ><div class="valmis">✔</div><div class="poista">✘</div><div class="tehtavasarake eka">'+varKuvaus+'<b class="nuoli">   Lisää &#8628;</b><textarea id="lisateksti'+juoksu2+'" class="Lisateksti"></textarea></div><div class="tehtavasarake toka" id="prio'+juoksu2+'">'+varPriot+'</spam></div><div class="tehtavasarake kolmas">'+varPaiva+'</div></li>');
		tehtavat.push({ kuvaus: varKuvaus,info:"",prio: varPriot, paiva:varPaiva,id:juoksu2,done:0});
		vari(varPriot,6,juoksu2);
		juoksu2++;
		$("#kuvaus").val('');
		$("#datepicker").val('');
	});
	$("#ListaTehtava").on("click",".poista",function(){ //Poistaa listalta tehtävän
		$(this).parent("li").slideUp("normal", function() { $(this).remove(); });
		idnum=$(this).parent("li").find(".toka").attr("id");
		$.each(tehtavat, function(index=0){
			if(idnum == "prio" + tehtavat[index].id){
				tehtavat.splice(index,1);
			}
		});
	});
	$("#ListaTehtava").on("click",".valmis",function(){ //Merkaa tehtävän valmiiksi ja muuttaa taustan harmaaksi
		$(this).parent("li").find(".toka, .eka, .kolmas, .valmis, .poista").css("background-color", "rgb(230,230,230)");
		$(this).parent("li").find(".toka,.nuoli, .eka, .kolmas, .valmis").css("color", "rgb(217,217,217)");
		idnum = $(this).parent("li").find(".toka").attr("id");
		$.each(tehtavat, function(index2){
			if(idnum=="prio"+tehtavat[index2].id){
				// tehtavat.splice(index2,1);
				tehtavat[index2].done = 1;
				// return false;
			}
		});
	});
	$("#ListaTehtava").on("click",".nuoli",function(){
		$(this).closest('li').find(".Lisateksti").slideToggle();
	});
	//Tyhjentaa kaikki lokaali tiedot
	$( "#tyhjenna").click(function() {
		localStorage.clear();
		tehtavat = [];
	});
	$( "#TehtavaTunnit" ).click(function() { //Tulostaa tehtävissä käytetyt tunnit
		if(tuolstettuTyoTunnit === 0){
			tuolstettuTyoTunnit = printworkhours();
		}
		$("#Tyotunnit").dialog({
			modal:true,
			show: {effect: "slide",duration: 200},
			hide: {effect: "slide",duration: 200},
			height : 500,
			buttons: {
				Close: function(){
					$(this).dialog("close");
				}
			}
		});
	});
});

function tallenna(){
	$.each(tehtavat, function(index ) {
		numero=tehtavat[index].id;
		tehtavat[index].info=$("#lisateksti"+numero+"").val();
	});
	localStorage.setItem('tehtavatlocal', JSON.stringify(tehtavat));
}

function loaddata() {
	juoksu2=localStorage.juoksu2;
    $('#tallennus').text(localStorage.juoksu2);

    }
function vari(val,max,ruutu){
	var red=0,green=0,blue=0,
	prosentti=((val/max)*100);

	if (prosentti >=50){
		red =255 -Math.round(((prosentti-50)/50)*255);
		green =255;
	}
	else if (prosentti == 0){
			red=230;
			green=230;
			blue=230;
	}
	else {
		red=255;
		green=Math.round(((prosentti)/50)*255);
	}
	$("#prio"+ruutu).css("background-color", "rgb("+red+","+green+","+blue+")");
}
function latausf(){
	if(localStorage.getItem('tehtavatlocal')!=null){
		tehtavat=JSON.parse(localStorage.getItem("tehtavatlocal"));
		$.each(tehtavat, function(index ) {

			if (tehtavat[index].done == 0) {
				$("#tehtavat ul").append('<li ><div class="valmis">✔</div><div class="poista">✘</div><div class="tehtavasarake eka">'+tehtavat[index].kuvaus+'<b class="nuoli">   Lisää &#8628;</b><textarea id="lisateksti'+tehtavat[index].id+'"\
				class="Lisateksti">'+tehtavat[index].info+'</textarea></div><div class="tehtavasarake toka" id="prio'+tehtavat[index].id+'">'+tehtavat[index].prio+'\
				</spam></div><div class="tehtavasarake kolmas">'+tehtavat[index].paiva+'</div></li>');
				vari(tehtavat[index].prio,6,tehtavat[index].id);
			}
		});
		try{
			juoksu2 = tehtavat[tehtavat.length-1].id+1;
		}
		catch(err){
			juoksu2=0;
		}

	}
	else{
		tehtavat=[];
		juoksu2=0;
	}

}
function printworkhours(){
	tehtavatunnit = []
	if(localStorage.getItem('tunnitlocal')){
		tunnit_muistsita = $.parseJSON(localStorage.getItem("tunnitlocal"));
		tehtavat_muistista = $.parseJSON(localStorage.getItem("tehtavatlocal"));
		$.each(tehtavat_muistista, function(index){
			tehtavatunnit.push({tehtava:tehtavat_muistista[index].kuvaus,tunnit:0});
		});
		$.each(tunnit_muistsita, function(index){
				$.each(tunnit_muistsita[index][0].tehtavat, function(index_tunnit){
					if(tehtavatunnit.length != 0){
						$.each(tehtavatunnit, function(index_tyot){

							if(tehtavatunnit[index_tyot].tehtava == tunnit_muistsita[index][0].tehtavat[index_tunnit].tehtava){
								tehtavatunnit[index_tyot].tunnit += toSeconds(tunnit_muistsita[index][0].tehtavat[index_tunnit].aika);
								return false;
							}
						});
					}
				});
		});
	}
	if (tehtavatunnit.length !== 0) {
		$.each(tehtavatunnit, function(index) {
			if(tehtavatunnit[index].tunnit !== 0 ){
				$("#taskworkhours").append('<li>'+tehtavatunnit[index].tehtava+' : '+ AddZero(Math.floor(tehtavatunnit[index].tunnit/3600)) + ':' + AddZero(Math.floor((tehtavatunnit[index].tunnit % 3600)/60))+'</li>');
			}
		});
	}

	return 1;
}
