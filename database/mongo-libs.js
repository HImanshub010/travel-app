const mongo = require('mongodb')
const constants = require('./../constants/constants')
const MongoClient = mongo.MongoClient;

MongoClient.connect(constants.mongoConstants.URL, function (err, client) {
  if(err) throw err;
  console.log("Connected successfully to Mongo server");
  db = client.db(constants.mongoConstants.DB_NAME);
});

const insertDataInMongo = (collectionName,data)=>{
  db.collection(collectionName).insertOne(data);
}

module.exports = {
  insertDataInMongo
}