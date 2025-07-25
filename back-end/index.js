const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()

const port = process.env.PORT || 3947
const event = require("./routes/event")


app.get("/", (req, res) => {
    res.send("Hello and welcome to the Never In website!")
})

app.use("/event", event)

app.listen(port, () => {
    console.log("Successfully running on port: " + port)
})

