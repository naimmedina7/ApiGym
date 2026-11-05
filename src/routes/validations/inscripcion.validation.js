const Joi = require("joi");

const inscripcionValidation = Joi.object({
  //s userId: Joi.string().hex().length(24).required(),
  activityId: Joi.string().hex().length(24).required(),
  date: Joi.date().required(),
  activityName: Joi.string(),
});

const inscripcionDateValidation = Joi.object({
  date: Joi.date().required(),
});

module.exports = { inscripcionValidation, inscripcionDateValidation };
