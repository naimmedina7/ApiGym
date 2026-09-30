const mongoose = require("mongoose");

const actividadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    //categoryId: { type: String, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    schedule: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = actividadSchema;
