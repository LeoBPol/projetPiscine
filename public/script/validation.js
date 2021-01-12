function buttonClicked() {
    date = document.getElementById('selected-date')
    horraire = document.getElementById('selected-time')
    a = document.getElementById('demo').innerHTML
    if (a) {
        document.getElementById('demo2').innerHTML = 'Votre réservation a bien été enregistrée !'
    }
    else {
        document.getElementById('demo2').innerHTML = 'Veuillez Sélectionner un créneau'
    }
}