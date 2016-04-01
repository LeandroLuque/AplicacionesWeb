var Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    MongoClient = require('mongodb').MongoClient;

var db = new Db('newDB', new Server('localhost', 27017));
// Establish connection to db
db.open(function(err, db) {

  // Create a collection we want to drop later

  var collection = db.collection('peliculas');

    // Peform a simple find and return all the documents
  collection.find().toArray(function(err, docs) {
  
    db.close();
  });
 
});

console.log(docs);