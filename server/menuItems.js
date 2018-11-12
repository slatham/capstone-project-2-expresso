/*
This file handles all the express routing for menuItems route
*/

// set up express
const express = require('express');
// define the menuItems router and merge request parameters
// from the parent menus router so we can access the menu
// id on say req.params.id
const menuItemsRouter = new express.Router({mergeParams: true});
// export it so it can be celled in the menu.js file
module.exports = menuItemsRouter;

// require the sql file with all the
// database functions
const db = require('./sql');

// router parameter function to parse id passed in all routes
menuItemsRouter.param('id', async (req, res, next, id) => {
  try {
    // try running async function
    const results = await db.getById('MenuItem', id);
    if (results) {
      // add the results onto the request object
      req.menuItemReturned = results;
      next();
    } else {
      // create new error object
      const e = new Error('MenuItem not found!');
      e.status = 404; // set a status on it
      return next(e); // return a rejected promise
    }
  } catch (e) {
    next(e); // catch any errors returned and forward to error handler
  };
});

// route to return all menuItems
menuItemsRouter.get('/', async (req, res, next) => {
  try {
    // run the async db function and wait for the promise to resolve
    const results = await db.getAllMenuItems(req.menuReturned.id);
    // send back the results
    return res.status(200).json({menuItems: results});
  } catch (e) {
    next(e); // catch any errors returned and forward to error handler
  }
});

// POST
menuItemsRouter.post('/', async (req, res, next) => {
  try {
    // try running async function
    const results = await db.addNewMenuItem(req.body, req.menuReturned.id);
    // return the results from the promise
    return res.status(201).json({menuItem: results});
  } catch (e) {
    next(e); // catch any errors returned and forward to error handler
  };
});

// PUT

// DELETE
