const MongoClient = require('mongodb').MongoClient;
const config = require('./config/db')

exports.createIndexes = () => {
  // Create a new MongoClient
  const client = new MongoClient(config.db);

  // Use connect method to connect to the server
  client.connect(function (err) {
    console.log("Successfully connected to the server!");

    const db = client.db(config.dbName);

    // Create indexes
    db.collection('patients').createIndex({ name: 'text', phone: 'text', email: 'text', patientID: 'text' }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Patient Indexes Created Successfully!");
      }

      client.close();
    });

  });
}

