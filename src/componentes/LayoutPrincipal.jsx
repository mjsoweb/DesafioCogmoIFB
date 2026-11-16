import { useEffect, useRef, useState } from 'react';
import { Grid, Layout, Menu } from 'antd';

import {
  DashboardOutlined,
  LineChartOutlined,
  TableOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Sider, Content } = Layout;

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

  const [menuAberto, setMenuAberto] = useState(false);
  const [menuDesktopExpandido, setMenuDesktopExpandido] = useState(true);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuAberto) return undefined;

    function fecharAoClicarFora(evento) {
      if (!menuRef.current?.contains(evento.target)) {
        setMenuAberto(false);
      }
    }

    document.addEventListener('pointerdown', fecharAoClicarFora);
    return () => document.removeEventListener('pointerdown', fecharAoClicarFora);
  }, [menuAberto]);

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
        ref={menuRef}
        width={250}
        collapsedWidth={mobile ? 0 : 80}
        collapsed={mobile ? !menuAberto : !menuDesktopExpandido}
        trigger={null}
        className={`menu-lateral ${
          mobile && menuAberto
            ? 'menu-lateral-aberto'
            : ''
        }`}
      >

        {/* MARCA */}
        <div className="marca">
          <img className="logo-oficial-menu" src="/logo-cogmo-oficial.png" alt="Cogmo Technology" />

          <button
            type="button"
            className="botao-alternar-menu"
            onClick={() => setMenuDesktopExpandido((expandido) => !expandido)}
            aria-label={menuDesktopExpandido ? 'Recolher menu' : 'Expandir menu'}
            aria-expanded={menuDesktopExpandido}
            title={menuDesktopExpandido ? 'Recolher menu' : 'Expandir menu'}
          >
            {menuDesktopExpandido ? <CloseOutlined /> : <MenuOutlined />}
          </button>

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
          inlineCollapsed={!mobile && !menuDesktopExpandido}
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
            CONTEÚDO
        ===================================== */}
        <Content className="conteudo">

          <div className="controles-menu">
            <button
              className="botao-menu-mobile"
              onClick={() => setMenuAberto(true)}
              aria-label="Abrir menu"
            >
              <MenuOutlined />
            </button>
          </div>

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
