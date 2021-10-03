var Express = require("express");
var cors = require("cors");
var BodyParser = require("body-parser");

var hostname = "localhost";
var port = 3000;

var app = Express();

app.use(cors());
app.use(BodyParser.urlencoded({ extented: false }));
app.use(BodyParser.json());

app.use("/client", require("./router/client"));
app.use("/user", require("./router/user"));
app.use("/salon", require("./router/salon"));
app.use("/produit", require("./router/produit"));
app.use("/blog", require("./router/blog"));


app.use("/notersalon", require("./router/notersalon"));
app.use("/noterproduit", require("./router/noterproduit"));
app.use("/", require("./router/nodemailer"));
app.use("/categorie", require("./router/categorie"));
app.use("/sousCategorie", require("./router/sousCategorie"));
app.use("/marque", require("./router/marque"));
app.use("/commande", require("./router/commande"));
app.use("/carteMenu", require("./router/carteMenu"));
app.use("/coiffeur", require("./router/coiffeur"));


app.listen(port, hostname, function() {
    console.log(
        "mon server fonctionne sur http://" + hostname + ":" + port + "/n"
    );
});