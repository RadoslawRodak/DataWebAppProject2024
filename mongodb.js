const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017"; // Local MongoDB URL
const dbName = "proj2024MongoDB"; // MongoDB database name

let db;

// Connect to MongoDB locally
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    console.log("Connected to MongoDB locally");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Function to get the "lecturers" collection
const getLecturers = () => {
    if (!db) {
      console.error("MongoDB is not connected.");
      return [];
    }
    return db.collection("lecturers").find({}).toArray(); // Fetch all lecturers
  };

  var deleteLecturers = function(lecturerId) {
    return new Promise((resolve, reject) => {
    coll.deleteOne({_id:lecturerId})
    .then((documents) => {
    resolve(documents)
    })
    .catch((error) => {
    reject(error)
    })
    })
    }
module.exports = { getLecturers, deleteLecturers};
