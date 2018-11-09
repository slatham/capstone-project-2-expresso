/*
File contains all function to interact with the database
*/

// set up sqlite3
const sqlite3 = require('sqlite3');
const testdb = process.env.TEST_DATABASE;
const db = new sqlite3.Database(testdb || './database.sqlite');

// function to return all employed employees
const getAllEmployees = () => {
  // set up and return a promise
  return new Promise((resolve, reject) => {
    // run the db query
    db.all(`SELECT * FROM Employee 
      WHERE is_current_employee = 1`, (err, rows) => {
      // check for an error
      if (err) {
        // create new error object
        const e = new Error('Employees not found!');
        e.status = 404; // set a status on it
        e.body = err; // add the err message as a body
        return reject(e); // return a rejected promise
      }
      // all was well, resolve the promise
      resolve(rows);
    });
  });
};

// function to return all menus
const getAllMenus = () => {
  // set up and return a promise
  return new Promise((resolve, reject) => {
    // run the db query
    db.all(`SELECT * FROM Menu`, (err, rows) => {
      // check for an error
      if (err) {
        // create new error object
        const e = new Error('Menus not found!');
        e.status = 404; // set a status on it
        e.body = err; // add the err message as a body
        return reject(e); // return a rejected promise
      }
      // all was well, resolve the promise
      resolve(rows);
    });
  });
};

const getById = (model, id) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM ${model} WHERE id = ${id}`, (err, row) => {
      if (err) {
        // create new error object
        const e = new Error('Item not found!');
        e.status = 404; // set a status on it
        e.body = err; // add the err message as a body
        return reject(e); // return a rejected promise
      }
      // all is well resolve the promise
      resolve(row);
    });
  });
};


// export the functions to be used elsewhere
module.exports = {getAllEmployees, getAllMenus, getById};
