import { useState, useEffect } from 'react';
import { Card, Col, Row, Select, Spin, Tag, Typography, Statistic } from 'antd';
import {
  EnvironmentOutlined,
  CloudOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { getStations, getSummary } from '../api/api';

const { Title, Text, Paragraph } = Typography;

export default function VisaoGeral() {
  const [estacoes, setEstacoes] = useState([]);
  const [estacaoSelecionadaId, setEstacaoSelecionadaId] = useState(null);
  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarEstacoes() {
      try {
        const resposta = await getStations();
        const lista = resposta?.stations || [];
        setEstacoes(lista);
        if (lista.length > 0) {
          setEstacaoSelecionadaId(lista[0].id);
        }
      } catch (erro) {
        console.error('Erro ao carregar estações:', erro);
      } finally {
        setCarregando(false);
      }
    }
    carregarEstacoes();
  }, []);

  useEffect(() => {
    if (!estacaoSelecionadaId) return;

    async function carregarResumo() {
      try {
        const dadosResumo = await getSummary(estacaoSelecionadaId);
        setResumo(dadosResumo);
      } catch (erro) {
        console.error('Erro ao carregar resumo:', erro);
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

  const estacaoAtual = estacoes.find((e) => e.id === estacaoSelecionadaId);

  // Extraindo os valores exatamente como o mockapi.ts retorna
  const valorNivel = resumo?.latest?.level_m ?? '--';
  const horarioNivel = resumo?.latest?.level_observed_at;

  const valorChuva = resumo?.latest?.rain_mm_h ?? '--';
  const horarioChuva = resumo?.latest?.rain_observed_at;

  return (
    <div className="pagina">
      <div className="pagina-introducao">
        <Text className="sobretitulo">PAINEL PRINCIPAL</Text>
        <Title level={2}>Visão Geral</Title>
        <Paragraph>
          Acompanhe os indicadores das estações e o resumo hidrológico mais recente.
        </Paragraph>
      </div>

      <Card className="seletor-card" bordered={false} style={{ marginBottom: 24 }}>
        <div>
          <span className="rotulo">ESTAÇÃO DE MONITORAMENTO</span>
          <h3>Selecione uma estação</h3>
        </div>

        <Select
          value={estacaoSelecionadaId}
          onChange={(valor) => setEstacaoSelecionadaId(valor)}
          className="seletor"
          options={estacoes.map((e) => ({
            value: e.id,
            label: e.name,
          }))}
        />
      </Card>

      {estacaoAtual && (
        <div className="identificacao">
          <div className="identificacao-icone" style={{ background: '#e7f1ff', padding: '8px', display: 'grid', placeItems: 'center', borderRadius: '14px' }}>
            <img src="/logo-cogmo.png" alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          </div>
          <div>
            <span>ESTAÇÃO SELECIONADA</span>
            <h2>{estacaoAtual.name}</h2>
            <p>{estacaoAtual.river} — {estacaoAtual.municipality}</p>
          </div>
        </div>
      )}

      <div className="grade-cartoes">
        <Card className="indicador" bordered={false}>
          <div className="indicador-topo">
            <span>Nível do rio</span>
            <div className="icone-agua">
              <DashboardOutlined />
            </div>
          </div>
          <Statistic
            value={valorNivel}
            precision={2}
            suffix="m"
            valueStyle={{ color: '#007bff', fontWeight: 700 }}
          />
          <Tag color="blue">Última medição</Tag>
          {horarioNivel && (
            <p className="horario">
              Horário: {new Date(horarioNivel).toLocaleTimeString('pt-BR')}
            </p>
          )}
        </Card>

        <Card className="indicador" bordered={false}>
          <div className="indicador-topo">
            <span>Precipitação</span>
            <div className="icone-chuva">
              <CloudOutlined />
            </div>
          </div>
          <Statistic
            value={valorChuva}
            precision={2}
            suffix="mm/h"
            valueStyle={{ color: '#6f42c1', fontWeight: 700 }}
          />
          <Tag color="purple">Última medição</Tag>
          {horarioChuva && (
            <p className="horario">
              Horário: {new Date(horarioChuva).toLocaleTimeString('pt-BR')}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}