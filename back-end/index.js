const express = require("express")
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const path = require("path")

dotenv.config()

const port = process.env.PORT || 3947
const event = require("./routes/event")
const users = require("./routes/users")
const comments = require("./routes/comments")



app.use(express.static(path.join(__dirname, "build")))
app.use(cookieParser("somesecret"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({
    origin: ["http://88.200.63.148:6493"],
    methods: ["GET", "POST"],
    credentials: true
}))
// -> to gre v {} za restrikcijo kdo lahko vidi: evente lahko vidijo vsi

app.use(session({
  secret: "somesecret", // use env var in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, 
    sameSite: 'lax',             
    secure: false                
  }
}));//za login - dodal (prej je blo samo v users.js)



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.use("/event", event)
app.use("/users", users)
app.use("/comments", comments)

app.listen(port, () => {
    console.log("Successfully running on port: " + port)
})

