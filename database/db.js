const Sequelize = require("sequelize");

const db = {};

const dbinfo = new Sequelize("hairStyle", "root", "", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    pool: {
        max: 5,
        min: 0,
    },
});

dbinfo
    .authenticate()
    .then(() => {
        console.log("connection sur mon db");
    })
    .catch((err) => {
        console.error("unable to connect to the database:" + err);
    });



db.user = require("../models/User")(dbinfo, Sequelize)
db.client = require("../models/Client")(dbinfo, Sequelize);
db.salon = require("../models/Salon")(dbinfo, Sequelize);
db.avis = require("../models/Avis")(dbinfo, Sequelize);
db.blog = require("../models/Blog")(dbinfo, Sequelize);
db.carteMenu = require("../models/CarteMenu")(dbinfo, Sequelize);
db.categorie = require("../models/Categorie")(dbinfo, Sequelize);
db.coiffeur = require("../models/Coiffeur")(dbinfo, Sequelize);
db.commande = require("../models/Commande")(dbinfo, Sequelize);
db.facture = require("../models/Facture")(dbinfo, Sequelize);
db.fournisseur = require("../models/Fournisseur")(dbinfo, Sequelize);
db.gestionPlanning = require("../models/GestionPlanning")(dbinfo, Sequelize);
db.livraison = require("../models/Livraison")(dbinfo, Sequelize);
db.marque = require("../models/Marque")(dbinfo, Sequelize);
db.paiement = require("../models/Paiement")(dbinfo, Sequelize);
db.produit = require("../models/Produit")(dbinfo, Sequelize);
db.sousCategorie = require("../models/SousCategorie")(dbinfo, Sequelize);
db.statistique = require("../models/Statistique")(dbinfo, Sequelize);
db.typeDePaiement = require("../models/TypeDePaiement")(dbinfo, Sequelize);
db.ville = require("../models/Ville")(dbinfo, Sequelize);
db.video = require("../models/Video")(dbinfo, Sequelize);
db.image = require("../models/Image")(dbinfo, Sequelize);



db.concerner = require("../models/Concerner")(dbinfo, Sequelize);
db.notersalon = require("../models/Notersalon")(dbinfo, Sequelize);
db.impliquer = require("../models/Impliquer")(dbinfo, Sequelize);
db.contenir = require("../models/Contenir")(dbinfo, Sequelize);
db.noterproduit = require("../models/noterproduit")(dbinfo, Sequelize);
db.fournir = require("../models/Fournir")(dbinfo, Sequelize);
db.detenir = require("../models/Detenir")(dbinfo, Sequelize);
db.posseder = require("../models/Posseder")(dbinfo, Sequelize);

db.carteMenu.hasMany(db.image, { foreignKey: "carteMenuId" });
db.salon.hasMany(db.image, { foreignKey: "salonId" });
db.coiffeur.hasMany(db.client, { foreignKey: "coiffeurId" });
db.salon.hasMany(db.gestionPlanning, { foreignKey: "salonId" });
db.ville.hasMany(db.salon, { foreignKey: "villeId" });
db.salon.hasOne(db.coiffeur, { foreignKey: "salonId" });
db.salon.hasMany(db.client, { foreignKey: "salonId" });
db.livraison.hasMany(db.commande, { foreignKey: "livraisonId" });
db.typeDePaiement.hasMany(db.paiement, { foreignKey: "typeDePaiementId" });
db.marque.hasMany(db.produit, { foreignKey: "marqueId" });
db.marque.hasMany(db.image, { foreignKey: "marqueId" });

db.salon.belongsToMany(db.statistique, { through: "Concerner", foreignKey: "salonId" });
db.statistique.belongsToMany(db.salon, { through: "Concerner", foreignKey: "statistiqueId" });

db.salon.belongsToMany(db.carteMenu, { through: "Posseder", foreignKey: "salonId" });
db.carteMenu.belongsToMany(db.salon, { through: "Posseder", foreignKey: "carteMenuId" });

db.salon.belongsToMany(db.avis, { through: "notersalon", foreignKey: "salonId" });
db.avis.belongsToMany(db.salon, { through: "notersalon", foreignKey: "avisId" });

db.produit.belongsToMany(db.statistique, { through: "Impliquer", foreignKey: "produitId" });
db.statistique.belongsToMany(db.produit, { through: "Impliquer", foreignKey: "statistiqueId" });

db.produit.belongsToMany(db.avis, { through: "noterproduit", foreignKey: "produitId" });
db.avis.belongsToMany(db.produit, { through: "noterproduit", foreignKey: "avisId" });

db.produit.belongsToMany(db.sousCategorie, { through: "Detenir", foreignKey: "produitId" });
db.sousCategorie.belongsToMany(db.produit, { through: "Detenir", foreignKey: "sousCategorieId" });

db.notersalon.belongsTo(db.salon, { foreignKey: 'salonId', as: 'salon', });
db.notersalon.belongsTo(db.client, { foreignKey: 'clientId', as: 'client', });



db.paiement.hasMany(db.commande, { foreignKey: "paiementId" });
db.categorie.hasMany(db.sousCategorie, { foreignKey: "categorieId" });
db.paiement.hasOne(db.facture, { foreignKey: "paiementId" });
db.blog.hasMany(db.client, { foreignKey: "blogId" });
db.client.hasMany(db.avis, { foreignKey: "clientId" });
db.client.hasMany(db.commande, { foreignKey: "clientId" });
db.produit.hasMany(db.image, { foreignKey: "produitId" });
db.blog.hasMany(db.image, { foreignKey: "blogId" });

db.commande.belongsToMany(db.produit, { through: "Contenir", foreignKey: "commandeId" });
db.produit.belongsToMany(db.commande, { through: "Contenir", foreignKey: "produitId" });

db.produit.belongsToMany(db.fournisseur, { through: "Fournir", foreignKey: "produitId" });
db.fournisseur.belongsToMany(db.produit, { through: "Fournir", foreignKey: "fournisseurId" });

//lien entre la clé étrangére et la table de référence
db.noterproduit.belongsTo(db.produit, { foreignKey: 'produitId', as: 'produit', });
db.noterproduit.belongsTo(db.client, { foreignKey: 'clientId', as: 'client', });

db.dbinfo = dbinfo;
db.Sequelize = Sequelize;

//dbinfo.sync({ force: true });

module.exports = db;