// const chat = require("../Models/chatmodel");
// const Message = require("../models/messageModel");

// const user = require("../Models/Usermodel");

// //@description     Get all Messages
// //@route           GET /api/Message/:chatid
// //@access          Protected
// const allMessages = async (req, res) => {
//   try {
//     const messages = await Message.find({ chat: req.params.chatid })
//       .populate("sender", "name pic email")
//       .populate("chat");
//     res.json(messages);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// };

// //@description     Create New Message
// //@route           POST /api/Message/
// //@access          Protected
// const sendMessage = async (req, res) => {
//   const { content, chatid } = req.body;

//   if (!content || !chatid) {
//     console.log("Invalid data passed into request");
//     return res.sendStatus(400);
//   }

//   var newMessage = {
//     sender: req.user._id,
//     content: content,
//     chat: chatid,
//   };

//   try {
//     var message = await Message.create(newMessage);

//     message = await message.populate("sender", "name pic").execPopulate();
//     message = await message.populate("chat");
//     message = await user.populate(message, {
//       path: "chat.users",
//       select: "name pic email",
//     });

//     await chat.findByIdAndUpdate(req.body.chatid, { latestmessage: message });

//     res.json(message);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// };

// module.exports = { allMessages, sendMessage };
const asyncHandler = require("express-async-handler");
const chat = require("../Models/chatmodel");
const Message = require("../Models/Messagemodel");
const user = require("../Models/Usermodel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatid })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatid } = req.body;

  if (!content || !chatid) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatid,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await user.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await chat.findByIdAndUpdate(req.body.chatid, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
