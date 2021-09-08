var express = require("express");
var router = express.Router();
var db = require("../database/db");


// Cette route permet créer une sousCategorie
router.post("/new", (req, res) => {
    //recuperer le nom du sousCategorie sera unique et l'id du produit
    db.sousCategorie
        .findOne({
            where: { nom: req.body.nom, produitId: req.body.produitId },
        })
        // vient les recuperer
        .then((sousCategorie) => {
            // categorie n'existe pas
            if (!sousCategorie) {
                //categorie va le créer
                db.sousCategorie
                    .create(req.body)
                    //vient le créer    // recevoir le message
                    .then((response) => res.json(response))
                    //attraper
                    .catch((err) => {
                        //recevoir le message d'erreur
                        res.json(err);
                    });
            } else {
                res.json("la sousCategorie existe déjà");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

module.exports = router;