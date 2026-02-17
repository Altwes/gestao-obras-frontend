# 🏗️ SOP-CE - Gestão de Obras (Front-end)

O **SOP-CE** é uma plataforma de monitoramento de obras focada no controle de orçamentos e medições físicas. Este front-end foi desenvolvido para oferecer uma interface moderna, rápida e integrada ao motor de regras de negócio da SOP.

---

## 🚀 Tecnologias e Padrões (Obrigatórios)

Este projeto foi construído seguindo rigorosamente o cronograma técnico:

* **Next.js**: Framework React para renderização de alta performance.
* **TailwindCSS & Flowbite**: Estilização baseada em utilitários e componentes UI para tabelas expansíveis e modais.
* **Axios**: Cliente HTTP configurado com Interceptors para gestão de tokens JWT.
* **Autenticação JWT**: Sistema de login seguro com persistência de sessão.

---

## 📋 Funcionalidades de Negócio Implementadas

* **Dashboard de Obras**: Listagem dinâmica de orçamentos com barra de pesquisa por protocolo.
* **Tabela de Medições Inteligente**: Uso de componentes Flowbite para detalhamento de itens através de expansão de linhas.
* **Recálculo Automático de Valores**: Lógica integrada que atualiza o total da medição instantaneamente ao editar quantidades.
* **Segurança de Status**: Interface bloqueia edições em medições já VALIDADAS e impede finalização de orçamentos com pendências.
* **Tratamento de Erros de Banco**: Mensagens personalizadas para protocolos duplicados e erros de integridade JPA.

---

## ⚙️ Instalação e Execução Local

1.  **Clone o repositório**:
    ```bash
    git clone [https://github.com/seu-usuario/gestao-obras-frontend.git](https://github.com/seu-usuario/gestao-obras-frontend.git)
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Configuração de Ambiente**:
    Crie um arquivo `.env.local` na raiz e adicione a URL da sua API:
    ```env
    NEXT_PUBLIC_API_URL=[https://gestao-obras-api-2x56.onrender.com](https://gestao-obras-api-2x56.onrender.com)
    NEXT_PUBLIC_STORAGE_TOKEN_KEY=@gestao-obras:token
    ```

4.  **Rode o projeto**:
    ```bash
    npm run dev
    ```