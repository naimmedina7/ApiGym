const Inscripcion = require("../models/inscripciones.model");
const User = require("../models/user.model");
const Actividad = require("../models/actividad.model");

const findInscripcionById = async (inscripcionId, userId) => {
  return await Inscripcion.findOne({
    _id: inscripcionId,
    userId: userId,
  }).select("userId activityId date _id");
};

const createInscripcion = async (userId, activityId, date) => {
  const countInscriptions = await Inscripcion.countDocuments({
    userId: userId,
  });

  const userInscription = await User.findById(userId);

  const existingInscripcion = await Inscripcion.findOne({
    userId: userId,
    activityId: activityId,
  });

  const existingActividad = await Actividad.findById(activityId);

  if (existingInscripcion) {
    throw new Error("El usuario ya está inscrito en esta actividad.");
  }

  if (!existingActividad) {
    throw new Error("La actividad especificada no existe.");
  }

  if (
    (!userInscription.premium && countInscriptions < 4) ||
    userInscription.premium
  ) {
    const newInscripcion = new Inscripcion({
      userId: userId,
      activityId: activityId,
      date: date,
    });

    return await newInscripcion.save();
  } else {
    throw new Error(
      "Los usuarios no premium solo pueden inscribirse a un máximo de 4 actividades.",
    );
  }
};

const deleteInscripcionById = async (inscripcionId, userId) => {
  return await Inscripcion.deleteOne({ _id: inscripcionId, userId: userId });
};

const getInscripcionesPaginated = async (userId, page = 1, limit = 5) => {
  const skip = (page - 1) * limit;

  const [inscripciones, total] = await Promise.all([
    Inscripcion.find({ userId }).skip(skip).limit(limit),
    Inscripcion.countDocuments({ userId }),
  ]);

  return {
    data: inscripciones,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

module.exports = {
  findInscripcionById,

  getInscripcionesPaginated,
  createInscripcion,
  deleteInscripcionById,
};
