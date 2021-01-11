const mongoose = require('mongoose');
const reservation_etudiant = new mongoose.Schema({
    NomGroupe : {
        type : String,
    },
    TuteurPolytech : {
        type : String,
    },
    TuteurEntreprise : {
        type : String,
    },
});

module.exports = mongoose.model('reservation_etudiant', reservation_etudiant);
