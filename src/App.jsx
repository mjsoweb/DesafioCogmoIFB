import { useState } from "react";
import { Layout, Menu } from "antd";

import VisaoGeral from "./paginas/VisaoGeral";
import HistoricoMedicoes from "./paginas/HistoricoMedicoes";
import ConsultaMedicoes from "./paginas/ConsultaMedicoes";

const { Header, Content } = Layout;

function App() {
  const [pagina, setPagina] = useState("visao");

  function mostrarPagina() {
    if (pagina === "historico") {
      return <HistoricoMedicoes />;
    }

    if (pagina === "consulta") {
      return <ConsultaMedicoes />;
    }

    return <VisaoGeral />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[pagina]}
          onClick={(item) => setPagina(item.key)}
          items={[
            { key: "visao", label: "Visão Geral" },
            { key: "historico", label: "Histórico" },
            { key: "consulta", label: "Consulta" }
          ]}
        />
      </Header>

      <Content style={{ padding: 24 }}>
        {mostrarPagina()}
      </Content>
    </Layout>
  );
}

export default App;