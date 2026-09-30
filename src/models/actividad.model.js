const mongoose = require("mongoose");
const actividadSchema = require("./schemas/actividad.schema");

const Actividad = mongoose.model("Actividad", actividadSchema);

module.exports=Actividad;