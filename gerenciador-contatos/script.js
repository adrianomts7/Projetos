"use strict";

class Contato {
  constructor(nome, sobrenome, telefone, email) {
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.telefone = telefone;
    this.email = email;
    this.id = new Date().getUTCMilliseconds();
  }
}

const navHeader = document.querySelector(".nav__header");
const sombra = document.querySelector(".sombra");
const containerForm = document.querySelector(".container__form");
const tituloForm = document.querySelector(".titulo__form");
const inputNome = document.querySelector(".input__nome");
const inputSobrenome = document.querySelector(".input__sobrenome");
const inputTelefone = document.querySelector(".input__telefone");
const inputEmail = document.querySelector(".input__email");
const mensagemForm = document.querySelector(".mensagem");
const listaContatos = document.querySelector(".lista__contatos");
const btnForm = document.querySelector(".btn__form");
const headerSection = document.querySelector(".header__section");
const containerConfirmacao = document.querySelector(
  ".container__confirmacao-apagar-contato"
);
const iconeOrdenacao = document.querySelector(".icone__ordenacao");
const inputBuscar = document.querySelector('.buscar');
const mensagemErroContainerContatos = document.querySelector('.mensagem__erro');

class App {
  #contatos = [];
  #indiceContato;
  #idContato;

  constructor() {
    this._contatosSalvosLocalStorage();

    navHeader.addEventListener("click", this._eventosNav.bind(this));
    containerForm.addEventListener("click", this._eventosForm.bind(this));
    listaContatos.addEventListener(
      "click",
      this._eventosListaContatos.bind(this)
    );
    containerConfirmacao.addEventListener(
      "click",
      this._eventosConfirmacao.bind(this)
    );
    headerSection.addEventListener("click", this._eventosHeader.bind(this));

    inputBuscar.addEventListener('input', this._filtrarContatos.bind(this));
  }

  _salvarContatosLocalStorage() {
    localStorage.setItem("contatos", JSON.stringify(this.#contatos));
  }

  _contatosSalvosLocalStorage() {
    this.#contatos = JSON.parse(localStorage.getItem("contatos")) || [];

    this._renderizarContatos();
  }

  _ficarVisivelOuEsconderElemento(elemento, display) {
    elemento.style.display = display;
  }

  _abrirSombra() {
    this._ficarVisivelOuEsconderElemento(sombra, 'block');
    document.body.style.overflow = "hidden";

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  _fecharSombra() {
    this._ficarVisivelOuEsconderElemento(sombra, 'none');
    document.body.style.overflow = "scroll";
  }

  _abrirModalForm() {
    this._ficarVisivelOuEsconderElemento(containerForm, 'block');
    this._abrirSombra();
  }

  _fecharModalForm() {
    this._ficarVisivelOuEsconderElemento(containerForm, 'none');
    this._fecharSombra();
  }

  _abrirModalConfirmacao() {
    this._ficarVisivelOuEsconderElemento(containerConfirmacao, 'block');
    this._abrirSombra();
  }

  _fecharModalConfirmacao() {
    this._ficarVisivelOuEsconderElemento(containerConfirmacao, 'none');
    this._fecharSombra();
  }

  _eventosNav(e) {
    if (e.target.closest(".btn__adicionar-contato")) {
      this._abrirModalForm();
      this._mudarFormCadastrar();
    }
  }

  _adicionandoContatoLista(contato) {
    const html = `
      <li class="contato" data-id="${contato.id}">

          <p class="nome__contato">${contato.nome + " " + contato.sobrenome}</p>

          <div class="area__info-contato">
            <div class="area__dados">

              <div class="centralizar__elementos-area">
                <ion-icon name="call-outline"></ion-icon>
                <p class="telefone__contato">${contato.telefone}</p>
              </div>

              <div class="centralizar__elementos-area">
                <ion-icon name="mail-outline"></ion-icon>
                <p class="email__contato">${contato.email}</p>
              </div>
            </div>

            <div class="area__butoes">
              <button class="btn btn__editar-contato" data-id="${contato.id}">
                <ion-icon name="pencil-outline" class="icone icone__editar-contato"></ion-icon>
                Editar
              </button>

              <button class="btn btn__apagar-contato" data-id="${contato.id}">
                <ion-icon name="trash-outline" class="icone icone__apagar-contato"></ion-icon>
                Apagar
              </button>

            </div>
          </div>

        </li>
    `;

    listaContatos.insertAdjacentHTML("afterbegin", html);
  }

  _limpandoListaContatos() {
    listaContatos.querySelectorAll(".contato").forEach((el) => el.remove());
  }

  _mudarDadosTitulo(titulo, mensagem) {
    titulo.textContent = mensagem;
  }

  _mudarCorElemento(elemento, cor) {
    elemento.style.color = cor;
  }

  _mudarFormAtualizar() {
    this._mudarDadosTitulo(tituloForm, 'Atualizar Contato');
    this._mudarCorElemento(tituloForm, "#1c7ed6")

    btnForm.classList.remove("btn__cadastrar-contato");
    btnForm.classList.add("btn__editar-contato");
    btnForm.textContent = "Atualizar Contato";
  }

  _mudarFormCadastrar() {
    this._limpandoInputs();
    this._mudarDadosTitulo(tituloForm, "Cadastro de Contato");
    this._mudarCorElemento(tituloForm, "#2f9e44");

    btnForm.classList.remove("btn__editar-contato");
    btnForm.classList.add("btn__cadastrar-contato");
    btnForm.textContent = "Cadastrar Contato";
  }

  _limpandoInputs() {
    inputNome.value =
      inputSobrenome.value =
      inputTelefone.value =
      inputEmail.value =
        "";
  }

  _eventosListaContatos(e) {
    this.#idContato = +e.target.dataset.id.slice(0, 3);
    const contato = this.#contatos.find(
      (contato) => contato.id === this.#idContato
    );
    this.#indiceContato = this.#contatos.indexOf(contato);

    if (e.target.closest(".btn__editar-contato")) {
      this._abrirModalForm();
      this._mudarFormAtualizar();

      inputNome.value = contato.nome;
      inputSobrenome.value = contato.sobrenome;
      inputTelefone.value = contato.telefone;
      inputEmail.value = contato.email;
    }

    if (e.target.closest(".btn__apagar-contato")) {
      this._abrirModalConfirmacao();
    }
  }

  _eventosForm(e) {
    const mensagemFormUsuario = function (mensagem, tipoMensagem) {
      const mudarCorMensagem = function (cor) {
        mensagemForm.style.color = cor;
      };

      mensagemForm.textContent = mensagem;
      tipoMensagem === "sucesso"
        ? mudarCorMensagem("#2f9e44")
        : mudarCorMensagem("#e03131");

      setTimeout(() => {
        mensagemForm.textContent = "Complete os campos abaixo";
        mudarCorMensagem("#212529");
      }, 5000);
    };

    const nome = inputNome.value;
    const sobrenome = inputSobrenome.value;
    const telefone = inputTelefone.value;
    const email = inputEmail.value;
    const regexTelefone = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]{2,}\.)+[a-zA-Z]{2,}$/;

    if (e.target.closest(".area__fechar-section"))
      return this._fecharModalForm();

    if (e.target.closest(".btn__cadastrar-contato")) {
      e.preventDefault();

      if (!nome || !sobrenome || !telefone || !email)
        return mensagemFormUsuario("Os campos não podem ficar vázios");
      if (nome.length < 2)
        return mensagemFormUsuario("Tamanho de nome inválido");
      if (!regexTelefone.test(telefone))
        return mensagemFormUsuario("Telefone inválido");
      if (!regexEmail.test(email))
        return mensagemFormUsuario("E-mail inválido");

      const contato = new Contato(nome, sobrenome, telefone, email);

      this.#contatos.push(contato);
      this._renderizarContatos()
      this._salvarContatosLocalStorage();
      mensagemFormUsuario("Contato salvo com sucesso!", "sucesso");

      setTimeout(() => {
        this._fecharModalForm();
        this._limpandoInputs();
      }, 3000);
    }

    if (e.target.closest(".btn__editar-contato")) {
      e.preventDefault();

      Object.assign(this.#contatos[this.#indiceContato], {
        nome,
        sobrenome,
        telefone,
        email,
      });
      mensagemFormUsuario("Contato atualizado com sucesso", "sucesso");
      this._salvarContatosLocalStorage();
      this._contatosSalvosLocalStorage();

      setTimeout(() => {
        this._fecharModalForm();
        this._limpandoInputs();
      }, 3000);
    }
  }

  _eventosConfirmacao(e) {
    if (e.target.closest(".nao__apagar-contato"))
      return this._fecharModalConfirmacao();

    if (e.target.closest(".apagar__contato")) {
      this.#contatos.splice(this.#indiceContato, 1);
      this._salvarContatosLocalStorage();
      this._contatosSalvosLocalStorage();
      this._fecharModalConfirmacao();
    }
  }

  _eventosHeader(e) {
    if (e.target.closest(".icone__ordenacao")) {
      let lista;

      const limparContainerMostrarNaTela = (listaContatos) => {
        this._renderizarContatos(listaContatos);
      };

      if (e.target.classList.contains("decrescente")) {
        lista = this.#contatos
          .slice()
          .sort((a, b) => a.nome.localeCompare(b.nome));

        iconeOrdenacao.name = "arrow-down-outline";
        iconeOrdenacao.classList.remove("decrescente");
        iconeOrdenacao.classList.add("crescente");
        limparContainerMostrarNaTela(lista);
        return;
      }

      if (e.target.classList.contains("crescente")) {
        lista = this.#contatos
          .slice()
          .sort((a, b) => b.nome.localeCompare(a.nome));
        
        iconeOrdenacao.name = "arrow-up-outline";
        iconeOrdenacao.classList.remove("crescente");
        iconeOrdenacao.classList.add("decrescente");
        limparContainerMostrarNaTela(lista);
        return;
      }
    }
  }

  _filtrarContatos() {
    const valor = inputBuscar.value.toLowerCase().trim();

    const contatosFiltrados = this.#contatos.slice().filter(contato =>  `${contato.nome} ${contato.sobrenome} ${contato.telefone} ${contato.email}`.toLowerCase().includes(valor));

    this._renderizarContatos(contatosFiltrados);
    
    this._limpandoMensagemErroTelaSectionContato();

    if (valor.length >= 1 && contatosFiltrados.length === 0) return this._mensagemErroSectionContato();

  }

  _renderizarContatos(contatos = this.#contatos) {
    this._limpandoListaContatos();
    contatos.forEach( contato => this._adicionandoContatoLista(contato) );
  }

  _mensagemErroSectionContato(mensagem = 'Contato não encontrado!') {
    this._limpandoMensagemErroTelaSectionContato();
    mensagemErroContainerContatos.textContent = mensagem;
  }

  _limpandoMensagemErroTelaSectionContato() {
    mensagemErroContainerContatos.textContent = '';
  }

}

const app = new App();
