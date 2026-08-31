export default function CampoComplementar({ listaClientes }) {
  const valorTotalFaturasClientes = listaClientes.reduce((acc, clientes) => !clientes.faturaPaga ? acc += clientes.valorTotal : acc ,0);
  const quantidadeFaturasGeradas = listaClientes.reduce((acc, clientes) => acc += clientes.faturas.length, 0);
  const totalClientes = listaClientes.length;
  const faturasPagasTotal = listaClientes.reduce((acc, clientes) => clientes.faturaPaga ? acc += clientes.valorTotal : acc, 0);

  return ( 
    <div className="area-dados-complementar">
      <DadosComplementares texto={"Valor recebido faturas"} valor={`R$ ${faturasPagasTotal}`} corValor={'#2b8a3e'} />
      <DadosComplementares texto={'Valor a receber Faturas:'} valor={`R$ ${valorTotalFaturasClientes}`} corValor={'#2b8a3e'} />
      <DadosComplementares texto={'Quantidade Faturas geradas'}  valor={quantidadeFaturasGeradas} />
      <DadosComplementares texto={'Quantidade Clientes'}  valor={totalClientes} />
    </div>
  )
}

function DadosComplementares({ texto, valor, corTexto = '#212529', corValor }) {
  return (
    <div className="dados-complementares">
      <p className="texto-dados-complementares" style={{color: corTexto}}>{texto}</p>

      <p className="valor-dados-complementares" style={{ color: corValor }}>{valor}</p>
    </div>
  )
}
