const express = require("express");
const { register, allusers } = require("../controllers/usercontrollers");
const { authuser } = require("../controllers/usercontrollers");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();
router.route("/").post(register);
router.post("/login", authuser);
router.route("/").get(protect, allusers);
module.exports = router;
