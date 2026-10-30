import { Row, Col, Typography } from "antd";

import CartaoMedicao from "../componentes/CartaoMedicao";
import InformacoesEstacao from "../componentes/InformacoesEstacao";
import AvisoSimulacao from "../componentes/AvisoSimulacao";

const { Title } = Typography;

function VisaoGeral() {
  return (
    <div>
      <Title level={2}>Visão Geral</Title>

      <AvisoSimulacao />

      <Title level={4} style={{ marginTop: 24 }}>
        Estações de monitoramento
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <InformacoesEstacao
            nome="Estação Rio Azul"
            rio="Rio Azul"
            municipio="Brasília"
          />
        </Col>

        <Col xs={24} md={8}>
          <InformacoesEstacao
            nome="Estação Vale Verde"
            rio="Rio Verde"
            municipio="Formosa"
          />
        </Col>

        <Col xs={24} md={8}>
          <InformacoesEstacao
            nome="Estação Santa Luzia"
            rio="Rio das Pedras"
            municipio="Planaltina"
          />
        </Col>
      </Row>

      <Title level={4} style={{ marginTop: 24 }}>
        Medições da estação selecionada
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <CartaoMedicao
            titulo="Nível do Rio Azul"
            valor={2.45}
            unidade="m"
            horario="29/10/2026 às 09:00"
          />
        </Col>

        <Col xs={24} md={12}>
          <CartaoMedicao
            titulo="Precipitação"
            valor={4.8}
            unidade="mm/h"
            horario="29/10/2026 às 09:00"
          />
        </Col>
      </Row>
    </div>
  );
}

export default VisaoGeral;