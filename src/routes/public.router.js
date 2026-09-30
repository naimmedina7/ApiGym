const express = require("express");
const publicRouter = express.Router();
const  { pingController } =  require("../controllers/public.controller")


publicRouter.get("/ping", pingController)


module.exports = publicRouter;