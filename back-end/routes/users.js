const express = require("express")
const users = express.Router()
const db = require('../db/conn')
const session = require("express-session")


users.use(session({
    secret: "somesecret",
    resave:false,
    saveUninitialized:false,
    cookies:{
        expires: 60*2
    }
}))

users.get("/login", (req, res) => {
    if(req.session.user) {
        res.send({
            logged:true,
            user:req.session.user
        })
    } else {
        res.send({
            logged:false
        })
    }
})

users.post("/login", async (req, res) => {
    let Email = req.body.Email
    let Geslo =  req.body.Geslo
    let isUserComplete = Email && Geslo
    if (isUserComplete) {
        try {
            let queryResult = await db.authUser(Email)
            if (queryResult.length > 0) {
                if (Geslo == queryResult[0].Geslo) {
                    console.log(queryResult[0])
                    req.session.user = queryResult[0]
                    res.json(queryResult[0].Email)
                    console.log("Valid Session")
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
})//login popravi imena spremenljivk!


users.post("/register", async (req, res) => { 
    let Email = req.body.Email
    let Geslo = req.body.Geslo
    let Ime_in_priimek = req.body.Ime_in_priimek
    let Tel_st = req.body.Tel_st
    let Lokacija = req.body.Lokacija

    let isUserComplete = Email && Geslo && Ime_in_priimek && Tel_st && Lokacija
    
    if (isUserComplete) {
        try {
            let queryResult = await db.addUser(Ime_in_priimek, Tel_st, Email, Geslo, Lokacija)
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

module.exports = users