const express = require("express");
const {
  acceschatroute,
  fetchchat,
  creategroupchat,
  renamegrp,
  addtogrp,
  removefromgrp,
} = require("../controllers/chatcontroller");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();
router.route("/").post(protect, acceschatroute);
router.route("/").get(protect, fetchchat);
router.route("/group").post(protect, creategroupchat);
router.route("/rename").put(protect, renamegrp);
router.route("/groupadd").put(protect, addtogrp);
router.route("/groupremove").put(protect, removefromgrp);
module.exports = router;
