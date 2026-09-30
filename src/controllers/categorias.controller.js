const {
  findCategoryById,
  findAllCategories,
  createCategory,
  deleteCategoryById,
  updateCategoryById,
} = require("../repositories/category.repository");

const getCategoriasController = async (req, res) => {
  try {
    res.status(200).json(await findAllCategories());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las categorías.", error: error.message });
  }
};

const findCategoriaControllerById = async (req, res) => {
  try {
    const categoria = await findCategoryById(req.params.id);
    if (categoria) {
      res.status(200).json(categoria);
    } else {
      res.status(404).json({
        message: `Categoría no encontrada`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la categoría.", error: error.message });
  }
};

const createCategoriaController = async (req, res) => {
  const role = req.user.role;
  if (role !== "admin") {
    return res.status(403).json({
      message:
        "Acceso denegado. Solo los administradores pueden crear categorías.",
    });
  }

  try {
    const { name } = req.body;
    const newCategoria = await createCategory(name);
    res.status(201).json(newCategoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la categoría.", error: error.message });
  }
};

const updateCategoriaController = async (req, res) => {
  const id = req.params.id;
  const role = req.user.role;
  if (role !== "admin") {
    return res.status(403).json({
      message:
        "Acceso denegado. Solo los administradores pueden actualizar categorías.",
    });
  }

  try {
    const updated = await updateCategoryById(id, req.body);
    if (updated) {
      res.status(200).json(updated);
    } else {
      res.status(404).json({
        message: `Categoría no encontrada`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la categoría.", error: error.message });
  }
};

const deleteCategoriaController = async (req, res) => {
  const role = req.user.role;
  if (role !== "admin") {
    return res.status(403).json({
      message:
        "Acceso denegado. Solo los administradores pueden eliminar categorías.",
    });
  }

  try {
    const deleted = await deleteCategoryById(req.params.id);
    if (deleted.deletedCount === 1) {
      res.status(204).send();
    } else {
      res.status(404).json({
        message: `Actividad no encontrada`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la categoría.", error: error.message });
  }
};

module.exports = {
  getCategoriasController,
  findCategoriaControllerById,
  createCategoriaController,
  updateCategoriaController,
  deleteCategoriaController,
};
