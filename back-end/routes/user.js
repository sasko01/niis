const express = require("express")
const users = express.Router()
const db = require('../db/conn')


users.post("/login", async (req, res) => {
    let [email, password] = req.body 
    let isUserComplete = email && password
    if (isUserComplete) {
        try {
            let queryResult = await db.authUser(email)
            if (queryResult.length > 0) {
                if (password == queryResult[0].Geslo) {
                    console.log(queryResult)
                } else {
                    console.log("Incorrect password!")
                }
            } else {
                console.log("User not registered!")
            }//elif
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    } else {
        console.log("Please enter Email and Password!")
    }
    res.end()
})//login


users.post("/register", async (req, res) => {
    let [email, password, name, phone, place] = req.body 
    let isUserComplete = email && password && name && phone && place
    if (isUserComplete) {
        try {
            let queryResult = await db.addUser(name, phone, email, password, place)
            if (queryResult.affectedRows) {
                console.log("New user added")
            }
        } catch (err) {

        }
    } else {
        console.log("A field is missing!")
    }
    res.end()
})//register