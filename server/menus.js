
/*
This file handles all the express routing for employees route
*/

// set up express
const express = require('express');
// define the menus router
const menusRouter = new express.Router();
// export it so it can be celled in the api.js file
module.exports = menusRouter;

// set up the menuItems router.  menu has
// many menuItems.  mount the router on the
// menu id parameter
const menuItemsRouter = require('./menuItems');
menusRouter.use('/:id/menu-items', menuItemsRouter);

// require the sql file with all the
// database functions
const db = require('./sql');

// router parameter function to parse id passed in all routes
menusRouter.param('id', async (req, res, next, id) => {
  try {
    // try running async function
    const results = await db.getById('Menu', id);
    if (results) {
      // add the results onto the request object
      req.menuReturned = results;
      next();
    } else {
      // create new error object
      const e = new Error('Menu not found!');
      e.status = 404; // set a status on it
      e.body = err; // add the err message as a body
      return next(e); // return a rejected promise
    }
  } catch (e) {
    next(e); // catch any errors returned and forward to error handler
  };
});

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

// route to get a menu by id.
menusRouter.get('/:id', (req, res, next) => {
  // return the menu pulled using the router parameter function
  res.status(200).json({menu: req.menuReturned});
});

// POST

// PUT

// DELETE
