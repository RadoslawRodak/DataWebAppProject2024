var mysql = require('mysql2');

var pool = mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2024Mysql'  // Your MySQL database name
});

var getStudents = function () {
    return pool.promise().query('SELECT * FROM student')  // Using promise() for queries
        .then(([rows, fields]) => {
            return rows;  // Return the student data (rows)
        })
        .catch((error) => {
            console.log(error);
            throw error;  // Throw the error if any
        });
};

module.exports = { getStudents };
