const express = require("express")
const dotenv = require("dotenv")
const app = express()
dotenv.config(); // to configure/access env value
app.get("/", (req,res) => {
    res.send("api is reunning")
})


app.listen(process.env.PORT,console.log("server is running on port 5000"))