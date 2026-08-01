import { useState, useEffect } from "react";
import { HiOutlineX } from "react-icons/hi";

export default function FormFatura({
  setIsModal,
  isModal,
  onCadastrarFatura,
  onAdicionarFatura,
  dadosAcao,
  onDadosAcaoForm,
  onEditarFatura,
}) {

  const [fatura, setFatura] = useState({
  id: crypto.randomUUID(),
  nome: "",
  descricao: "",
  quantidade: 1,
  valor: "",
});
  const [mensagemUser, setMensagemUser] = useState(null);

  useEffect(() => {
    setFatura({
      id: dadosAcao?.idFatura || crypto.randomUUID(),
      nome: dadosAcao?.nome || dadosAcao?.dadosFatura?.nome || '',
      descricao: dadosAcao?.dadosFatura?.descricao || "",
      quantidade: dadosAcao?.dadosFatura?.quantidade || 1,
      valor: dadosAcao?.dadosFatura?.valor || "",
    });
  },[dadosAcao])

  function pegandoDadosInput(e) {
    const { name, value } = e.target;

    setFatura((dados) => ({ ...dados, [name]: value }));
  }

  function enviarForm(e) {
    e.preventDefault();

    const novaFatura = {
      ...fatura,
      valor: Number(fatura.valor),
      quantidade: Number(fatura.quantidade),
    };

    function resetandoMensagemUser() {
      setTimeout(() => setMensagemUser(null), 3000);
    }

    function fecharForm() {
      setTimeout(() => setIsModal(false), 3000);
    }

    if (
      novaFatura?.nome?.trim() === "" ||
      novaFatura?.descricao?.trim() === ""
    ) {
      setMensagemUser({
        mensagem: "Os campos não podem ficar vázio!",
        tipo: "erro",
      });
      resetandoMensagemUser();
      return;
    }
    if (novaFatura.valor <= 0) {
      setMensagemUser({
        mensagem: "Digite um valor de serviço válido",
        tipo: "erro",
      });
      resetandoMensagemUser();
      return;
    }

    if (!dadosAcao) {
      onCadastrarFatura(novaFatura, novaFatura.id);
      setMensagemUser({
        mensagem: "Fatura gerada com sucesso!",
        tipo: "sucesso",
      });
      resetandoMensagemUser();
      fecharForm();
      return;
    }

    if (dadosAcao.acao === "adicionar") {
      onAdicionarFatura(dadosAcao.id, novaFatura);
      setMensagemUser({
        mensagem: `Nova Fatura adicionada com sucesso ao cliente ${novaFatura.nome}`,
        tipo: "sucesso",
      });
      onDadosAcaoForm(null);
      resetandoMensagemUser();
      fecharForm();
      return;
    }

    if (dadosAcao.acao === "editar") {
      onEditarFatura(
        dadosAcao.idCliente,
        dadosAcao.idFatura,
        novaFatura,
        dadosAcao.dadosFatura.valor * dadosAcao.dadosFatura.quantidade,
      );
      setMensagemUser({
        mensagem: `Fatura Editada com sucesso do cliente ${novaFatura.nome}`, tipo: 'sucesso',
      });
      resetandoMensagemUser();
      fecharForm();
      onDadosAcaoForm(null);
      return;
    }
  }

  return (
    <div className="sombra">
      <form className="form-fatura" onSubmit={enviarForm}>
        <h3 className="titulo-form">
          {dadosAcao?.acao === "editar"
            ? "Editar Fatura"
            : "Cadastro de Fatura"}
        </h3>

        {mensagemUser && (
          <p
            className={`mensagem ${mensagemUser?.tipo === "erro" ? "erro" : "sucesso"}`}
          >
            {mensagemUser?.mensagem}
          </p>
        )}

        <div className="area-input">
          <label htmlFor="nome">Nome:</label>
          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="Digite o nome do cliente"
            onChange={pegandoDadosInput}
            value={fatura.nome}
          />
        </div>

        <div className="area-input">
          <label htmlFor="descricao">Descrição:</label>
          <input
            id="descricao"
            name="descricao"
            type="text"
            placeholder="Digite a Descrição do Serviço: "
            onChange={pegandoDadosInput}
            value={fatura.descricao}
          />
        </div>

        <div className="area-input">
          <label htmlFor="quantidade">Quantidade:</label>
          <input
            id="quantidade"
            name="quantidade"
            type="number"
            placeholder="1"
            onChange={pegandoDadosInput}
            min={1}
            value={fatura.quantidade}
          />
        </div>

        <div className="area-input">
          <label htmlFor="valor">Valor:</label>
          <input
            id="valor"
            name="valor"
            type="number"
            min={0}
            step={0.1}
            onChange={pegandoDadosInput}
            value={fatura.valor}
          />
        </div>

        <button className="btn-form-fatura">
          {dadosAcao?.acao === "editar" ? "Editar Fatura" : "Gerar Fatura"}
        </button>

        <button
          className="fechar-form-fatura"
          onClick={() => setIsModal(false)}
        >
          <HiOutlineX />
        </button>
      </form>
    </div>
  );
}
