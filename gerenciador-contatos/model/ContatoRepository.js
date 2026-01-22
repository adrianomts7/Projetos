'use strict';

class ContatoRepository{
  #contatos = [];

  salvarContatosLocalStorage() {
    localStorage.setItem("contatos", JSON.stringify(this.#contatos));
  }

  contatosSalvosLocalStorage() {
    return this.#contatos = JSON.parse(localStorage.getItem("contatos")) || [];
  }

  adicionarContato(contato) {
    this.#contatos.push(contato);
    this.salvarContatosLocalStorage();
  }

  getContato(idContato) {
    return  this.#contatos.filter( contato => contato.id === idContato )[0];
  }

  indiceContato(contato) {
    const indiceContato = this.#contatos.indexOf(contato);
    return indiceContato;
  }

  apagarContato(indiceContato) {
    const contatoApagado = this.#contatos.splice(indiceContato, 1)[0];
    return contatoApagado;
  }

  editarContato(indiceContato, dadosAtualizar) {
    Object.assign(this.#contatos[indiceContato], {
      nome: dadosAtualizar.nome,
      sobrenome: dadosAtualizar.sobrenome,
      telefone: dadosAtualizar.telefone,
      email: dadosAtualizar.email
    })
  }

  ordenarCrescente() {
    return this.#contatos.slice().sort((a, b) => b.nome.localeCompare(a.nome));
  }

  getListaContatosPadrao() {
    return this.#contatos;
  }

  contatosPesquisar(dados) {
    return this.#contatos.filter( contato => `${contato.nome} ${contato.sobrenome} ${contato.telefone} ${contato.email}`.toLowerCase().includes(dados) );
  }

}

export default new ContatoRepository();