var inputs = '';
for (var i = 1; i <= 10; i++) {
    inputs += '<input name="scores" type="radio" value="' + i + '" id="' + i + '">'+i+'';
}
document.getElementById('NPSform').insertAdjacentHTML('afterbegin', inputs);