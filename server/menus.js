
/*
This file handles all the express routing for employees route
*/

// set up express
const express = require('express');
// define the menus router
const menusRouter = new express.Router();
// export it so it can be celled in the api.js file
module.exports = menusRouter;

// require the sql file with all the
// database functions
const db = require('./sql');

// route to return all menus
menusRouter.get('/', async (req, res, next) => {
  try {
    // run the async db function and wait for the promise to resolve
    const results = await db.getAllMenus();
    // send back the results
    return res.status(200).json({menus: results});
  } catch (e) {
    next(e); // catch any errors returned and forward to error handler
  }
});
