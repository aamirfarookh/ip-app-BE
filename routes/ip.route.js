const express = require("express");
const { getCity } = require("../controllers/ip.controller");
const { ipValidator } = require("../middlewares/validateIP");
const { auth } = require("../middlewares/auth.middleware");

const ipRouter = express.Router();


ipRouter.get("/:ip",auth,ipValidator,getCity);




module.exports = {ipRouter}