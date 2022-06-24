const express = require("express");
const { register } = require("../controllers/usercontrollers");
const { authuser } = require("../controllers/usercontrollers");
const router = express.Router();
router.route("/").post(register);
router.post("/login", authuser);
module.exports = router;
