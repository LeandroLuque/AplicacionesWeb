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
		var modal = $("#modal");
		modal.find(".modal-title").text("Error");
		modal.find(".modal-body p").text("La calificación debe ser mayor a cero");
		modal.find(".modal-header").attr({"style":"background-color: #c77270"});
		modal.find("h4").attr({"style":"color: black"});
		modal.modal("show");
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
				var modal = $("#modal");
				if (data.status == "error"){
					modal.find(".modal-title").text("Error");
					modal.find(".modal-body p").text("La pelicula ya ha sido calificada");
					modal.find(".modal-header").attr({"style":"background-color: #c77270"});
					modal.find("h4").attr({"style":"color: black"});
					modal.modal("show");
				}else{
					limpiar();
					modal.find(".modal-title").text("Éxito");
					modal.find(".modal-body p").text("La pelicula ha sido cargada con éxito");
					modal.find(".modal-header").attr({"style":"background-color: #bce8f1"});
					modal.find("h4").attr({"style":"color: black"});
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
