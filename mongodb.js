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

// Function to delete a lecturer from MongoDB by ID
const deleteLecturerById = async (lecturerId) => {
    if (!db) {
      console.error("MongoDB is not connected.");
      return;
    }

    const lecturersCollection = db.collection("lecturers"); // Use existing connection

    try {
      // Delete lecturer by ID
      const result = await lecturersCollection.deleteOne({ _id: lecturerId });
      if (result.deletedCount === 0) {
        throw new Error("Lecturer not found or already deleted");
      }
      console.log("Lecturer deleted successfully");
    } catch (err) {
      console.error("Error deleting lecturer from MongoDB:", err);
      throw err; // Propagate error to handle it elsewhere if needed
    }
};

module.exports = { getLecturers, deleteLecturerById };
