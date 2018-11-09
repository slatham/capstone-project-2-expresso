
/*
This file handles all the express routing for employees route
*/

// set up express
const express = require('express');
// define the employees router
const employeesRouter = new express.Router();
// export it so it can be celled in the api.js file
module.exports = employeesRouter;

// require the sql file with all the
// database functions
const db = require('./sql');

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
