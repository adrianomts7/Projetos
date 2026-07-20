export default function Header({onIsModal}) {
  return (
    <header>
      <h1 className="titulo">Gerador de Fatura</h1>
      <button className="btn-abrir-modal" onClick={() => onIsModal(true)}>Cadastrar Nova Fatura</button>
    </header>
  );

}