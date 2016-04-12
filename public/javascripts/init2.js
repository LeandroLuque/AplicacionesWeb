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

	var $rateYo = $("#rateYo").rateYo();
	var rating = $rateYo.rateYo("rating");
	var codIMDB = document.getElementById("codIMDB").value;
	var title = document.getElementById("titulo").innerHTML;
	var genre = document.getElementById("genero").innerHTML;
	var runtime = document.getElementById("duracion").innerHTML;
	var language = document.getElementById("lenguaje").innerHTML;
	var country = document.getElementById("pais").innerHTML;
	var year = document.getElementById("año").innerHTML;
	var poster = document.getElementById("poster").getAttribute("src");
	var nuevo;

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
	$("#myModal").modal("show");
	
	
	nuevo = {
		"id": codIMDB,
		"title": title,
		"year": year,
		"genre": genre,
		"runtime": runtime,
		"language": language,
		"country": country,
		"ranking": rating
	}

	actualizar(nuevo)
	limpiar();
	
}

function actualizar(arreglo){

	console.log(arreglo["id"]);

	var string = "<tr><td>" + arreglo["id"] + "</td>" +
					"<td>" + arreglo["title"] + "</td>" + 
					"<td>" + arreglo["year"] + "</td>" + 
					"<td>" + arreglo["genre"] + "</td>" + 
					"<td>" + arreglo["runtime"] + "</td>" +
					"<td>" + arreglo["language"] + "</td>" +
					"<td>" + arreglo["country"] + "</td>" +
					"<td>" + arreglo["ranking"] + "</td></tr>"
	$("#mytable tr:last").after(string);
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
			for (i in cont){
				var string = '<div class="col-xs-5 col-md-3">' +
				    '<a href="#">' +
				      '<img class="img-rounded" src='+ cont[i].poster +' id='+cont[i].idMovie+
			 					' onclick=mostrar_pelicula(this.id)>' +
				    '</a> </div>';
	  // <img src="+cont[i].poster+" id="+cont[i].idMovie+
			// 					" onclick=mostrar_pelicula(this.id)>";
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
	armarModal(datos_pelicula[0]);
	$("#myModal").modal("show");
}

function armarModal(arr){

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
	var $rateYo = $("#rateYo").rateYo();
	$rateYo.rateYo("option","maxValue", 10);
	$rateYo.rateYo("rating", parseFloat(arr.ranking)); //ver
	$("#buscar_punto").hide();
}


function comparar_pelicula(){
	
	//Para devolver mi pelicula
	var url =document.getElementById("url_publicacion").value;
	var codigo = document.getElementById("codigoIMBD").innerHTML;
	var nombreURL = document.getElementById("url_publicacion").value;
	if (url == ""){
		alert("Se tomará:http://www.omdbapi.com");
		nombreURL = "http://www.omdbapi.com";
		url = "http://www.omdbapi.com/?i="+codigo+"&plot=short&r=json";
	}else{
		url = "http://" + url + "/"+codigo; //se debería pedir el parámetro id?	
	}
	//xmlhttp = new XMLHttpRequest();
	//marcar con rojo campo, para mostrar error en vez de los alert
	$("#urlComparador").text("Puntaje de:" + nombreURL);
	$("#urlComparador").show();
	$.get(url, obtieneRanking,"json");
}

function obtieneRanking(data,status){
	if (status == "success"){
		//alert(data["imdbRating"]);
		$("#rateYo2").rateYo({
			maxValue: 10,
			rating: data["imdbRating"], //debería normalizarse, o pasarse por paráemtros
			readOnly: true
		});
		//ver configuración de los rating, cuantas estrellas
	}else{
		alert(status);
		$("#urlComparador").hide();
	}
}
function comparar(){
	$("#buscar_punto").show();
}