const mysql = require('mysql');

// Create the connection pool
const pool = mysql.createPool({
  connectionLimit: 3,
  host: "localhost",
  user: "root",
  password: "root",
  database: "proj2024Mysql"
});

// Function to get all students
var getStudents = function () {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM student", (error, results) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log(results);
        resolve(results);
      }
    });
  });
};


// Function to get a student by sid
const getStudentBySid = (sid) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM student WHERE sid = ?", [sid], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]); // Return only the first result (1 student)
        }
      });
    });
  };
  
  // Function to add a student
  const addStudent = (sid, name, age) => {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO student (sid, name, age) VALUES (?, ?, ?)";
      pool.query(query, [sid, name, age], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };
  
  // Function to update a student's data
  const updateStudent = (sid, { name, age }) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE student SET name = ?, age = ? WHERE sid = ?",
        [name, age, sid],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  };
  
  // Export functions for use in other parts of the app
  module.exports = { getStudents, getStudentBySid, addStudent, updateStudent };
