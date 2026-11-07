import { useState, useEffect } from 'react';
import { Table, Card, Typography, Spin, Tag, Space, Button, message } from 'antd';
import { DatabaseOutlined, ReloadOutlined, EnvironmentOutlined, DownloadOutlined } from '@ant-design/icons';
import { getStations, getSummary } from '../api/api';

const { Title, Paragraph, Text } = Typography;

export default function ConsultaMedicoes() {
  const [estacoes, setEstacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [detalhesResumo, setDetalhesResumo] = useState({});

  async function carregarDados() {
    setCarregando(true);
    try {
      const resposta = await getStations();
      if (resposta && resposta.stations) {
        setEstacoes(resposta.stations);
        
        const novosResumos = {};
        for (const est of resposta.stations) {
          try {
            const sum = await getSummary(est.id);
            novosResumos[est.id] = sum;
          } catch (e) {
            console.error(`Erro ao buscar resumo para ${est.id}`, e);
          }
        }
        setDetalhesResumo(novosResumos);
        message.success('Tabela atualizada com sucesso!');
      }
    } catch (erro) {
      message.error('Erro ao carregar medições da API.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
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
      const nivel = resumo?.latest?.level_m ?? 'N/A';
      const chuva = resumo?.latest?.rain_mm_h ?? 'N/A';
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
        const val = resumo?.latest?.level_m;
        return val !== undefined ? (
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
        const val = resumo?.latest?.rain_mm_h;
        return val !== undefined ? (
          <Tag color="purple" style={{ fontSize: '13px', padding: '4px 8px' }}>
            <strong>{val} mm/h</strong>
          </Tag>
        ) : (
          <Text type="secondary">--</Text>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: () => <Tag color="success">Ativa (Mock)</Tag>,
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
    <div className="pagina" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div 
        className="pagina-introducao" 
        style={{ 
          marginBottom: '24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          flexWrap: 'wrap',
          gap: '16px' 
        }}
      >
        <div>
          <Text className="sobretitulo" style={{ color: '#007bff', fontWeight: 'bold', fontSize: '12px' }}>DADOS E REGISTROS</Text>
          <Title level={2} style={{ margin: '4px 0' }}>Consulta de Medições</Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Listagem detalhada e exportação de relatórios operacionais do sistema.
          </Paragraph>
        </div>

        <Space wrap>
          <Button 
            icon={<DownloadOutlined />} 
            onClick={exportarCSV}
            style={{ borderColor: '#007bff', color: '#007bff' }}
          >
            Exportar CSV
          </Button>

          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={carregarDados}
            style={{ background: '#007bff' }}
          >
            Atualizar
          </Button>
        </Space>
      </div>

      <Card bordered={false} className="painel-card" style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)', borderRadius: '16px' }}>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DatabaseOutlined style={{ color: '#007bff' }} />
          <Text strong style={{ fontSize: 16 }}>
            Estações Cadastradas ({estacoes.length})
          </Text>
        </div>

        <Table
          dataSource={estacoes}
          columns={colunas}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
}