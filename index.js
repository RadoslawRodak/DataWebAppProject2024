const express = require('express');
const { getStudents, getStudentBySid, updateStudent } = require('./mysql'); // Import the getStudents function
const app = express();
const bodyParser = require('body-parser')
const port = 3004;
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));  // Use body-parser to handle URL-encoded data

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
    const sid = req.params.sid; // sid instead of id
  
    getStudentBySid(sid) // Fetch student by sid
      .then((student) => {
        res.render('update-student', { student }); // Render the update form with student data
      })
      .catch((error) => {
        res.status(500).send("Error fetching student details");
      });
  });
  
  // Route to handle the form submission and update the student
  app.post('/update-student/:sid', (req, res) => {
    const sid = req.params.sid; // sid from URL
    const { name, age } = req.body; // Get the updated data from the form
  
    updateStudent(sid, { name, age }) // Call the function to update the database
      .then(() => {
        res.redirect('/students'); // Redirect back to the students list after update
      })
      .catch((error) => {
        res.status(500).send("Error updating student details");
      });
  });


// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
