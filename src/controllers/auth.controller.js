const {
  findUserByUsername,
  saveUser,
} = require("../repositories/user.repository");
const { isValidPassword } = require("../utils/validatePassword");
const jwt = require("jsonwebtoken");

const cloudinary = require("../config/cloudinary.config");
const { uploadBufferToCloudinary } = require("../utils/cloudinary.util");

const postAuthLogin = async (req, res) => {
  try {
    const { body } = req;
    const { username, password } = body;
    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(400).json({ message: "Credenciales invalidas" });
    }

    const isValidPass = await isValidPassword(password, user.password);

    if (!isValidPass) {
      return res.status(400).json({ message: "Credenciales invalidas" });
    }

    const userId = user._id.toString();

    const token = jwt.sign(
      { id: userId, username: user.username, role: user.role },
      process.env.AUTH_SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.json({ token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ocurrio un error al iniciar sesión.",
      error: error.message,
    });
  }
};

const postAuthSignup = async (req, res) => {
  const { body } = req;
  const { username, name, password, telefono } = body;

  const user = await findUserByUsername(username);
  console.log("usuario encontrado: ", user);

  if (user) {
    return res.status(400).json({ message: "Nombre de usuario ya en uso" });
  }

  // Bloque de subida a Cloudinary
  try {
    //req.file
    if (!req.file) {
      return res.status(400).json({ error: "No se subio ningun archivo" });
    }
    const folder = req.body?.folder || "uploads";

    const result = await uploadBufferToCloudinary(cloudinary, req.file.buffer, {
      resource_type: "auto",
      folder,
    });

    const avatarUrl = result.secure_url;

    await saveUser(name, username, password, telefono, avatarUrl);

    return res.status(201).json({
      message: "Usuario creado correctamente",
      url: result.secure_url,
      folder: result.folder,
    });
  } catch (error) {
    console.error("Error al subir la imagen: ", error);
    return res.status(500).json({ error: "Error al subir imagen" });
  }
};

module.exports = {
  postAuthLogin,
  postAuthSignup,
};
