import { useEffect, useReducer } from "react";

import Header from "./Header";
import FormFatura from "./FormFatura";
import ListaFaturas from "./ListaFatura";
import CampoComplementar from "./CampoComplementar";
import ModalPagarFatura from "./ModalPagarFatura";

const initialState = {
  listaClientes: JSON.parse(localStorage.getItem('faturas')) || [],
  isModal: false,
  dadosAcao: null,
  idSelecionado: null,
  pagarFatura: false, 
  fatura: null
}

function reducer(state, action) {
  switch(action.type) {
    case 'cadastrarFatura':
      // Cadastrar uma fatura se o cliente não tiver nenhuma fatura
      return {...state, listaClientes: [...state.listaClientes, { id: action.payload.id, faturas: [action.payload.fatura], valorTotal: action.payload.fatura.valor * action.payload.fatura.quantidade, faturaPaga: action.payload.faturaPaga }]};
    
    case 'adicionarFatura':
      // Adiciona uma fatura ao cliente ja existente
      return {...state, listaClientes: state.listaClientes.map(cliente => cliente.id === action.payload.id ? {...cliente, faturas: [...cliente.faturas, action.payload.fatura], valorTotal: cliente.valorTotal + (action.payload.fatura.valor * action.payload.fatura.quantidade) } : cliente ), dadosAcao: null }

    case 'apagarFaturaCliente':
      // Apagar uma fatura dos serviços do cliente
        return {...state, listaClientes: state.listaClientes.map(cliente => cliente.id === action.payload.idCliente ? { ...cliente, faturas: cliente.faturas.filter(fatura => fatura.id !== action.payload.idFatura), valorTotal: cliente.valorTotal - action.payload.valor } : cliente) }
    
    case 'editarFatura':
      return {...state, listaClientes: state.listaClientes.map(cliente => cliente.id === action.payload.idCliente ? {...cliente, faturas: cliente.faturas.map(fatura => fatura.id === action.payload.idFatura ? { ...action.payload.faturaEditada } : fatura), valorTotal: (cliente.valorTotal - action.payload.valorAntigo) + (action.payload.faturaEditada.valor * action.payload.faturaEditada.quantidade)} : cliente), dadosAcao: null}

    case 'mostrarDadosServicos':
      return {...state, idSelecionado: action.payload=== state.idSelecionado ? null : action.payload};

    case 'solicitarPagamento':
      return {...state, pagarFatura: true, fatura: action.payload.fatura, idSelecionado: action.payload.idFatura,  };

    case 'pagamentoConcluido':
      return {...state, listaClientes: state.listaClientes.map(cliente => cliente.id === action.payload ? {...cliente, faturaPaga: true} : cliente), idSelecionado: null, pagarFatura: false}

    case 'pagamentoCancelado':
      return {...state, pagarFatura: false, idSelecionado: null};

    case 'mostrarModal':
      return {...state, isModal: true, idSelecionado: null};

    case 'fecharModal':
      return {...state, isModal: false, dadosAcao: null};

    case 'dadosAcaoForm':
      return {...state, dadosAcao: action.payload};
  
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
  const [ {listaClientes, idSelecionado, pagarFatura, fatura, isModal, dadosAcao}, dispatch] = useReducer(reducer, initialState);
   
  function destaqueModal() {
    setTimeout(() => dispatch({type: 'mostrarDadosServicos', payload: null}), 450)
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(function() {
    localStorage.setItem("faturas", JSON.stringify(listaClientes));
  }, [listaClientes]);

  return <div className="container">
    <Header dispatch={dispatch} />

    { isModal && <FormFatura dispatch={dispatch} isModal={isModal}  dadosAcao={dadosAcao}  onDestaqueModal={destaqueModal} />}
    
    <CampoComplementar listaClientes={listaClientes} />
    { pagarFatura &&  <ModalPagarFatura fatura={fatura} idSelecionado={idSelecionado} dispatch={dispatch} /> }

    <ListaFaturas listaClientes={listaClientes} idSelecionado={idSelecionado} dispatch={dispatch} />
    
  </div>
}