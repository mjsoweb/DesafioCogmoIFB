import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LayoutPrincipal from './componentes/LayoutPrincipal';
import VisaoGeral from './paginas/VisaoGeral';
import HistoricoMedicoes from './paginas/HistoricoMedicoes';
import ConsultaMedicoes from './paginas/ConsultaMedicoes';
import './estilos.css';
import './tema-modernizado.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutPrincipal />}>
          <Route index element={<VisaoGeral />} />
          <Route path="historico" element={<HistoricoMedicoes />} />
          <Route path="medicoes" element={<ConsultaMedicoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}