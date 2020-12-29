const { authJwt } = require("../middlewares");
const controller = require("../controllers/admin.controller");

module.exports = function(app) {

    app.get(
        "/admin/accueil",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );

    app.get(
        "/admin/createEvent",
        [authJwt.verifyToken, authJwt.isAdmin],
        (req, res) => {
            res.render("FormulaireAdmin.html")
        }
    );

    app.post(
        "/admin/createEvent",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.createEvent
    );

};