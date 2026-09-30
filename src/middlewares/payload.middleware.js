const payloadMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Validation error",
        message: error.details.map((err) => err.message),
      });
    }
    return next();
  };
};

module.exports = payloadMiddleware;
