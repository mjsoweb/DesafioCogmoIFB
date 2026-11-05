<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======


>>>>>>> cf8245c7906d7c5f02cb2cf771dab6dceb2ec3d1
import {
  Button,
  Card,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Spin,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { getStations } from '../api/api';

import AvisoSimulacao from '../componentes/AvisoSimulacao';
import { estacoes, registrosExemplo } from '../dados/estacoes';

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
<<<<<<< HEAD
    title: 'Última atualização',
    dataIndex: 'updated_at',
    key: 'updated_at',
    render: (texto) => (texto ? new Date(texto).toLocaleString('pt-BR') : '-'),
=======
    title: 'Situação',
    dataIndex: 'situacao',
    key: 'situacao',
    render: (situacao) => (
      <Tag color={situacao === 'Normal' ? 'green' : 'gold'}>{situacao}</Tag>
    ),
>>>>>>> cf8245c7906d7c5f02cb2cf771dab6dceb2ec3d1
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
<<<<<<< HEAD
          Consulte e organize os registros simulados das estações 
          de monitoramento hidrológico através da API mock.
=======
          Registros ilustrativos das estações de monitoramento.
>>>>>>> cf8245c7906d7c5f02cb2cf771dab6dceb2ec3d1
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
<<<<<<< HEAD
              Opções de filtragem baseadas nas estações cadastradas no mock.
=======
              Filtros apenas visuais nesta sprint.
>>>>>>> cf8245c7906d7c5f02cb2cf771dab6dceb2ec3d1
            </Text>
          </div>
        </div>

        <div className="filtros-consulta">
          <div className="filtro-campo">
<<<<<<< HEAD
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
=======
            <Text strong>Estação</Text>
            <Select
              placeholder="Todas as estações"
              size="large"
              options={estacoes.map((e) => ({ value: e.id, label: e.nome }))}
              className="campo-largo"
>>>>>>> cf8245c7906d7c5f02cb2cf771dab6dceb2ec3d1
            />
          </div>

          <div className="filtro-campo">
<<<<<<< HEAD
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
=======
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
>>>>>>> cf8245c7906d7c5f02cb2cf771dab6dceb2ec3d1
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
<<<<<<< HEAD
              Tabela preenchida com os registros fornecidos pela API do projeto.
=======
              Registros fictícios, apenas para demonstração.
>>>>>>> cf8245c7906d7c5f02cb2cf771dab6dceb2ec3d1
            </Text>
          </div>

          <Space>
            <DatabaseOutlined />
<<<<<<< HEAD
            <Text type="secondary">{estacoes.length} registros carregados</Text>
=======
            <Text type="secondary">{registrosExemplo.length} registros de exemplo</Text>
>>>>>>> cf8245c7906d7c5f02cb2cf771dab6dceb2ec3d1
          </Space>
        </div>

        <Table
          columns={colunas}
<<<<<<< HEAD
          dataSource={estacoes}
=======
          dataSource={registrosExemplo}
>>>>>>> cf8245c7906d7c5f02cb2cf771dab6dceb2ec3d1
          pagination={false}
          rowKey="id"
          scroll={{ x: 700 }}
        />
      </Card>
    </div>
  );
<<<<<<< HEAD
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
=======
}
>>>>>>> cf8245c7906d7c5f02cb2cf771dab6dceb2ec3d1
