require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const loggerMiddleware = require("./middlewares/logger.middleware");
const authMiddleware = require("./middlewares/auth.middleware");
const dbMiddleware = require("./middlewares/db.middleware");
const privateRouter = require("./routes/private.router");
const publicRouter = require("./routes/public.router");
const authRouter = require("./routes/auth.router");

const { generalLimiter } = require("./middlewares/rateLimit.middleware");

// (async () => {
//   try {
//     await connectMongoDB();
//   } catch (error) {
//     console.log("Ocurrio un error", error);
//     process.exit();
//   }
// })();

app.use(express.json());
app.use(loggerMiddleware);
app.use(morgan("dev"));
app.use(cors());
app.use(generalLimiter);

app.use("/public", publicRouter);

app.use(dbMiddleware);

app.use("/v1/auth", authRouter);

app.use(authMiddleware);
// Private
app.use("/v1", privateRouter);

app.use((err, req, res, next) => {
  console.error("Error no controlado:", err);
  res.status(err.status || 500).json({ message: "Error interno del servidor" });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Listen & serve PORT: ${PORT}`);
  });
}
