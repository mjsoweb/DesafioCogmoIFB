import { useState, useEffect } from 'react';
import { Card, Select, Spin, Statistic, Alert } from 'antd';
import {
  CloudOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import EstacaoDAO from '../objetos/dao/EstacaoDAOBackEnd.mjs';

const estacaoDAO = new EstacaoDAO();

export default function VisaoGeral() {
  const [estacoes, setEstacoes] = useState([]);
  const [estacaoSelecionadaId, setEstacaoSelecionadaId] = useState(null);
  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [carregandoResumo, setCarregandoResumo] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;
    async function carregarEstacoes() {
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
    carregarEstacoes();
    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    if (!estacaoSelecionadaId) return;
    let ativo = true;
    async function carregarResumo() {
      setResumo(null);
      setErro(null);
      setCarregandoResumo(true);
      try {
        const dadosResumo = await estacaoDAO.obterResumo(estacaoSelecionadaId);
        if (ativo) setResumo(dadosResumo);
      } catch (erro) {
        if (ativo) setErro(erro.message || 'Falha ao consultar dados da estação.');
      } finally {
        if (ativo) setCarregandoResumo(false);
      }
    }
    carregarResumo();
    return () => { ativo = false; };
  }, [estacaoSelecionadaId]);

  if (carregando) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <Spin size="large" tip="Sincronizando com a API..." />
      </div>
    );
  }

  const valorNivel = resumo?.latest?.level?.value;
  const horarioNivel = resumo?.latest?.level?.observedAt;
  const valorChuva = resumo?.latest?.rain?.value;
  const horarioChuva = resumo?.latest?.rain?.observedAt;

  return (
    <div className="pagina pagina-visao-geral">

      {erro && <Alert type="error" message={erro} showIcon style={{ marginBottom: 24 }} />}
      {!erro && estacoes.length === 0 && <Alert message="Nenhuma estação disponível." showIcon style={{ marginBottom: 24 }} />}
      {carregandoResumo && <Spin tip="Carregando leituras"><div style={{ minHeight: 48 }} /></Spin>}

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

      <div className="grade-cartoes">
        {/* Card Nível do Rio */}
        <Card 
          className="indicador" 
          bordered={false} 
          style={{ 
            borderRadius: '16px', 
            borderLeft: '5px solid #007bff'
          }}
        >
          <div className="indicador-topo">
            <span>Nível do rio</span>
            <div className="icone-agua" style={{ background: '#e7f1ff', color: '#6129ac' }}>
              <DashboardOutlined />
            </div>
          </div>
          <Statistic
            value={valorNivel ?? '—'}
            precision={2}
            suffix="m"
            valueStyle={{ color: '#1d165c', fontWeight: 700 }}
          />
          <p className="horario">
            Última leitura: {horarioNivel ? new Date(horarioNivel).toLocaleString('pt-BR') : '—'}
          </p>
        </Card>

        {/* Card Precipitação */}
        <Card 
          className="indicador" 
          bordered={false} 
          style={{ 
            borderRadius: '16px',
            borderLeft: '5px solid #6f42c1'
          }}
        >
          <div className="indicador-topo">
            <span>Precipitação</span>
            <div className="icone-chuva" style={{ background: '#f3e8ff', color: '#6f42c1' }}>
              <CloudOutlined />
            </div>
          </div>
          <Statistic
            value={valorChuva ?? '—'}
            precision={2}
            suffix="mm/h"
            valueStyle={{ color: '#1d165c', fontWeight: 700 }}
          />
          <p className="horario">
            Última leitura: {horarioChuva ? new Date(horarioChuva).toLocaleString('pt-BR') : '—'}
          </p>
        </Card>
      </div>
    </div>
  );
}
