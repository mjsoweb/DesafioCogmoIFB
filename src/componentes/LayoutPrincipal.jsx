import { useState } from 'react';
import { Grid, Layout, Menu } from 'antd';

import {
  DashboardOutlined,
  LineChartOutlined,
  TableOutlined,
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

  const menuRecolhidoAtual = mobile
    ? !menuAberto
    : menuRecolhido;

  function selecionarPagina({ key }) {
    navegar(key);
    setMenuAberto(false);
  }

  return (
    <Layout className="aplicacao" hasSider>

      {/* OVERLAY DO MENU MOBILE */}
      {mobile && menuAberto && (
        <div
          className="menu-overlay"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* =========================================
          MENU LATERAL
      ========================================= */}
      <Sider
        width={250}
        collapsedWidth={mobile ? 0 : 80}
        collapsed={menuRecolhidoAtual}
        trigger={null}
        className={`menu-lateral ${
          mobile && menuAberto
            ? 'menu-lateral-aberto'
            : ''
        }`}
      >

        {/* MARCA */}
        <div className="marca">
          <div className="marca-icone" style={{ background: 'transparent', padding: 0 }}>
            <img src="/logo-cogmo.png" alt="Logo Cogmo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          <div className="marca-textos">
            <div className="marca-nome">
              COGMO
            </div>

            <div className="marca-subtitulo">
              TECHNOLOGY
            </div>
          </div>

          {/* BOTÃO FECHAR - MOBILE */}
          <button
            className="botao-fechar-menu"
            onClick={() => setMenuAberto(false)}
            aria-label="Fechar menu"
          >
            <CloseOutlined />
          </button>

        </div>

        {/* TÍTULO DO MENU */}
        <div className="menu-titulo">
          MONITORAMENTO
        </div>

        {/* NAVEGAÇÃO */}
        <Menu
          theme="dark"
          mode="inline"
          inlineCollapsed={
            !mobile && menuRecolhido
          }
          selectedKeys={[
            localizacao.pathname,
          ]}
          items={itensMenu}
          onClick={selecionarPagina}
          className="menu-navegacao"
        />

        {/* RODAPÉ DO MENU */}
        <div className="menu-rodape">
          <span className="indicador-ponto" />

          <span>
            Ambiente demonstrativo
          </span>
        </div>

      </Sider>

      {/* =========================================
          ÁREA PRINCIPAL
      ========================================= */}
      <Layout className="layout-principal">

        {/* =====================================
            CABEÇALHO
        ===================================== */}
        <Header className="cabecalho">

          {/* BOTÃO DESKTOP */}
          <button
            className="botao-menu-desktop"
            onClick={() =>
              setMenuRecolhido(!menuRecolhido)
            }
            aria-label={
              menuRecolhido
                ? 'Expandir menu'
                : 'Recolher menu'
            }
          >
            {menuRecolhido ? (
              <MenuUnfoldOutlined />
            ) : (
              <MenuFoldOutlined />
            )}
          </button>

          {/* BOTÃO MOBILE */}
          <button
            className="botao-menu-mobile"
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
          >
            <MenuOutlined />
          </button>

          {/* IDENTIDADE */}
          <div className="cabecalho-identidade">

            <div className="cabecalho-simbolo" style={{ width: '34px', height: '34px' }}>
              <img src="/logo-cogmo.png" alt="Logo Cogmo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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

          {/* STATUS */}
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

        {/* =====================================
            CONTEÚDO
        ===================================== */}
        <Content className="conteudo">

          <main className="conteudo-principal">
            <Outlet />
          </main>

          {/* RODAPÉ */}
          <footer className="rodape">
            Cogmo Technology · Projeto Integrador — Bolsa Futuro Digital
          </footer>

        </Content>

      </Layout>

    </Layout>
  );
}