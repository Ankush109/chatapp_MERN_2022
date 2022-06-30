const express = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messagecontroller");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();
router.route("/").post(protect, sendMessage);
router.route("/:chatid").get(protect, allMessages);
module.exports = router;
