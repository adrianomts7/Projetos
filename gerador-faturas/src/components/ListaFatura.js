import Fatura from "./Fatura";

export default function ListaFaturas({ listaClientes, mostrarMaisInfo, onMostrarMaisInfo, onIsModal, onDadosAcaoForm, onApagarFatura}) {
  return (
    <ul className="lista-faturas">
        { listaClientes.length > 0 ? listaClientes.map(fatura => <Fatura fatura={fatura} key={fatura.id} mostrarMaisInfo={mostrarMaisInfo} onMostrarMaisInfo={onMostrarMaisInfo} onIsModal={onIsModal} onDadosAcaoForm={onDadosAcaoForm} onApagarFatura={onApagarFatura} />) : <p className="mensagem-fatura-vazia">Nenhuma Fatura de Clientes Registradas!</p> }
    </ul>
  );
}