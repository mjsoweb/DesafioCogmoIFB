
import { Alert, Card, Col, Row, Select, Typography } from 'antd';
import {
  EnvironmentOutlined,
  CloudOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function VisaoGeral() {
  return (
    <div className="pagina">
      <div className="pagina-introducao">
        <Text className="sobretitulo">PAINEL DE CONTROLE</Text>
        <Title level={2}>Visão Geral</Title>
        <Paragraph>
          Acompanhe a estrutura de monitoramento das estações
          hidrológicas em um só lugar.
        </Paragraph>
      </div>

      <Alert
        className="alerta-simulado"
        type="info"
        showIcon
        message="Ambiente demonstrativo"
        description="As informações e futuras medições deste projeto são simuladas. Não representam condições hidrológicas reais."
      />

      <Card className="painel-card" bordered={false}>
        <div className="secao-cabecalho">
          <div className="icone-secao">
            <EnvironmentOutlined />
          </div>
          <div>
            <Title level={4}>Estação de monitoramento</Title>
            <Text type="secondary">
              Selecione uma estação para consultar seus indicadores.
            </Text>
          </div>
        </div>

        <div className="campo-estacao">
          <Text strong>Estação selecionada</Text>
          <Select
            size="large"
            placeholder="Selecione uma estação"
            className="seletor-estacao"
            options={[
              { value: 'estacao-1', label: 'Estação demonstrativa 01' },
              { value: 'estacao-2', label: 'Estação demonstrativa 02' },
              { value: 'estacao-3', label: 'Estação demonstrativa 03' },
            ]}
          />
          <Text type="secondary" className="texto-ajuda">
            A seleção é apenas visual nesta sprint.
          </Text>
        </div>
      </Card>

      <div className="titulo-secao">
        <Title level={4}>Indicadores da estação</Title>
        <Text type="secondary">Áreas reservadas para as próximas etapas</Text>
      </div>

      <Row gutter={[20, 20]}>
        <Col xs={24} md={12}>
          <Card className="indicador-card" bordered={false}>
            <div className="indicador-icone azul">
              <ExperimentOutlined />
            </div>
            <div className="indicador-conteudo">
              <Text type="secondary">Nível do rio</Text>
              <Title level={3}>Aguardando implementação</Title>
              <Text type="secondary">
                Unidade prevista: metros (m)
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="indicador-card" bordered={false}>
            <div className="indicador-icone verde">
              <CloudOutlined />
            </div>
            <div className="indicador-conteudo">
              <Text type="secondary">Precipitação</Text>
              <Title level={3}>Aguardando implementação</Title>
              <Text type="secondary">
                Unidade prevista: milímetros por hora (mm/h)
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="painel-card proxima-etapa" bordered={false}>
        <Text className="sobretitulo">PRÓXIMAS SPRINTS</Text>
        <Title level={4}>Os dados ganharão vida nas próximas etapas</Title>
        <Paragraph>
          Esta primeira entrega estabelece a navegação e a organização
          visual. Os indicadores serão conectados às medições simuladas
          quando essa funcionalidade entrar no escopo.
        </Paragraph>
      </Card>
    </div>
  );
}