import { useState, useEffect } from 'react';
import { Card, Col, Radio, Row, Typography, Spin, Select, Space } from 'antd';
import {
  LineChartOutlined,
  CloudOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { getStations, getSeries } from '../api';

const { Title, Paragraph, Text } = Typography;

function EspacoGrafico({ titulo, descricao, icone, unidade, pontos }) {
  return (
    <Card className="grafico-card" bordered={false}>
      <div className="secao-cabecalho">
        <div className="icone-secao">{icone}</div>
        <div>
          <Title level={4}>{titulo}</Title>
          <Text type="secondary">{descricao}</Text>
        </div>
      </div>

      {/* Listagem rápida dos pontos obtidos via API mock */}
      <div style={{ margin: '16px 0', background: '#fafafa', padding: '12px', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto' }}>
        <Text strong style={{ display: 'block', marginBottom: '8px' }}>
          <DatabaseOutlined /> Amostras recuperadas da API:
        </Text>
        {pontos && pontos.length > 0 ? (
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {pontos.slice(0, 5).map((ponto, index) => (
              <li key={index}>
                <Text type="secondary">
                  {new Date(ponto.timestamp).toLocaleString('pt-BR')}: <strong>{ponto.value} {unidade.includes('m') ? 'm' : 'mm/h'}</strong>
                </Text>
              </li>
            ))}
          </ul>
        ) : (
          <Text type="secondary">Nenhum ponto retornado para este período.</Text>
        )}
      </div>

      <div className="grafico-placeholder">
        <div className="grafico-placeholder-icone">
          <LineChartOutlined />
        </div>
        <Text strong>Gráfico reservado</Text>
        <Text type="secondary">
          A visualização gráfica será implementada em uma próxima sprint.
        </Text>
        <Text className="unidade-grafico">{unidade}</Text>
      </div>
    </Card>
  );
}

export default function HistoricoMedicoes() {
  const [estacoes, setEstacoes] = useState([]);
  const [estacaoSelecionadaId, setEstacaoSelecionadaId] = useState(null);
  const [horasSelecionadas, setHorasSelecionadas] = useState(24);
  const [serieNivel, setSerieNivel] = useState([]);
  const [serieChuva, setSerieChuva] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // 1. Carrega as estações ao abrir a página
  useEffect(() => {
    async function carregarLista() {
      try {
        const resposta = await getStations();
        if (resposta && resposta.stations) {
          setEstacoes(resposta.stations);
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

  // 2. Carrega as séries de nível e chuva sempre que mudar a estação ou as horas
  useEffect(() => {
    if (!estacaoSelecionadaId) return;

    async function carregarSeries() {
      try {
        const dadosNivel = await getSeries(estacaoSelecionadaId, 'level', Number(horasSelecionadas));
        const dadosChuva = await getSeries(estacaoSelecionadaId, 'rain', Number(horasSelecionadas));
        
        setSerieNivel(dadosNivel?.points || []);
        setSerieChuva(dadosChuva?.points || []);
      } catch (erro) {
        console.error("Erro ao carregar histórico:", erro);
      }
    }
    carregarSeries();
  }, [estacaoSelecionadaId, horasSelecionadas]);

  if (carregando) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="pagina">
      <div className="pagina-introducao">
        <Text className="sobretitulo">ANÁLISE TEMPORAL</Text>
        <Title level={2}>Histórico de Medições</Title>
        <Paragraph>
          Estrutura para consultar a evolução do nível do rio e da
          precipitação ao longo do tempo utilizando a API mock.
        </Paragraph>
      </div>

      <Card className="painel-card" bordered={false}>
        <div className="filtros-cabecalho" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="secao-cabecalho" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="icone-secao">
              <ClockCircleOutlined />
            </div>
            <div>
              <Title level={4} style={{ margin: 0 }}>Período e Estação</Title>
              <Text type="secondary">
                Filtre os registros temporais para a futura visualização.
              </Text>
            </div>
          </div>

          <Space wrap>
            <Select
              style={{ width: 200 }}
              size="large"
              value={estacaoSelecionadaId}
              onChange={(valor) => setEstacaoSelecionadaId(valor)}
              options={estacoes.map((e) => ({ value: e.id, label: e.name }))}
            />

            <Radio.Group
              value={String(horasSelecionadas)}
              onChange={(e) => setHorasSelecionadas(e.target.value)}
              optionType="button"
              buttonStyle="solid"
              options={[
                { label: '12 horas', value: '12' },
                { label: '24 horas', value: '24' },
                { label: '48 horas', value: '48' },
              ]}
            />
          </Space>
        </div>
        <Text type="secondary" className="texto-ajuda" style={{ display: 'block', marginTop: '12px' }}>
          Os controles já integram dados temporais mockados para a Sprint 3.
        </Text>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} xl={12}>
          <EspacoGrafico
            titulo="Nível do rio"
            descricao="Histórico do nível da água por estação"
            icone={<LineChartOutlined />}
            unidade="Unidade prevista: metros (m)"
            pontos={serieNivel}
          />
        </Col>

        <Col xs={24} xl={12}>
          <EspacoGrafico
            titulo="Precipitação"
            descricao="Histórico de chuva por estação"
            icone={<CloudOutlined />}
            unidade="Unidade prevista: mm/h"
            pontos={serieChuva}
          />
        </Col>
      </Row>

      <div className="nota-informativa" style={{ marginTop: '24px' }}>
        <Text type="secondary">
          Os dados exibidos provêm dos serviços da API mock, preparando a base para os gráficos das próximas sprints.
        </Text>
      </div>
    </div>
  );
}