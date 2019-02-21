const mongo = require('mongodb')
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'myDb';
MongoClient.connect(url, function (err, client) {
  if(err) throw err;
  console.log("Connected successfully to Mongo server");
  db = client.db(dbName);
});

const insertDataInMongo = (collectionName,data)=>{
  db.collection(collectionName).insertOne(data);
}

module.exports = {
  insertDataInMongo
}