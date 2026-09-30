const Joi = require("joi");

const inscripcionValidation = Joi.object({
  //s userId: Joi.string().hex().length(24).required(),
  activityId: Joi.string().hex().length(24).required(),
  date: Joi.date().required(),
  activityName: Joi.string(),
});

module.exports = { inscripcionValidation };
