let express = require("express"),
 router = express.Router();
 let db = require("../database/db");

 //register new command
 router.post("/new", (req, res) => {
     db.command.create({ clientId: req.body.clientId})
 })