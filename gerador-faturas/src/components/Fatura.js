
export default function Fatura({fatura, onMostrarMaisInfo, mostrarMaisInfo, onIsModal, onDadosAcaoForm, onApagarFatura}) {
  function moodAdicionarNovaFatura(id, nome) {
   onIsModal(true);
   onDadosAcaoForm({ id: id, nome: nome, acao: 'adicionar' });
  }

  function moodEditarFatura(idCliente, idFatura, dadosFatura) {
    onIsModal(true);
    onDadosAcaoForm({idCliente ,idFatura, dadosFatura, acao: 'editar' })
  }

  return <li style={mostrarMaisInfo === fatura.id ? { border: '3px solid var(--verde)', padding: '2rem 0.8rem'} : {}}>
    <div>
      <p className="nome-cliente">Nome do Cliente: {fatura.faturas[0].nome}</p>
      
      <div className="area-faturas">
        <p>Quantidade de Produtos Solicitados: <span className="quantidade-produtos">{fatura.faturas.length} </span></p>
        
        <p>Valor Total: <span className="valor-total-fatura">R$ {fatura.valorTotal}</span></p>
      </div>
      
      { mostrarMaisInfo === fatura.id && <DivDadosFatura fatura={fatura} onMoodEditarFatura={moodEditarFatura} onApagarFatura={onApagarFatura}  /> }
     
      <div className="area-butoes-fatura">
        <button className="btn-mostrar-mais" onClick={() => onMostrarMaisInfo(fatura.id)}>{ mostrarMaisInfo ? "Ocultar Infos" : "Mostrar Infos" }</button>
        <button className="btn-adicionar-nova-fatura" onClick={() => moodAdicionarNovaFatura(fatura.id, fatura.faturas[0].nome)} >Adicionar Nova Fatura para {fatura.faturas[0].nome}</button>
      </div>
    </div>
  </li>
}

function DivDadosFatura({ fatura, onMoodEditarFatura, onApagarFatura }) {
  const quantidadeItensFatura = fatura.faturas.length;
  const idCliente = fatura.id;

  return (  
    <div className="area-dados-fatura">
      <p className="titulo-descricao-produtos">Descrição dos Produtos Solicitados:</p>
      <div className="area-dados">
      { fatura.faturas.map((fatura, i) => 

        <div className="area-dados-botoes" key={fatura.id}>
          <div className="dados-fatura" >
             
            <p>{(i + 1)}º  Descrição: {fatura.descricao}</p>  
            <p>Quantidade: {fatura.quantidade}</p>
            <p>Valor: <span className="valor">R$ {fatura.valor}</span></p>
          </div>
          {
            quantidadeItensFatura > 1 && (
              <div className="botoes-fatura-acoes">
                  <button className="btn-fatura-editar" onClick={() => onMoodEditarFatura(idCliente, fatura.id, fatura)}>Editar Fatura</button>
                  <button className="btn-fatura-apagar" onClick={() => onApagarFatura(idCliente, fatura.id, (fatura.valor * fatura.quantidade))}>Apagar Fatura</button>
              </div>
            )
          } 
        </div>
      )}
      </div>
    </div>
  )
}