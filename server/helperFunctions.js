
// function to validate fields on post and put requests
const checkValidInput = (req, res, next) => {
  // define what valid fields are required for each model
  // and what type they should be
  const requiredFields = {
    'employee': {
      'name': 'string',
      'position': 'string',
      'wage': 'number',
    },
    'menu': {
      'title': 'string',
    },
    'timesheet': {
      'hours': 'number',
      'rate': 'number',
      'date': 'number',
    },
    'menuItem': {
      'name': 'string',
      'description': 'string',
      'inventory': 'number',
      'price': 'number',
    },
  };
  // determine the current model to check - employee, menu,
  // timesheet or menuItems based on the req.body
  const model = Object.keys(req.body)[0];
  // get the required fields for this current model
  const fields = requiredFields[model];
  // loop through each of the fields required
  // for this model and check if they exist
  Object.keys(fields).forEach((requiredField) => {
    // check if all the required fields exist in the POST / PUT
    if (!Object.keys(req.body[model]).includes(requiredField)) {
      // create new error object
      const e = new Error(`${requiredField} field not supplied`);
      e.status = 400; // set a status on it
      e.body = 'Validation Failed';
      return next(e); // send the error to the error handler
    } else {
      // field must have been found, so check it is of the correct type
      // if field should be a number, check it
      if (requiredFields[model][requiredField] === 'number') {
        // if not a number send the error
        if (isNaN(req.body[model][requiredField])) {
          // create new error object
          const e = new Error(`${requiredField} field is not a number`);
          e.status = 400; // set a status on it
          e.body = 'Validation Failed';
          next(e); // send the error to the error handler
        }
      // check if it is a valid string
      } else if (requiredFields[model][requiredField] === 'string') {
        // if not a string raise an error
        if (typeof req.body[model][requiredField] !== 'string') {
          // create new error object
          const e = new Error(`${requiredField} field is wrong type`);
          e.status = 400; // set a status on it
          e.body = 'Validation Failed';
          next(e); // send the error to the error handler
        }
      }
    }
  });

  // no issues with validation, onwards!
  next();
};

module.exports = {checkValidInput};
