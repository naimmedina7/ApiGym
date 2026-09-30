const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const findUserByUsername = async (username) => {
  return await User.findOne({ username: username });
};

const saveUser = async (name, username, password, telefono, avatarUrl) => {
  console.log(name, username, password, telefono, avatarUrl);

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name: name,
    username: username,
    password: hashedPassword,
    telefono: telefono,
    avatarUrl: avatarUrl,
  });
  console.log("new user", newUser);

  try {
    const res = await newUser.save();
    return res;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

const cambiarPlanUsuario = async (username) => {
  const updatedUser = await User.findOneAndUpdate(
    { username },
    { $set: { premium: true } },
    {
      returnDocument: "after",
      runValidators: true,
      projection: { password: 0 },
    },
  );

  if (!updatedUser) {
    throw new Error("Usuario no encontrado");
  }

  return updatedUser;
};

module.exports = {
  findUserByUsername,
  saveUser,
  cambiarPlanUsuario,
};
