const express = require('express');
const router = express.Router();
const reservation_etudiant = require('./../models/reservation_etudiant');

router.post('/', (req,res) => {
    const newReservation = new reservation_etudiant({
        NomGroupe : req.body.titre,
        TuteurPolytech : req.body.TuteurPolytech,
        TuteurEntreprise : req.body.TuteurEntreprise,
    });
    newReservation.save(function(err){
        if (err) {
            console.log(err)
        } else {
            res.send("Réservation effectué !")
        }
    })
    
});

module.exports = router;