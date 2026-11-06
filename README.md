# 🌊 Dashboard de Monitoramento Hidrológico

Projeto desenvolvido no curso de Front-end do **IFB**, com base no desafio proposto pela **Cogmo Technology**.

## 🎯 Sobre o projeto

O objetivo é desenvolver uma aplicação web para consultar dados simulados de estações de monitoramento hidrológico, visualizar as últimas medições do nível do rio e da precipitação e analisar seus históricos por meio de gráficos.

> ⚠️ **Importante:** todas as estações e medições são fictícias e possuem finalidade exclusivamente demonstrativa. Os dados não devem ser utilizados para decisões operacionais ou de segurança.

## 🛠️ Tecnologias utilizadas

- ⚛️ **ReactJS** — construção da interface.
- 🎨 **Ant Design** — componentes visuais.
- 📊 **Recharts** — visualização dos gráficos.
- 🟨 **JavaScript** — lógica e interatividade.
- 🗂️ **Dados locais (mock)** — simulação das informações, sem necessidade de backend.
- 💻 **StackBlitz** — ambiente de desenvolvimento online.

## ✨ Funcionalidades previstas

- 📍 Listagem e seleção de estações.
- 🏞️ Exibição do rio e município da estação selecionada.
- 💧 Consulta da última medição do nível do rio, em metros (m).
- 🌧️ Consulta da última medição de precipitação, em milímetros por hora (mm/h).
- 📈 Gráficos históricos separados para nível do rio e precipitação.
- 🕒 Filtros de período de 12, 24 e 48 horas.
- 📋 Tabela de medições com opções de ordenação e filtragem.
- ℹ️ Mensagens informativas para situações sem dados disponíveis.

*As funcionalidades serão implementadas e validadas durante o desenvolvimento, priorizando os requisitos obrigatórios do desafio.*

## 🚀 Como executar

1. Abra o projeto no StackBlitz.
2. Instale as dependências necessárias:

   ```bash
   npm install
   npm install antd @ant-design/icons recharts
   ```

3. Execute a aplicação:

   ```bash
   npm run dev
   ```

4. Acesse o endereço disponibilizado pelo ambiente de desenvolvimento.

## 👥 Equipe

Projeto acadêmico desenvolvido em equipe por três integrantes do curso de Front-end do IFB. 
Maria Júlia, Thalita e Samantha.

## 📌 Observação

O projeto prioriza usabilidade, responsividade, organização do código e visualização clara dos dados, seguindo os requisitos do desafio proposto pela Cogmo Technology.
