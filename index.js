const express = require("express");
const { getStudents, getStudentBySid, updateStudent, addStudent, getGradesData} = require("./mysql"); // Import the functions from mysql.js
const app = express();
const bodyParser = require("body-parser");
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
            <h1>G00417413</h1>
            <nav>
                <ul>
                    <li><a href="/students">Students</a></li>
                    <li><a href="/grades">Grades</a></li>                   
                </ul>
            </nav>
        </body>
        </html>
    `);
});

// Route to display students in the browser
app.get("/students", (req, res) => {
  getStudents()
    .then((students) => {
      // Render 'student.ejs' with the fetched students data
      res.render("student", { students: students });
    })
    .catch((err) => {
      res.status(500).send("Error fetching students");
      console.error(err);
    });
});

// Route to display the update form for a specific student
app.get("/students/edit/:sid", (req, res) => {
  const sid = req.params.sid;
  getStudentBySid(sid)
    .then((student) => {
      if (student) {
        res.render("update-student", { student, errors: [] });
      } else {
        res.status(404).send("Student not found");
      }
    })
    .catch((err) => {
      console.log("Error fetching student:", err);
      res.status(500).send("Internal Server Error");
    });
});

// Route to handle the form submission and update the student
app.post("/students/edit/:sid", (req, res) => {
  const sid = req.params.sid; // Get the SID from the URL
  const { name, age } = req.body; // Get the new name and age from the form input

  // Validation logic
  let errors = [];
  if (!name || name.length < 2) {
    errors.push("Student Name should be at least 2 characters");
  }
  if (!age || age < 18) {
    errors.push("Student Age should be at least 18");
  }

  // If validation fails, re-render the form with errors
  if (errors.length > 0) {
    return res.render("update-student", {
      student: { sid, name, age },
      errors,
    });
  }

  // If validation passes, update the student in the database
  updateStudent(sid, { name, age })
    .then(() => {
      res.redirect("/students"); // Redirect to the students list after update
    })
    .catch((err) => res.status(500).send("Error updating student details"));
});

// Route to render the Add Student form (GET)
app.get("/students/add", (req, res) => {
  res.render("add-student", {
    sid: "", // Empty string for SID for new student
    name: "", // Empty string for name
    age: "", // Empty string for age
    errors: [], // Empty error initially
  });
});

// POST route to handle Add Student
app.post("/students/add", async (req, res) => {
  const { sid, name, age } = req.body || {};
  const errors = [];

  // Validation
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
    // Add the new student
    await addStudent(sid, { name, age: Number(age) }); // Ensure age is a number
    res.redirect("/students");
  } catch (err) {
    console.log("Error adding student:", err);

    // Handle duplicate entry error
    if (err.code === "ER_DUP_ENTRY") {
      errors.push("A student with this ID already exists.");
    } else {
      errors.push(
        "An error occurred while adding the student. Please try again."
      );
    }

    // Re-render the form with errors and previously entered data
    res.render("add-student", { sid, name, age, errors });
  }
});

app.get("/grades", (req, res) => {
  getGradesData()
    .then((results) => {
      // Group the results by student name for easier rendering
      const gradesData = results.reduce((acc, row) => {
        if (!acc[row.student_name]) {
          acc[row.student_name] = [];
        }
        acc[row.student_name].push({
          module: row.module_name || "No Modules", // Show "No Modules" if null
          grade: row.grade || "No Grade", // Show "No Grade" if null
        });
        return acc;
      }, {});

      res.render("grades", { gradesData });
    })
    .catch((err) => {
      console.error("Error fetching grades:", err);
      res.status(500).send("Internal Server Error");
    });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
