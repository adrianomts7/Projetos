export default function Header({dispatch}) {
  return (
    <header>
      <h1 className="titulo">Gerador de Fatura</h1>
      <button className="btn-abrir-modal" onClick={() => dispatch({type: 'mostrarModal',})}>Cadastrar Nova Fatura</button>
    </header>
  );

}