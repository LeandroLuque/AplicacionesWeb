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
		collection.find({"idMovie": id}).toArray(function(err, docs) {
			db.close();
			var data = {
					 	"idMovie" : docs[0]["idMovie"],
					 	"ranking": docs[0]["ranking"]
					   }
			res.json(data);
		});
	});

});



module.exports = router;
