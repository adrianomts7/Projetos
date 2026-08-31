import { useState, useEffect, useReducer } from "react";

import Header from "./Header";
import FormFatura from "./FormFatura";
import ListaFaturas from "./ListaFatura";
import CampoComplementar from "./CampoComplementar";

const initialState = {
  listaClientes: JSON.parse(localStorage.getItem('faturas')) || [],
  isModal: false,
  mostrarMaisInfo: null,
  dadosAcao: null,
  confirmacaoPagarFatura: false,
  dadosPagarFatura: null
}

// localStorage.clear();

function reducer(state, action) {
  switch(action.type) {
    case 'cadastrarFatura':
      console.log(state.listaClientes)
      // Cadastrar uma fatura se o cliente não tiver nenhuma fatura
      return {...state, listaClientes: [...state.listaClientes, { id: action.payload.id, faturas: [action.payload.fatura], valorTotal: action.payload.fatura.valor * action.payload.fatura.quantidade, faturaPaga: action.payload.faturaPaga }]};
    
    case 'adicionarFatura':
      // Adiciona uma fatura ao cliente ja existente
      return {...state, listaClientes: state.listaClientes.map(cliente => cliente.id === action.payload.id ? {...cliente, faturas: [...cliente.faturas, action.payload.fatura], valorTotal: cliente.valorTotal + (action.payload.fatura.valor * action.payload.fatura.quantidade) } : cliente ) }

    case 'apagarFaturaCliente':
        return {...state, listaClientes: state.listaClientes.map(cliente => cliente.id === action.payload.idCliente ? { ...cliente, faturas: cliente.faturas.filter(fatura => fatura.id !== action.payload.idFatura), valorTotal: cliente.valorTotal - action.payload.valor } : cliente) }
    
    case 'editarFatura':
      return {...state, listaClientes: state.listaClientes.map(cliente => cliente.id === action.payload.idCliente ? {...cliente, faturas: cliente.faturas.map(fatura => fatura.id === action.payload.idFatura ? { ...action.payload.faturaEditada } : fatura), valorTotal: (cliente.valorTotal - action.payload.valorAntigo) + (action.payload.faturaEditada.valor * action.payload.faturaEditada.quantidade)} : cliente)}

    default: 
      throw new Error(`${action.type} inválida`);
  
    } 
}

export default function App() {
  return (
    <div>
      <GeradorFatura />
    </div>
  );  
}

function GeradorFatura() {
  const [ {listaClientes}, dispatch] = useReducer(reducer, initialState);
  const [isModal, setIsModal] = useState(false);
  // const [listaClientes, setListaClientes] = useState(() => (JSON.parse(localStorage.getItem('faturas')) || []));
  const [mostrarMaisInfo, setMostrarMaisInfo] = useState(null);
  const [dadosAcao, setDadosAcao] = useState(null);
  const [confirmacaoPagarFatura, setConfirmacaoPagarFatura] = useState(false);
  const [dadosPagarFatura, setDadosPagarFatura] = useState(null);
   

  function mostrarMaisInfoFatura(idSelecionado) {
    setMostrarMaisInfo(id => id === idSelecionado ? null : idSelecionado);
  }

  function confirmacaoClientePagou(idCliente, fatura) {
    destaqueModal();
  //   setConfirmacaoPagarFatura(true);
  //   setDadosPagarFatura({idCliente, fatura});
  }
  
  function resetStatesConfirmacao() {
    setConfirmacaoPagarFatura(false);
    setDadosPagarFatura(null);
  }
  
  function clientePagouFatura(idCliente) {
    // setListaClientes(clientes => clientes.map(cliente => cliente.id === idCliente ? {...cliente, faturaPaga: true} : cliente));
    resetStatesConfirmacao();
  }

  function destaqueModal() {
    setTimeout(() => setMostrarMaisInfo(null), 450)
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(function() {
    localStorage.setItem("faturas", JSON.stringify(listaClientes));
  }, [listaClientes]);

  // console.log(listaClientes);

  return <div className="container">
    <Header onIsModal={setIsModal} />

    { isModal && <FormFatura dispatch={dispatch} setIsModal={setIsModal} isModal={isModal}   dadosAcao={dadosAcao} onDadosAcaoForm={setDadosAcao} onDestaqueModal={destaqueModal} />}
    
    <CampoComplementar listaClientes={listaClientes} />
    { confirmacaoPagarFatura && <ModalConfirmacaoPagamento onResetPagamentoConcluido={resetStatesConfirmacao} dadosPagarFatura={dadosPagarFatura} onClientePagouFatura={clientePagouFatura} /> }

    <ListaFaturas listaClientes={listaClientes} mostrarMaisInfo={mostrarMaisInfo} onMostrarMaisInfo={mostrarMaisInfoFatura} onIsModal={setIsModal} onDadosAcaoForm={setDadosAcao} onConfirmacaoPagouFatura={confirmacaoClientePagou} dispatch={dispatch} />
    
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