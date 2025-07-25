const express = require("express")
const { title } = require("process")
const event = express.Router()
const db = require('../db/conn')

event.get("/", async (req, res, next) => {
    try 
    {
        let queryResult = await db.allEvents ()
        res.json(queryResult)
    }
    catch (err) 
    {
        console.log(err)
        res.sendStatus(500)
    }
})//allEvents

event.get("/:d_id", async (req, res, next) => {
    try 
    {
        console.log(req)
        let queryResult = await db.oneEvent (req.params.d_id)
        res.json(queryResult)
    }
    catch (err) 
    {
        console.log(err)
        res.sendStatus(500)
    }
})//oneEvent

event.post("/", async (req, res, next) => {
    let [Ime_dogodka, Vrsta_dogodka, Datum_in_ura, Lokacija, Samo_za_clane, Druge_info] = req.body
    let isAcompleteEvent = Ime_dogodka && Vrsta_dogodka && Datum_in_ura && Lokacija && Samo_za_clane && Druge_info

    if (isAcompleteEvent) {
        try 
        {
            let queryResult = await db.createEventAdmin (Ime_dogodka, Vrsta_dogodka, Datum_in_ura, Lokacija, Samo_za_clane, Druge_info)
            if (queryResult.affectedRows) {
                console.log ("New Event added successfully")
            }//if
        }
        catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    } else {
        console.log("ERROR: A field is empty or has wrong type!")
    }
    res.end()
})

module.exports = event