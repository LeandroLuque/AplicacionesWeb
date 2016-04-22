
var datos_peliculas;

$(document).ready(function(){

	cargar_datos();
});


function cargar_datos(){

	$.ajax({
		url: "/data",
		complete:function(data){
			var cont = JSON.parse(data.responseText);
			datos_peliculas = cont;
			$("#covers").empty();
			for (i in cont){
				var string = '<div class="col-xs-6 col-md-3">' +
					'<a class="responsive">' +
				    '<img class="img-rounded" width="310px" height="410px" src="' + cont[i].poster + 
				    '" id="' + cont[i]._id+ '" onclick="mostrar_pelicula(this.id)">' +
				    '</a></div>';
				$("#covers").append(string);
			}
			
		}
	});
}

function mostrar_pelicula(id){

	
	var datos_pelicula = datos_peliculas.filter(function(pelicula){
		return pelicula._id == id;
	});
	armarModal(id,datos_pelicula[0]);
	$("#myModal").modal("show");
}

function armarModal(id,arr){
	$("#codigoIMBD").text("");
 	$("#codigoIMBD").append(id);	
	$("#poster").attr("src",arr.poster);
	$("#year").text("");
	$("#year").append("<strong>Año: </strong>"+arr.year);
	$("#modalTitulo").text(arr.title);
	$("#genre").text("");
	$("#genre").append("<strong>Género: </strong>"+arr.genre);
	$("#runtime").text("");
	$("#runtime").append("<strong>Duración: </strong>"+arr.runtime);
	$("#language").text("");
	$("#language").append("<strong>Lenguaje: </strong>"+arr.language);
	$("#country").text("");
	$("#country").append("<strong>País: </strong>"+arr.country);
	$("#codIMDB").text("");
	$("#codIMDB").append("<strong>Código IMDb: </strong>"+id);
	var $rateYo = $("#rateYo").rateYo({readOnly:true});
	$rateYo.rateYo("rating", parseFloat(arr.ranking));
	$("#rateYo2").hide();
}

function comparar_pelicula_4(url){
	
	$.ajax({
		url: url,
		type:"GET",
		crossDomain:true,
		complete:function(data,status){
			if (status == "success"){
				if (data.length != 0)
					set_rating_grupo(JSON.parse(data.responseText)["rating"]);
				else
					set_rating_grupo(0);	
			}	
		}
	});	
}

function comparar_pelicula_1(url){

	$.ajax({
		url: url,
		type:"GET",
		crossDomain:true,
		complete:function(data,status){
			if (status == "success"){
				if (data.length != 0)
					set_rating_grupo(JSON.parse(data.responseText)["ponderacion"]/2);
				else
					set_rating_grupo(0);
			}
		}
	});	
}

function comparar_pelicula_3(url){

	$.ajax({
		url: url,
		type:"GET",
		crossDomain:true,
		complete:function(data,status){
			if (status == "success"){
				if (data.length != 0)
					set_rating_grupo(JSON.parse(data.responseText)["ponderacion"]);
				else
					set_rating_grupo(0);
			}
		}
	});	
}


function set_rating_grupo(rating){
	$("#rateYo2").rateYo({
		maxValue: 5,
		rating: rating,
		readOnly: true,
		ratedFill: "red"
	});
	$("#rateYo2").show();
}

function comparar(){
	var cod = document.getElementById("codigoIMBD").innerHTML;
	var opcion = $("#grupos").val();
	var ip = prompt("Ingrese IP", "Ejemplo 192.168.0.2");
	switch(opcion){
		//Grupo Andres
		case "GRUPO 1": comparar_pelicula_1("http://" + ip + "/pelicula/" + cod +"/comparar");							
						break;					
		//Grupo Bruno
		case "GRUPO 4": comparar_pelicula_4("http://" + ip + "/movies/?id=" + cod);
						break;
		//Grupo Diego
		case "GRUPO 3": comparar_pelicula_3("http://" + ip +"/Nueva%20carpeta/buscapeliculas.php/?id=" + cod);
						break;
		default: break;
	}
}
