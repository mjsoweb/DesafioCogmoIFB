# Dashboard de Monitoramento Hidrológico

Projeto do curso de Front-end do IFB para o desafio da Cogmo Technology.

## Telas

- **Visão Geral:** seleção de estação, últimas leituras e indicadores.
- **Histórico de Medições:** filtros de estação e período, gráficos e amostras detalhadas.
- **Consulta de Medições:** estações cadastradas e exportação CSV.

A interface usa React, Ant Design e Recharts. Os dados atuais vêm do mock local em `src/api/mockApi.ts` por meio de `src/api/api.ts`.

## Executar localmente

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite no terminal. Para validar a compilação, execute `npm run build`; para verificar o código, `npm run lint`.

## Organização

- `src/estilos.css`: estilos básicos da aplicação.
- `src/tema-modernizado.css`: visual modernizado aprovado, consolidado em uma folha.
- `src/componentes/` e `src/paginas/`: layout e três telas.
- `src/api/`, `src/modelos/` e `src/dao/`: mock, modelos e acesso a dados.
- `CONTRATO_API_back.md`, `CONTRATO_API_front.md` e `MODELO_DE_DADOS.md`: contratos e modelo de dados.
- `docs/arquivo/modernizacao-historico.zip`: cópias das etapas de modernização anteriores.

## Equipe

Maria Júlia, Thalita e Samantha.

## Sprint 5 — modelos e DAOs

A camada de domínio foi acrescentada sem alterar as três telas, a navegação ou os gráficos. As telas continuam consumindo `src/api/api.ts`; a migração completa para os DAOs pertence à Sprint 6.

| Pasta/arquivo | Responsabilidade |
| --- | --- |
| `src/modelos/Estacao.js` | Identidade da estação com atributos privados, getters e validação. |
| `src/modelos/Observacao.js` | Leitura de nível ou chuva, com validação de métrica, unidade, valor e timestamp UTC. |
| `src/dao/EstacaoDAO.js` | `listar()` e `obterResumo(stationId)` assíncronos. |
| `src/dao/ObservacaoDAO.js` | `listarSerie(stationId, metric = 'level', hours = 24)` assíncrono. |
| `src/api/api.ts` e `src/api/mockApi.ts` | Contrato de consultas e fonte local com três estações fictícias. |

O mock de `src/api/mockApi.ts` é a fonte canônica para os DAOs. Os arquivos antigos em `src/dados/` e `src/dadosEstacoes.json` foram mantidos como material anterior, mas não entram nessas consultas. A API de backend não é exigida nesta sprint.

### Conversão do contrato

- `stations[]` vira uma lista de instâncias `Estacao`, ordenada por `name`. O JSON de listagem informa `updated_at`, exposto pelo getter `updatedAt`. O endpoint não informa `active`; nesse caso o getter permanece `undefined`.
- `summary.station` vira `Estacao`. Os quatro campos de `summary.latest` viram duas instâncias `Observacao`: `level` em `m` e `rain` em `mm/h`, cada uma com seu próprio valor e horário. Ambos podem ser `null`. `data_mode` e `message` continuam no objeto de resultado do DAO.
- `series.points[]` vira uma lista de `Observacao`. O contexto da série fornece `stationId`, `metric` e `unit`; cada ponto fornece somente `timestamp` e `value`. Por isso os getters `id` e `source` permanecem `null`: o endpoint não os envia. `from`, `to`, `interval_minutes` e `data_mode` permanecem no resultado da série, sem serem calculados novamente a partir dos pontos.
- Um registro persistido da tabela `observations`, descrita em `MODELO_DE_DADOS.md`, pode fornecer `id` e `source` para uma `Observacao`; esse registro completo não é retornado pelo endpoint de série.

Os métodos de consulta rejeitam estação desconhecida com `code: station_not_found` e `status: 404`; métrica inválida e horas fora do intervalo inteiro de 1 a 72 geram `invalid_metric` ou `invalid_hours` com `status: 400`. Esses códigos são propriedades do erro no mock, equivalentes ao objeto HTTP `{ error: { code, message } }` descrito em `CONTRATO_API_back.md`. Os métodos não fazem requisições HTTP nesta etapa.

### Exemplo de uso

```js
import EstacaoDAO from './src/dao/EstacaoDAO.js';
import ObservacaoDAO from './src/dao/ObservacaoDAO.js';
import Estacao from './src/modelos/Estacao.js';
import Observacao from './src/modelos/Observacao.js';

const estacoesDAO = new EstacaoDAO();
const observacoesDAO = new ObservacaoDAO();
const estacoes = await estacoesDAO.listar();
console.log(estacoes[0] instanceof Estacao); // true

const resumo = await estacoesDAO.obterResumo(estacoes[0].id);
console.log(resumo.latest.level instanceof Observacao); // true

const serie = await observacoesDAO.listarSerie(estacoes[0].id, 'rain', 12);
console.log(serie.metric, serie.unit, serie.points.length); // rain mm/h 13

try {
  await estacoesDAO.obterResumo('INEXISTENTE');
} catch (erro) {
  console.log(erro.code, erro.status); // station_not_found 404
}
```

O projeto usa Vite para carregar os módulos TypeScript do mock. Para executar uma demonstração completa no terminal, sem servidor de backend:

```bash
npm run demo:dao
```

Esse comando verifica instâncias, ordenação, valores e horários, padrões de consulta e erros do contrato. Os cenários `VITE_DEMO_CENARIO=empty`, `slow` e `error` continuam disponíveis no mock; configure a variável antes de iniciar a aplicação ou a demonstração.
