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

module.exports = router;
