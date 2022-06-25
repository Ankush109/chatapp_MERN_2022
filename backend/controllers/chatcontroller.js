const expressAsyncHandler = require("express-async-handler");
const chat = require("../Models/chatmodel");
const user = require("../Models/Usermodel");

const acceschatroute = expressAsyncHandler(async (req, res) => {
  const { userid } = req.body;
  if (!userid) {
    console.log("not sent");
    return res.sendStatus(400);
  }
  var ischat = await chat
    .find({
      isgroupchat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userid } } },
      ],
    })
    .populate("users", "-password")
    .populate("latestmessage");
  ischat = await user.populate(ischat, {
    path: "latestmessage.sender",
    select: "name pic email",
  });
  if (ischat.length > 0) {
    res.send(ischat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userid],
    };
    try {
      const createdchat = await chat.create(chatData);
      const fullchat = await chat
        .findOne({ _id: createdchat._id })
        .populate("users", "-password");
      res.status(200).send(fullchat);
    } catch (error) {
      res.send(400);
      throw new Error(error.message);
    }
  }
});
module.exports = { acceschatroute };
