var express = require("express");
var router = express.Router();
var db = require("../database/db");


// Cette route permet créer une categorie
router.post("/new", (req, res) => {
    //recuperer le nom du categorie sera unique et l'id du produit
    db.categorie
        .findOne({
            where: { nom: req.body.nom, produitId: req.body.produitId },
        })
        // vient les recuperer
        .then((categorie) => {
            // categorie n'existe pas
            if (!categorie) {
                //categorie va le créer
                db.categorie
                    .create(req.body)
                    //vient le créer    // recevoir le message
                    .then((response) => res.json(response))
                    //attraper
                    .catch((err) => {
                        //recevoir le message d'erreur
                        res.json(err);
                    });
            } else {
                res.json("la catégorie existe déjà");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

module.exports = router;