const User = require("../Models/Usermodel");
const asyncHandler = require("express-async-handler");
const generatetoken = require("../config/token");
const expressAsyncHandler = require("express-async-handler");
const chat = require("../Models/chatmodel");
const register = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please enter all the fields");
  }
  const userexists = await User.findOne({ email });
  if (userexists) {
    res.status(400);
    throw new Error("user already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isadmin: user.isadmin,
      pic: user.pic,
      token: generatetoken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("user not found");
  }
});
const authuser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchpassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generatetoken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("invalid email or password");
  }
});
//api/user
const allusers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { register, authuser, allusers };
