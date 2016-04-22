/* Javascript */
 

$(function () {
 
	$("#rateAlta").rateYo({
		rating: 0,
    	halfStar: true
	});
})

function mostrarData(arr){

	if (arr["Error"] == "Incorrect IMDb ID."){
		$("#calificacion").hide();
		$("#datos_pelicula").hide();
		var modal = $("#modal");
		modal.find(".modal-title").text("Error");
		modal.find(".modal-body p").text("La pelicula ingresada no existe");
		modal.find(".modal-header").attr({"style":"background-color: #c77270"});
		modal.modal("show");	
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
		var url = "http://www.omdbapi.com/?i="+codIMDB+"&plot=short&r=json"
		$.get(url,function(data){
		    mostrarData(data);
		});
	}
}

function calificar(){

	var $rateYo = $("#rateAlta").rateYo();
	var rating = $rateYo.rateYo("rating");
	
	if (rating == 0){
		alert("La calificación debe ser mayor a cero");
	}else{
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
			url: "/movie",
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
				   },
			success:function(data){
				limpiar();
				var modal = $("#modal");
				if (data.status == "error"){
					modal.find(".modal-title").text("Error");
					modal.find(".modal-body p").text("La pelicula ya ha sido calificada");
					modal.find(".modal-header").attr({"style":"background-color: #c77270"});
					modal.modal("show");
				}else{
					modal.find(".modal-title").text("Éxito");
					modal.find(".modal-body p").text("La pelicula ha sido cargada con éxito");
					modal.find(".modal-header").attr({"style":"background-color: #bce8f1"});
					modal.modal("show");
				}
			}
		});
	}
}

function limpiar(){

	document.getElementById("codIMDB").value = ""
	$("#calificacion").hide();
	$("#datos_pelicula").hide();
	$("#rateAlta").rateYo("rating",0);
    	
}


//------------------------------------//

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

function comparar_pelicula(url){
	
	$.ajax({
		url: url,
		type:"GET",
		crossDomain:true,
		complete:function(data,status){
			if (status == "success"){
				if (data.length == 0)
					set_rating_grupo(JSON.parse(data.responseText)["rating"]);
				else
					set_rating_grupo(0);	
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
				if (data.length == 0)
					set_rating_grupo(JSON.parse(data.responseText)["rating"]/2);
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
		case "GRUPO 1": comparar_pelicula_enteros("http://" + ip + "/pelicula/" + cod +"/comparar");							
						break;					
		case "GRUPO 4": comparar_pelicula("http://" + ip + "/movies/?id=" + cod);
						break;
		case "GRUPO 3": comparar_pelicula("http://" + ip +"/Nueva%20carpeta/buscapeliculas.php/?id=" + cod);
						break;
		default: break;
	}
}
