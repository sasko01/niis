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
            console.log(err);
            res.status(500).send({ success: false, message: "Server error" });
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

users.post("/create-organization", async (req, res) => {
    const u_id = req.body.u_id
    const Ime = req.body.Ime
    const Tip = req.body.Tip
    const Druge_info = req.body.Druge_info

    let isOrgComplete = u_id && Ime && Tip && Druge_info

    if(!isOrgComplete) {
        return res.status(400).send({ success: false, message: "Error: Missing fields!" });
    }
    try {
        await db.addOrganization(u_id, Ime, Tip, Druge_info);
        res.send({ success: true, message: "Organization created successfully" });
    } catch (err) {
        console.error("Organization update error:", err);
        res.status(500).send({ success: false, message: "Database error" });
    }    
});

users.get("/has-organization/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await db.checkIfUserHasDrustvo(userId);
    if (result.length > 0) {
      res.send({ hasDrustvo: true, orgName: result[0].Ime });
    } else {
      res.send({ hasDrustvo: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

users.post("/reserve", async (req, res) => {
  const d_id = req.body.d_id
  const u_id = req.body.u_id

  if (!d_id || !u_id) {
    return res.status(400).send({ success: false, message: "Missing data." });
  }
  try {
    const result = await db.reserveTicket(d_id, u_id);
    res.send({ success: true, result });
  } catch (err) {
    console.error("Reservation error: ", err);
    res.status(500).send({ success: false, message: "Failed to reserve ticket." });
  }
});

users.get("/reservations/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await db.getUserReservations(userId);
    res.send({ success: true, reservations: result });
  } catch (err) {
    console.error("Fetch reservations error:", err);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

users.get("/paid-tickets/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await db.getUserPaidEvents(userId);
    res.send({ success: true, paid: result });
  } catch (err) {
    console.error("Fetch paid tickets error:", err);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

users.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await db.getUserInfo(userId);
    if (result.length > 0) {
      res.send({ success: true, user: result[0] });
    } else {
      res.send({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).send({ success: false, message: "Server error" });
  }
});


module.exports = users