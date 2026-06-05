// Input validation middleware

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(e => ({
          field: e.path[0],
          message: e.message
        }))
      });
    }
    
    req.body = value;
    next();
  };
};

module.exports = { validateRequest };
