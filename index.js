const express = require("express");
const { getStudents, getStudentBySid, updateStudent, addStudent, getGradesData, getModulesByLecturerId } = require("./mysql");
const { getLecturers, deleteLecturerFromMongoDB } = require("./mongodb"); // Import MongoDB functions
const bodyParser = require("body-parser");

const app = express();
const port = 3004;
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Homepage (GET /)
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Home Page</title>
    </head>
    <body>
        <h1>Welcome to the Database Management</h1>
        <nav>
            <ul>
                <li><a href="/students">Students</a></li>
                <li><a href="/grades">Grades</a></li>
                <li><a href="/lecturers">Lecturers</a></li>
            </ul>
        </nav>
    </body>
    </html>
  `);
});

// Route to display lecturers
app.get("/lecturers", async (req, res) => {
  try {
    // Fetch lecturers from MongoDB
    const lecturers = await getLecturers();
    console.log("Lecturers fetched from MongoDB:", lecturers);  // Debugging output

    if (lecturers && lecturers.length > 0) {
      res.render("lecturers", { lecturers }); // Pass lecturers to the view
    } else {
      res.render("lecturers", { lecturers: [], errorMessage: "No lecturers found." });
    }
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    res.status(500).send("Error fetching lecturers");
  }
});

// Route to handle lecturer deletion
app.get("/lecturers/delete/:id", async (req, res) => {
  const lecturerId = req.params.id;

  try {
    // Check if the lecturer is teaching any modules in MySQL
    const modules = await getModulesByLecturerId(lecturerId);

    if (modules.length > 0) {
      // If the lecturer is teaching modules, prevent deletion and show modules
      const moduleNames = modules.map(module => module.name).join(", ");
      res.render("lecturers", {
        lecturers: await getLecturers(),  // Refresh lecturer list
        errorMessage: `This lecturer is teaching the following module(s): ${moduleNames}. Cannot delete lecturer.`,
      });
    } else {
      // If no modules are found, proceed with deletion
      await deleteLecturerFromMySQL(lecturerId);  // Delete lecturer from MySQL

      // Optionally, delete from MongoDB as well (if you want)
      const resultMongo = await deleteLecturerFromMongoDB(lecturerId);  // Delete lecturer from MongoDB
      if (resultMongo) {
        console.log(`Lecturer ${lecturerId} successfully deleted from MongoDB.`);
      }

      // After successful deletion, redirect to the list of lecturers
      res.redirect("/lecturers");
    }
  } catch (error) {
    console.error("Error handling deletion:", error);
    res.status(500).send("Error handling deletion");
  }
});

// Route to display students
app.get("/students", (req, res) => {
  getStudents()
    .then((students) => {
      res.render("student", { students });
    })
    .catch((err) => {
      res.status(500).send("Error fetching students");
      console.error(err);
    });
});

// Route to display the update form for a specific student
app.get("/students/edit/:sid", (req, res) => {
  const sid = req.params.sid;
  getStudentBySid(sid).then((student) => {
    if (student) {
      res.render("update-student", { student, errors: [] });
    } else {
      res.status(404).send("Student not found");
    }
  });
});

// Route to handle the form submission and update the student
app.post("/students/edit/:sid", (req, res) => {
  const sid = req.params.sid;
  const { name, age } = req.body;

  let errors = [];
  if (!name || name.length < 2) {
    errors.push("Student Name should be at least 2 characters");
  }
  if (!age || age < 18) {
    errors.push("Student Age should be at least 18");
  }

  if (errors.length > 0) {
    return res.render("update-student", { student: { sid, name, age }, errors });
  }

  updateStudent(sid, { name, age }).then(() => {
    res.redirect("/students");
  });
});

// Route to render the Add Student form (GET)
app.get("/students/add", (req, res) => {
  res.render("add-student", { sid: "", name: "", age: "", errors: [] });
});

// POST route to handle Add Student
app.post("/students/add", async (req, res) => {
  const { sid, name, age } = req.body || {};
  const errors = [];

  if (!sid || typeof sid !== "string" || sid.length !== 4) {
    errors.push("Student ID must be exactly 4 characters.");
  }
  if (!name || typeof name !== "string" || name.length < 2) {
    errors.push("Name must be at least 2 characters.");
  }
  if (!age || isNaN(Number(age)) || Number(age) < 18) {
    errors.push("Age must be 18 or older.");
  }

  if (errors.length > 0) {
    return res.render("add-student", { sid, name, age, errors });
  }

  try {
    await addStudent(sid, { name, age: Number(age) });
    res.redirect("/students");
  } catch (err) {
    console.log("Error adding student:", err);
    if (err.code === "ER_DUP_ENTRY") {
      errors.push("A student with this ID already exists.");
    } else {
      errors.push("An error occurred while adding the student. Please try again.");
    }
    res.render("add-student", { sid, name, age, errors });
  }
});

// Route to display grades
app.get("/grades", (req, res) => {
  getGradesData().then((grades) => {
    res.render("grades", { grades });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
