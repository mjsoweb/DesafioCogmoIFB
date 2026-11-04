// DADOS ESTÁTICOS E FICTÍCIOS — Sprint 2.
// Nada neste arquivo representa observações hidrológicas reais.
// Datas e horários são apenas ilustrativos.

export const estacoes = [
  { id: 'rio-azul', nome: 'Estação Rio Azul', rio: 'Rio Azul', municipio: 'Brasília' },
  { id: 'vale-verde', nome: 'Estação Vale Verde', rio: 'Rio Verde', municipio: 'Formosa' },
  { id: 'santa-luzia', nome: 'Estação Santa Luzia', rio: 'Rio das Pedras', municipio: 'Planaltina' },
];

// Última medição ilustrativa exibida na Visão Geral.
export const medicaoExemplo = {
  nivel: 2.45, // metros (m)
  chuva: 4.8, // milímetros por hora (mm/h)
  horario: '29/10/2026 às 09:00',
};

// Registros ilustrativos da tela Consulta de Medições.
export const registrosExemplo = [
  { key: '1', data: '29/10/2026 09:00', estacao: 'Estação Rio Azul', nivel: 2.45, chuva: 4.8, situacao: 'Normal' },
  { key: '2', data: '29/10/2026 08:00', estacao: 'Estação Rio Azul', nivel: 2.38, chuva: 3.9, situacao: 'Normal' },
  { key: '3', data: '29/10/2026 09:00', estacao: 'Estação Vale Verde', nivel: 1.92, chuva: 1.2, situacao: 'Normal' },
  { key: '4', data: '29/10/2026 08:00', estacao: 'Estação Vale Verde', nivel: 1.89, chuva: 0.8, situacao: 'Normal' },
  { key: '5', data: '29/10/2026 09:00', estacao: 'Estação Santa Luzia', nivel: 3.05, chuva: 6.4, situacao: 'Atenção' },
  { key: '6', data: '29/10/2026 08:00', estacao: 'Estação Santa Luzia', nivel: 2.97, chuva: 5.7, situacao: 'Atenção' },
];
