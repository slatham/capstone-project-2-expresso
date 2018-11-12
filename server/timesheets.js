/*
This file handles all the express routing for timesheets route
*/

// set up express
const express = require('express');
// define the timesheets router and merge request parameters
// from the parent employee router so we can access the employee
// id on say req.params.id
const timesheetsRouter = new express.Router({mergeParams: true});
// export it so it can be celled in the employee.js file
module.exports = timesheetsRouter;

// set up the menuItems router.  Menu has
// many menuItems.  Mount the router on the
// Menu id parameter
const menuItemsRouter = require('./menuItems');
menuItemsRouter.use('/:id/menu-items', menuItemsRouter);

// require the sql file with all the
// database functions
const db = require('./sql');

// router parameter function to parse id passed in all routes
timesheetsRouter.param('id', async (req, res, next, id) => {
  try {
    // try running async function
    const results = await db.getById('Timesheet', id);
    if (results) {
      // add the results onto the request object
      req.timesheetReturned = results;
      next();
    } else {
      // create new error object
      const e = new Error('Timesheet not found!');
      e.status = 404; // set a status on it
      return next(e); // return a rejected promise
    }
  } catch (e) {
    next(e); // catch any errors returned and forward to error handler
  };
});

// route to return all timesheets
timesheetsRouter.get('/', async (req, res, next) => {
  try {
    // run the async db function and wait for the promise to resolve
    const results = await db.getAllTimesheets(req.params.id);
    // send back the results
    return res.status(200).json({timesheets: results});
  } catch (e) {
    next(e); // catch any errors returned and forward to error handler
  }
});

// POST
timesheetsRouter.post('/', async (req, res, next) => {
  try {
    // try running async function
    const results = await db.addNewTimesheet(req.body, req.params.id);
    // return the results from the promise
    return res.status(201).json({timesheet: results});
  } catch (e) {
    next(e); // catch any errors returned and forward to error handler
  };
});

// PUT

// DELETE
