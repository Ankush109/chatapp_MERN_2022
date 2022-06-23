const mongoose = require("mongoose");
const chatmodel = mongoose.Schema(
  {
    chatname: {
      type: String,
      trim: true,
    },
    isgroupchat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // model ke reference
      },
    ],
    latestmessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupadmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const chat = mongoose.model("Chat", chatmodel);
module.exports = chat;
