const Express = require("express"),
    router = Express.Router(),
    db = require("../database/db");


router.post("/new", (req, res) => {
    console.log(req.body);
    db.marque
        .findOne({
            where: { astuce: req.body.astuce },
        })
        .then((marque) => {
            if (!marque) {
                db.marque
                    .create(req.body)
                    .then((marqueitem) => {
                        db.image
                            .create({
                                image: req.body.image,
                                marqueitem: marqueitem.id,
                            })
                            .then((image) => {
                                res.status(200).json({
                                    marque: marqueitem,
                                    marque: image,
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
                marque
                    .update({
                        produit: req.body.produit,
                    })
                    .then((rep) => {
                        res.status(200).json({ marque: rep });
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
    db.marque
        .findAll({
            include: [{
                model: db.image,
            }, ],
        })
        .then((marques) => {
            if (marques) {
                res.status(200).json({
                    marques: marques,
                });
            } else {
                res.status(404).json("il n'a pas de marques");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

router.post("/add", (req, res) => {
    var marques = {
        nom: req.body.nom,

    };
    //crée une nouvelle occurence( ajouter une nouvelle ligne)  qui va ajouter marques
    db.marque.create(marques)

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


module.exports = router;