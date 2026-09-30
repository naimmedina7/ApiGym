const {
  getActividadesPaginated,
  findActividadById,
  createActividad,
  deleteActividadById,
  updateActividadById,
  getActividadesByCategoryIdPagineted,
} = require("../repositories/actividad.repository");

const { askGeminiFlash } = require("../services/gemini.service");

const DEFAULT_ACTIVITY_DESCRIPTION =
  "Una actividad para moverte, entrenar y mejorar tu bienestar.";

const getActividadesController = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  try {
    const result = await getActividadesPaginated(page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener las actividades.",
      error: error.message,
    });
  }
};

const getActividadControllerById = async (req, res) => {
  try {
    const actividad = await findActividadById(req.params.id);
    if (actividad) {
      res.status(200).json(actividad);
    } else {
      res.status(404).json({
        message: `Actividad no encontrada`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener la actividad.",
      error: error.message,
    });
  }
};

const getActividadesByCategoryController = async (req, res) => {
  const categoryId = req.params.categoryId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  try {
    const actividades = await getActividadesByCategoryIdPagineted(
      categoryId,
      page,
      limit,
    );
    res.status(200).json(actividades);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener las actividades por categoría.",
      error: error.message,
    });
  }
};

const postActividadController = async (req, res) => {
  const role = req.user.role;
  if (role !== "admin") {
    return res.status(403).json({
      message:
        "Acceso denegado. Solo los administradores pueden crear actividades.",
    });
  }

  const { name, categoryId, date, schedule } = req.body;
  try {
    const prompt = `Crea una descripción atractiva y breve (100 caracteres máximo) para la actividad "${name}", con la fecha ${date} y horario ${schedule}. La descripción debe ser clara, concisa y motivadora, destacando los beneficios y características de la actividad.`;

    let generatedDescription = DEFAULT_ACTIVITY_DESCRIPTION;
    try {
      const geminiResponse = await askGeminiFlash(prompt);
      const parts = geminiResponse?.candidates?.[0]?.content?.parts || [];
      generatedDescription =
        parts.find((part) => part.text)?.text || DEFAULT_ACTIVITY_DESCRIPTION;
    } catch (error) {
      console.error(
        "Error al generar la descripción con Gemini:",
        error.message,
      );
    }

    await createActividad(
      name,
      categoryId,
      generatedDescription,
      date,
      schedule,
    );

    res.status(201).json({
      message: "Actividad creada correctamente",
    });
  } catch (error) {
    if (error.message === "Ya existe una actividad con ese nombre.") {
      return res.status(409).json({ message: error.message });
    }

    console.error(error);
    res
      .status(500)
      .json({ message: "Error al crear la actividad.", error: error.message });
  }
};

const putActividadController = async (req, res) => {
  const id = req.params.id;
  const role = req.user.role;
  if (role !== "admin") {
    return res.status(403).json({
      message:
        "Acceso denegado. Solo los administradores pueden crear actividades.",
    });
  }

  try {
    const updated = await updateActividadById(id, req.body);
    if (updated) {
      res.status(200).json(updated);
    } else {
      res.status(404).json({
        message: `Actividad no encontrada`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar la actividad.",
      error: error.message,
    });
  }
};

const deleteActividadController = async (req, res) => {
  const role = req.user.role;
  if (role !== "admin") {
    return res.status(403).json({
      message:
        "Acceso denegado. Solo los administradores pueden crear actividades.",
    });
  }

  try {
    const deleted = await deleteActividadById(req.params.id);
    if (deleted.deletedCount === 1) {
      res.status(204).send();
    } else {
      res.status(404).json({
        message: `Actividad no encontrada`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al eliminar la actividad.",
      error: error.message,
    });
  }
};

module.exports = {
  getActividadesController,
  getActividadControllerById,
  postActividadController,
  putActividadController,
  deleteActividadController,
  getActividadesByCategoryController,
};
