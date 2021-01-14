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
        controller.getEventCreation
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
        controller.getTimeSlotProposition
    );

    app.post(
        "/admin/proposeTimeSlot/:eventID",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.proposeTimeSlot
    );

    app.get(
        "/admin/manageTeachers",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.manageTeachers
    );

    app.post(
        "/admin/manageTeachers",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.addTeacher
    );

    app.delete(
        "/admin/manageTeachers/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteTeacher
    );

    app.get(
        "/admin/manageRooms",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.manageRooms
    );

    app.post(
        "/admin/manageRooms",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.addRoom
    );

    app.delete(
        "/admin/manageRooms/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteRoom
    );

    app.get(
        "/admin/manageJuries",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.manageJuries
    );

    app.post(
        "/admin/manageJuries/:eventid",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.addJury
    );

    app.delete(
        "/admin/manageJuries/:id/:eventid",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteJury
    );

    app.put(
        "/admin/planning",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.editTimeSlot
    )
};