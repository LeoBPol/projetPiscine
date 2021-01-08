const form = document.getElementById('form');
const id = document.getElementById('exampleInputEmail1');
const password = document.getElementById('exampleInputPassword1');
const errorElement = document.getElementById('error');

form.addEventListener('submit', (e) => {
    let message = [];
    if (id.value === '' || id.value == null) {
        message.push("L'adresse e-mail est requise !");
    }
    if (password.value === '' || password.value == null) {
        message.push("Le mot de passe est requis !");
    }
    if (password.value.length <= 6 && password.value.length > 0) {
        message.push("Le mot de passe doit faire plus de 6 caractères !");
    }
    if (password.value.length > 20) {
        message.push("Le mot de passe doit faire moins de 20 caractères !");
    }
    if (message.length > 0) {
        e.preventDefault();
        errorElement.innerText = message.join('\n');
        errorElement.classList.add('alert')
        errorElement.classList.add('alert-danger')
        errorElement.classList.add('alert-dismissible fade show')
    }
});

