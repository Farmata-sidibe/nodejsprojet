const express = require("express");
const router = express.Router();
const db = require("../database/db");
var randtoken = require('rand-token');

router.post("/sendmail", (req, res) => {
    var token = randtoken.generate(16);
    db.client.findOne({
            where: { email: req.body.email }
        })
        .then(client => {
            if (client) {
                client.update({
                        forget: token
                    })
                    .then(item => {
                        var nodemailer = require("nodemailer");

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: '587',
                            auth: {
                                user: "muskann1286@gmail.com",
                                pass: "Aashiqui86",
                            },
                            secureConnection: 'false',
                            tls: {
                                ciphers: 'SSLv3',
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: "muskann1286@gmail.com",
                            to: item.email,
                            subject: "Bienvenue dans HairStyle",

                            html: "<a href=http://localhost:3000/client/validemail/" + item.forget + ">Valider votre mail</a>"
                        };

                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                res.json(error);
                                console.log(error);
                            } else {
                                console.log("email sent" + info.response);
                                res.json("vous avez recu un email");
                            }
                        });
                    })
                    .catch(err => {
                        res.json(err)
                    })
            } else {
                res.status(404).json("client not found");
            }
        })
        .catch(err => {
            res.json(err)
        })
});






module.exports = router;