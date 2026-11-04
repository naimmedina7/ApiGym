const {
  findUserByUsername,
  findUserById,
  cambiarPlanUsuario,
} = require("../repositories/user.repository");

const getCurrentUser = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no existente" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al obtener el usuario.",
      error: error.message,
    });
  }
};

const patchUserPremium = async (req, res) => {
  const { username } = req.user;

  try {
    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(400).json({ message: "Usuario no existente" });
    }

    if (user.premium) {
      return res.status(400).json({ message: "El usuario ya es premium" });
    }

    // Actualizamos el plan llamando a la función del repositorio
    const updatedUser = await cambiarPlanUsuario(username);

    return res.status(200).json({
      message: "Usuario actualizado a premium con éxito",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Error al actualizar el usuario.", 
      error: error.message 
    });
  }
};


const getInformacionUsuarioById = async (req, res) => {
  const userId = req.params.id;
  const { id } = req.user;
  try {
    const inscripcion = await findUsuarioById(userId, id);
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




module.exports = {
  getCurrentUser,
  patchUserPremium
};