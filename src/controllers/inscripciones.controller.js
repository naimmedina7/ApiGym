const {
  findInscripcionById,
  getInscripcionesPaginated,
  createInscripcion,
  deleteInscripcionById,
} = require("../repositories/inscripciones.repository");

const sendSMS = require("../services/sms.service");

const getInscripcionesController = async (req, res) => {
  const { id } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const result = await getInscripcionesPaginated(id, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error al obtener las inscripciones.",
        error: error.message,
      });
  }
};

const getInscripcionControllerById = async (req, res) => {
  const inscripcionId = req.params.id;
  const { id } = req.user;
  try {
    const inscripcion = await findInscripcionById(inscripcionId, id);
    if (inscripcion) {
      res.status(200).json(inscripcion);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error al obtener la inscripción.",
        error: error.message,
      });
  }
};

const postInscripcionController = async (req, res) => {
  const userId = req.user.id;

  const { activityId, date, activityName } = req.body;

  try {
    await createInscripcion(userId, activityId, date);
    res.status(201).json({
      message: "Inscripcion creada correctamente",
    });
    try {
      await sendSMS(
        process.env.ADMIN_PHONE_NUMBER,
        `Hola Naim, un usuario se ha inscrito a la actividad con ID: ${activityName} en la fecha: ${date}.`,
      );
    } catch (error) {
      console.error("No se pudo enviar el SMS:", error.code, error.message);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error al crear la inscripción.",
        error: error.message,
      });
  }
};

const deleteInscripcionController = async (req, res) => {
  const inscripcionId = req.params.id;
  const { id } = req.user;

  try {
    const deleted = await deleteInscripcionById(inscripcionId, id);
    if (deleted.deletedCount === 1) {
      res.status(204).send();
    } else {
      res.status(404).json({
        message: `Inscripción no encontrada`,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error al eliminar la inscripción.",
        error: error.message,
      });
  }
};

module.exports = {
  getInscripcionesController,
  getInscripcionControllerById,
  postInscripcionController,
  deleteInscripcionController,
};
