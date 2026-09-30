const express = require("express");
const router = express.Router();

const {
  getActividadesController,
  getActividadControllerById,
  postActividadController,
  putActividadController,
  deleteActividadController,
  getActividadesByCategoryController,
} = require("../controllers/actividades.controller");

const { patchUserPremium } = require("../controllers/users.controller");

const {
  getCategoriasController,
  findCategoriaControllerById,
  createCategoriaController,
  updateCategoriaController,
  deleteCategoriaController,
} = require("../controllers/categorias.controller");

const {
  getInscripcionesController,
  getInscripcionControllerById,
  postInscripcionController,
  deleteInscripcionController,
} = require("../controllers/inscripciones.controller");

const payloadMiddleWare = require("../middlewares/payload.middleware");
const { actividadValidation } = require("./validations/actividad.validation");
const { categoriaValidation } = require("./validations/categoria.validation");
const {
  inscripcionValidation,
} = require("./validations/inscripcion.validation");

// RUTAS PARA ACTIVIDADES
router.get("/actividades", getActividadesController);

router.get("/actividades/:id", getActividadControllerById);

router.get(
  "/actividades/categoria/:categoryId",
  getActividadesByCategoryController,
);

router.post(
  "/actividades",
  payloadMiddleWare(actividadValidation),
  postActividadController,
);

router.delete("/actividades/:id", deleteActividadController);

router.put(
  "/actividades/:id",
  payloadMiddleWare(actividadValidation),
  putActividadController,
);

//RUTAS PARA USUARIOS
router.patch("/usuarios/premium", patchUserPremium);

//RUTAS PARA CATEGORIAS
router.get("/categorias", getCategoriasController);

router.get("/categorias/:id", findCategoriaControllerById);
router.post(
  "/categorias",
  payloadMiddleWare(categoriaValidation),
  createCategoriaController,
);
router.put("/categorias/:id", updateCategoriaController);
router.delete("/categorias/:id", deleteCategoriaController);

//RUTAS INSCRIPCIONES
router.post(
  "/inscripciones",
  payloadMiddleWare(inscripcionValidation),
  postInscripcionController,
);

router.get("/inscripciones", getInscripcionesController);

router.get("/inscripciones/:id", getInscripcionControllerById);
router.delete("/inscripciones/:id", deleteInscripcionController);

module.exports = router;
