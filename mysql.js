const mysql = require('mysql2');

// Create the connection pool
const pool = mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2024Mysql'
});

// Function to get all students (returns a promise)
const getStudents = () => {
    return pool.promise().query('SELECT * FROM student')  // Using promise() for queries
        .then(([rows, fields]) => {
            return rows;  // Return the student data (rows)
        })
        .catch((error) => {
            console.log(error);
            throw error;  // Throw the error if any
        });
};

// Function to get a specific student by sid (returns a promise)
const getStudentBySid = (sid) => {
    return pool.promise().query('SELECT * FROM student WHERE sid = ?', [sid])
        .then(([rows, fields]) => {
            return rows[0];  // Return the first result (only one student expected)
        })
        .catch((error) => {
            console.log(error);
            throw error;  // Throw the error if any
        });
};

// Function to update a student's details (returns a promise)
const updateStudent = (sid, updatedData) => {
    const { name, age } = updatedData;
    return pool.promise().query(
        'UPDATE student SET name = ?, age = ? WHERE sid = ?',
        [name, age, sid]
    )
    .then(([results]) => {
        return results;  // Return the results of the update query
    })
    .catch((error) => {
        console.log(error);
        throw error;  // Throw the error if any
    });
};


// Function to add a new student
const addStudent = (studentData) => {
  const { sid, name, age } = studentData;
  return pool.promise().query(
      'INSERT INTO student (sid, name, age) VALUES (?, ?, ?)',
      [sid, name, age]
  )
  .then(([results]) => {
      return results;
  })
  .catch((error) => {
      console.log(error);
      throw error;
  });
};

// Export the functions to be used in other files
module.exports = { getStudents, getStudentBySid, updateStudent, addStudent };
