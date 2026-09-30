const Joi = require("joi");

const actividadValidation = Joi.object({
  name: Joi.string().min(3).max(50).trim().required(),
  categoryId: Joi.string().hex().length(24).required(),
  description: Joi.string().min(5).max(255).trim(),
  date: Joi.date().iso().required(), // Acepta formatos de fecha válidos (incluyendo YYYY-MM-DD o YYYY/MM/DD)
  schedule: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/) // Valida formato de hora "HH:MM" (ej: "9:30" o "14:15")
    .required(),
});

module.exports = { actividadValidation };
