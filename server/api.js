/*
Base router, pull other routers in from here
*/

// set up express
const express = require('express');

// set up the api router and export it so as it can be imported and
// used in the server.js file -- i.e. the starting point for the app
const apiRouter = new express.Router();
module.exports = apiRouter;
// set up routers for employees and menus
const employeesRouter = require('./employees');
const menusRouter = require('./menus');
// mount these routes on the apiRouter
apiRouter.use('/employees', employeesRouter);
apiRouter.use('/menus', menusRouter);
