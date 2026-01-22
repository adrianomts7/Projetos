'use strict';

class ContatoView {
  #containerForm = document.querySelector(".container__form");
  #containerConfirmacao = document.querySelector(".container__confirmacao-apagar-contato");
  #containerContatos = document.querySelector('.container__contatos');
  #sombra = document.querySelector(".sombra");
  #navHeader = document.querySelector(".nav__header");
  #headerSection = document.querySelector('.header__section');
  #inputNome = document.querySelector(".input__nome");
  #inputSobrenome = document.querySelector(".input__sobrenome");
  #inputTelefone = document.querySelector(".input__telefone");
  #inputEmail = document.querySelector(".input__email");
  #inputBusca = document.querySelector('.buscar');
  #mensagemForm = document.querySelector(".mensagem");
  #listaContatos = document.querySelector(".lista__contatos");
  #idContato;
  #tituloForm = document.querySelector(".titulo__form");
  #btnForm = document.querySelector(".btn__form");
  #iconeOrdenarLista = document.querySelector('.icone__ordenacao');
  #ordenacaoContato = 'normal';
  acaoForm;

  eventosNav(handler) {
    this.#navHeader.addEventListener('click', (e) => {
      this.limparInputs();
      handler();
    })
  }

  eventosHeaderSection(ordemContatos) {
    this.#headerSection.addEventListener('click', e => {
      if (e.target.closest('.icone__ordenacao')) {
        const ordenacao = this.#ordenacaoContato === 'decrescente' ? 'normal' : 'decrescente';

        const nomeOrdemIcone = ordenacao === 'decrescente' ? 'arrow-down-outline' : 'arrow-up-outline';
                
        if (this.#iconeOrdenarLista.classList.contains('normal')) {
          this.#mudarOrdemIcone(ordenacao, nomeOrdemIcone);
        }

        if (this.#iconeOrdenarLista.classList.contains('decrescente')) {
          this.#mudarOrdemIcone(ordenacao, nomeOrdemIcone);
        }

        ordemContatos(this.#ordenacaoContato);
      }; 

    });
  }

  eventosClickContainerForm(handler) {
    this.#containerForm.addEventListener('click', e => {
      if (e.target.closest('.area__fechar-section')) return handler();      
    })
  }

  eventoForm(cadastrarContato, atualizarContato) {
    this.#containerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dados = this.#getDadosFormulario();

      this.acaoForm === 'cadastrar' ? cadastrarContato(dados) : atualizarContato(dados);

    });
  }

  eventosContainerContatos(apagarContato, atualizarContato) {
    this.#containerContatos.addEventListener('click', e => {
      this.#idContato = e.target.dataset.id;

      if (e.target.closest('.btn__apagar-contato')) return apagarContato();

      if (e.target.closest('.btn__editar-contato')) {
        atualizarContato(this.#idContato);
      }

    });
  }

  eventosContainerConfirmacao(naoApagarContato, apagarContato) {
    this.#containerConfirmacao.addEventListener('click', e => {
      if (e.target.closest('.nao__apagar-contato')) return naoApagarContato();

      if (e.target.closest('.apagar__contato')) return apagarContato(this.#idContato);
        
    });
  }

  eventosInputBusca(handler) {
    this.#inputBusca.addEventListener('input', e => {
      handler(this.#inputBusca.value);
    });
  }

  mensagemForm(mensagem, tipoMensagem) {
    const mudarCorMensagem =(cor) => {
        this.#mensagemForm.style.color = cor;
      };

      this.#mensagemForm.textContent = mensagem;
      tipoMensagem === "sucesso"
        ? mudarCorMensagem("#2f9e44") : mudarCorMensagem("#e03131");

      setTimeout(() => {
        this.#mensagemForm.textContent = "Complete os campos abaixo";
        mudarCorMensagem("#212529");
      }, 5000);
  }

  colocarDadosInputForm(dados) {
    this.#inputNome.value = dados.nome;
    this.#inputSobrenome.value = dados.sobrenome;
    this.#inputTelefone.value = dados.telefone;
    this.#inputEmail.value = dados.email;
  }

  mudarDadosForm(tipoForm) {
    const textoBotao = tipoForm === 'atualizar' ? 'Atualizar Contato' : 'Cadastrar Contato';
    const corBotao = tipoForm === 'atualizar' ? '#1c7ed6' : '#2f9e44';
    const classRemover = tipoForm === 'atualizar' ? 'btn__cadastrar-contato' : 'btn__atualizar-contato';
    const classAdicionar = tipoForm === 'atualizar' ? 'btn__atualizar-contato' : 'btn__cadastrar-contato';

    if (tipoForm === 'atualizar') {
      this.#mudarTextoElemento(this.#tituloForm, textoBotao);
      this.#btnForm.classList.remove(classRemover);
      this.#btnForm.classList.add(classAdicionar);
      this.#btnForm.textContent = textoBotao;
      this.#tituloForm.style.color = corBotao;
    } 

    if (tipoForm === 'cadastrar') {
      this.#mudarTextoElemento(this.#tituloForm, textoBotao);
      this.#btnForm.classList.remove(classRemover);
      this.#btnForm.classList.add(classAdicionar);
      this.#btnForm.textContent = textoBotao;
      this.#tituloForm.style.color = corBotao;
    }
  }

  abrirModalForm() {
    this.#ficarVisivelOuEsconderElemento(this.#containerForm, 'block');
    this.#abrirSombra();
  }

  fecharModalForm(delayELimparInputs = false, sec) {

    const fecharModal = () => {
      this.#ficarVisivelOuEsconderElemento(this.#containerForm, 'none');
      this.#fecharSombra();  
    }

    if(delayELimparInputs && sec > 0) {
      setTimeout(() => {
        this.limparInputs();
        fecharModal();
      }, sec);
    } else {
      fecharModal();
    }
  }

  abrirModalConfirmacaoApagarContato() {
    this.#ficarVisivelOuEsconderElemento(this.#containerConfirmacao, 'block');
    this.#abrirSombra();
  }

  fecharModalConfirmacaoApagarContato() {
    this.#ficarVisivelOuEsconderElemento(this.#containerConfirmacao, 'none');
    this.#fecharSombra();
  }

  atualizarListaContatos(contatos) {
    this.#limpandoListaContatosUi();
    const contatosEl = contatos.map( contato => this.#renderizarContato(contato) );
    contatosEl.forEach( contato => this.#adicionarContatosLista(contato) );
  }

  limparInputs() {
    this.#inputNome.value = this.#inputSobrenome.value = this.#inputTelefone.value = this.#inputEmail.value = '';
  }

  #mudarOrdemIcone(ordenacao, nomeIcone) {
    this.#ordenacaoContato =  ordenacao;
    this.#iconeOrdenarLista.classList.add(ordenacao);
    this.#iconeOrdenarLista.name = nomeIcone;
  }

  #mudarTextoElemento(elemento, texto) {
    elemento.textContent = texto;
  }

  #getDadosFormulario() {
    return {
      nome: this.#inputNome.value,
      sobrenome: this.#inputSobrenome.value,
      telefone: this.#inputTelefone.value,
      email: this.#inputEmail.value,
    };
  }

  #ficarVisivelOuEsconderElemento(elemento, display) {
    elemento.style.display = display;
  }

  #limpandoListaContatosUi() {
    this.#listaContatos.querySelectorAll('.contato').forEach( contato => contato.remove() );
  }

  #renderizarContato(contato) {
    return `
      <li class="contato" data-id="${contato.id}">

          <p class="nome__contato data-id="${contato.id}">${contato.nome + " " + contato.sobrenome}</p>

          <div class="area__info-contato" data-id="${contato.id}">
            <div class="area__dados data-id="${contato.id}">

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
  }

  #adicionarContatosLista(contatoHtml) {
    this.#listaContatos.insertAdjacentHTML('afterbegin', contatoHtml);
  }

  #abrirSombra() {
    this.#ficarVisivelOuEsconderElemento(this.#sombra, 'block');
    document.body.style.overflow = "hidden";

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  #fecharSombra() {
    this.#ficarVisivelOuEsconderElemento(this.#sombra, 'none');
    document.body.style.overflow = "scroll";
  }

};

export default new ContatoView();