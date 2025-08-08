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

dataPool.oneEventWithOrg = (d_id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT d.*, dr.Ime AS dr_ime, dr.Tip AS dr_tip, dr.Druge_info AS dr_info
      FROM Dogodek d
      LEFT JOIN Drustvo dr ON d.d_id = dr.d_id
      WHERE d.d_id = ?`,
      [d_id],
      (err, res) => {
        if (err) return reject(err);
        resolve(res);
      }
    );
  });
};

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
    conn.query(`SELECT 
                d.*, 
                (d.St_vseh_vstopnic - COUNT(v.v_id)) AS Stevilo_ostalih_vstopnic
                FROM Dogodek d
                LEFT JOIN Vstopnica v ON d.d_id = v.d_id
                WHERE d.Sprejet_od_NI = 1 AND d.Datum_in_ura > NOW()
                GROUP BY d.d_id
                ORDER BY d.Datum_in_ura ASC`, (err, res) => {
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

dataPool.getPastEvents = () => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM Dogodek WHERE Sprejet_od_NI = 1 AND Datum_in_ura < NOW() ORDER BY Datum_in_ura DESC`, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

dataPool.getCommentsForEvent = (d_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT k.*, u.Ime_priimek 
                FROM Komentar k
                JOIN Uporabnik u ON k.u_id = u.u_id
                WHERE k.d_id = ?
                ORDER BY k.Datum_in_ura DESC`, [d_id], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

dataPool.addComment = (u_id, d_id, Tekst) => {
  return new Promise((resolve, reject) => {
    conn.query(`INSERT INTO Komentar (u_id, d_id, Tekst, Datum_in_ura) VALUES (?, ?, ?, NOW())`, [u_id, d_id, Tekst], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

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

dataPool.getUserPaidEvents = (u_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT d_id FROM Vstopnica WHERE u_id = ? AND Placana_vstopnica = 1`, [u_id], (err, result) => {
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
        conn.query(
          `INSERT INTO Uporabnik (Ime_priimek, Tel_st, Email, Geslo, Lokacija)
            VALUES (?,?,?,?,?)`, [Ime_priimek, Tel_st, Email, Geslo, Lokacija],(err, res) => {
            if (err) {return reject(err)}
            return resolve(res)
        })
    })
}//addUser

dataPool.setUserAsMember = (Email) => {
    return new Promise ((resolve, reject) => {
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

dataPool.getUserInfo = (u_id) => {
  return new Promise ((resolve, reject) => {
    conn.query(
      `SELECT * FROM Uporabnik WHERE u_id=?`, [u_id], (err, res) => {
        if (err) {return reject(err)}
        return resolve(res)
      }
    )
  })
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
