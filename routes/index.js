var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendfile("index.html");
});

/* POST new movie. */
router.post('/login',function(req,res){
	var titulo = req.body.titulo;
	var ranking = req.body.ranking;
	var db = req.db;
	db.open(function(error,client){
		var collection = db.collection('peliculas');
		collection.insertOne({
			titulo: titulo,
			ranking: ranking
		});
		db.close();
	});
});


module.exports = router;
