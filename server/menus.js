
/*
This file handles all the express routing for menus route
*/

// set up express
const express = require('express');
// define the menus router
const menusRouter = new express.Router();
// export it so it can be celled in the api.js file
module.exports = menusRouter;

// set up the menuItems router.  menu has
// many menuItems.  Mount the router on the
// menu id parameter
const menuItemsRouter = require('./menuItems');
menusRouter.use('/:id/menu-items', menuItemsRouter);

// require the sql file with all the
// database functions
const db = require('./sql');
// import helper functions
const hlp = require('./helperFunctions');

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

// POST route to create a new menu.  Checks valid in[put first]
menusRouter.post('/', hlp.checkValidInput, async (req, res, next) => {
  try {
    // try running async function
    const results = await db.addNewMenu(req.body);
    // return the results from the promise
    return res.status(201).json({menu: results});
  } catch (e) {
    next(e); // catch any errors returned and forward to error handler
  };
});

// PUT route to update a menu given its id, checks for valid input first
menusRouter.put('/:id', hlp.checkValidInput, async (req, res, next) => {
  try {
    // try the promise and wait for it to return
    const results = await db.updateMenu(req.body, req.menuReturned.id);
    // return the results
    return res.status(200).json({menu: results});
  } catch (e) {
    // send the error to the error handler middle-ware
    next(e);
  }
});

// Route to delete a menu if there are no menuItems associated
menusRouter.delete('/:id', async (req, res, next) => {
  try {
    // get the menu items for this menu (if there are any)
    menuItems = await db.getAllMenuItems(req.menuReturned.id);
    // if there are no menu items we can delete the menu
    if (menuItems.length === 0) {
      // try running async function
      const results = await db.deleteById('Menu', req.menuReturned.id);
      // return the results from the promise
      return res.status(204).json({menu: results});
    } else {
      // create new error object
      const e = new Error('Menu has manuItem.  Can not delete!');
      e.status = 400; // set a status on it
      return next(e); // return a rejected promise
    }
  } catch (e) {
    next(e); // catch any errors returned and forward to error handler
  };
});
