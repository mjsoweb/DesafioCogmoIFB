
import { Navigate, Route, Routes } from 'react-router-dom';
import LayoutPrincipal from './componentes/LayoutPrincipal';
import VisaoGeral from './paginas/VisaoGeral';
import HistoricoMedicoes from './paginas/HistoricoMedicoes';
import ConsultaMedicoes from './paginas/ConsultaMedicoes';

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutPrincipal />}>
        <Route path="/" element={<VisaoGeral />} />
        <Route path="/historico" element={<HistoricoMedicoes />} />
        <Route path="/medicoes" element={<ConsultaMedicoes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
