
import { Button, Card, Col, Radio, Row, Typography } from 'antd';
import {
  LineChartOutlined,
  CloudOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

function EspacoGrafico({ titulo, descricao, icone, unidade }) {
  return (
    <Card className="grafico-card" bordered={false}>
      <div className="secao-cabecalho">
        <div className="icone-secao">{icone}</div>
        <div>
          <Title level={4}>{titulo}</Title>
          <Text type="secondary">{descricao}</Text>
        </div>
      </div>

      <div className="grafico-placeholder">
        <div className="grafico-placeholder-icone">
          <LineChartOutlined />
        </div>
        <Text strong>Gráfico reservado</Text>
        <Text type="secondary">
          A visualização será implementada em uma próxima sprint.
        </Text>
        <Text className="unidade-grafico">{unidade}</Text>
      </div>
    </Card>
  );
}

export default function HistoricoMedicoes() {
  return (
    <div className="pagina">
      <div className="pagina-introducao">
        <Text className="sobretitulo">ANÁLISE TEMPORAL</Text>
        <Title level={2}>Histórico de Medições</Title>
        <Paragraph>
          Estrutura para consultar a evolução do nível do rio e da
          precipitação ao longo do tempo.
        </Paragraph>
      </div>

      <Card className="painel-card" bordered={false}>
        <div className="filtros-cabecalho">
          <div className="secao-cabecalho">
            <div className="icone-secao">
              <ClockCircleOutlined />
            </div>
            <div>
              <Title level={4}>Período de consulta</Title>
              <Text type="secondary">
                Escolha um intervalo para a futura visualização.
              </Text>
            </div>
          </div>

          <Radio.Group
            defaultValue="24"
            optionType="button"
            buttonStyle="solid"
            options={[
              { label: '12 horas', value: '12' },
              { label: '24 horas', value: '24' },
              { label: '48 horas', value: '48' },
            ]}
          />
        </div>
        <Text type="secondary" className="texto-ajuda">
          Os controles são demonstrativos e ainda não aplicam filtros.
        </Text>
      </Card>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <EspacoGrafico
            titulo="Nível do rio"
            descricao="Histórico do nível da água"
            icone={<LineChartOutlined />}
            unidade="Unidade prevista: metros (m)"
          />
        </Col>

        <Col xs={24} xl={12}>
          <EspacoGrafico
            titulo="Precipitação"
            descricao="Histórico de chuva"
            icone={<CloudOutlined />}
            unidade="Unidade prevista: mm/h"
          />
        </Col>
      </Row>

      <div className="nota-informativa">
        <Text type="secondary">
          Os gráficos serão implementados nas próximas sprints com
          dados explicitamente identificados como simulados.
        </Text>
      </div>
    </div>
  );
}