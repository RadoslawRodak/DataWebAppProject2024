const express = require('express');
const { getStudents } = require('./mysql'); // Import the getStudents function
const app = express();
const port = 3004;
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

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


// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
