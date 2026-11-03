

import {
  Button,
  Card,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';

import AvisoSimulacao from '../componentes/AvisoSimulacao';
import { estacoes, registrosExemplo } from '../dados/estacoes';

const { Title, Paragraph, Text } = Typography;

const colunas = [
  {
    title: 'Data e hora',
    dataIndex: 'data',
    key: 'data',
  },
  {
    title: 'Estação',
    dataIndex: 'estacao',
    key: 'estacao',
  },
  {
    title: 'Nível do rio (m)',
    dataIndex: 'nivel',
    key: 'nivel',
  },
  {
    title: 'Precipitação (mm/h)',
    dataIndex: 'chuva',
    key: 'chuva',
  },
  {
    title: 'Situação',
    dataIndex: 'situacao',
    key: 'situacao',
    render: (situacao) => (
      <Tag color={situacao === 'Normal' ? 'green' : 'gold'}>{situacao}</Tag>
    ),
  },
];

export default function ConsultaMedicoes() {
  return (
    <div className="pagina">
      <div className="pagina-introducao">
        <Text className="sobretitulo">CONSULTA DE REGISTROS</Text>
        <Title level={2}>Consulta de Medições</Title>
        <Paragraph>
          Registros ilustrativos das estações de monitoramento.
        </Paragraph>
      </div>

      <AvisoSimulacao />

      <Card className="painel-card" bordered={false}>
        <div className="secao-cabecalho">
          <div className="icone-secao">
            <FilterOutlined />
          </div>
          <div>
            <Title level={4}>Filtros de consulta</Title>
            <Text type="secondary">
              Filtros apenas visuais nesta sprint.
            </Text>
          </div>
        </div>

        <div className="filtros-consulta">
          <div className="filtro-campo">
            <Text strong>Estação</Text>
            <Select
              placeholder="Todas as estações"
              size="large"
              options={estacoes.map((e) => ({ value: e.id, label: e.nome }))}
              className="campo-largo"
            />
          </div>

          <div className="filtro-campo">
            <Text strong>Pesquisar registro</Text>
            <Input
              size="large"
              placeholder="Buscar por estação ou registro"
              prefix={<SearchOutlined />}
              disabled
            />
          </div>

          <Button
            type="primary"
            size="large"
            icon={<FilterOutlined />}
            disabled
          >
            Aplicar filtros
          </Button>
        </div>

        <Text type="secondary" className="texto-ajuda">
          Os filtros ainda não executam consultas nesta sprint.
        </Text>
      </Card>

      <Card className="painel-card tabela-card" bordered={false}>
        <div className="tabela-cabecalho">
          <div>
            <Title level={4}>Registros de medições</Title>
            <Text type="secondary">
              Registros fictícios, apenas para demonstração.
            </Text>
          </div>

          <Space>
            <DatabaseOutlined />
            <Text type="secondary">{registrosExemplo.length} registros de exemplo</Text>
          </Space>
        </div>

        <Table
          columns={colunas}
          dataSource={registrosExemplo}
          pagination={false}
          locale={{
            emptyText: (
              <div className="tabela-vazia">
                <DatabaseOutlined />
                <Text strong>Nenhum registro disponível</Text>
                <Text type="secondary">
                  A tabela será preenchida em uma próxima sprint.
                </Text>
              </div>
            ),
          }}
          scroll={{ x: 700 }}
        />
      </Card>
    </div>
  );
}