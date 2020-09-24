const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var db = require("../database/db");
const { salon } = require("../database/db");


router.post("/new", (req, res) => {
    console.log(req.body);
    db.salon
        .findOne({
            where: { nom: req.body.nom },
        })
        .then((salon) => {
            if (!salon) {
                db.salon
                    .create(req.body)
                    .then((salonitem) => {
                        db.img
                            .create({
                                Status: 1,
                                Image: req.body.img,
                                salonId: salonitem.id,
                            })
                            .then((img) => {
                                res.status(200).json({
                                    salon: salonitem,
                                    salon: img,
                                    message: "ok ",
                                });
                            })
                            .catch((err) => {
                                res.json(err);
                            });
                    })
                    .catch((err) => {
                        res.status(400).send("error" + err);
                    });
            } else {
                salon
                    .update({
                        stock: req.body.stock,
                    })
                    .then((rep) => {
                        res.status(200).json({ salon: rep });
                    })
                    .catch((err) => {
                        res.status(403).json("not updated");
                    });
            }
        })
        .catch((err) => {
            res.status(404).json("Not found");
        });
});

router.get("/all", (req, res) => {
    db.salon
        .findAll({
            include: [{
                model: db.image,
            }, ],
        })
        .then((salons) => {
            if (salons) {
                res.status(200).json({
                    salons: salons,
                });
            } else {
                res.status(404).json("il n'a pas de salons");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

router.post("/add", (req, res) => {
    var salons = {
        nom: req.body.nom,

    };
    //crée une nouvelle occurence( ajouter une nouvelle ligne)  qui va ajouter salons
    db.salon.create(salons)

    .then(rep => {
            // faire reference a rep then(rep)
            // on veut savoir s'il reussite à créer alors il va nous envoyer une réponse
            res.json({ message: 'ok', rep })
        })
        .catch(err => {
            // ne marche pas alors il va afficher error
            res.json({ error: 'error' + err })
        })

});




router.delete("/delete/:id", (req, res) => {
    console.log(req.body)
        // find the salon and delete
        // findOne veut dire récupérer un élément
        // findAll veut dire recuperer tous les éléments
    db.salon.findOne({
            where: { id: req.params.id }
        }).then(salon => {
            // if salon exist so
            if (salon) {
                salon.destroy().then(() => {
                        res.json("salon supprimer")
                    })
                    .catch(err => {
                        res.json("error" + err)
                    })
            } else {
                res.json({ error: "vous ne pouvez pas supprimer ce salon, elle n'existe pas dans la base" })
            }
        })
        .catch(err => {
            //send back the message error
            res.json("error" + err);
        })
});

//.......recherche........


router.get('/limit/:limit', (req, res) => {
    db.salon.findAll({
            include: [{
                    model: db.image,
                },
                {
                    model: db.video,
                },
            ],
            limit: parseInt(req.params.limit),
        })
        .then(salons => {
            res.status(200).json({ salons: salons })
        })
        .catch(err => {
            res.status(502).json("bad req" + err);
        })
});


router.get('/all/:limit/:offset', (req, res) => {
    db.salon.findAll({
            include: [{
                    model: db.image,
                },
                {
                    model: db.video,
                },
            ],
            limit: parseInt(req.params.limit),
            offset: parseInt(req.params.offset),

        })
        .then(salons => {
            res.status(200).json({ salons: salons })
        })
        .catch(err => {
            res.status(502).json("bad req" + err);
        })
});



router.post('/addvideo', (req, res) => {
    db.video.create({
            video: req.body.video,
            salonId: req.body.id
        })
        .then(() => {
            db.salon.findOne({
                    where: { id: req.body.id },
                    include: [{
                            model: db.image
                        },
                        {
                            model: db.video
                        }
                    ]
                })
                .then(salon => {
                    res.status(200).json({
                        salon: salon
                    })
                })
                .catch(err => {
                    res.json(err)
                })
        })
        .catch(err => {
            res.json(err)
        })
});


router.post('/addimage', (req, res) => {
    db.image.create({
            image: req.body.image,
            salonId: req.body.id
        })
        .then(() => {
            db.salon.findOne({
                    where: { id: req.body.id },
                    include: [{
                            model: db.image
                        },
                        {
                            model: db.video
                        }
                    ]
                })
                .then(salon => {
                    res.status(200).json({
                        salon: salon
                    })
                })
                .catch(err => {
                    res.json(err)
                })
        })
        .catch(err => {
            res.json(err)
        })
});


router.get('/findBy/:nom', (req, res) => {
    console.log(res)
    db.salon.findAll({

            where: {
                nom: {
                    [Op.like]: "%" + req.params.nom + "%",
                }
            },
            include: [{
                    model: db.image
                },
                {
                    model: db.video
                },
            ]
        })
        .then(salons => {
            res.status(200).json({ salons: salons })
        })
        .catch(err => {
            res.json(err)
        })
})

module.exports = router;