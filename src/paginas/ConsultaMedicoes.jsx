import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Input,
  Select,
  Space,
  Table,
  Typography,
  Spin,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { getStations } from '../api/api';

const { Title, Paragraph, Text } = Typography;

const colunas = [
  {
    title: 'Estação',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Rio',
    dataIndex: 'river',
    key: 'river',
  },
  {
    title: 'Município',
    dataIndex: 'municipality',
    key: 'municipality',
  },
  {
    title: 'Última atualização',
    dataIndex: 'updated_at',
    key: 'updated_at',
    render: (texto) => (texto ? new Date(texto).toLocaleString('pt-BR') : '-'),
  },
];

export default function ConsultaMedicoes() {
  const [estacoes, setEstacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const resposta = await getStations();
        if (resposta && resposta.stations) {
          setEstacoes(resposta.stations);
        }
      } catch (erro) {
        console.error("Erro ao carregar registros:", erro);
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, []);

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
        <Text className="sobretitulo">CONSULTA DE REGISTROS</Text>
        <Title level={2}>Consulta de Medições</Title>
        <Paragraph>
          Consulte e organize os registros simulados das estações 
          de monitoramento hidrológico através da API mock.
        </Paragraph>
      </div>

      <Card className="painel-card" bordered={false}>
        <div className="secao-cabecalho">
          <div className="icone-secao">
            <FilterOutlined />
          </div>
          <div>
            <Title level={4}>Filtros de consulta</Title>
            <Text type="secondary">
              Opções de filtragem baseadas nas estações cadastradas no mock.
            </Text>
          </div>
        </div>

        <div className="filtros-consulta">
          <div className="filtro-campo">
            <label htmlFor="filtro-estacao">Estação</label>
            <Select
              id="filtro-estacao"
              placeholder="Todas as estações"
              size="large"
              options={estacoes.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              className="campo-largo"
              aria-label="Filtrar por estação"
            />
          </div>

          <div className="filtro-campo">
            <label htmlFor="pesquisa-registro">Pesquisar registro</label>
            <Input
              id="pesquisa-registro"
              size="large"
              placeholder="Buscar por estação ou registro"
              prefix={<SearchOutlined />}
              aria-label="Pesquisar por estação ou registro"
            />
          </div>

          <div className="filtro-acao">
            <Button
              type="primary"
              size="large"
              icon={<FilterOutlined />}
              block
              className="botao-aplicar-filtros"
            >
              Aplicar filtros
            </Button>
          </div>
        </div>

        <Text type="secondary" className="texto-ajuda">
          Dados carregados via serviços simulados (Mock) para a Sprint 3.
        </Text>
      </Card>

      <Card className="painel-card tabela-card" bordered={false}>
        <div className="tabela-cabecalho">
          <div>
            <Title level={4}>Registros de medições</Title>
            <Text type="secondary">
              Tabela preenchida com os registros fornecidos pela API do projeto.
            </Text>
          </div>

          <Space>
            <DatabaseOutlined />
            <Text type="secondary">{estacoes.length} registros carregados</Text>
          </Space>
        </div>

        <Table
          columns={colunas}
          dataSource={estacoes}
          pagination={false}
          rowKey="id"
          scroll={{ x: 700 }}
        />
      </Card>
    </div>
  );
}
// import {
//   Button,
//   Card,
//   Input,
//   Select,
//   Space,
//   Table,
//   Typography,
// } from 'antd';
// import {
//   SearchOutlined,
//   FilterOutlined,
//   DatabaseOutlined,
// } from '@ant-design/icons';
// import estacoesData from '../dados/estacoes.json';

// const { Title, Paragraph, Text } = Typography;

// const colunas = [
//   {
//     title: 'Data e hora',
//     dataIndex: 'data',
//     key: 'data',
//   },
//   {
//     title: 'Estação',
//     dataIndex: 'estacao',
//     key: 'estacao',
//   },
//   {
//     title: 'Nível do rio (m)',
//     dataIndex: 'nivel',
//     key: 'nivel',
//   },
//   {
//     title: 'Precipitação (mm/h)',
//     dataIndex: 'chuva',
//     key: 'chuva',
//   },
//   {
//     title: 'Situação',
//     dataIndex: 'situacao',
//     key: 'situacao',
//   },
// ];

// export default function ConsultaMedicoes() {
//   return (
//     <div className="pagina">
//       <div className="pagina-introducao">
//         <Text className="sobretitulo">CONSULTA DE REGISTROS</Text>
//         <Title level={2}>Consulta de Medições</Title>
//         <Paragraph>
//           Consulte e organize os registros simulados das estações 
//           de monitoramento hidrológico.
//         </Paragraph>
//       </div>

//       <Card className="painel-card" bordered={false}>
//         <div className="secao-cabecalho">
//           <div className="icone-secao">
//             <FilterOutlined />
//           </div>
//           <div>
//             <Title level={4}>Filtros de consulta</Title>
//             <Text type="secondary">
//               Opções de filtragem baseadas nas estações cadastradas.
//             </Text>
//           </div>
//         </div>

//         <div className="filtros-consulta">
//           <div className="filtro-campo">
//             <label htmlFor="filtro-estacao">Estação</label>
//             <Select
//               id="filtro-estacao"
//               placeholder="Todas as estações"
//               size="large"
//               options={estacoesData.map((item) => ({
//                 value: item.id,
//                 label: item.estacao,
//               }))}
//               className="campo-largo"
//               aria-label="Filtrar por estação"
//             />
//           </div>

//           <div className="filtro-campo">
//             <label htmlFor="pesquisa-registro">Pesquisar registro</label>
//             <Input
//               id="pesquisa-registro"
//               size="large"
//               placeholder="Buscar por estação ou registro"
//               prefix={<SearchOutlined />}
//               aria-label="Pesquisar por estação ou registro"
//             />
//           </div>

//           <div className="filtro-acao">
//             <Button
//               type="primary"
//               size="large"
//               icon={<FilterOutlined />}
//               block
//               className="botao-aplicar-filtros"
//             >
//               Aplicar filtros
//             </Button>
//           </div>
//         </div>

//         <Text type="secondary" className="texto-ajuda">
//           Dados carregados da fonte local JSON para a Sprint 3.
//         </Text>
//       </Card>

//       <Card className="painel-card tabela-card" bordered={false}>
//         <div className="tabela-cabecalho">
//           <div>
//             <Title level={4}>Registros de medições</Title>
//             <Text type="secondary">
//               Tabela preenchida com os registros simulados do JSON local.
//             </Text>
//           </div>

//           <Space>
//             <DatabaseOutlined />
//             <Text type="secondary">{estacoesData.length} registros carregados</Text>
//           </Space>
//         </div>

//         <Table
//           columns={colunas}
//           dataSource={estacoesData}
//           pagination={false}
//           rowKey="id"
//           scroll={{ x: 700 }}
//         />
//       </Card>
//     </div>
//   );
// }