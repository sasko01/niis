const mysql = require("mysql2")
const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
})

let dataPool = {}

//DOGODKI
dataPool.allEvents = () => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Dogodek`, (err, res) => {
            if (err) {return reject(err)}
            return resolve(res)
        })//query
    })//promise
}//allEvents

dataPool.oneEvent = (d_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Dogodek WHERE d_id = ?`, d_id, (err, res) => {
            if (err) {return reject(err)}
            return resolve(res)
        })//query
    })//promise 
}//oneEvent

dataPool.createEvent = (Ime_dogodka, Vrsta_dogodka, Datum_in_ura, Lokacija, Druge_info) => {
    return new Promise ((resolve, reject) => {
        conn.query(`INSERT INTO Dogodek (Ime_dogodka, Vrsta_dogodka, Datum_in_ura, Lokacija, Druge_info) 
            VALUES (?,?,?,?,?)`, [Ime_dogodka, Vrsta_dogodka, Datum_in_ura, Lokacija, Druge_info], (err, res) => {
                if (err) {return reject(err)}
                return resolve(res)
        })//query
    })//promise
}//createEventAdmin

//UPORABNIK
dataPool.authUser = (Email) => {
    return new Promise ((resolve, reject) => {
        conn.query(`SELECT * FROM Uporabnik WHERE Email = ?`, Email, (err, res) => {
            if (err) {return reject(err)}
            return resolve(res) 
        })//query
    })//promise
}//authUser

dataPool.addUser = (Ime_priimek, Tel_st, Email, Geslo, Lokacija) => {
    return new Promise ((resolve, reject) => {
        conn.query(`INSERT INTO Uporabnik (Ime_priimek, Tel_st, Email, Geslo, Lokacija)
            VALUES (?,?,?,?,?)`, [Ime_priimek, Tel_st, Email, Geslo, Lokacija],(err, res) => {
            if (err) {return reject(err)}
            return resolve(res)
        })//query
    })//promise
}//addUser

dataPool.setUserAsMember = (Email) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `UPDATE Uporabnik SET Clan = 1 WHERE Email = ?`,
            [Email],
            (err, res) => {
                if (err) return reject(err);
                return resolve(res);
            }
        );
    });
};


conn.connect(err => {
    if(err){
        console.log("ERROR: " + err.message)
        return
    }
    console.log("Connection established")
})

module.exports = dataPool
