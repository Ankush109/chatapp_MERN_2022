const dotenv = require("dotenv");
const express = require("express");

const connectdb = require("./config/db");
const app = express();

dotenv.config({ path: "./backend/.env" });
connectdb(); // to configure/access env value
app.get("/", (req, res) => {
  res.send("api is reunning");
});

app.listen(process.env.PORT, console.log("server is running on port 5000"));
