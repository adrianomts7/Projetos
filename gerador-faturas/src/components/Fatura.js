export default function Fatura({fatura, onMostrarMaisInfo, mostrarMaisInfo, onIsModal, onDadosAcaoForm, onApagarFatura, onConfirmacaoPagouFatura}) {
  const quantidadeItensFatura = fatura.faturas.length;
  const nomeCliente = fatura.faturas[0].nome;

  function moodAdicionarNovaFatura(id, nome) {
   onIsModal(true);
   onDadosAcaoForm({ id: id, nome: nome, acao: 'adicionar' });
  }

  function moodEditarFatura(idCliente, idFatura, dadosFatura) {
    onIsModal(true);
    onDadosAcaoForm({idCliente ,idFatura, dadosFatura, acao: 'editar' })
  }

  return <li style={mostrarMaisInfo === fatura.id ? { border: '3px solid var(--verde)', padding: '2rem 0.8rem'} : {}} >
    <div>
      <div className="area-faturas-dados">
        <p className="nome-cliente" style={{width: `${nomeCliente.length * 10}px` }}>{nomeCliente}</p>
        <span className="selo-pagou">{fatura.faturaPaga ? 'PAGO' : ''}</span>
      </div>

      <div className="area-faturas">
        <p>Quantidade de Produtos Solicitados: <span className="quantidade-produtos">{quantidadeItensFatura}</span></p>

        <p>Valor Total: <span className="valor-total-fatura">R$ {fatura.valorTotal}</span></p>
      </div>
      
      { mostrarMaisInfo === fatura.id && <DivDadosFatura fatura={fatura} onMoodEditarFatura={moodEditarFatura} onApagarFatura={onApagarFatura} quantidadeItensFatura={quantidadeItensFatura}  /> }
     
      <div className="area-butoes-fatura">
        <button className="btn-mostrar-mais" onClick={() => onMostrarMaisInfo(fatura.id)}>{ mostrarMaisInfo ? "Ocultar Infos" : "Mostrar Infos" }</button>
        
        { !fatura.faturaPaga && <button className="btn-fatura-paga" onClick={() => onConfirmacaoPagouFatura(fatura.id, fatura)} >Pagar Fatura</button>}


        <button className="btn-adicionar-nova-fatura" onClick={() => moodAdicionarNovaFatura(fatura.id, nomeCliente)} >Adicionar Nova Fatura para {nomeCliente}</button>

      </div>
    </div>
  </li>
}

function DivDadosFatura({ fatura, onMoodEditarFatura, onApagarFatura, quantidadeItensFatura }) {
  const idCliente = fatura.id;

  return (  
    <div className="area-dados-fatura">
      <p className="titulo-descricao-produtos">Descrição dos Produtos Solicitados:</p>
      <div className="area-dados">
      { fatura.faturas.map((fatura, i) => 

        <div className="area-dados-botoes" key={fatura.id}>
          <div className="dados-fatura" >
             
            <p>{(i + 1)}º  Descrição: {fatura.descricao}</p>  
            <p>Quantidade: {fatura.quantidade} {fatura.quantidade > 1 ? 'Produtos' : 'Produto'}</p>
            <p>Valor Unidade: <span className="valor">R$ {fatura.valor}</span></p>
            <p>Valor Total: <span className="valor">R$ {fatura.valor * fatura.quantidade}</span></p>
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