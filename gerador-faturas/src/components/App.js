import { useState } from "react";

import Header from "./Header";
import FormFatura from "./FormFatura";
import ListaFaturas from "./ListaFatura";
import CampoComplementar from "./CampoComplementar";

export default function App() {
  return (
    <div>
      <GeradorFatura />
    </div>
  );  
}

function GeradorFatura() {
  const [isModal, setIsModal] = useState(false);
  const [listaClientes, setListaClientes] = useState([]);
  const [mostrarMaisInfo, setMostrarMaisInfo] = useState(null);
  const [dadosAcao, setDadosAcao] = useState(null);
  const [confirmacaoPagarFatura, setConfirmacaoPagarFatura] = useState(false);
  const [dadosPagarFatura, setDadosPagarFatura] = useState(null);
    
  function mostrarMaisInfoFatura(idSelecionado) {
    setMostrarMaisInfo(id => id === idSelecionado ? null : idSelecionado);
  }
  
  function novaFatura(fatura, idCliente, faturaPaga) {
    setListaClientes(clientes => [...clientes, { id: idCliente, faturas: [fatura], valorTotal: fatura.valor * fatura.quantidade, faturaPaga: faturaPaga }]);
  }
  
  function adicionarNovaFaturaCliente(idCliente, fatura, ) {
    setListaClientes(clientes => clientes.map(cliente => cliente.id === idCliente ? {...cliente, faturas: [...cliente.faturas, fatura], valorTotal: cliente.valorTotal + (fatura.valor * fatura.quantidade) } : cliente));
  }

  function apagarFaturaCliente(idCliente, idFatura, valor) {
    setListaClientes(clientes => clientes.map(cliente => cliente.id === idCliente ? { ...cliente, faturas: cliente.faturas.filter(fatura => fatura.id !== idFatura), valorTotal: cliente.valorTotal - valor } : cliente));
  }

  function editarFaturaCliente(idCliente, idFatura, faturaEditada, valorAntigo) {
    setListaClientes(clientes => clientes.map(cliente => cliente.id === idCliente ? {...cliente, faturas: cliente.faturas.map(fatura => fatura.id === idFatura ? { ...faturaEditada } : fatura), valorTotal: (cliente.valorTotal - valorAntigo) + (faturaEditada.valor * faturaEditada.quantidade)} : cliente));
  }
  
  function confirmacaoClientePagou(idCliente, fatura) {
    setConfirmacaoPagarFatura(true);
    setDadosPagarFatura({idCliente, fatura});
  }
  
  function resetStatesConfirmacao() {
    setConfirmacaoPagarFatura(false);
    setDadosPagarFatura(null);
  }
  
  function clientePagouFatura(idCliente) {
    setListaClientes(clientes => clientes.map(cliente => cliente.id === idCliente ? {...cliente, faturaPaga: true} : cliente));
    resetStatesConfirmacao();
  }

  return <div className="container">
    <Header onIsModal={setIsModal} />

    { isModal && <FormFatura setIsModal={setIsModal} isModal={isModal} onCadastrarFatura={novaFatura} onAdicionarFatura={adicionarNovaFaturaCliente} dadosAcao={dadosAcao} onDadosAcaoForm={setDadosAcao} onEditarFatura={editarFaturaCliente} />}
    
    <CampoComplementar listaClientes={listaClientes} />
    { confirmacaoPagarFatura && <ModalConfirmacaoPagamento onResetPagamentoConcluido={resetStatesConfirmacao} dadosPagarFatura={dadosPagarFatura} onClientePagouFatura={clientePagouFatura} /> }

    <ListaFaturas listaClientes={listaClientes} mostrarMaisInfo={mostrarMaisInfo} onMostrarMaisInfo={mostrarMaisInfoFatura} onIsModal={setIsModal} onDadosAcaoForm={setDadosAcao} onApagarFatura={apagarFaturaCliente} onConfirmacaoPagouFatura={confirmacaoClientePagou} />
    
  </div>
}

function ModalConfirmacaoPagamento({ dadosPagarFatura, onResetPagamentoConcluido, onClientePagouFatura }) {
  const nomeCliente = dadosPagarFatura.fatura.faturas[0].nome;
  const [faturaEditada, setFaturaEditada] = useState(false);

  function faturaPaga(idCliente) {
    setFaturaEditada(true);
    setTimeout(() => {
      onClientePagouFatura(idCliente);
      setFaturaEditada(false);
    }, 3000)
  }

  return (
    <div className="sombra">
      <div className="area-confirmacao modal">
        <h2 className="titulo-modal">{nomeCliente} pagou a fatura no valor de <span className="valor valor-fatura-modal">R$ {dadosPagarFatura.fatura.valorTotal}</span></h2>
        <p className={`mensagem ${ !faturaEditada ? 'atencao' : 'sucesso'} mensagem-modal`}>{!faturaEditada ? 'ATENÇÃO, Está ação não pode ser desfeita!' : `${nomeCliente} pagou a fatura com sucesso!` }</p>
        <div className="area-modal-confirmacao">
          <button className="btn-modal-sim" onClick={() => (faturaPaga(dadosPagarFatura.fatura.id))}>Sim</button>
          <button className="btn-modal-nao" onClick={onResetPagamentoConcluido}>Não</button>
        </div>
      </div>
    </div>
  )
}