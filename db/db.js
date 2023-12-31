
const { MongoClient, Db } = require('mongodb');

let dbConnection

module.exports = {

  connectToDb: (cb) => {
    MongoClient.connect('mongodb://localhost:27017/tattler')
    .then((client) => {
      dbConnection = client.db();
      return cb();
    }).catch(err => {
      console.log(err);
      return cb(err)
    })
  },
  getDb: () => dbConnection
}