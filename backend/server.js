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
app.listen(process.env.PORT, console.log("server is running on port 5000"));
