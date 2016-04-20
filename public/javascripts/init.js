/* Javascript */
 
function mostrarData(arr){

	if (arr["Error"] == "Incorrect IMDb ID."){
		$("#calificacion").hide();
		$("#datos_pelicula").hide();
		alert("La pelicula ingresada no existe o ya ha sido calificada");
	}else{
		$("#poster").attr("src",arr["Poster"]);
		$("#año").text(arr["Year"]);
		$("#titulo").text(arr["Title"]);
		$("#genero").text(arr["Genre"]);
		$("#duracion").text(arr["Runtime"]);
		$("#lenguaje").text(arr["Language"]);
		$("#pais").text(arr["Country"]);
		$("#datos_pelicula").show();
		$("#calificacion").show();
	}
}

function buscar(){

	var codIMDB = document.getElementById("codIMDB").value;
	if (codIMDB != "") {
		xmlhttp = new XMLHttpRequest();
		var url = "http://www.omdbapi.com/?i="+codIMDB+"&plot=short&r=json"
		xmlhttp.onreadystatechange = function() {
		    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		        var myArr = JSON.parse(xmlhttp.responseText);
		        mostrarData(myArr);
		    }
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}
}

function calificar(){

	var $rateYo = $("#rateAlta").rateYo();
	var rating = $rateYo.rateYo("rating");
	var codIMDB = document.getElementById("codIMDB").value;
	var title = document.getElementById("titulo").innerHTML;
	var genre = document.getElementById("genero").innerHTML;
	var runtime = document.getElementById("duracion").innerHTML;
	var language = document.getElementById("lenguaje").innerHTML;
	var country = document.getElementById("pais").innerHTML;
	var year = document.getElementById("año").innerHTML;
	var poster = document.getElementById("poster").getAttribute("src");

	$.ajax({
		type: "POST",
		url: "http://localhost:3000",
		data: {
				idMovie:codIMDB, 
				title: title,
				genre: genre,
				runtime: runtime,
				language: language,
				country: country,
				year: year,
				ranking:rating,
				poster:poster
			   }
	});
	
	limpiar();
	var modal = $("#modal");
	modal.find(".modal-title").text("Éxito");
	modal.find(".modal-body p").text("La pelicula ha sido cargada con éxito");
	modal.modal("show");
}

function limpiar(){

	document.getElementById("codIMDB").value = ""
	$("#calificacion").hide();
	$("#datos_pelicula").hide();
}


var datos_peliculas;

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
				    '" id="' + cont[i].idMovie + '" onclick="mostrar_pelicula(this.id)">' +
				    '</a></div>';
				$("#covers").append(string);
			}
			
		}
	});
}

$(document).ready(function(){

	cargar_datos();
});

function mostrar_pelicula(id){

	
	var datos_pelicula = datos_peliculas.filter(function(pelicula){
		return pelicula.idMovie == id;
	});
	armarModal(id,datos_pelicula[0]);
	$("#myModal").modal("show");
}

function armarModal(id,arr){

	$("#codigoIMBD").text("");
 	$("#codigoIMBD").append(arr.idMovie);
 	
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

function comparar_pelicula(){
	
	//Para devolver mi pelicula
	var codIMDB = document.getElementById("codIMDB").value;
	$.ajax({
		url: "/movie/data?id=" + codIMDB,
		complete:function(data){
			console.log(data.responseJSON);
			$.get("http://www.omdbapi.com/?i="+codIMDB+"&plot=short&r=json",function(data){
				console.log(data);
			});
		}
	});
}

$(function () {
 
	$("#rateAlta").rateYo({
		rating: 0,
    	halfStar: true
	});
})

function comparar_pelicula(url){
	
	$.ajax({
		url: url,
		type:"GET",
		crossDomain:true,
		complete:function(data,status){
			if (status == "success"){
				set_rating_grupo(JSON.parse(data.responseText)["rating"])
			}
		}
	});	
}

function comparar_pelicula_enteros(url){

	$.ajax({
		url: url,
		type:"GET",
		crossDomain:true,
		complete:function(data,status){
			if (status == "success"){
				set_rating_grupo(JSON.parse(data.responseText)["rating"]/2);
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
	//validar direccion ip ingresada
	var url = ip;
	switch(opcion){
		case "GRUPO 1":url = "http://" + url + "/pelicula/" + cod +"/comparar";
							comparar_pelicula_enteros(url);							
							break;
		case "GRUPO 4": comparar_pelicula("http://" + url + "/movies/?id=" + cod);
							break;
		case "GRUPO 3": url = "http://" + url +"/Nueva%20carpeta/buscapeliculas.php/?id=" + codigo;
							comparar_pelicula(url);
							break;
		default: break;
	}
}
