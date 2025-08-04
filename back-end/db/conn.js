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
        })
    })
}//allEvents

dataPool.oneEvent = (d_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Dogodek WHERE d_id = ?`, d_id, (err, res) => {
            if (err) {return reject(err)}
            return resolve(res)
        })
    }) 
}//oneEvent

dataPool.createEvent = (Ime_dogodka, Vrsta_dogodka, Datum_in_ura, Lokacija, Druge_info) => {
    return new Promise ((resolve, reject) => {
        conn.query(`INSERT INTO Dogodek (Ime_dogodka, Vrsta_dogodka, Datum_in_ura, Lokacija, Druge_info) 
            VALUES (?,?,?,?,?)`, [Ime_dogodka, Vrsta_dogodka, Datum_in_ura, Lokacija, Druge_info], (err, res) => {
                if (err) {return reject(err)}
                return resolve(res)
        })
    })
}//createEvent

dataPool.getAcceptedEvents = () => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM Dogodek WHERE Sprejet_od_NI = 1`, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};//Sprejeti dogodki od NI

dataPool.getPendingEvents = () => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM Dogodek WHERE Sprejet_od_NI = 0`, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};//Dogodki ki niso sprejeti oz niso se sprejeti

dataPool.reserveTicket = (d_id, u_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`INSERT INTO Vstopnica (d_id, u_id, Placana_vstopnica, Rezervirana_vstopnica) 
                VALUES (?, ?, 0, 1)
                ON DUPLICATE KEY UPDATE Rezervirana_vstopnica = 1`, [d_id, u_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

dataPool.getUserReservations = (u_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT d_id FROM Vstopnica WHERE u_id = ? AND Rezervirana_vstopnica = 1`, [u_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

//UPORABNIK
dataPool.authUser = (Email) => {
    return new Promise ((resolve, reject) => {
        conn.query(`SELECT * FROM Uporabnik WHERE Email = ?`, Email, (err, res) => {
            if (err) {return reject(err)}
            return resolve(res) 
        })
    })
}//authUser

dataPool.addUser = (Ime_priimek, Tel_st, Email, Geslo, Lokacija) => {
    return new Promise ((resolve, reject) => {
        conn.query(`INSERT INTO Uporabnik (Ime_priimek, Tel_st, Email, Geslo, Lokacija)
            VALUES (?,?,?,?,?)`, [Ime_priimek, Tel_st, Email, Geslo, Lokacija],(err, res) => {
            if (err) {return reject(err)}
            return resolve(res)
        })
    })
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

dataPool.addOrganization = (u_id, Ime, Tip, Druge_info) => {
    return new Promise ((resolve, reject) => {
        conn.query(`INSERT INTO Drustvo (u_id, Ime, Tip, Druge_info)
            VALUES (?,?,?,?)`, [u_id, Ime, Tip, Druge_info],
            (err, res) => {
                if (err) {return reject(err)}
                return resolve(res)
        })
    })
}

dataPool.checkIfUserHasDrustvo = (u_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM Drustvo WHERE u_id = ?`, [u_id], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
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
