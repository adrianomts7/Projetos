import Fatura from "./Fatura";
import { useState } from "react";

export default function ListaFaturas({ listaClientes, idSelecionado,  dispatch, }) {
  const [filtroFaturas, setFiltroFaturas] = useState('');

  listaClientes = filtroFaturas ? listaClientes.filter(faturas => filtroFaturas === 'pagas' ? faturas.faturaPaga : !faturas.faturaPaga) : listaClientes.slice().sort((a,b) => a.faturaPaga - b.faturaPaga);

  return (
    <>
    <select className="select-mostrar-dados" value={filtroFaturas} onChange={(e => setFiltroFaturas(e.target.value))}>
      <option value='pagas'>Faturas Pagas</option>
      <option value='pendente'>Faturas Pendentes</option>
      <option value=''>Todas Faturas</option>
    </select>

    <ul className="lista-faturas">
        { listaClientes.length > 0 ? listaClientes.map(fatura => <Fatura fatura={fatura} key={fatura.id} idSelecionado={idSelecionado} dispatch={dispatch} />) : <p className="mensagem-fatura-vazia"> { filtroFaturas !== 'pagas' ? `Nenhuma Fatura de Clientes ${ !filtroFaturas ? 'Registrada' : 'Pendente'}!` : `Nenhuma fatura foi paga ainda` } </p> }
    </ul>
    </>
  );
}