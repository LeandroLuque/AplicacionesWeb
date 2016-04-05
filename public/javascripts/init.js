/* Javascript */
 
$(function () {
 
	$("#rateYo").rateYo({
		rating: 0,
    	halfStar: true
	});
});


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


function cargar_datos(){

	$.ajax({
		url: "/data",
		complete:function(data){
			var cont = JSON.parse(data.responseText);
			for (i in cont){
				var string = "<tr><td>" + cont[i].idMovie + "</td>" +
								"<td>" + cont[i].title + "</td>" + 
								"<td>" + cont[i].year + "</td>" + 
								"<td>" + cont[i].genre + "</td>" + 
								"<td>" + cont[i].runtime + "</td>" +
								"<td>" + cont[i].language + "</td>" +
								"<td>" + cont[i].country + "</td>" +
								"<td>" + cont[i].ranking + "</td></tr>"
				$("#mytable tr:last").after(string);
			}
			$("#mytable").show();
			$("#mytable").tablesorter();
		}
	});

}


$(document).ready(function(){

	cargar_datos();

});


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