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

    app.get(
        "/admin/planning",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminPlanning
    );

    app.get(
        "/admin/proposeTimeSlot",
        [authJwt.verifyToken, authJwt.isAdmin],
        (req, res) => {
            res.render("ProposerCreneau.html", {eventID: req.query.eventID})
        }
    );

    app.post(
        "/admin/proposeTimeSlot/:eventID",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.proposeTimeSlot
    );

};