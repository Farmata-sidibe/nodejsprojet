const Express = require("express"),
    router = Express.Router(),
    db = require("../database/db");


router.post("/new", (req, res) => {
    console.log(req.body);
    db.blog
        .findOne({
            where: { astuce: req.body.astuce },
        })
        .then((blog) => {
            if (!blog) {
                db.blog
                    .create(req.body)
                    .then((blogitem) => {
                        db.image
                            .create({
                                image: req.body.image,
                                blogitem: blogitem.id,
                            })
                            .then((image) => {
                                res.status(200).json({
                                    blog: blogitem,
                                    blog: image,
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
                blog
                    .update({
                        article: req.body.article,
                    })
                    .then((rep) => {
                        res.status(200).json({ blog: rep });
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
    db.blog
        .findAll({
            include: [{
                model: db.image,
            }, ],
        })
        .then((blogs) => {
            if (blogs) {
                res.status(200).json({
                    blogs: blogs,
                });
            } else {
                res.status(404).json("il n'a pas de blogs");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

router.post("/add", (req, res) => {
    var blogs = {
        astuce: req.body.astuce,

    };
    //crée une nouvelle occurence( ajouter une nouvelle ligne)  qui va ajouter blogs
    db.blog.create(blogs)

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

router.post('/addimage', (req, res) => {
    db.image.create({
            image: req.body.image,
            blogId: req.body.id
        })
        .then(() => {
            db.blog.findOne({
                    where: { id: req.body.id },
                    include: [{
                            model: db.image
                        }

                    ]
                })
                .then(blog => {
                    res.status(200).json({
                        blog: blog
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

module.exports = router;