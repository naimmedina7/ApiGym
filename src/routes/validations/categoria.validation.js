const Joi = require("joi");

const categoriaValidation = Joi.object({
  name: Joi.string().min(1).max(50).trim().required(),
});

module.exports = { categoriaValidation };
