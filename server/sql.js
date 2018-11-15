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
      $is_current_employee: 1,
    }, function(err) {
      if (err) {
      // create new error object
        const e = new Error('Employee not added!');
        e.status = 400; // set a status on it
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
        e.status = 400; // set a status on it
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
        e.status = 400; // set a status on it
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
        e.status = 400; // set a status on it
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

const deleteById = (model, id) => {
  return new Promise((resolve, reject) => {
    // code to delete all models except employee
    if (model !== 'Employee') {
      db.run(`DELETE FROM ${model} WHERE id = ${id}`, (err) => {
        if (err) {
          // create new error object
          const e = new Error(`${model} not deleted!`);
          e.status = 500; // set a status on it
          e.body = err; // add the err message as a body
          return reject(e); // return a rejected promise
        }
        resolve();
      });
    // code to delete an employee
    } else {
      db.run(`UPDATE Employee SET is_current_employee = 0 
        WHERE id = ${id}`, (err) => {
        if (err) {
          // create new error object
          const e = new Error(`Employee not deleted!`);
          e.status = 500; // set a status on it
          e.body = err; // add the err message as a body
          return reject(e); // return a rejected promise
        }
        db.get(`SELECT * FROM Employee 
          WHERE id = ${id}`, (err, row) => {
          if (err) {
            // create new error object
            const e = new Error(`Deleted employee not found!`);
            e.status = 404; // set a status on it
            e.body = err; // add the err message as a body
            return reject(e); // return a rejected promise
          }
          resolve(row);
        });
      });
    }
  });
};

// function to update an employee in the db from a PUT
// request given the employee id
const updateEmployee = (put, id) => {
  // return a promise to do this
  return new Promise((resolve, reject) => {
    // run the slow async function
    db.run(`UPDATE Employee SET name = $name,
                  position = $position,
                  wage = $wage, 
                  is_current_employee = 1 
        WHERE id = $id`, {
      $name: put.employee.name,
      $position: put.employee.position,
      $wage: put.employee.wage,
      $id: id,
    }, (err) => {
      // handle errors
      if (err) {
        // create a new error object
        const error = new Error('Employee Not Updated');
        error.status = 400; // set error status
        error.body = err; // set error body
        return reject(error); // reject the promise and send back the error
      }
      // get the newly updated employee from the db
      db.get('SELECT * FROM Employee WHERE id = $id', {$id: id}, (err, row) =>{
      // handle any error
        if (err) {
        // create a new error object
          const error = new Error('Updated Employee Not Found');
          error.status = 404; // set error status
          error.body = err; // set error body
          return reject(error); // reject the promise and send back the error
        }
        // resolve the promise by sending the
        // updated issue back
        resolve(row);
      });
    });
  });
};

// function to update a menu in the db from a PUT
// request given the menu id
const updateMenu = (put, id) => {
  // return a promise to do this
  return new Promise((resolve, reject) => {
    // run the slow async function
    db.run(`UPDATE Menu SET title = $title
        WHERE id = $id`, {
      $title: put.menu.title,
      $id: id,
    }, (err) => {
      // handle errors
      if (err) {
        // create a new error object
        const error = new Error('Menu Not Updated');
        error.status = 400; // set error status
        error.body = err; // set error body
        return reject(error); // reject the promise and send back the error
      }
      // get the newly updated menu from the db
      db.get('SELECT * FROM Menu WHERE id = $id', {$id: id}, (err, row) =>{
      // handle any error
        if (err) {
        // create a new error object
          const error = new Error('Updated Menu Not Found');
          error.status = 404; // set error status
          error.body = err; // set error body
          return reject(error); // reject the promise and send back the error
        }
        // resolve the promise by sending the
        // updated issue back
        resolve(row);
      });
    });
  });
};

// function to update a timesheet in the db from a PUT
// request given the timesheet id
const updateTimesheet = (put, id, employeeId) => {
  // return a promise to do this
  return new Promise((resolve, reject) => {
    // run the slow async function
    db.run(`UPDATE Timesheet SET hours = $hours,
        rate = $rate,
        date = $date,
        employee_id = $employee_id
        WHERE id = $id`, {
      $hours: put.timesheet.hours,
      $rate: put.timesheet.rate,
      $date: put.timesheet.date,
      $employee_id: employeeId,
      $id: id,
    }, (err) => {
      // handle errors
      if (err) {
        // create a new error object
        const error = new Error('Timesheet Not Updated');
        error.status = 400; // set error status
        error.body = err; // set error body
        return reject(error); // reject the promise and send back the error
      }
      // get the newly updated timesheet from the db
      db.get('SELECT * FROM Timesheet WHERE id = $id', {$id: id}, (err, row) =>{
      // handle any error
        if (err) {
        // create a new error object
          const error = new Error('Updated Timesheet Not Found');
          error.status = 404; // set error status
          error.body = err; // set error body
          return reject(error); // reject the promise and send back the error
        }
        // resolve the promise by sending the
        // updated issue back
        resolve(row);
      });
    });
  });
};

// function to update a menuItem in the db from a PUT
// request given the menuItem id
const updateMenuItem = (put, id, menuId) => {
  // return a promise to do this
  return new Promise((resolve, reject) => {
    // run the slow async function
    db.run(`UPDATE MenuItem SET name = $name,
        description = $description,
        inventory = $inventory,
        price = $price,
        menu_id = $menu_id
        WHERE id = $id`, {
      $name: put.menuItem.name,
      $description: put.menuItem.description,
      $inventory: put.menuItem.inventory,
      $price: put.menuItem.price,
      $menu_id: menuId,
      $id: id,
    }, (err) => {
      // handle errors
      if (err) {
        // create a new error object
        const error = new Error('MenuItem Not Updated');
        error.status = 400; // set error status
        error.body = err; // set error body
        return reject(error); // reject the promise and send back the error
      }
      // get the newly updated menuItem from the db
      db.get('SELECT * FROM MenuItem WHERE id = $id', {$id: id}, (err, row) =>{
      // handle any error
        if (err) {
        // create a new error object
          const error = new Error('Updated MenuItem Not Found');
          error.status = 404; // set error status
          error.body = err; // set error body
          return reject(error); // reject the promise and send back the error
        }
        // resolve the promise by sending the
        // updated issue back
        resolve(row);
      });
    });
  });
};


// export the functions to be used elsewhere
module.exports = {getAllEmployees, getAllMenus, getAllTimesheets,
  getAllMenuItems, getById, addNewEmployee, addNewMenu, addNewMenuItem,
  addNewTimesheet, deleteById, updateEmployee, updateMenu,
  updateMenuItem, updateTimesheet};
