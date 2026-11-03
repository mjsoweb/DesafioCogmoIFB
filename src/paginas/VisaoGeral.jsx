import { Row, Col, Typography } from "antd";

import CartaoMedicao from "../componentes/CartaoMedicao";
import InformacoesEstacao from "../componentes/InformacoesEstacao";
import AvisoSimulacao from "../componentes/AvisoSimulacao";
import { estacoes, medicaoExemplo } from "../dados/estacoes";

const { Title, Paragraph, Text } = Typography;

function VisaoGeral() {
  const estacaoSelecionada = estacoes[0];

  return (
    <div className="pagina">
      <div className="pagina-introducao">
        <Text className="sobretitulo">PAINEL DE CONTROLE</Text>
        <Title level={2}>Visão Geral</Title>
        <Paragraph>
          Acompanhe as estações de monitoramento hidrológico em um só lugar.
        </Paragraph>
      </div>

      <AvisoSimulacao />

      <Title level={4} style={{ marginTop: 24 }}>
        Estações de monitoramento
      </Title>

      <Row gutter={[16, 16]}>
        {estacoes.map((estacao) => (
          <Col xs={24} md={8} key={estacao.id}>
            <InformacoesEstacao
              nome={estacao.nome}
              rio={estacao.rio}
              municipio={estacao.municipio}
            />
          </Col>
        ))}
      </Row>

      <Title level={4} style={{ marginTop: 24 }}>
        Medições da estação selecionada ({estacaoSelecionada.nome} — exemplo)
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <CartaoMedicao
            titulo={`Nível do ${estacaoSelecionada.rio}`}
            valor={medicaoExemplo.nivel}
            unidade="m"
            horario={medicaoExemplo.horario}
          />
        </Col>

        <Col xs={24} md={12}>
          <CartaoMedicao
            titulo="Precipitação"
            valor={medicaoExemplo.chuva}
            unidade="mm/h"
            horario={medicaoExemplo.horario}
          />
        </Col>
      </Row>
    </div>
  );
}

export default VisaoGeral;