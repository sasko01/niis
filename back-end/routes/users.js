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
    let Email = req.body.Email;
    let Geslo = req.body.Geslo;

    if (Email && Geslo) {
        try {
            let queryResult = await db.authUser(Email);
            if (queryResult.length > 0) {
                if (Geslo === queryResult[0].Geslo) {
                    req.session.user = queryResult[0]; 
                    console.log(queryResult);
                    console.log("Valid Session");
                    res.send({
                        success: true,
                        user: queryResult[0]
                    }); 
                } else {
                    console.log("Incorrect password!");
                    res.send({ success: false, message: "Incorrect password" });
                }
            } else {
                console.log("User not registered!");
                res.send({ success: false, message: "User not registered" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).send({ success: false, message: "Server error" });
        }
    } else {
        console.log("Please enter Email and Password!");
        res.send({ success: false, message: "Missing credentials" });
    }
}); // updated for loggedUserView


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

users.post("/become-member", async (req, res) => {
    const Email = req.body.Email;
    
    if (!Email) {
        return res.status(400).send({ success: false, message: "Email is required" });
    }
    try {
        await db.setUserAsMember(Email);
        if (req.session.user) {
            req.session.user.Clan = 1;
        }

        res.send({ success: true, message: "User marked as member" });
    } catch (err) {
        console.error("Membership update error:", err);
        res.status(500).send({ success: false, message: "Database error" });
    }
});

module.exports = users