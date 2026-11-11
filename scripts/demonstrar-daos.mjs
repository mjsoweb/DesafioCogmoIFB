import assert from 'node:assert/strict';
import { createServer } from 'vite';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const [{ default: EstacaoDAO }, { default: ObservacaoDAO }, { default: Estacao }, { default: Observacao }] =
    await Promise.all([
      vite.ssrLoadModule('/src/dao/EstacaoDAO.js'),
      vite.ssrLoadModule('/src/dao/ObservacaoDAO.js'),
      vite.ssrLoadModule('/src/modelos/Estacao.js'),
      vite.ssrLoadModule('/src/modelos/Observacao.js'),
    ]);
  const estacoesDAO = new EstacaoDAO();
  const observacoesDAO = new ObservacaoDAO();
  const estacoes = await estacoesDAO.listar();
  assert.equal(estacoes.length, 3);
  assert(estacoes.every(estacao => estacao instanceof Estacao));
  const nomes = estacoes.map(estacao => estacao.name);
  assert.deepEqual(nomes, nomes.toSorted((a, b) => a.localeCompare(b, 'pt-BR')));
  assert(estacoes.every(estacao => estacao.active === undefined));

  const resumo = await estacoesDAO.obterResumo(estacoes[0].id);
  assert(resumo.station instanceof Estacao);
  assert(resumo.latest.level instanceof Observacao);
  assert(resumo.latest.rain instanceof Observacao);
  assert.equal(resumo.latest.level.unit, 'm');
  assert.equal(resumo.latest.rain.unit, 'mm/h');

  const serie = await observacoesDAO.listarSerie(estacoes[0].id, 'level', 12);
  assert.equal(serie.points.length, 13);
  assert(serie.points.every(ponto => ponto instanceof Observacao && ponto.id === null && ponto.source === null));
  assert.equal(serie.points.at(-1).value, resumo.latest.level.value);
  assert.equal(serie.points.at(-1).observedAt, serie.to);
  assert.equal((await observacoesDAO.listarSerie(estacoes[0].id)).metric, 'level');
  assert.equal((await observacoesDAO.listarSerie(estacoes[0].id)).points.length, 25);
  assert.equal((await observacoesDAO.listarSerie(estacoes[0].id, 'level', 1)).points.length, 2);
  assert.equal((await observacoesDAO.listarSerie(estacoes[0].id, 'level', 72)).points.length, 73);

  const verificarErro = async (promise, code, status) => {
    await assert.rejects(promise, erro => erro.code === code && erro.status === status);
  };
  await verificarErro(estacoesDAO.obterResumo('DESCONHECIDA'), 'station_not_found', 404);
  await verificarErro(observacoesDAO.listarSerie(estacoes[0].id, 'invalid', 24), 'invalid_metric', 400);
  await verificarErro(observacoesDAO.listarSerie(estacoes[0].id, 'level', 0), 'invalid_hours', 400);
  await verificarErro(observacoesDAO.listarSerie(estacoes[0].id, 'level', 73), 'invalid_hours', 400);
  await verificarErro(observacoesDAO.listarSerie(estacoes[0].id, 'level', 1.5), 'invalid_hours', 400);
  assert.throws(() => new Observacao({ stationId: estacoes[0].id, metric: 'rain', unit: 'm' }), /unit incompatível/);

  console.log('Estações:', estacoes.map(estacao => estacao.name).join(', '));
  console.log('Resumo:', resumo.station.name, resumo.latest.level.value, 'm;', resumo.latest.rain.value, 'mm/h');
  console.log('Série:', serie.points.length, 'pontos entre', serie.from, 'e', serie.to);
  console.log('Instâncias, padrões e erros do contrato: OK');
} finally {
  await vite.close();
}
