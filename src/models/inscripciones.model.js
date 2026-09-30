const mongoose = require("mongoose");
const inscripcionesSchema = require("./schemas/inscripciones.schema");

const Inscripcion = mongoose.model("Inscripcion", inscripcionesSchema);

module.exports=Inscripcion;