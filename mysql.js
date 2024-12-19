const mysql = require("mysql");

// Create the connection pool
const pool = mysql.createPool({
  connectionLimit: 3,
  host: "localhost",
  user: "root",
  password: "root",
  database: "proj2024Mysql",
});

// Function to get all students
const getStudents = function () {
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
const addStudent = (sid, { name, age }) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO student (sid, name, age) VALUES (?, ?, ?)",
      [sid, name, age],
      (err, results) => {
        if (err) {
          console.log("Database Error:", err); // Log the error for debugging
          reject(err); // Reject with the error if something goes wrong
        } else {
          resolve(results); // Resolve if the insert is successful
        }
      }
    );
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

const getGradesData = () => {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT 
          student.name AS student_name,
          module.name AS module_name,
          grade.grade AS grade
        FROM 
          student
        LEFT JOIN 
          grade ON student.sid = grade.sid
        LEFT JOIN 
          module ON grade.mid = module.mid
        ORDER BY 
          student.name ASC, grade ASC;
      `;

    pool.query(query, (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const lecturerExists = function (lec_id) {
  return new Promise((resolve, reject) => {
    pool.query(
    "SELECT * FROM module WHERE lecturer = ?",
      [lec_id],
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
module.exports = {
  getStudents,
  getStudentBySid,
  addStudent,
  updateStudent,
  getGradesData,
  lecturerExists
};
