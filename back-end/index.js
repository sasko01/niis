const express = require("express")
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")
dotenv.config()

const port = process.env.PORT || 3947
const event = require("./routes/event")
const users = require("./routes/users")


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: ["http://88.200.63.148:6493"],
    methods: ["GET", "POST"],
    credentials: true
}))
//origin: ["http://88.200.63.148:6493"],
//    methods: ["GET", "POST"],
//    credentials: true -> to gre v {} za restrikcijo kdo lahko vidi: evente lahko vidijo vsi


app.get("/", (req, res) => {
    res.send("Hello and welcome to the Never In website!")
})

app.use("/event", event)
app.use("/users", users)

app.listen(port, () => {
    console.log("Successfully running on port: " + port)
})

