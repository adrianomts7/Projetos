'use strict';


document.querySelector('.icon--senha').addEventListener('click', function() {
  const senha = document.querySelector('.password--input');

  if (this.name === 'eye-outline') {
    this.name = 'eye-off-outline';
    senha.type = 'text'
  } 
  else {
    this.name = 'eye-outline';
    senha.type = 'password';
  }
  
})

const button = document.querySelector('.button');;
button.addEventListener('click', function(e) {
  e.preventDefault();

  const login = document.querySelector('.login--input').value;
  const password = document.querySelector('.password--input').value;
  const messages = document.querySelector('.messages');

  const limparMensagens = () => messages.textContent = '';


  if (!login || !password) {
    messages.textContent = 'Login ou senha inválido';
    setTimeout(() => limparMensagens(), 3000);
    return
  };

  if (login.length < 5 || password.length < 7) {
    messages.textContent = 'Login ou senha inválido';
    setTimeout(() => limparMensagens(), 3000); 
    return
  };

})