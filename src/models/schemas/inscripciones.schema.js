const mongoose = require("mongoose");

const inscripcionesSchema = new mongoose.Schema(
  {
    //userId: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //activityId: { type: String, required: true },
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = inscripcionesSchema;
