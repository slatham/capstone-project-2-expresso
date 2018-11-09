/*
Starting point for the app.  Run this with node server.js
to start the app running.
=========================================================
*/
// set up express
const express = require('express');
const app = express();

/*
Middle-ware packages can be defined here.
----------------------------------------
*/
// require and use the body parser middle-ware
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// middle-ware for handling CORS
const cors = require('cors');
app.use(cors());
// verbose logging middle-ware
const morgan = require('morgan');
app.use(morgan('dev'));
// custom error handler middle-ware
app.use(function(error, req, res, next) {
  console.log(error);
  res.status(error.status).json({message: error.message});
});

/*
Set up base api router here.
----------------------------
*/
// require the router from another file
const apiRouter = require('./server/api');
// mount the router at the start of /api route
app.use('/api', apiRouter);

/*
Set up the server
-----------------
*/
// configure the port to listen on
const PORT = process.env.PORT || 4000;

// start the server on the port
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// export app for testing suite to access
module.exports = app;
