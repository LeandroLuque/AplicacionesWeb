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
	$.ajax({
		type: "POST",
		url: "http://localhost:3000/login",
		data: {titulo:codIMDB, ranking:rating},
		success: function(data){
			console.log("it works");
		}
	});
	$("#myModal").modal("show");
	limpiar();
}

function limpiar(){

	document.getElementById("codIMDB").value = ""
	$("#calificacion").hide();
	$("#datos_pelicula").hide();
}