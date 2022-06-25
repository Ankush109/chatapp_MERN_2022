const express = require("express");
const { acceschatroute } = require("../controllers/chatcontroller");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();
router.route("/").post(protect, acceschatroute);
module.exports = router;
