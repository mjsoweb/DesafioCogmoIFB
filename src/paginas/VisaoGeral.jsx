import { useState, useEffect } from 'react';
import { Card, Select, Spin, Tag, Typography, Statistic, message, Alert } from 'antd';
import {
  CloudOutlined,
  DashboardOutlined,
  WarningOutlined,
  CheckCircleOutlined,
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
        message.success('Estações carregadas com sucesso via API Mock!');
      } catch (erro) {
        message.error(erro.message || 'Erro ao carregar estações.');
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
        message.error(erro.message || 'Falha ao consultar dados da estação.');
        setResumo(null);
      }
    }
    carregarResumo();
  }, [estacaoSelecionadaId]);

  if (carregando) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <Spin size="large" tip="Sincronizando com a API..." />
      </div>
    );
  }

  const estacaoAtual = estacoes.find((e) => e.id === estacaoSelecionadaId);

  const valorNivel = resumo?.latest?.level_m ?? 0;
  const horarioNivel = resumo?.latest?.level_observed_at;
  const valorChuva = resumo?.latest?.rain_mm_h ?? 0;
  const horarioChuva = resumo?.latest?.rain_observed_at;

  // Lógica de Alerta (Thresholds de Segurança Hidrológica)
  const nivelAlerta = valorNivel > 1.8;
  const chuvaAlerta = valorChuva > 2.0;

  return (
    <div className="pagina">
      <div className="pagina-introducao">
        <Text className="sobretitulo" style={{ color: '#007bff', fontWeight: 'bold', fontSize: '12px' }}>PAINEL DE CONTROLE INTELIGENTE</Text>
        <Title level={2}>Visão Geral e Alertas</Title>
        <Paragraph type="secondary">
          Monitoramento em tempo real com regras automáticas de limiar (Thresholds) para suporte à decisão.
        </Paragraph>
      </div>

      {/* Alerta dinâmico de Defesa Civil se passar do limite */}
      {(nivelAlerta || chuvaAlerta) && (
        <Alert
          message="Atenção: Indicadores acima da média operacional!"
          description="Os sensores registraram níveis elevados de água ou precipitação nesta estação. Monitore com atenção."
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: '24px', borderRadius: '12px', border: '1px solid #ffe58f' }}
        />
      )}

      <Card className="seletor-card" bordered={false} style={{ marginBottom: 24, borderRadius: '16px' }}>
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
        <div className="identificacao" style={{ background: '#fff', padding: '16px 20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#e7f1ff', padding: '10px', display: 'grid', placeItems: 'center', borderRadius: '12px' }}>
            <img src="/logo-cogmo.png" alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#6c757d', fontWeight: 'bold' }}>ESTAÇÃO ATIVA</span>
            <h2 style={{ margin: '2px 0', fontSize: '18px' }}>{estacaoAtual.name}</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#6c757d' }}>{estacaoAtual.river} — {estacaoAtual.municipality}</p>
          </div>
        </div>
      )}

      <div className="grade-cartoes">
        {/* Card Nível do Rio */}
        <Card 
          className="indicador" 
          bordered={false} 
          style={{ 
            borderRadius: '16px', 
            borderLeft: nivelAlerta ? '5px solid #faad14' : '5px solid #007bff' 
          }}
        >
          <div className="indicador-topo">
            <span>Nível do rio</span>
            <div className="icone-agua" style={{ background: nivelAlerta ? '#fffbe6' : '#e7f1ff', color: nivelAlerta ? '#faad14' : '#007bff' }}>
              <DashboardOutlined />
            </div>
          </div>
          <Statistic
            value={valorNivel}
            precision={2}
            suffix="m"
            valueStyle={{ color: nivelAlerta ? '#faad14' : '#007bff', fontWeight: 700 }}
          />
          <Tag color={nivelAlerta ? 'warning' : 'blue'}>
            {nivelAlerta ? 'Nível Elevado (Alerta)' : 'Condição Normal'}
          </Tag>
          {horarioNivel && (
            <p className="horario">
              Última leitura: {new Date(horarioNivel).toLocaleTimeString('pt-BR')}
            </p>
          )}
        </Card>

        {/* Card Precipitação */}
        <Card 
          className="indicador" 
          bordered={false} 
          style={{ 
            borderRadius: '16px',
            borderLeft: chuvaAlerta ? '5px solid #f5222d' : '5px solid #6f42c1' 
          }}
        >
          <div className="indicador-topo">
            <span>Precipitação</span>
            <div className="icone-chuva" style={{ background: chuvaAlerta ? '#fff1f0' : '#f3e8ff', color: chuvaAlerta ? '#f5222d' : '#6f42c1' }}>
              <CloudOutlined />
            </div>
          </div>
          <Statistic
            value={valorChuva}
            precision={2}
            suffix="mm/h"
            valueStyle={{ color: chuvaAlerta ? '#f5222d' : '#6f42c1', fontWeight: 700 }}
          />
          <Tag color={chuvaAlerta ? 'error' : 'purple'}>
            {chuvaAlerta ? 'Chuva Intensa' : 'Baixa / Sem Chuva'}
          </Tag>
          {horarioChuva && (
            <p className="horario">
              Última leitura: {new Date(horarioChuva).toLocaleTimeString('pt-BR')}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}