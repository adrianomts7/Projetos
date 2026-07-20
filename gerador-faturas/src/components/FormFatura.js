import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";

export default 
function FormFatura({setIsModal, isModal, onCadastrarFatura, onAdicionarFatura, dadosAcao, onDadosAcaoForm, onEditarFatura }) {

  const [fatura, setFatura] = useState({id: dadosAcao?.idFatura || crypto.randomUUID() ,nome: dadosAcao?.nome || dadosAcao?.dadosFatura?.nome, descricao:  dadosAcao?.dadosFatura?.descricao || '', quantidade: dadosAcao?.dadosFatura?.quantidade || 1 , valor: dadosAcao?.dadosFatura?.valor || ''});

  function pegandoDadosInput(e) {
    const { name, value } = e.target;

    setFatura(dados => ({...dados, [name]: value}));
  }
  
  function enviarForm(e) {
    e.preventDefault();
        
    const novaFatura = {
      ...fatura,
      valor: Number(fatura.valor),
      quantidade: Number(fatura.quantidade)
    }

    if (novaFatura.nome.trim() === "" || novaFatura.descricao.trim() === "") return alert("Os campos não podem ficar vázio!");
    if (novaFatura.valor <= 0) return alert("Digite um valor de serviço válido");

    if (!dadosAcao){
      onCadastrarFatura(novaFatura, novaFatura.id);
      alert("Fatura gerada com sucesso!");
      setIsModal(false);
      return;
    }
    if (dadosAcao.acao === 'adicionar') {
      onAdicionarFatura(dadosAcao.id, novaFatura);
      alert(`Nova Fatura adicionada com sucesso ao cliente ${novaFatura.nome}`)
      onDadosAcaoForm(null);
    } 
    
    if (dadosAcao.acao === 'editar') {
      onEditarFatura(dadosAcao.idCliente, dadosAcao.idFatura, novaFatura, (dadosAcao.dadosFatura.valor * dadosAcao.dadosFatura.quantidade));
      alert(` Fatura Editada com sucesso do cliente ${novaFatura.nome}`)
      onDadosAcaoForm(null);
    }
     
    setIsModal(false);
  }

  return (
    <div className="sombra">
      <form className="form-fatura" onSubmit={enviarForm}>
        <h3 className="titulo-form">{ dadosAcao?.acao === 'editar' ? 'Editar Fatura' : 'Cadastro de Fatura'}</h3>

        <div className="area-input">
          <label htmlFor="nome">Nome:</label>
          <input id="nome" name="nome" type="text" placeholder="Digite o nome do cliente" onChange={pegandoDadosInput} value={fatura.nome} />
        </div>

        <div className="area-input">
          <label htmlFor="descricao">Descrição:</label>
          <input id="descricao" name="descricao" type="text" placeholder="Digite a Descrição do Serviço: " onChange={pegandoDadosInput} value={fatura.descricao} />
        </div>

        <div className="area-input">
          <label htmlFor="quantidade">Quantidade:</label>
          <input id="quantidade" name="quantidade" type="number" placeholder="1" onChange={pegandoDadosInput} min={1} value={fatura.quantidade} />
        </div>

        <div className="area-input">
          <label htmlFor="valor">Valor:</label>
          <input id="valor" name="valor" type="number" min={0} step={0.1} onChange={pegandoDadosInput} value={fatura.valor} />
        </div>

        <button className="btn-form-fatura">{ dadosAcao?.acao === 'editar' ? 'Editar Fatura' : 'Gerar Fatura'}</button>

        <button className="fechar-form-fatura" onClick={() => setIsModal(false)}><HiOutlineX /></button>
      </form>
    </div>
  );
}
