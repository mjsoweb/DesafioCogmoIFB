import {
  Table,
  Typography,
  Input,
  Button,
  Space
} from "antd";

import AvisoSimulacao from "../componentes/AvisoSimulacao";

const { Title } = Typography;

function ConsultaMedicoes() {
  const dados = [
    {
      key: "1",
      estacao: "Estação Rio Azul",
      dataHora: "29/10/2026 09:00",
      nivel: 2.45,
      chuva: 4.8
    },
    {
      key: "2",
      estacao: "Estação Vale Verde",
      dataHora: "29/10/2026 08:30",
      nivel: 1.82,
      chuva: 2.3
    },
    {
      key: "3",
      estacao: "Estação Santa Luzia",
      dataHora: "29/10/2026 08:00",
      nivel: 3.10,
      chuva: 0.0
    },
    {
      key: "4",
      estacao: "Estação Rio Azul",
      dataHora: "29/10/2026 08:00",
      nivel: 2.40,
      chuva: 3.5
    }
  ];

  const colunas = [
    {
      title: "Estação",
      dataIndex: "estacao",
      key: "estacao"
    },
    {
      title: "Data e hora",
      dataIndex: "dataHora",
      key: "dataHora"
    },
    {
      title: "Nível do rio (m)",
      dataIndex: "nivel",
      key: "nivel"
    },
    {
      title: "Chuva (mm/h)",
      dataIndex: "chuva",
      key: "chuva"
    }
  ];

  return (
    <div>
      <Title level={2}>Consulta de Medições</Title>

      <AvisoSimulacao />

      <Space
        style={{
          marginTop: 24,
          marginBottom: 16,
          display: "flex",
          flexWrap: "wrap"
        }}
      >
        <Input
          placeholder="Nome da estação"
          style={{ width: 220 }}
        />

        <Button>Consultar</Button>
      </Space>

      <Table
        columns={colunas}
        dataSource={dados}
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
      />
    </div>
  );
}

export default ConsultaMedicoes;