import { useState } from "react";

import Header from "./Header";
import FormFatura from "./FormFatura";
import ListaFaturas from "./ListaFatura";

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

  function mostrarMaisInfoFatura(idSelecionado) {
    setMostrarMaisInfo(id => id === idSelecionado ? null : idSelecionado);
  }

  function novaFatura(fatura, idCliente) {
    setListaClientes(clientes => [...clientes, { id: idCliente, faturas: [fatura], valorTotal: fatura.valor * fatura.quantidade }]);
  }
  
  function adicionarNovaFaturaCliente(idCliente, fatura) {
    setListaClientes(clientes => clientes.map(cliente => cliente.id === idCliente ? {...cliente, faturas: [...cliente.faturas, fatura], valorTotal: cliente.valorTotal + (fatura.valor * fatura.quantidade) } : cliente));
  }

  function apagarFaturaCliente(idCliente, idFatura, valor) {
    setListaClientes(clientes => clientes.map(cliente => cliente.id === idCliente ? { ...cliente, faturas: cliente.faturas.filter(fatura => fatura.id !== idFatura), valorTotal: cliente.valorTotal - valor } : cliente));
  }

  function editarFaturaCliente(idCliente, idFatura, faturaEditada, valorAntigo) {
    setListaClientes(clientes => clientes.map(cliente => cliente.id === idCliente ? {...cliente, faturas: cliente.faturas.map(fatura => fatura.id === idFatura ? { ...faturaEditada } : fatura), valorTotal: (cliente.valorTotal - valorAntigo) + (faturaEditada.valor * faturaEditada.quantidade)} : cliente));
  }

  return <div className="container">
    <Header onIsModal={setIsModal} />

    { isModal && <FormFatura setIsModal={setIsModal} isModal={isModal} onCadastrarFatura={novaFatura} onAdicionarFatura={adicionarNovaFaturaCliente} dadosAcao={dadosAcao} onDadosAcaoForm={setDadosAcao} onEditarFatura={editarFaturaCliente} />}
    
    <CampoComplementar listaClientes={listaClientes} />

    <ListaFaturas listaClientes={listaClientes} mostrarMaisInfo={mostrarMaisInfo} onMostrarMaisInfo={mostrarMaisInfoFatura} onIsModal={setIsModal} onDadosAcaoForm={setDadosAcao} onApagarFatura={apagarFaturaCliente} />
    
  </div>
}

function CampoComplementar({ listaClientes }) {
  const valorTotalFaturasClientes = listaClientes.reduce((acc, clientes, i) => acc += clientes.valorTotal ,0);
  const quantidadeFaturasGeradas = listaClientes.reduce((acc, clientes) => acc += clientes.faturas.length, 0);

  return ( 
    <div className="area-dados-complementar">
      <div className="dados-fatura">
        <p className="texto-dados"> Valor Total das Faturas:
          <span className="valor-total-fatura">R$ {valorTotalFaturasClientes}</span></p>
        <p className="texto-dados">Quantidade Faturas geradas <span className="quantidade">{quantidadeFaturasGeradas}</span> Faturas</p>
      </div>
    </div>
  )
}