const express = require("express");

const {
  postAuthLogin,
  postAuthSignup,
} = require("../controllers/auth.controller");
const payloadMiddleWare = require("../middlewares/payload.middleware");
const {
  signupValidation,
  loginValidation,
} = require("./validations/user.validation");

const { upload } = require("../middlewares/multer.middleware");

const authRouter = express.Router();

authRouter.post(
  "/signup",
  upload.single("imagen"),
  payloadMiddleWare(signupValidation),
  postAuthSignup,
);
authRouter.post("/login", payloadMiddleWare(loginValidation), postAuthLogin);

module.exports = authRouter;
