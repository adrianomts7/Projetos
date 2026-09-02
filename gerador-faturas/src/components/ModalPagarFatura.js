import { useState } from "react";

function ModalPagarFatura({ fatura, dispatch }) {
  const nomeCliente = fatura.faturas[0].nome;
  const [faturaEditada, setFaturaEditada] = useState(false);

  function faturaPaga(idCliente) {
    setFaturaEditada(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    setTimeout(() => {
      dispatch({type: 'pagamentoConcluido', payload: idCliente});
      setFaturaEditada(false);
    }, 3000)
  }

  return (
    <div className="sombra">
      <div className="area-confirmacao modal">
        <h2 className="titulo-modal">{nomeCliente} pagou a fatura no valor de <span className="valor valor-fatura-modal">R$ {fatura.valorTotal}</span></h2>
        <p className={`mensagem ${ !faturaEditada ? 'atencao' : 'sucesso'} mensagem-modal`}>{!faturaEditada ? 'ATENÇÃO, Está ação não pode ser desfeita!' : `${nomeCliente} pagou a fatura com sucesso!` }</p>
        <div className="area-modal-confirmacao">
          <button className="btn-modal-sim" onClick={() => (faturaPaga(fatura.id))}>Sim</button>

          <button className="btn-modal-nao" onClick={() => dispatch({ type: 'pagamentoCancelado'})}>Não</button>
        </div>
      </div>
    </div>
  )
}

export default ModalPagarFatura