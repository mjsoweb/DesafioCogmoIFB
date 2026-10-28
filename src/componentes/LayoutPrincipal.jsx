
import { Layout, Menu, Typography, Tag } from 'antd';

import {
  DashboardOutlined,
  LineChartOutlined,
  TableOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const itensMenu = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: 'Visão Geral',
  },
  {
    key: '/historico',
    icon: <LineChartOutlined />,
    label: 'Histórico de Medições',
  },
  {
    key: '/medicoes',
    icon: <TableOutlined />,
    label: 'Consulta de Medições',
  },
];

export default function LayoutPrincipal() {
  const localizacao = useLocation();
  const navegar = useNavigate();

  return (
    <Layout className="aplicacao" hasSider>
      <Sider
        width={250}
        breakpoint="lg"
        collapsedWidth={0}
        className="menu-lateral"
      >
        <div className="marca">
          <div className="marca-icone">
            <ExperimentOutlined />
          </div>

          <div>
            <div className="marca-nome">COGMO</div>
            <div className="marca-subtitulo">TECHNOLOGY</div>
          </div>
        </div>

        <div className="menu-titulo">MONITORAMENTO</div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[localizacao.pathname]}
          items={itensMenu}
          onClick={({ key }) => navegar(key)}
          className="menu-navegacao"
        />

        <div className="menu-rodape">
          <span className="indicador-ponto" />
          <span>Ambiente demonstrativo</span>
        </div>
      </Sider>

      <Layout className="layout-principal">
        <Header className="cabecalho">
          <div>
            <Text className="cabecalho-legenda">
              
            </Text>

            <div className="cabecalho-titulo">
              
            </div>
          </div>

          <Tag color="blue" bordered={false}>
            SPRINT 1
          </Tag>
        </Header>

        <Content className="conteudo">
          <div className="aviso-superior">
            <span>Projeto acadêmico</span>
            <span className="aviso-separador">•</span>
            <span>Dados demonstrativos</span>
          </div>

          <main className="conteudo-principal">
            <Outlet />
          </main>

          <footer className="rodape">
            Cogmo Technology · Projeto Integrador — Bolsa Futuro Digital
          </footer>
        </Content>
      </Layout>
    </Layout>
  );
}
