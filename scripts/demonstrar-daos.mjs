import assert from 'node:assert/strict';
import { createServer } from 'vite';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const [{ default: EstacaoDAO }, { default: ObservacaoDAO }, { default: Estacao }, { default: Observacao }] =
    await Promise.all([
      vite.ssrLoadModule('/src/objetos/dao/EstacaoDAOBackEnd.mjs'),
      vite.ssrLoadModule('/src/objetos/dao/ObservacaoDAOBackEnd.mjs'),
      vite.ssrLoadModule('/src/objetos/estacoes/Estacao.mjs'),
      vite.ssrLoadModule('/src/objetos/observacoes/Observacao.mjs'),
    ]);

  const estacaoDAO = new EstacaoDAO();
  const observacaoDAO = new ObservacaoDAO();
  const estacoes = await estacaoDAO.listar();
  assert.equal(estacoes.length, 3);
  assert(estacoes.every(estacao => estacao instanceof Estacao && estacao.active === undefined));
  assert.deepEqual(estacoes.map(estacao => estacao.name),
    estacoes.map(estacao => estacao.name).toSorted((a, b) => a.localeCompare(b, 'pt-BR')));

  for (const estacao of estacoes) {
    const resumo = await estacaoDAO.obterResumo(estacao.id);
    assert(resumo.station instanceof Estacao);
    assert(resumo.latest.level instanceof Observacao);
    assert(resumo.latest.rain instanceof Observacao);
    assert.equal(resumo.latest.level.unit, 'm');
    assert.equal(resumo.latest.rain.unit, 'mm/h');

    for (const metric of ['level', 'rain']) {
      for (const hours of [12, 24, 48]) {
        const serie = await observacaoDAO.listarSerie(estacao.id, metric, hours);
        assert.equal(serie.stationId, estacao.id);
        assert.equal(serie.metric, metric);
        assert.equal(serie.unit, metric === 'level' ? 'm' : 'mm/h');
        assert(serie.points.every(ponto => ponto instanceof Observacao && ponto.id === null && ponto.source === null));
        assert(serie.points.every(ponto => ponto.observedAt >= serie.from && ponto.observedAt <= serie.to));
        assert(serie.points.every((ponto, i) => i === 0 || ponto.observedAt >= serie.points[i - 1].observedAt));
        console.log(`${estacao.id} ${metric} ${hours}h: ${serie.points.length} pontos`);
      }
    }
  }

  await assert.rejects(estacaoDAO.obterResumo('DESCONHECIDA'), erro => erro.code === 'station_not_found' && erro.status === 404);
  await assert.rejects(observacaoDAO.listarSerie('EST-01', 'invalid', 24), erro => erro.code === 'invalid_metric' && erro.status === 400);
  await assert.rejects(observacaoDAO.listarSerie('EST-01', 'level', 0), erro => erro.code === 'invalid_hours' && erro.status === 400);
  await assert.rejects(observacaoDAO.listarSerie('EST-01', 'level', 36), erro => erro.code === 'invalid_hours' && erro.status === 400);
  console.log('Integração HTTP, modelos, filtros e erros: OK');
} finally {
  await vite.close();
}
