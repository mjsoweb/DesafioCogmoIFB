import { Layout, Menu, Typography } from 'antd';

import {
  DashboardOutlined,
  LineChartOutlined,
  TableOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

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
  const telas = Grid.useBreakpoint();

  const mobile = !telas.lg;

  const [menuRecolhido, setMenuRecolhido] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const menuRecolhidoAtual = mobile ? !menuAberto : menuRecolhido;

  function selecionarPagina({ key }) {
    navegar(key);
    setMenuAberto(false);
  }

  return (
    <Layout className="aplicacao" hasSider>
      {mobile && menuAberto && (
        <div
          className="menu-overlay"
          onClick={() => setMenuAberto(false)}
        />
      )}

      <Sider
        width={250}
        collapsedWidth={mobile ? 0 : 80}
        collapsed={menuRecolhidoAtual}
        trigger={null}
        className={`menu-lateral ${
          mobile && menuAberto ? 'menu-lateral-aberto' : ''
        }`}
      >
        <div className="marca">
          <div className="marca-icone">
           <img src="/logo-cogmo.png" alt="Logo Cogmo" />
          </div>

          <div className="marca-textos">
            <div className="marca-nome">COGMO</div>
            <div className="marca-subtitulo">TECHNOLOGY</div>
          </div>

          <button
            className="botao-fechar-menu"
            onClick={() => setMenuAberto(false)}
            aria-label="Fechar menu"
          >
            <CloseOutlined />
          </button>
        </div>

        <div className="menu-titulo">MONITORAMENTO</div>

        <Menu
          theme="dark"
          mode="inline"
          inlineCollapsed={!mobile && menuRecolhido}
          selectedKeys={[localizacao.pathname]}
          items={itensMenu}
          onClick={selecionarPagina}
          className="menu-navegacao"
        />

        <div className="menu-rodape">
          <span className="indicador-ponto" />
          <span>Ambiente demonstrativo</span>
        </div>
      </Sider>

      <Layout className="layout-principal">
        <Header className="cabecalho">
          <button
            className="botao-menu-desktop"
            onClick={() => setMenuRecolhido(!menuRecolhido)}
            aria-label={
              menuRecolhido ? 'Expandir menu' : 'Recolher menu'
            }
          >
            {menuRecolhido ? (
              <MenuUnfoldOutlined />
            ) : (
              <MenuFoldOutlined />
            )}
          </button>

          <button
            className="botao-menu-mobile"
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
          >
            <MenuOutlined />
          </button>

          <div className="cabecalho-identidade">
            <div className="cabecalho-simbolo">
              <img src="/logo-cogmo.png" alt="Logo Cogmo" />
            </div>

            <div className="cabecalho-textos">
              <span className="cabecalho-legenda">
                COGMO TECHNOLOGY
              </span>
              <span className="cabecalho-titulo">
                Monitoramento Hidrológico
              </span>
            </div>
          </div>

          <div className="cabecalho-status">
            <span className="status-icone">
              <SafetyCertificateOutlined />
            </span>

            <div className="status-textos">
              <span className="status-titulo">
                Ambiente demonstrativo
              </span>
              <span className="status-subtitulo">
                Dados simulados
              </span>
            </div>

            <span className="status-ponto" />
          </div>
        </Header>

        <Content className="conteudo">
          <main className="conteudo-principal">
            <Outlet />
          </main>

          <footer className="rodape">
            Cogmo Technology · Projeto Integrador — Bolsa Futuro Digital IFB
          </footer>
        </Content>
      </Layout>
    </Layout>
  );
}
