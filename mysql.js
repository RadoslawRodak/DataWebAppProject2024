var mysql = require('mysql2');

var pool = mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2024Mysql' 
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

// Function to get a specific student by sid
const getStudentBySid = (sid) => {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM student WHERE sid = ?', [sid], (err, results) => { 
        if (err) reject(err);
        else resolve(results[0]); // Only return the first (and only) result
      });
    });
  };
  
  // Function to update a student's details
  const updateStudent = (sid, updatedData) => {
    return new Promise((resolve, reject) => {
      const { name, age } = updatedData;
      pool.query(
        'UPDATE student SET name = ?, age = ? WHERE sid = ?',
        [name, age, sid],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  };
  
  module.exports = { getStudents, getStudentBySid, updateStudent };