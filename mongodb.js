const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017"; 
const dbName = "proj2024MongoDB"; 

let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const getLecturers = () => {
  if (!db) {
    console.error("MongoDB is not connected.");
    return;
  }
  return db.collection("lecturers");
};

const deleteLecturer = async (lecturerId) => {
  if (!db) {
    console.error("MongoDB is not connected.");
    return;
  }

  const lecturersCollection = db.collection("lecturers");
  const modulesCollection = db.collection("modules");

  try {
    // Log the lecturerId to ensure it's being passed correctly
    console.log("Lecturer ID to delete:", lecturerId);

    // Find the lecturer by their _id (as the lecturerId is stored as _id)
    const lecturer = await lecturersCollection.findOne({ _id: lecturerId }); 
    console.log("Found lecturer:", lecturer); // Log the found lecturer

    if (!lecturer) {
      console.log("Lecturer not found with _id:", lecturerId); // More detailed logging
      return { success: false, message: `Lecturer with ID ${lecturerId} not found.` };
    }

    // Check if the lecturer is teaching any modules
    const lecturerModules = await modulesCollection.find({ lecturerId }).toArray();
    console.log("Lecturer modules:", lecturerModules);

    if (lecturerModules.length > 0) {
      // If the lecturer is teaching modules, don't allow deletion
      console.log("Lecturer cannot be deleted because they teach modules");
      return { success: false, message: "This lecturer cannot be deleted because they are teaching modules." };
    }

    // Proceed to delete the lecturer if they are not teaching any modules
    const result = await lecturersCollection.deleteOne({ _id: lecturerId });
    console.log("Delete result:", result);

    if (result.deletedCount === 1) {
      return { success: true, message: `Lecturer with ID ${lecturerId} deleted.` };
    } else {
      return { success: false, message: "Lecturer not found or already deleted." };
    }
  } catch (error) {
    console.error("Error deleting lecturer:", error);
    return { success: false, message: "Error deleting lecturer." };
  }
};

module.exports = { getLecturers, deleteLecturer };
