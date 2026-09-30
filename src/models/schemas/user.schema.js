const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    premium: { type: Boolean, default: false },
    role: { type: String, default: "user" },
    telefono: { type: String, required: true },
    avatarUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = userSchema;
