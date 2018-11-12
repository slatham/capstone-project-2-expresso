
/*
This file handles all the express routing for employees route
*/

// set up express
const express = require('express');
// define the employees router
const employeesRouter = new express.Router();
// export it so it can be celled in the api.js file
module.exports = employeesRouter;

// set up the timesheets router.  Employee has
// many timesheets.  mount the router on the
// employee id parameter
const timesheetsRouter = require('./timesheets');
employeesRouter.use('/:id/timesheets', timesheetsRouter);

// require the sql file with all the
// database functions
const db = require('./sql');
// import helper functions
const hlp = require('./helperFunctions');

// router parameter function to parse id passed in all routes
employeesRouter.param('id', async (req, res, next, id) => {
  try {
    // try running async function
    const results = await db.getById('Employee', id);
    if (results) {
      // add the results onto the request object
      req.employeeReturned = results;
      next();
    } else {
      // create new error object
      const e = new Error('Employee not found!');
      e.status = 404; // set a status on it
      return next(e); // return a rejected promise
    }
  } catch (e) {
    next(e); // catch any errors returned and forward to error handler
  };
});

// route to return all employees
employeesRouter.get('/', async (req, res, next) => {
  try {
    // run the async db function and wait for the promise to resolve
    const results = await db.getAllEmployees();
    // send back the results
    return res.status(200).json({employees: results});
  } catch (e) {
    next(e); // catch any errors returned and forward to error handler
  }
});

// route to get an individual employee.
employeesRouter.get('/:id', (req, res, next) => {
  // return the employee pulled using the router parameter function
  res.status(200).json({employee: req.employeeReturned});
});

// POST
employeesRouter.post('/', async (req, res, next) => {
  try {
    // try running async function
    const results = await db.addNewEmployee(req.body);
    // return the results from the promise
    return res.status(201).json({employee: results});
  } catch (e) {
    next(e); // catch any errors returned and forward to error handler
  };
});

// PUT

// DELETE
