const { verifySignUp } = require("../middlewares");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/signup", (req, res) => {
        res.render('Inscription.html')
    })

    /*app.get("/signin", (req, res) => {
        if (authJwt.verifyToken(req, res)){
            res.redirect('/')
        } else {
            res.render('Connexion.html')
        }
    })*/
    app.get("/signin", (req, res) => {
        res.render('Connexion.html')
    })

    app.get("/admin/signin", (req, res) => {
        res.render('ConnexionAdmin.html')
    })

    app.post(
        "/signup",
        [
            verifySignUp.checkDuplicateEmail
        ],
        controller.signup
    );

    app.post("/signin", controller.signin);

    app.post("/admin/signin", controller.signin);

    app.get("/", authJwt.verifyToken, (req, res, next) => {
        if (authJwt.isAdmin(req, res, next)) {
            res.redirect('/admin/accueil')
        } else {
            res.redirect('/planning')
        }
    })

    app.get("/home", (req, res) => {res.render('PremierePage.html')})

    app.get("/logout", controller.logout)

};