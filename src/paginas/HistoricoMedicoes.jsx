import { Card, Col, Row, Typography, Button, Space } from "antd";

import AvisoSimulacao from "../components/AvisoSimulacao";

const { Title, Text } = Typography;

function HistoricoMedicoes() {
  return (
    <div>
      <Title level={2}>Histórico de Medições</Title>

      <AvisoSimulacao />

      <div style={{ marginTop: 24 }}>
        <Text strong>Período de consulta:</Text>

        <Space style={{ marginLeft: 12, marginTop: 8 }}>
          <Button>12 horas</Button>
          <Button>24 horas</Button>
          <Button>48 horas</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Histórico do nível do rio">
            <Title level={3}>2,45 m</Title>

            <Text type="secondary">
              Valor ilustrativo em 29/10/2026 às 09:00.
            </Text>

            <div
              style={{
                marginTop: 24,
                padding: 24,
                background: "#f0f5ff",
                textAlign: "center",
                borderRadius: 8
              }}
            >
              Gráfico de nível do rio
              <br />
              <Text type="secondary">
                Espaço reservado para as próximas sprints.
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Histórico de precipitação">
            <Title level={3}>4,8 mm/h</Title>

            <Text type="secondary">
              Valor ilustrativo em 29/10/2026 às 09:00.
            </Text>

            <div
              style={{
                marginTop: 24,
                padding: 24,
                background: "#e6f4ff",
                textAlign: "center",
                borderRadius: 8
              }}
            >
              Gráfico de precipitação
              <br />
              <Text type="secondary">
                Espaço reservado para as próximas sprints.
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HistoricoMedicoes;