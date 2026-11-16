import { useState, useEffect, useRef } from 'react';
import { Alert, Table, Card, Typography, Spin, Tag, Space, Button, message } from 'antd';
import { DatabaseOutlined, ReloadOutlined, EnvironmentOutlined, DownloadOutlined } from '@ant-design/icons';
import EstacaoDAO from '../objetos/dao/EstacaoDAOBackEnd.mjs';

const estacaoDAO = new EstacaoDAO();

const { Text } = Typography;

export default function ConsultaMedicoes() {
  const [estacoes, setEstacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [detalhesResumo, setDetalhesResumo] = useState({});
  const [erro, setErro] = useState(null);
  const requisicaoAtual = useRef(0);

  async function carregarDados() {
    const requisicao = ++requisicaoAtual.current;
    setCarregando(true);
    setErro(null);
    try {
      const lista = await estacaoDAO.listar();
      const resultados = await Promise.allSettled(lista.map(est => estacaoDAO.obterResumo(est.id)));
      if (requisicao !== requisicaoAtual.current) return;
      const novosResumos = {};
      resultados.forEach((resultado, index) => {
        if (resultado.status === 'fulfilled') novosResumos[lista[index].id] = resultado.value;
      });
      setEstacoes(lista);
      setDetalhesResumo(novosResumos);
      if (resultados.some(resultado => resultado.status === 'rejected')) {
        setErro('Alguns resumos não puderam ser carregados.');
      }
    } catch (erro) {
      if (requisicao === requisicaoAtual.current) {
        setEstacoes([]);
        setDetalhesResumo({});
        setErro(erro.message || 'Erro ao carregar medições da API.');
      }
    } finally {
      if (requisicao === requisicaoAtual.current) setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
    return () => { requisicaoAtual.current += 1; };
  }, []);

  // Função sênior para exportar dados em CSV (Gerador de Relatório Corporativo)
  function exportarCSV() {
    if (estacoes.length === 0) {
      message.warning('Não há dados para exportar.');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,ID,Estacao,Rio,Municipio,Nivel (m),Precipitacao (mm/h)\n";
    
    estacoes.forEach((est) => {
      const resumo = detalhesResumo[est.id];
      const nivel = resumo?.latest?.level?.value ?? 'N/A';
      const chuva = resumo?.latest?.rain?.value ?? 'N/A';
      csvContent += `${est.id},"${est.name}","${est.river}","${est.municipality}",${nivel},${chuva}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "relatorio_hidrologico_cogmo.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success('Relatório CSV exportado com sucesso!');
  }

  const colunas = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (texto) => <Tag color="blue">{texto}</Tag>,
    },
    {
      title: 'Estação',
      dataIndex: 'name',
      key: 'name',
      render: (texto, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{texto}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <EnvironmentOutlined /> {record.municipality}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Rio Principal',
      dataIndex: 'river',
      key: 'river',
    },
    {
      title: 'Último Nível (m)',
      key: 'nivel',
      render: (_, record) => {
        const resumo = detalhesResumo[record.id];
        const val = resumo?.latest?.level?.value;
        return val != null ? (
          <Tag color="cyan" style={{ fontSize: '13px', padding: '4px 8px' }}>
            <strong>{val} m</strong>
          </Tag>
        ) : (
          <Text type="secondary">--</Text>
        );
      },
    },
    {
      title: 'Precipitação',
      key: 'chuva',
      render: (_, record) => {
        const resumo = detalhesResumo[record.id];
        const val = resumo?.latest?.rain?.value;
        return val != null ? (
          <Tag color="purple" style={{ fontSize: '13px', padding: '4px 8px' }}>
            <strong>{val} mm/h</strong>
          </Tag>
        ) : (
          <Text type="secondary">--</Text>
        );
      },
    },
  ];

  if (carregando) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <Spin size="large" tip="Carregando dados das estações..." />
      </div>
    );
  }

  return (
    <div className="pagina pagina-cabecalho-proximo pagina-consulta" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {erro && <Alert type="error" message={erro} showIcon style={{ marginBottom: 24 }} />}
      <div className="consulta-cabecalho">
        <Space wrap className="consulta-acoes">
          <Button 
            icon={<DownloadOutlined />} 
            onClick={exportarCSV}
            style={{ borderColor: '#6129ac', color: '#6129ac' }}
          >
            Exportar CSV
          </Button>

          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={carregarDados}
            style={{ background: '#6129ac' }}
          >
            Atualizar
          </Button>
        </Space>
      </div>

      <Card bordered={false} className="painel-card" style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)', borderRadius: '16px' }}>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DatabaseOutlined style={{ color: '#6129ac' }} />
          <Text strong style={{ fontSize: 16 }}>
            Estações Cadastradas ({estacoes.length})
          </Text>
        </div>

        <div className="consulta-tabela">
          <Table
            dataSource={estacoes}
            columns={colunas}
            rowKey="id"
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        </div>
        <div className="consulta-lista" aria-label="Estações cadastradas">
          {estacoes.map((estacao) => {
            const ultimo = detalhesResumo[estacao.id]?.latest;
            return (
              <article className="consulta-estacao" key={estacao.id}>
                <div className="consulta-estacao-topo">
                  <div>
                    <strong>{estacao.name}</strong>
                    <span><EnvironmentOutlined /> {estacao.municipality}</span>
                  </div>
                </div>
                <div className="consulta-estacao-dados">
                  <div><span>Rio principal</span><strong>{estacao.river}</strong></div>
                  <div><span>Nível</span><strong>{ultimo?.level?.value ?? '--'} m</strong></div>
                  <div><span>Precipitação</span><strong>{ultimo?.rain?.value ?? '--'} mm/h</strong></div>
                </div>
              </article>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
