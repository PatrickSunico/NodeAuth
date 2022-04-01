/* 
    @title - 404 Handler 
    @desc - Handles 404 Routes which does not exist
*/

exports.handle404 = async (req, res, next) => {
 next({ message: "Not found", status: 404 });
};

/* 
    @title - Handles Errors Globally 
    @desc - Handles all errors from within the api controllers
    @usage - takes in an error object which consists of error: {message, status} 
*/

exports.handleErrors = async (errorMessages, req, res, next) => {
 if (errorMessages) {
  const error = {
   ...errorMessages,
   status: 403,
  };

  res.status(error.status || 500);
  res.send(error);
 }
};
