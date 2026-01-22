'use strict';

export class Contato {
  #regexTelefone = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
  #regexEmail = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]{2,}\.)+[a-zA-Z]{2,}$/;

  
  constructor(nome, sobrenome, telefone, email) {
    if (!nome || !sobrenome || !telefone || !email)
      throw new Error("Os campos não podem ficar vázios");
    
    if (nome.length < 2)
      throw new Error("Tamanho de nome inválido");
    
    if (!this.#regexTelefone.test(telefone))
      throw new Error("Telefone inválido");
    
    if (!this.#regexEmail.test(email))
      throw new Error("E-mail inválido");

    this.nome = nome;
    this.sobrenome = sobrenome;
    this.telefone = telefone;
    this.email = email;
    this.id = new Date().getUTCMilliseconds();
  }
};

export const dadosContatoAtualizar = {
  dados: {},
  indiceContato: 0,
};