'use strict';

class Tarefa {
  constructor(nome, descricao, categoria, status) {
    this.id = new Date().getHours() + new Date().getUTCMilliseconds();
    this.nome = nome;
    this.descricao = descricao;
    this.categoria = categoria;
    this.status = status;
    this.dataCriacao = new Intl.DateTimeFormat('pt-BR').format(new Date());
  }
}

const sombra = document.querySelector('.sombra');

const navHeader = document.querySelector('.nav__header');
const linkCadastro = document.querySelector('.link__cadastrar-tarefa');

const selectFiltroTabela = document.querySelector('.select__tabela-filtro');
const areaSelectHeader = document.querySelector('.area__select-header');

const containerTabela = document.querySelector('.container__tabela');
const tabelaTarefas = document.querySelector('.tabela__tarefa');
const linhaTabela = document.querySelector('.linha__tabela');
const btnEditarTarefa = document.querySelector('.editar__tarefa');
const btnApagarTarefa = document.querySelector('.apagar__tarefa');

const containerForm = document.querySelector('.container__form');
const tituloForm = document.querySelector('.titulo__container-registro');
const mensagemForm = document.querySelector('.mensagem');
const form = document.querySelector('.form__cadastro');
const inputNomeTarefa = document.querySelector('.input__nome-tarefa');
const inputDescricaoTarefa = document.querySelector('.input__descricao-tarefa');
const selectStatusTarefa = document.querySelector('.select__status-tarefa');
const selectCategoriaTarefa = document.querySelector('.select__categoria-tarefa');
const btnCadastrarTarefa = document.querySelector('.btn__cadastrar-tarefa');

const iconeFecharPagina = document.querySelector('.icon__fechar');

const containerTarefa = document.querySelector('.container__tarefa');
const tituloDetalhesTarefa = document.querySelector('.titulo__detalhes-tarefa');

const containerConfirmacao = document.querySelector('.container__confirmacao');

class App {
  #tarefas = [];
  #indiceTarefa;
  
  constructor() {
    this._tarefasSalvasLocalStorage();

    areaSelectHeader.addEventListener('click', this._filtrarTarefas.bind(this));
    containerForm.addEventListener('click', this._criarNovaTarefa.bind(this));
    containerTarefa.addEventListener('click', this._eventosDetalhesTarefa.bind(this));
    containerConfirmacao.addEventListener('click', this._apagarTarefaConfirmacao.bind(this));
    navHeader.addEventListener('click', this._direcionarUsuario.bind(this));
    tabelaTarefas.addEventListener('click', this._eventosTabela.bind(this));
  }

  _pegarValorInput(input) {
    return input.value;
  }

  _limparInputsCadastro() {
    inputNomeTarefa.value = inputDescricaoTarefa.value = '';
  }

  _salvarTarefasLocalStorage() {
    localStorage.setItem('tarefas', JSON.stringify(this.#tarefas));
  }

  _tarefasSalvasLocalStorage() {
    this.#tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    this.#tarefas.forEach(tarefa => this._exibirTarefaTabela(tarefa));
  }

  _filtrarTarefas(e) {
    e.preventDefault();

    if (e.target.value === 'todos') {
      this._limparTabelaTarefa();
      this.#tarefas.forEach( tarefa => this._exibirTarefaTabela(tarefa) )
    }

    if (e.target.value === 'pendente') {
      this._limparTabelaTarefa();
      this.#tarefas.filter( tarefa => this._formatandoStatusPadrao(tarefa.status) === 'emAndamento' || this._formatandoStatusPadrao(tarefa.status) === 'naoIniciado').forEach( tarefasPendentes => this._exibirTarefaTabela(tarefasPendentes) );
    }

    if (e.target.value === 'concluido') {
      this._limparTabelaTarefa();
      this.#tarefas.filter( tarefa => this._formatandoStatusPadrao(tarefa.status) === 'concluido' ).forEach( tarefaConcluida => this._exibirTarefaTabela(tarefaConcluida) );
    }

  }

  _criarNovaTarefa(e) {
    e.preventDefault();

    const _mensagemFormUsuario = function(mensagem, errorOuSucesso) {
      const _mudarCorMensagem = cor => mensagemForm.style.color = cor;
      const textoMensagem = texto => mensagemForm.textContent = texto;
      
      textoMensagem(mensagem);

      _mudarCorMensagem(`${errorOuSucesso === 'sucesso' ? '#0ca678' : '#e03131'}`); 

      setTimeout(() => {
        _mudarCorMensagem('#212529');
        textoMensagem('Cadastre suas tarefas diárias');
      }, 5000)
    } 

    const _fechandoModaleLimpandoInputs = () => {
      setTimeout(() => { 
        this._fecharSectionForm();
        this._limparInputsCadastro();
      }, 2000);
    }

    if (e.target.classList.contains('icon__fechar')) {
      this._limparInputsCadastro();
      this._fecharSectionForm();
      return 
    } 

    
    if (e.target.classList.contains('btn__editar-tarefa')) {
      const nome = this._pegarValorInput(inputNomeTarefa);
      const descricao = this._pegarValorInput(inputDescricaoTarefa);
      let status = this._pegarValorInput(selectStatusTarefa);
      const categoria = this._pegarValorInput(selectCategoriaTarefa);
      
      status = this._formatandoStatus(status);
      
      Object.assign(this.#tarefas[this.#indiceTarefa], { nome, descricao, status, categoria });
      
      _mensagemFormUsuario('Tarefa atualizada com sucesso!', 'sucesso');

      this._limparTabelaTarefa();
      this._salvarTarefasLocalStorage();
      this._tarefasSalvasLocalStorage();
      _fechandoModaleLimpandoInputs();
    }

    if (e.target.classList.contains('btn__cadastrar-tarefa')) {     
      const nome = this._pegarValorInput(inputNomeTarefa);
      const descricao = this._pegarValorInput(inputDescricaoTarefa);
      let status = this._pegarValorInput(selectStatusTarefa);
      const categoria = this._pegarValorInput(selectCategoriaTarefa);
        
      if (!nome || !descricao ) return _mensagemFormUsuario('Os campos não podem ficar vázio!');
      if (nome.length <= 2) return _mensagemFormUsuario('Tamanho do nome da tarefa inválido!');
      if (descricao.length <= 5) return _mensagemFormUsuario('Digite uma descrição válida!');

      status = this._formatandoStatus(status); 
      const tarefa =  new Tarefa(nome, descricao, categoria, status);

      this.#tarefas.push(tarefa);
      this._exibirTarefaTabela(tarefa);
      this._salvarTarefasLocalStorage();
      _mensagemFormUsuario('Tarefa Cadastrada com sucesso!', 'sucesso');

      _fechandoModaleLimpandoInputs();
    }

  }

  _direcionarUsuario(e) {
    e.preventDefault();

    if (e.target.classList.contains('link__cadastrar-tarefa')) {
      this._mudarTextosParaCadastrar();
      this._abrirSectionForm()
    };
    
  }

  _abrirSectionForm() {
    sombra.style.display = 'block';
    containerForm.style.display = 'block';
  }

  _fecharSectionForm() {
    sombra.style.display = 'none';
    containerForm.style.display = 'none';
  }

  _exibirTarefaTabela(tarefa) {
    const html = ` 
        <tr class="tarefa__salva">
          <td>${tarefa.nome}</td>
          <td>${tarefa.status}</td>
          <td>${tarefa.categoria}</td>
          <td>${tarefa.dataCriacao}</td>
          <td><button class="btn__tarefas detalhes__tarefa" data-id="${tarefa.id}">Detalhes</button></td>
          <td><button class="btn__tarefas apagar__tarefa" data-id="${tarefa.id}">Apagar</button></td>
        </tr>
      `

    linhaTabela.insertAdjacentHTML('beforebegin', html);
  }

  _formatandoStatus(status) {
    if (status === 'naoIniciado') return 'Não Iniciado';
    if (status === 'emAndamento') return 'Em Andamento';
    if (status === 'concluido') return status;
  }
  
  _formatandoStatusPadrao(status) {
    if (status === 'Não Iniciado') return 'naoIniciado';
    if (status === 'Em Andamento') return 'emAndamento';
    if (status === 'concluido') return status;
  }

  _limparTabelaTarefa() {
      tabelaTarefas.querySelectorAll('.tarefa__salva').forEach(el => el.remove());
    }

  _apagarTarefa(indiceTarefa) {
    this.#tarefas.splice(indiceTarefa, 1);  
      this._limparTabelaTarefa();
      this._salvarTarefasLocalStorage();
      this._tarefasSalvasLocalStorage();
      this._fecharModalConfirmacaoTarefa();
  }

  _eventosTabela(e) {
    e.preventDefault();
    
    const idTarefa = +e.target.dataset.id;

    const tarefa = this.#tarefas.find( tarefa => tarefa.id === idTarefa );

    this.#indiceTarefa = this.#tarefas.indexOf(tarefa);

    if (e.target.classList.contains('detalhes__tarefa')) return this._exibirDetalhes(tarefa);

    if (e.target.classList.contains('apagar__tarefa')) return this._abrirModalConfirmacaoTarefa();

  }

  _exibirSectionTarefa() { 
    containerTarefa.style.display = 'flex';
    sombra.style.display = 'block';
    }

  _fecharSectionTarefa = function() {
      containerTarefa.style.display = 'none';
      sombra.style.display = 'none';
    }  

  _exibirDetalhes(tarefa) {
    
    const _limparContainerDetalhes = function() {
      containerTarefa.querySelectorAll('.area__tarefa, .botoes__tarefa-descricao').forEach(el => el.remove());
    }

    _limparContainerDetalhes();
    this._exibirSectionTarefa();
    this._exibirTarefaDetalhes(tarefa);

  }

  _exibirTarefaDetalhes(tarefa) {

     const html = `
      <div class="area__tarefa">
        <p class="tarefa__titulo tarefa__nome-titulo">Nome da Tarefa:</p>
        <p class="tarefa__servico">${tarefa.nome}</p>
      </div>

      <div class="area__tarefa">
        <p class="tarefa__titulo tarefa__descricao-titulo">Descrição da Tarefa:</p>
        <p class="tarefa__servico tarefa__descricao-servico">${tarefa.descricao}</p>
      </div>

      <div class="area__tarefa">
        <p class="tarefa__titulo tarefa__categoria-titulo">Categoria:</p>
        <p class="tarefa__servico">${tarefa.categoria}</p>
      </div>

      <div class="area__tarefa">
        <p class="tarefa__titulo tarefa__status-titulo">Status:</p>
        <p class="tarefa__servico">${tarefa.status}</p>
      </div>  

      <div class="area__tarefa">
        <p class="tarefa__titulo tarefa__data-titulo">Data de Criação:</p>
        <p class="tarefa__servico">${tarefa.dataCriacao}</p>
      </div>
      
      <div class="botoes__tarefa-descricao">
        <button class="btn__tarefas editar__tarefa btn__tarefa-detalhes">Editar Tarefa</button>
        <button class="btn__tarefas apagar__tarefa btn__tarefa-detalhes">Apagar Tarefa</button>
      </div>
    `;

    tituloDetalhesTarefa.insertAdjacentHTML('afterend', html);
  }

  _eventosDetalhesTarefa(e) {
    if (e.target.classList.contains('icon__fechar')) return this._fecharSectionTarefa();

    if(e.target.classList.contains('apagar__tarefa')) {
      this._fecharSectionTarefa();
      this._abrirModalConfirmacaoTarefa();
      return;
    } 
    
    if (e.target.classList.contains('editar__tarefa')) {
      this._fecharSectionTarefa();
      this._abrirSectionForm();
      this._mudarTextosParaAtualizar();

      const tarefa = this.#tarefas[this.#indiceTarefa];
      this._colocarValoresInput(tarefa);
      return;
    }

  }

  _colocarValoresInput(tarefa) {
    inputNomeTarefa.value = tarefa.nome;
    inputDescricaoTarefa.value = tarefa.descricao;
    selectStatusTarefa.value = this._formatandoStatusPadrao(tarefa.status);
    selectCategoriaTarefa.value = tarefa.categoria;
  }

  _abrirModalConfirmacaoTarefa() {
    containerConfirmacao.style.display = 'block';
    sombra.style.display = 'block';
  }

  _fecharModalConfirmacaoTarefa() {
    containerConfirmacao.style.display = 'none';
    sombra.style.display = 'none';
  }

  _mudarTextosParaAtualizar() {
    tituloForm.textContent = 'Atualizar Tarefa';
    tituloForm.style.color = '#f59f00';
    mensagemForm.textContent = 'Complete os campos para atualizar a sua tarefa';
    btnCadastrarTarefa.textContent = 'Atualizar Tarefa';
    btnCadastrarTarefa.classList.remove('btn__cadastrar-tarefa');
    btnCadastrarTarefa.classList.add('editar__tarefa', 'btn__editar-tarefa');
  }

  _mudarTextosParaCadastrar() {
    tituloForm.textContent = 'Registre a sua nova Tarefa';
    mensagemForm.textContent = 'Cadastre suas tarefas diárias';
    btnCadastrarTarefa.textContent = 'Cadastrar Tarefa';
    tituloForm.style.color = '#0ca678';
    btnCadastrarTarefa.classList.remove('editar__tarefa', 'btn__editar-tarefa')
    btnCadastrarTarefa.classList.add('btn__cadastrar-tarefa');
  }

  _apagarTarefaConfirmacao(e) {
    if (e.target.classList.contains('btn__confirmacao-sim')) return this._apagarTarefa(this.#indiceTarefa);
    if (e.target.classList.contains('btn__confirmacao-nao')) return this._fecharModalConfirmacaoTarefa();
  }

}

const app = new App();