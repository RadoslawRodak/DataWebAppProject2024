// mongodb.js
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; // MongoDB connection URI
const dbName = "proj2024MongoDB"; // MongoDB database name

// Function to connect to MongoDB
const connectToMongo = async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    return db; // Return the MongoDB database connection
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    throw err;
  }
};

// Function to get the 'lecturers' collection
const getLecturersCollection = async () => {
  const db = await connectToMongo();
  return db.collection("lecturers"); // Returns the 'lecturers' collection
};

module.exports = {
  connectToMongo,
  getLecturersCollection,
};
