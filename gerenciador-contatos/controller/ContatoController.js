"use strict";

import view from "../view/ContatoView.js";
import * as model from "../model/ContatoModel.js";
import repository from "../model/ContatoRepository.js";

let acaoForm;

const abrirModalForm = function () {
  view.abrirModalForm();
  acaoForm = "cadastrar";

  view.mudarDadosForm(acaoForm);
  view.acaoForm = acaoForm;
};

const fecharModalForm = function () {
  view.fecharModalForm();
};

const abrirModalApagarContato = function () {
  view.abrirModalConfirmacaoApagarContato();
};

const fecharModalApagarContato = function () {
  view.fecharModalConfirmacaoApagarContato();
};

const verificarContatoRenderizar = function (contatos = [], mensagem = 'Nenhum contato Cadastrado!') {
  contatos.length < 1
    ? view.mensagemContato(true, mensagem)
    : view.mensagemContato();
};

const renderizarContatos = function () {
  const contatos = repository.contatosSalvosLocalStorage();

  verificarContatoRenderizar(contatos);

  view.atualizarListaContatos(contatos);
};

const cadastrarContato = function (dados) {
  try {
    const { nome, sobrenome, telefone, email } = dados;

    const contato = new model.Contato(nome, sobrenome, telefone, email);

    repository.adicionarContato(contato);
    renderizarContatos();

    view.mensagemForm("Contato Cadastrado com sucesso!", "sucesso");

    view.fecharModalForm(true, 3000);
  } catch (err) {
    view.mensagemForm(err.message);
  }
};

const apagarContato = function (idContato) {
  // Transformando o idContato em um número.
  const contato = repository.getContato(+idContato);
  const indiceContato = repository.indiceContato(contato);
  const contatoDeletado = repository.apagarContato(indiceContato);

  if (contato === contatoDeletado) alert("Contato Deletado com Sucesso!");

  repository.salvarContatosLocalStorage();
  renderizarContatos();

  view.fecharModalConfirmacaoApagarContato();
};

const dadosContatoAtualizar = function (idContato) {
  // Transformando o idContato em um número.
  const contato = repository.getContato(+idContato);
  const indiceContato = repository.indiceContato(contato);
  view.abrirModalForm();

  acaoForm = "atualizar";

  view.mudarDadosForm(acaoForm);
  view.acaoForm = acaoForm;

  view.colocarDadosInputForm(contato);
  model.dadosContatoAtualizar.dados = contato;
  model.dadosContatoAtualizar.indiceContato = indiceContato;
};

const atualizandoContato = function (dadosAtualizados) {
  const { indiceContato } = model.dadosContatoAtualizar;
  repository.editarContato(indiceContato, dadosAtualizados);

  repository.salvarContatosLocalStorage();
  renderizarContatos();

  view.mensagemForm("Contato Editado com Sucesso", "sucesso");
  view.fecharModalForm(true, 3000);
};

const ordenacaoContatos = function (ordenacao) {
  const contatosDesordenados = repository.ordenarCrescente();
  const contatosNormal = repository.getListaContatosPadrao();

  const contatosLista =
    ordenacao === "decrescente" ? contatosDesordenados : contatosNormal;

  view.atualizarListaContatos(contatosLista);
};

const buscarContato = function (dadosContato) {
  const dadosBuscarContato = dadosContato.toLowerCase();
  const contatoProcurado = repository.contatosPesquisar(dadosBuscarContato);

  Number(dadosBuscarContato.length) < 1 ? verificarContatoRenderizar() : verificarContatoRenderizar(contatoProcurado, 'Nenhum contato cadastrado com esses dados!');

  view.atualizarListaContatos(contatoProcurado);
};

const init = function () {
  renderizarContatos();

  view.eventosNav(abrirModalForm);
  view.eventosHeaderSection(ordenacaoContatos);
  view.eventosContainerConfirmacao(fecharModalApagarContato, apagarContato);
  view.eventosContainerContatos(abrirModalApagarContato, dadosContatoAtualizar);
  view.eventosClickContainerForm(fecharModalForm);
  view.eventoForm(cadastrarContato, atualizandoContato);
  view.eventosInputBusca(buscarContato);
};

init();
