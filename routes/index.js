var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/data', function(req, res, next) {
	var db = req.db;
	db.open(function(error,client){

		collection = db.collection('peliculas');
		collection.find().toArray(function(err, docs) {
			db.close();
			res.json(docs);
		});
	});
});

/* POST new movie. */
router.post('/',function(req,res){
	var idMovie = req.body.idMovie;
	var title = req.body.title;
	var runtime = req.body.runtime;
	var language = req.body.language;
	var country = req.body.country;
	var year = req.body.year;
	var genre = req.body.genre;
	var ranking = req.body.ranking;
	var poster = req.body.poster;
	var db = req.db;
	db.open(function(error,client){
		var collection = db.collection('peliculas');
		collection.insertOne({
			idMovie: idMovie,
			title: title,
			year: year,
			genre: genre,
			runtime: runtime,
			language: language,
			country: country,
			ranking: ranking,
			poster:poster
		});
		db.close();
	});
});


module.exports = router;
