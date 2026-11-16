import { useState, useEffect } from 'react';
import { Alert, Button, Card, Col, Radio, Row, Typography, Spin, Select, Space } from 'antd';
import {
  ClockCircleOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';
import EstacaoDAO from '../objetos/dao/EstacaoDAOBackEnd.mjs';
import ObservacaoDAO from '../objetos/dao/ObservacaoDAOBackEnd.mjs';

const estacaoDAO = new EstacaoDAO();
const observacaoDAO = new ObservacaoDAO();

function pontosParaGrafico(pontos) {
  return pontos.flatMap((ponto, index) => {
    if (index === 0) return [ponto];
    const anterior = new Date(pontos[index - 1].timestamp).getTime();
    const atual = new Date(ponto.timestamp).getTime();
    const lacunas = [];
    for (let instante = anterior + 60 * 60 * 1000; instante < atual; instante += 60 * 60 * 1000) {
      const timestamp = new Date(instante).toISOString();
      lacunas.push({ timestamp, value: null, horaFormatada: new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) });
    }
    return [...lacunas, ponto];
  });
}

const { Title, Text } = Typography;

export default function HistoricoMedicoes() {
  const [estacoes, setEstacoes] = useState([]);
  const [estacaoSelecionadaId, setEstacaoSelecionadaId] = useState(null);
  const [horasSelecionadas, setHorasSelecionadas] = useState(24);
  const [mostrarAmostrasNivel, setMostrarAmostrasNivel] = useState(false);
  const [mostrarAmostrasChuva, setMostrarAmostrasChuva] = useState(false);
  const [serieNivel, setSerieNivel] = useState([]);
  const [serieChuva, setSerieChuva] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoSeries, setCarregandoSeries] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;
    async function carregarLista() {
      try {
        const lista = await estacaoDAO.listar();
        if (!ativo) return;
        setEstacoes(lista);
        if (lista.length > 0) {
          setEstacaoSelecionadaId(lista[0].id);
        }
      } catch (erro) {
        if (ativo) setErro(erro.message || 'Erro ao carregar estações.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregarLista();
    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    if (!estacaoSelecionadaId) return;
    let ativo = true;
    async function carregarSeries() {
      setSerieNivel([]);
      setSerieChuva([]);
      setErro(null);
      setCarregandoSeries(true);
      try {
        const [dadosNivel, dadosChuva] = await Promise.all([
          observacaoDAO.listarSerie(estacaoSelecionadaId, 'level', Number(horasSelecionadas)),
          observacaoDAO.listarSerie(estacaoSelecionadaId, 'rain', Number(horasSelecionadas)),
        ]);
        if (!ativo) return;
        
        // Formatando o timestamp para exibir a hora amigável nos gráficos e listas
        const formatarPontos = (pontos) => 
          pontos.map(p => ({
            timestamp: p.observedAt,
            value: p.value,
            horaFormatada: new Date(p.observedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            dataCompleta: new Date(p.observedAt).toLocaleString('pt-BR')
          }));

        setSerieNivel(formatarPontos(dadosNivel?.points));
        setSerieChuva(formatarPontos(dadosChuva?.points));
      } catch (erro) {
        if (ativo) setErro(erro.message || 'Erro ao carregar histórico.');
      } finally {
        if (ativo) setCarregandoSeries(false);
      }
    }
    carregarSeries();
    return () => { ativo = false; };
  }, [estacaoSelecionadaId, horasSelecionadas]);

  if (carregando) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <Spin size="large" />
      </div>
    );
  }

  const ultimoNivel = serieNivel.at(-1)?.value;
  const ultimaChuva = serieChuva.at(-1)?.value;

  return (
    <div className="pagina pagina-cabecalho-proximo pagina-historico">
      {erro && <Alert type="error" message={erro} showIcon style={{ marginBottom: 24 }} />}
      {!erro && estacoes.length === 0 && <Alert message="Nenhuma estação disponível." showIcon style={{ marginBottom: 24 }} />}
      {carregandoSeries && <Spin tip="Carregando séries"><div style={{ minHeight: 48 }} /></Spin>}
      <div className="historico-topo">
      <Card className="painel-card" bordered={false} style={{ marginBottom: 24, borderRadius: '16px' }}>
        <div className="filtros-cabecalho" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="secao-cabecalho" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="icone-secao" style={{ background: '#f3e8ff', color: '#6129ac', padding: '10px', borderRadius: '10px' }}>
              <ClockCircleOutlined style={{ fontSize: '20px' }} />
            </div>
            <div>
              <Title level={4} style={{ margin: 0 }}>Período e Estação</Title>
              <Text type="secondary">
                Filtre os registros temporais para atualizar os dados e gráficos instantaneamente.
              </Text>
            </div>
          </div>

          <Space wrap>
            <Select
              className="filtro-estacao"
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
              size="large"
            >
              <Radio.Button value="12">12 h</Radio.Button>
              <Radio.Button value="24">24 h</Radio.Button>
              <Radio.Button value="48">48 h</Radio.Button>
            </Radio.Group>
          </Space>
        </div>
      </Card>
      </div>

      {/* SEÇÃO 1: GRÁFICOS INTERATIVOS RECHARTS */}
      <Row className="historico-graficos" gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* Gráfico de Nível do Rio */}
        <Col xs={24} xl={12}>
          <Card title="Nível do rio" extra={<span className="unidade">Metros (m)</span>} bordered={false} style={{ borderRadius: '16px' }}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={pontosParaGrafico(serieNivel)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis dataKey="horaFormatada" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                <Tooltip />
                <Line
                  type="linear"
                  connectNulls={false}
                  dataKey="value"
                  name="Nível (m)"
                  stroke="#007bff"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#007bff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Gráfico de Precipitação */}
        <Col xs={24} xl={12}>
          <Card title="Precipitação" extra={<span className="unidade">mm/h</span>} bordered={false} style={{ borderRadius: '16px' }}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={pontosParaGrafico(serieChuva)}>
                <defs>
                  <linearGradient id="gradChuva" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6f42c1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6f42c1" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis dataKey="horaFormatada" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                <Tooltip />
                <Area
                  type="linear"
                  connectNulls={false}
                  dataKey="value"
                  name="Precipitação (mm/h)"
                  stroke="#6f42c1"
                  fill="url(#gradChuva)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <section className="historico-kpis" aria-label="Indicadores do período">
        <div className="historico-kpi">
          <span>NÍVEL MAIS RECENTE</span>
          <strong>{ultimoNivel == null ? '—' : Number(ultimoNivel).toFixed(2)} <small>m</small></strong>
          <p>Última amostra de nível</p>
        </div>
        <div className="historico-kpi">
          <span>CHUVA MAIS RECENTE</span>
          <strong>{ultimaChuva == null ? '—' : Number(ultimaChuva).toFixed(2)} <small>mm/h</small></strong>
          <p>Última amostra de chuva</p>
        </div>
        <div className="historico-kpi">
          <span>AMOSTRAS DE NÍVEL</span>
          <strong>{serieNivel.length}</strong>
          <p>No período selecionado</p>
        </div>
        <div className="historico-kpi">
          <span>AMOSTRAS DE CHUVA</span>
          <strong>{serieChuva.length}</strong>
          <p>No período selecionado</p>
        </div>
      </section>

      {/* SEÇÃO 2: AMOSTRAS DETALHADAS DA API (LISTA) */}
      <Row className="historico-amostras" gutter={[24, 24]}>
        {/* Amostras Nível */}
        <Col xs={24} xl={12}>
          <Card 
            title={<span><DatabaseOutlined /> Amostras Detalhadas - Nível do Rio</span>} 
            extra={<Button type="link" aria-expanded={mostrarAmostrasNivel} aria-controls="amostras-nivel" onClick={() => setMostrarAmostrasNivel((visivel) => !visivel)}>{mostrarAmostrasNivel ? 'Ocultar' : 'Exibir'}</Button>}
            bordered={false} 
            style={{ borderRadius: '16px' }}
          >
            {mostrarAmostrasNivel && <div id="amostras-nivel" style={{ maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
              {serieNivel && serieNivel.length > 0 ? (
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {serieNivel.map((ponto, index) => (
                    <li key={index} style={{ marginBottom: '6px' }}>
                      <Text type="secondary">
                        {ponto.dataCompleta}: <strong>{ponto.value} m</strong>
                      </Text>
                    </li>
                  ))}
                </ul>
              ) : (
                <Text type="secondary">Nenhum ponto retornado para este período.</Text>
              )}
            </div>}
          </Card>
        </Col>

        {/* Amostras Precipitação */}
        <Col xs={24} xl={12}>
          <Card 
            title={<span><DatabaseOutlined /> Amostras Detalhadas - Precipitação</span>} 
            extra={<Button type="link" aria-expanded={mostrarAmostrasChuva} aria-controls="amostras-chuva" onClick={() => setMostrarAmostrasChuva((visivel) => !visivel)}>{mostrarAmostrasChuva ? 'Ocultar' : 'Exibir'}</Button>}
            bordered={false} 
            style={{ borderRadius: '16px' }}
          >
            {mostrarAmostrasChuva && <div id="amostras-chuva" style={{ maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
              {serieChuva && serieChuva.length > 0 ? (
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {serieChuva.map((ponto, index) => (
                    <li key={index} style={{ marginBottom: '6px' }}>
                      <Text type="secondary">
                        {ponto.dataCompleta}: <strong>{ponto.value} mm/h</strong>
                      </Text>
                    </li>
                  ))}
                </ul>
              ) : (
                <Text type="secondary">Nenhum ponto retornado para este período.</Text>
              )}
            </div>}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
