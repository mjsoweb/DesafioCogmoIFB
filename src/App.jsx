
// import { useState } from 'react';
// import {
//   Layout,
//   Menu,
//   Select,
//   Card,
//   Statistic,
//   Tag,
//   Radio,
// } from 'antd';
// import {
//   DashboardOutlined,
//   EnvironmentOutlined,
//   BarChartOutlined,
//   CloudOutlined,
//   InfoCircleOutlined,
// } from '@ant-design/icons';
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Area,
//   AreaChart,
// } from 'recharts';
// import './estilos.css';

// const { Sider, Content } = Layout;

// const dadosNivel = [
//   { hora: '08h', valor: 2.1 },
//   { hora: '10h', valor: 2.3 },
//   { hora: '12h', valor: 2.2 },
//   { hora: '14h', valor: 2.6 },
//   { hora: '16h', valor: 2.5 },
//   { hora: '18h', valor: 2.8 },
// ];

// const dadosChuva = [
//   { hora: '08h', valor: 1.2 },
//   { hora: '10h', valor: 2.1 },
//   { hora: '12h', valor: 0.8 },
//   { hora: '14h', valor: 3.4 },
//   { hora: '16h', valor: 2.4 },
//   { hora: '18h', valor: 1.7 },
// ];

// const estacoes = {
//   rio: {
//     nome: 'Estação Rio Azul',
//     rio: 'Rio Azul',
//     municipio: 'Município Demonstrativo A',
//     nivel: 2.8,
//     chuva: 1.7,
//     horario: '18:00 UTC',
//   },
//   vale: {
//     nome: 'Estação Vale Verde',
//     rio: 'Rio Verde',
//     municipio: 'Município Demonstrativo B',
//     nivel: 3.2,
//     chuva: 2.4,
//     horario: '18:00 UTC',
//   },
//   serra: {
//     nome: 'Estação Serra Clara',
//     rio: 'Rio Claro',
//     municipio: 'Município Demonstrativo C',
//     nivel: 1.9,
//     chuva: 0.9,
//     horario: '18:00 UTC',
//   },
// };

// function App() {
//   const [estacao, setEstacao] = useState('rio');
//   const [periodo, setPeriodo] = useState(24);

//   const atual = estacoes[estacao];

//   return (
//     <Layout className="aplicacao">
//       <Sider width={235} className="menu-lateral">
//         <div className="marca">
//           <div className="marca-icone">🌊</div>
//           <div>
//             <strong>COGMO</strong>
//             <span>Monitoramento</span>
//           </div>
//         </div>

//         <p className="menu-titulo">MENU PRINCIPAL</p>

//         <Menu
//           theme="dark"
//           mode="inline"
//           selectedKeys={['painel']}
//           items={[
//             {
//               key: 'painel',
//               icon: <DashboardOutlined />,
//               label: 'Visão geral',
//             },
//             {
//               key: 'estacoes',
//               icon: <EnvironmentOutlined />,
//               label: 'Estações',
//             },
//             {
//               key: 'historico',
//               icon: <BarChartOutlined />,
//               label: 'Histórico',
//             },
//           ]}
//         />

//         <div className="aviso-lateral">
//           <InfoCircleOutlined />
//           <p>Ambiente demonstrativo</p>
//           <span>Todos os dados são simulados.</span>
//         </div>
//       </Sider>

//       <Layout>
//         <header className="cabecalho">
//           <div>
//             <span className="caminho">Painel / Visão geral</span>
//             <h1>Monitoramento Hidrológico</h1>
//             <p>Acompanhe os indicadores das estações.</p>
//           </div>

//           <Tag color="blue">● Dados simulados</Tag>
//         </header>

//         <Content className="conteudo">
//           <Card className="seletor-card" bordered={false}>
//             <div>
//               <span className="rotulo">ESTAÇÃO DE MONITORAMENTO</span>
//               <h3>Selecione uma estação</h3>
//             </div>

//             <Select
//               value={estacao}
//               onChange={setEstacao}
//               className="seletor"
//               options={Object.entries(estacoes).map(([chave, item]) => ({
//                 value: chave,
//                 label: item.nome,
//               }))}
//             />
//           </Card>

//           <div className="identificacao">
//             <div className="identificacao-icone">
//               <EnvironmentOutlined />
//             </div>
//             <div>
//               <span>ESTAÇÃO SELECIONADA</span>
//               <h2>{atual.rio}</h2>
//               <p>{atual.municipio}</p>
//             </div>
//           </div>

//           <div className="grade-cartoes">
//             <Card className="indicador" bordered={false}>
//               <div className="indicador-topo">
//                 <span>Nível do rio</span>
//                 <div className="icone-agua">≈</div>
//               </div>
//               <Statistic
//                 value={atual.nivel}
//                 precision={1}
//                 suffix="m"
//                 valueStyle={{ color: '#153B59', fontWeight: 700 }}
//               />
//               <Tag color="blue">Última medição</Tag>
//               <p className="horario">Horário: {atual.horario}</p>
//             </Card>

//             <Card className="indicador" bordered={false}>
//               <div className="indicador-topo">
//                 <span>Precipitação</span>
//                 <div className="icone-chuva">
//                   <CloudOutlined />
//                 </div>
//               </div>
//               <Statistic
//                 value={atual.chuva}
//                 precision={1}
//                 suffix="mm/h"
//                 valueStyle={{ color: '#153B59', fontWeight: 700 }}
//               />
//               <Tag color="cyan">Última medição</Tag>
//               <p className="horario">Horário: {atual.horario}</p>
//             </Card>
//           </div>

//           <div className="historico-cabecalho">
//             <div>
//               <h2>Histórico das medições</h2>
//               <p>Visualize os registros por período.</p>
//             </div>

//             <Radio.Group
//               value={periodo}
//               onChange={(e) => setPeriodo(e.target.value)}
//               optionType="button"
//               buttonStyle="solid"
//             >
//               <Radio.Button value={12}>12 h</Radio.Button>
//               <Radio.Button value={24}>24 h</Radio.Button>
//               <Radio.Button value={48}>48 h</Radio.Button>
//             </Radio.Group>
//           </div>

//           <div className="grade-graficos">
//             <Card
//               title="Nível do rio"
//               extra={<span className="unidade">Metros (m)</span>}
//               bordered={false}
//             >
//               <ResponsiveContainer width="100%" height={230}>
//                 <LineChart data={dadosNivel}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF4" />
//                   <XAxis dataKey="hora" axisLine={false} tickLine={false} />
//                   <YAxis axisLine={false} tickLine={false} />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="valor"
//                     name="Nível"
//                     stroke="#167DAB"
//                     strokeWidth={3}
//                     dot={{ r: 4 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </Card>

//             <Card
//               title="Precipitação"
//               extra={<span className="unidade">mm/h</span>}
//               bordered={false}
//             >
//               <ResponsiveContainer width="100%" height={230}>
//                 <AreaChart data={dadosChuva}>
//                   <defs>
//                     <linearGradient id="chuva" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#20A89A" stopOpacity={0.3} />
//                       <stop offset="100%" stopColor="#20A89A" stopOpacity={0.02} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF4" />
//                   <XAxis dataKey="hora" axisLine={false} tickLine={false} />
//                   <YAxis axisLine={false} tickLine={false} />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="valor"
//                     name="Precipitação"
//                     stroke="#20A89A"
//                     fill="url(#chuva)"
//                     strokeWidth={3}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </Card>
//           </div>

//           <footer className="rodape">
//             Projeto acadêmico · IFB × Cogmo Technology
//             <span>Dados fictícios para demonstração</span>
//           </footer>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutPrincipal from './componentes/LayoutPrincipal'; // ou do caminho onde está o LayoutPrincipal
import VisaoGeral from './paginas/VisaoGeral';
import HistoricoMedicoes from './paginas/HistoricoMedicoes';
import ConsultaMedicoes from './paginas/ConsultaMedicoes';
import './estilos.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* O LayoutPrincipal envolve as rotas da aplicação */}
        <Route path="/" element={<LayoutPrincipal />}>
          <Route index element={<VisaoGeral />} />
          <Route path="historico" element={<HistoricoMedicoes />} />
          <Route path="medicoes" element={<ConsultaMedicoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}