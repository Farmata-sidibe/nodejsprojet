var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var db = require("../database/db");
var randtoken = require('rand-token');

process.env.SECRET_KEY = 'secret';
//mon registeur
router.post("/registor", (req, res) => {
    console.log(req.body);
    db.client
        .findOne({
            // demander de recuperer l'email
            where: { email: req.body.email },
        })
        .then((client) => {
            if (!client) {

                const hash = bcrypt.hashSync(req.body.password, 10);
                req.body.password = hash;
                db.client
                    .create(req.body)
                    .then((item) => {
                        var nodemailer = require("nodemailer");
                        var transporter = nodemailer.createTransport({
                            host: "smtp.gmail.com",
                            port: "587",
                            auth: {
                                user: "projetsidibe1@gmail.com",
                                pass: "Projetsidibe@",
                            },
                            secureConnection: "false",
                            tls: {
                                ciphers: "SSLv3",
                                rejectUnauthorized: false,
                            },
                        });

                        var mailOptions = {
                            from: "projetsidibe1@gmail.com",
                            to: item.email,
                            subject: "Bienvenue dans HairStyle",
                            text: "https://hairs-style.fr/validemail/" +
                                " Valider votre compte client " +
                                " ",
                        };

                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                console.log(error);
                                return error;
                            } else {
                                console.log("email sent" + info.response);
                                return info.response;
                            }
                        });
                    })
                    .then((clientitem) => {
                        let token = jwt.sign(
                            clientitem.dataValues,
                            process.env.SECRET_KEY, {
                                expiresIn: 1440,
                            }
                        );
                        res.status(200).json({
                            message: "Vous devez valider votre mail",
                            email: itemclient.email,
                        });
                    })

                .catch((err) => {
                    res.json(err);
                });
            } else {
                res.json("cette adresse mail et déja utilisée");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

router.post("/llogin", (req, res) => {
    db.client.findOne({ where: { email: req.body.email } })
        .then(client => {
            console.log(client)
            if (client.Status === true) {
                if (bcrypt.compareSync(req.body.password, client.password)) {
                    let clientdata = {
                        id: client.id,
                        email: client.email,
                    };
                    let token = jwt.sign(clientdata, process.env.SECRET_KEY, {
                        expiresIn: 1440,
                    })
                    res.status(200).json({ token: token })
                } else {
                    res.json("error mail or error password")

                }
            } else {
                res.json({ message: "Vous devez valider votre mail" })
            }
        })
        .catch(err => {
            res.json(err);
        });
});
/*
router.post("/login", (req, res) => {
    //eslint-disable-next-line
    console.log(req.body)
    database.client.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(client => {
            // req.body.password : c'est celui saisi , user.password : c'est celui de la database , compareSync les compares
            if (client) {


                // tu me compare le mot de passe entre et celui qui est dans ma base de donner
                if (bcrypt.compareSync(req.body.password, client.password)) {

                    //  Nous créons un jeton d'authentification pour l'utilisateur avec le jwt
                    let token = jwt.sign(client.dataValues, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    });
                    // Je recupere le token
                    // tu m'envoie statu 200 si ses bon 
                    res.status(200.).json({
                        token: token
                    })
                } else {
                    res.status(404).send('message erreur ou mot de passe erreur')
                }
            } else {
                res.status(404).json("error")
            }
        })
        .catch(err => {
            res.status(404).send('error ' + err)
        })

});*/

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
                                user: "projetsidibe1@gmail.com",
                                pass: "Projetsidibe@",
                            },
                            secureConnection: 'false',
                            tls: {
                                ciphers: 'SSLv3',
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: "projetsidibe1@gmail.com",
                            to: item.email,
                            subject: "Bienvenue dans HairStyle",

                            html: "<a href=https://localhost:3000/client/validemail/" + item.forget + ">Valider votre mail</a>"
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

//on appelle route générique parce que on peut l'utiliser dans plusieurs cas

/*router.post("/forgetpassword", (req, res) => {
    // ça nous permet de generer le token
    var randtoken = require('rand-token');
    var token = randtoken.generate(16);
    db.client.findOne({
            where: { email: req.body.email }
        })
        .then(client => {
            if (client) {
                client.update({
                        forget: token
                    }).then(item => {
                        var nodemailer = require("nodemailer");

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: '587',
                            auth: {
                                user: "projetsidib@gmail.com",
                                pass: "Projetsidibe@",
                            },
                            secureConnection: 'false',
                            tls: {
                                ciphers: 'SSLv3',
                                rejectUnauthorized: false
                            }

                        });

                        var mailOptions = {
                            from: "projetsidib@gmail.com",
                            to: item.email,
                            subject: "Réinitialisation de votre mot de passe",
                            html: "<a href=http://localhost:8080/mpo/" + item.forget + ">Metter a jour le mot de passe</a>"
                        };

                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                res.json(error);
                                console.log(error);
                            } else {
                                console.log("email sent" + info.response);
                                return info.response;
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
});*/
// route permet faire mot de passe oublié
router.post("/forgetpassword", (req, res) => {
    var randtoken = require("rand-token");
    // ça generer le token
    var token = randtoken.generate(16);
    db.client
        .findOne({
            // recuperer l'adresse email
            where: { email: req.body.email },
        })
        .then((client) => {
            if (client) {
                client
                    .update({
                        forget: token,
                    })
                    .then((item) => {
                        var nodemailer = require("nodemailer");
                        var transporter = nodemailer.createTransport({
                            host: "smtp.gmail.com",
                            port: "587",
                            auth: {
                                user: "projetsidibe1@gmail.com",
                                pass: "Projetsidibe@",
                            },
                            secureConnection: "false",
                            tls: {
                                ciphers: "SSLv3",
                                rejectUnauthorized: false,
                            },
                        });

                        var mailOptions = {
                            from: "projetsidibe1@gmail.com",
                            to: item.email,
                            subject: "HairStyle",
                            text: "http://localhost:8080/updatepassword/" +
                                " Voici le lien pour mettre à jour votre mot de passe " +
                                " ",
                        };

                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                console.log(error);
                                return error;
                            } else {
                                console.log("email sent" + info.response);
                                return info.response;
                            }
                        });
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            } else {
                res.status(404).json("client not found");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});


router.post("/updatepassword", (req, res) => {
    db.client.findOne({
            where: { forget: req.body.forget }
        }).then(client => {
            if (client) {
                const hash = bcrypt.hashSync(req.body.password, 10);
                req.body.password = hash;
                client.update({
                        password: req.body.password,
                        forget: null

                    })
                    .then(() => {
                        res.json({
                            message: "votre mot de passe est mis a jour"
                        })
                    })
                    .catch(err => {
                        res.json(err);
                    })
            } else {
                res.json("link not validé");
            }
        })
        .catch(err => {
            res.json(err)
        })
});


// route permet valider son adresse mail
router.post("/validemail", (req, res) => {
    db.client.findOne({
            // recuperer le email
            where: { email: req.body.email },
        })
        .then((client) => {
            if (client) {
                if (client.Status !== 1) {
                    // changer le status qui devient un compte valide et il peut l'utiliser
                    client
                        .update({
                            Status: 1,
                        })
                        // L'utilisateur va recevoir ce message
                        .then(() => {
                            res.json({
                                message: "votre compte a été activer",
                            });
                        })
                        .catch((err) => {
                            res.json(err);
                        });
                } else {
                    res.json("votre compte est déja validé");
                }
            } else {
                res.status(404).json("client not found !!!");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});


router.put('/udapte/:id', (req, res) => {
    db.client.findOne({
            where: { id: req.params.id }
        })
        .then(client => {
            if (client) {

                password = bcrypt.hashSync(req.body.password, 10);
                req.body.password = password;
                client.update(req.body)
                    .then(clientitem => {
                        console.log(clientitem);
                        db.client.findOne({
                                where: { id: req.params.id }
                            })
                            .then(client => {
                                let token = jwt.sign(client.dataValues,
                                    process.env.SECRET_KEY, {
                                        expiresIn: 1440
                                    });
                                res.status(200).json({ token: token })
                            })

                        .catch(err => {
                            res.status(402).send(err + 'bad request')
                        })
                    })
                    .catch(err => {
                        res.status(402).send("impossible de mettre à jour le client" + err);
                    })
            } else {
                res.json("client n'est pas dans la base de données")
            }
        })
        .catch(err => {
            res.json(err);
        })
})

router.get("/profil/:id", (req, res) => {
    db.client
        .findOne({
            where: { id: req.params.id },
        })
        .then((client) => {
            if (client) {
                let token = jwt.sign(client.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440,
                });
                res.status(200).json({ token: token });
            } else {
                res.json("error le client n'est pas dans la base !!");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});
router.get("/getById/:id", (req, res) => {
    db.client
        .findOne({
            where: { id: req.params.id },
            include: [{
                model: db.image,
            }, ],
        })
        .then((clients) => {
            res.status(200).json({ clients: clients });
        })
        .catch((err) => {
            res.json(err);
        });
});

module.exports = router;