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
      chatname: "sender",
      isgroupchat: false,
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
const fetchchat = expressAsyncHandler(async (req, res) => {
  try {
    chat
      .find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupadmin", "-password")
      .populate("latestmessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await user.populate(result, {
          path: "latestmessage.sender",
          select: "name pic email",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const creategroupchat = expressAsyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "please fill all the fields" });
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("more than 2 users are required to form a group chat");
  }
  users.push(req.user);
  try {
    const grpchat = await chat.create({
      chatname: req.body.name,
      users: users,
      isgroupchat: true,
      groupadmin: req.user,
    });
    const fullgrpchat = await chat
      .findOne({ _id: grpchat._id })
      .populate("users", "-password")
      .populate("groupadmin", "-password");
    res.status(200).json(fullgrpchat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const renamegrp = expressAsyncHandler(async (req, res) => {
  const { chatid, chatname } = req.body;
  const updatedchat = await chat
    .findByIdAndUpdate(
      chatid,
      {
        chatname,
      },
      {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupadmin", "-password");
  if (!updatedchat) {
    res.status(404);
    throw new Error("chat not found");
  } else {
    res.json(updatedchat);
  }
});
const addtogrp = expressAsyncHandler(async (req, res) => {
  const { chatid, userid } = req.body;
  const added = await chat
    .findByIdAndUpdate(
      chatid,
      {
        $push: { users: userid },
      },
      {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupadmin", "-password");
  if (!added) {
    res.status(404);
    throw new Error("chat not found");
  } else {
    res.json(added);
  }
});
const removefromgrp = expressAsyncHandler(async (req, res) => {
  const { chatid, userid } = req.body;
  const removed = await chat
    .findByIdAndUpdate(
      chatid,
      {
        $pull: { users: userid },
      },
      {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupadmin", "-password");
  if (!removed) {
    res.status(404);
    throw new Error("chat not found");
  } else {
    res.json(removed);
  }
});

module.exports = {
  acceschatroute,
  fetchchat,
  creategroupchat,
  renamegrp,
  addtogrp,
  removefromgrp,
};
