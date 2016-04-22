var express = require('express');
var router = express.Router();
var path = require('path');


/* GET users listing. */
router.get('/', function(req, res, next) {

  res.sendFile('consulta.html', { root: path.join('public') });
});

router.get('/data',function(req, res, next){

	var db = req.db;
	var id = req.query["id"];

	db.open(function(error,client){

		collection = db.collection('peliculas');
		collection.find({_id: id}).toArray(function(err, docs) {
			if (typeof docs != "undefined"){
				if (docs.length == 0){
					res.json({});
				}else{
					db.close();
					var data = {
							 	"idMovie" : docs[0]["_id"],
							 	"ranking": docs[0]["ranking"]
							   }
					res.json(data);	
				}
			}
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
		collection.find({_id: idMovie}).toArray(function(err, docs) {
			if (docs.length == 0){
				collection.insertOne({
					_id: idMovie,
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
				res.send({"status":"ok"});
			}else{
				db.close();
				res.send({"status":"error"});
			}
		
		});
	});
});

module.exports = router;
