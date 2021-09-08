const Express = require("express"),
    router = Express.Router(),
    db = require("../database/db");

router.post("/add", (req, res) => {
    var carteMenus = {
        prestation: req.body.prestation,
        tarif: req.body.tarif,
        image: req.body.image
    };
    //crée une nouvelle occurence( ajouter une nouvelle ligne)  qui va ajouter une prestation
    db.carteMenu.create(carteMenus)

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
    // find the prestation and delete
    // findOne veut dire récupérer un élément
    // findAll veut dire recuperer tous les éléments
    db.carteMenu.findOne({
            where: { id: req.params.id }
        }).then(carteMenu => {
            // if prestation exist so
            if (carteMenu) {
                carteMenu.destroy().then(() => {
                        res.json("carteMenu supprimer")
                    })
                    .catch(err => {
                        res.json("error" + err)
                    })
            } else {
                res.json({ error: "vous ne pouvez pas supprimer ce carteMenu, elle n'existe pas dans la base" })
            }
        })
        .catch(err => {
            //send back the message error
            res.json("error" + err);
        })
});


router.post("/newadd", (req, res) => {
    db.carteMenu.findOne({
            where: { prestation: req.body.prestation }
        })
        .then(carteMenu => {
            if (!carteMenu) {
                db.carteMenu.create(req.body)
                    .then(itemcarteMenu => {
                        db.image.create({
                                image: image,
                                carteMenuId: itemcarteMenu.id
                            })
                            .then(() => {
                                db.carteMenu.findOne({
                                        where: { id: itemcarteMenu.id },
                                        include: [{
                                            model: db.image
                                        }]
                                    })
                                    .then(fournirr => {
                                        fournirr.addsalon([salonId = req.body.salonId])
                                            .then(carteMenu => {
                                                res.status(200).json({
                                                    carteMenu: carteMenu,
                                                    message: "votre prestation a été creer",
                                                })
                                            })
                                    })
                            })
                            .catch(err => {
                                res.status(502).json(err);
                            })

                    })
                    .catch(err => {
                        res.status(502).json(err);
                    })

            } else {
                res.json("la prestation est déja dans la base");
            }
        })
        .catch(err => {
            res.status(502).json(err);
        })

});

module.exports = router;