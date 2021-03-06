const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/planning",
        authJwt.verifyToken,
        controller.userBoard
    );

    app.get("/groupRegistration",
        authJwt.verifyToken,
        controller.getGroupRegistration
    );

    app.post("/groupRegistration",
        authJwt.verifyToken,
        controller.groupRegistration
    );

    app.put("/planning",
        authJwt.verifyToken,
        controller.userBooking
    );

};