const express = require('express');
const { getStudents, getStudentBySid, updateStudent } = require('./mysql'); // Import the getStudents function
const app = express();
const bodyParser = require('body-parser')
const port = 3004;
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));


// Homepage (GET /)
app.get('/', (req, res) => {
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
app.get('/students', (req, res) => {
    getStudents()
        .then((students) => {
            // Render 'student.ejs' with the fetched students data
            res.render('student', { students: students });
        })
        .catch((err) => {
            res.status(500).send('Error fetching students');
            console.error(err);
        });
});


// Route to display the update form for a specific student
app.get('/update-student/:sid', (req, res) => {
    const sid = req.params.sid;
    getStudentBySid(sid) // Fetch student by sid
      .then((student) => {
        if (!student) {
          return res.status(404).send('Student not found');
        }
        res.render('update-student', { student, errors: [] });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error fetching student details.');
      });
  });
  
  // Route to handle the form submission and update the student
  app.post('/update-student/:sid', (req, res) => {
    const sid = req.params.sid;  // Get the SID from the URL
    const { name, age } = req.body;  // Get the new name and age from the form input
  
    // Validation logic
    let errors = [];
    if (!name || name.length < 2) {
      errors.push('Student Name should be at least 2 characters');
    }
    if (!age || age < 18) {
      errors.push('Student Age should be at least 18');
    }
  
    // If validation fails, re-render the form with errors
    if (errors.length > 0) {
      return res.render('update-student', { student: { sid, name, age }, errors });
    }
  
    // If validation passes, update the student in the database
    updateStudent(sid, { name, age })
      .then(() => {
        res.redirect('/students');  // Redirect to the students list after update
      })
      .catch(err => res.status(500).send('Error updating student details'));
  });


// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
