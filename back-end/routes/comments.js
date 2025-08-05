const express = require("express")
const comments = express.Router()
const db = require("../db/conn")
const session = require("express-session")

comments.get("/:eventId", async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const comments = await db.getCommentsForEvent(eventId);
    res.send(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).send([]);
  }
});

comments.post("/", async (req, res) => {
  const u_id = req.body.u_id
  const d_id = req.body.d_id
  const Tekst  = req.body.Tekst

  if (!d_id || !u_id || !Tekst) {
    return res.status(400).send({ success: false, message: "Missing fields" });
  }  
  try {
    await db.addComment(u_id, d_id, Tekst);
    res.send({ success: true, message: "Comment posted sucessfully!" });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).send({ success: false, message: "Server error"  });
  }
});

module.exports = comments;
