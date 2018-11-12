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

// function to return all timesheets for a given employee
const getAllTimesheets = (employeeId) => {
  // set up and return a promise
  return new Promise((resolve, reject) => {
    // run the db query
    db.all(`SELECT * FROM Timesheet WHERE employee_id = $id
      `, {$id: employeeId}, (err, rows) => {
      // check for an error
      if (err) {
        // create new error object
        const e = new Error('Timesheets not found!');
        e.status = 404; // set a status on it
        e.body = err; // add the err message as a body
        return reject(e); // return a rejected promise
      }
      // all was well, resolve the promise
      resolve(rows);
    });
  });
};

// function to return all timesheets for a given employee
const getAllMenuItems = (menuId) => {
  // set up and return a promise
  return new Promise((resolve, reject) => {
    // run the db query
    db.all(`SELECT * FROM MenuItem WHERE menu_id = $id
      `, {$id: menuId}, (err, rows) => {
      // check for an error
      if (err) {
        // create new error object
        const e = new Error('MenuItems not found!');
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

// add a new employee to the database
const addNewEmployee = (post) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO Employee (name,position,wage,is_current_employee) 
      VALUES ($name,$position,$wage,$is_current_employee)`, {
      $name: post.employee.name,
      $position: post.employee.position,
      $wage: post.employee.wage,
      $is_current_employee: post.employee.isCurrentEmployee,
    }, function(err) {
      if (err) {
      // create new error object
        const e = new Error('Employee not added!');
        e.status = 500; // set a status on it
        e.body = err; // add the err message as a body
        return reject(e); // return a rejected promise
      }
      // send back the new employee
      db.get('SELECT * FROM Employee WHERE id = $id', {$id: this.lastID},
          function(err, row) {
            if (err) {
            // create new error object
              const e = new Error('New employee not found!');
              e.status = 404; // set a status on it
              e.body = err; // add the err message as a body
              return reject(e); // return a rejected promise
            }
            resolve(row);
          });
    });
  });
};

// add a new menu to the database
const addNewMenu = (post) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO Menu (title) VALUES ($title)`, {
      $title: post.menu.title,
    }, function(err) {
      if (err) {
      // create new error object
        const e = new Error('Menu not added!');
        e.status = 500; // set a status on it
        e.body = err; // add the err message as a body
        return reject(e); // return a rejected promise
      }
      // send back the new menu
      db.get('SELECT * FROM Menu WHERE id = $id', {$id: this.lastID},
          function(err, row) {
            if (err) {
            // create new error object
              const e = new Error('New menu not found!');
              e.status = 404; // set a status on it
              e.body = err; // add the err message as a body
              return reject(e); // return a rejected promise
            }
            resolve(row);
          });
    });
  });
};

// add a new menu to the database
const addNewMenuItem = (post, menuId) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO MenuItem (name,description,inventory,price,menu_id)
     VALUES ($name,$description,$inventory,$price,$menu_id)`, {
      $name: post.menuItem.name,
      $description: post.menuItem.description,
      $inventory: post.menuItem.inventory,
      $price: post.menuItem.price,
      $menu_id: menuId,
    }, function(err) {
      if (err) {
      // create new error object
        const e = new Error('MenuItem not added!');
        e.status = 500; // set a status on it
        e.body = err; // add the err message as a body
        return reject(e); // return a rejected promise
      }
      // send back the new menu item
      db.get('SELECT * FROM MenuItem WHERE id = $id', {$id: this.lastID},
          function(err, row) {
            if (err) {
            // create new error object
              const e = new Error('New menu item not found!');
              e.status = 404; // set a status on it
              e.body = err; // add the err message as a body
              return reject(e); // return a rejected promise
            }
            resolve(row);
          });
    });
  });
};

// add a new timesheet to the database
const addNewTimesheet = (post, employeeId) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO Timesheet (hours,rate,date,employee_id)
     VALUES ($hours,$rate,$date,$employee_id)`, {
      $hours: post.timesheet.hours,
      $rate: post.timesheet.rate,
      $date: post.timesheet.date,
      $employee_id: employeeId,
    }, function(err) {
      if (err) {
      // create new error object
        const e = new Error('Timesheet not added!');
        e.status = 500; // set a status on it
        e.body = err; // add the err message as a body
        return reject(e); // return a rejected promise
      }
      // send back the new menu item
      db.get('SELECT * FROM Timesheet WHERE id = $id', {$id: this.lastID},
          function(err, row) {
            if (err) {
            // create new error object
              const e = new Error('New timesheet item not found!');
              e.status = 404; // set a status on it
              e.body = err; // add the err message as a body
              return reject(e); // return a rejected promise
            }
            resolve(row);
          });
    });
  });
};

// export the functions to be used elsewhere
module.exports = {getAllEmployees, getAllMenus, getAllTimesheets,
  getAllMenuItems, getById, addNewEmployee, addNewMenu, addNewMenuItem,
  addNewTimesheet};
