const dotenv = require("dotenv");
const express = require("express");
const userroute = require("./routes/userRoute");
const chatroute = require("./routes/chatroute");
const messageroute = require("./routes/messageroute");
const connectdb = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errormiddleware");
const app = express();

dotenv.config({ path: "./backend/.env" });

connectdb(); // to configure/access env value
app.use(express.json());
app.get("/", (req, res) => {
  res.send("api is reunning");
});
app.use("/api/user", userroute);
app.use("/api/chat", chatroute);
app.use("/api/message", messageroute);
app.use(notFound);
app.use(errorHandler);
const server = app.listen(
  process.env.PORT,
  console.log("server is running on port 5000")
);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
// io.on("connection", (socket) => {
//   console.log("connected to socket.io");
//   socket.on(`setup`, (userdata) => {
//     socket.join(userdata._id);
//     console.log(userdata._id);
//     socket.emit("connected");
//   });
//   socket.on("join chat", (room) => {
//     socket.join(room);
//     console.log("user joined room " + room);
//   });
//   socket.on("new message", (newmessage) => {
//     var chat = newmessage.chat;

//     if (!chat.users) return console.log("chat.users not found");

//     chat.users.forEach((user) => {
//       if (user._id == newmessage.sender._id) return;

//       socket.in(user._id).emit("message rec", newmessage);
//     });
//   });
// });
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    console.log("neww mess", newMessageRecieved);
    console.log("hi", chat);
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
