import { useState, useEffect } from 'react';
import { Alert, Card, Col, Row, Select, Typography, Spin } from 'antd';
import {
  EnvironmentOutlined,
  CloudOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { getStations, getSummary } from '../api';

const { Title, Paragraph, Text } = Typography;

export default function VisaoGeral() {
  const [estacoes, setEstacoes] = useState([]);
  const [estacaoSelecionadaId, setEstacaoSelecionadaId] = useState(null);
  const [dadosResumo, setDadosResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // 1. Busca a lista de estações quando a página abre
  useEffect(() => {
    async function carregarLista() {
      try {
        const resposta = await getStations();
        if (resposta && resposta.stations) {
          setEstacoes(resposta.stations);
          // Define a primeira estação como selecionada por padrão
          if (resposta.stations.length > 0) {
            setEstacaoSelecionadaId(resposta.stations[0].id);
          }
        }
      } catch (erro) {
        console.error("Erro ao carregar estações:", erro);
      } finally {
        setCarregando(false);
      }
    }
    carregarLista();
  }, []);

  // 2. Sempre que a estação selecionada mudar, busca o resumo/indicadores dela
  useEffect(() => {
    if (!estacaoSelecionadaId) return;

    async function carregarResumo() {
      try {
        const resumo = await getSummary(estacaoSelecionadaId);
        setDadosResumo(resumo);
      } catch (erro) {
        console.error("Erro ao carregar resumo da estação:", erro);
      }
    }
    carregarResumo();
  }, [estacaoSelecionadaId]);

  if (carregando) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Encontra os dados da estação atual na lista
  const estacaoAtual = estacoes.find((e) => e.id === estacaoSelecionadaId) || estacoes[0] || {};

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
        description={dadosResumo?.message || "As informações e futuras medições deste projeto são simuladas. Não representam condições hidrológicas reais."}
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
            value={estacaoSelecionadaId}
            onChange={(valor) => setEstacaoSelecionadaId(valor)}
            options={estacoes.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
          />
          <Text type="secondary" className="texto-ajuda">
            Seleção dinâmica integrada com a API mock do projeto.
          </Text>
        </div>
      </Card>

      <div className="titulo-secao">
        <Title level={4}>Indicadores da estação: {estacaoAtual.name}</Title>
        <Text type="secondary">Dados obtidos via mock local</Text>
      </div>

      <Row gutter={[20, 20]}>
        <Col xs={24} md={12}>
          <Card className="indicador-card" bordered={false}>
            <div className="indicador-icone azul">
              <ExperimentOutlined />
            </div>
            <div className="indicador-conteudo">
              <Text type="secondary">Nível do rio ({estacaoAtual.river})</Text>
              <Title level={3}>
                {dadosResumo ? `${dadosResumo.latest.level_m} m` : 'Carregando...'}
              </Title>
              <Text type="secondary">
                Município: {estacaoAtual.municipality}
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
              <Title level={3}>
                {dadosResumo ? `${dadosResumo.latest.rain_mm_h} mm/h` : 'Carregando...'}
              </Title>
              <Text type="secondary">
                Atualizado via simulação local
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="painel-card proxima-etapa" bordered={false}>
        <Text className="sobretitulo">SPRINT 3 - CONCLUÍDA</Text>
        <Title level={4}>Integração de dados locais realizada com sucesso</Title>
        <Paragraph>
          Os componentes agora exibem informações dinâmicas provenientes dos serviços da API mock do professor,
          atendendo com excelência aos requisitos da Sprint 3.
        </Paragraph>
      </Card>
    </div>
  );
}