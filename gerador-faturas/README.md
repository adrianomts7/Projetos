# 🧾 Gerador de Faturas

Aplicação desenvolvida em **React** para gerenciamento de clientes e faturas. O sistema permite cadastrar clientes, adicionar múltiplos serviços para cada um, editar e remover faturas, além de calcular automaticamente os valores totais.

O projeto foi desenvolvido com o objetivo de praticar conceitos fundamentais do React, como gerenciamento de estado, componentização, formulários controlados e atualização imutável de dados.

---

## 🚀 Demonstração

> Adicione aqui um GIF da aplicação em funcionamento.

Ou acesse a demonstração online:

**Demo:** https://seu-projeto.vercel.app

---

## ✨ Funcionalidades

- Cadastro de clientes.
- Cadastro de múltiplas faturas para um mesmo cliente.
- Edição e remoção de faturas.
- Exibição detalhada dos serviços de cada cliente.
- Cálculo automático do valor total por cliente.
- Cálculo do valor total geral das faturas.
- Validação dos dados do formulário.
- Interface organizada em componentes reutilizáveis.

---

## 🛠 Tecnologias Utilizadas

- React
- JavaScript (ES6+)
- HTML5
- CSS3
- React Icons

---

## 📚 Conceitos Praticados

Durante o desenvolvimento deste projeto foram utilizados conceitos importantes do ecossistema React, como:

- Componentização
- useState
- Props
- Eventos
- Formulários controlados
- Renderização condicional
- Renderização de listas
- Atualização imutável de objetos e arrays
- CRUD (Create, Read, Update e Delete)
- Manipulação de estruturas de dados utilizando `map`, `filter` e `reduce`
- Geração de identificadores únicos com `crypto.randomUUID()`

---

## 🏗 Estrutura dos Dados

O estado principal da aplicação é composto por uma lista de clientes, onde cada cliente possui um conjunto de faturas associadas.

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "valorTotal": 3000,
    "faturas": [
      {
        "id": "987fcdeb-51a2-43d7-9012-345678912345",
        "nome": "Empresa X",
        "descricao": "Desenvolvimento Front-End",
        "quantidade": 1,
        "valor": 3000
      }
    ]
  }
]
```

Essa estrutura permite manter a relação entre clientes e suas respectivas faturas, facilitando operações de cadastro, edição, remoção e cálculo dos valores totais.

---

## ▶️ Como executar o projeto

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/gerador-faturas-react.git
```

Acesse a pasta:

```bash
cd gerador-faturas-react
```

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
npm run dev
```

---

## 📈 Melhorias Futuras

- Persistência de dados utilizando Local Storage.
- Integração com uma API.
- Exportação das faturas em PDF.
- Busca de clientes.
- Filtro de faturas.
- Formatação monetária.
- Migração para TypeScript.

---

## 👨‍💻 Autor

**Adriano Mateus**

- GitHub: https://[github.com/adrianomts7](https://github.com/adrianomts7)
- LinkedIn: https://linkedin.com/in/[adrianomts7](https://www.linkedin.com/in/adrianomts7/)