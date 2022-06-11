const {
  validateRouter,
  handlerError,
} = require('../../utils/response_handler');

const validate = async (req, res, next) => {
  // validate the input parameters
  const validate = validateRouter(req);
  // handle the error, stop
  if (validate) {
    return handlerError(req, res, validate);
  }
  return next();
};

module.exports = validate;
