// const mongoose = require('mongoose')
// const Schema = mongoose.Schema
// const Model = mongoose.Model

// mongoose.connect(
//   // `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/appserver`, 
//   `mongodb://root:example@localhost:27017`, 
//   {
//     useNewUrlParser: true,
//     autoIndex: false, // Don't build indexes
//     poolSize: 10, // Maintain up to 10 socket connections
//     serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
//     socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//     family: 4 // Use IPv4, skip trying IPv6
//   }
// );

// mongoose.connection.on('error', err => {
//   console.error(err.toString())
// });

// const MyModel = mongoose.model('Test', new Schema({ name: String }));


// (async () => {
//   await MyModel.create({
//     name: 'aaa'
//   });
//   const doc = await MyModel.findOne();

//   console.log(doc)
// })()

// const schema = new Schema({
//   name: String
// }, {
//   capped: { size: 1024 },
//   bufferCommands: false,
//   autoCreate: false // disable `autoCreate` since `bufferCommands` is false
// });



////////////////////////////////////// mongodb driver
// const url = 'mongodb://root:example@localhost:27017';
    
// // Database Name
// const dbName = 'myproject';

// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   if (err) {
//     console.error(err.toString())
//   }
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);

//   insertDocuments(db, function(result) {
//     console.log(result)
//   });

//   // client.close();
// });

// const insertDocuments = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection('documents');
//   // Insert some documents
//   collection.insertMany([
//     {a : 1}, {a : 2}, {a : 3}
//   ], function(err, result) {
//     assert.equal(err, null);
//     assert.equal(3, result.result.n);
//     assert.equal(3, result.ops.length);
//     console.log("Inserted 3 documents into the collection");
//     callback(result);
//   });
// }

(async () => {
  const MongoDB = require('../src/db/mongo');

  await MongoDB.connect();

  await MongoDB.insert({
    test: 'aaa'
  })

  const test = await MongoDB.get('test', 'aaa')

  console.dir(test);
})()
