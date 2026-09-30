const { findUserByUsername, cambiarPlanUsuario } = require("../repositories/user.repository");

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

module.exports = {
  patchUserPremium
};