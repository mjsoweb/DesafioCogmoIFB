# Dashboard de Monitoramento Hidrológico

Projeto do curso de Front-end do IFB para o desafio da Cogmo Technology.

Acesse o projeto:https://desafio-cogmo-ifb-1.vercel.app/

## Telas

- **Visão Geral:** seleção de estação, últimas leituras e indicadores.
- **Histórico de Medições:** filtros de estação e período, gráficos e amostras detalhadas.
- **Consulta de Medições:** estações cadastradas e exportação CSV.

A interface usa React, Ant Design e Recharts. Na Sprint 6, as telas consomem os Webhooks HTTP da Cogmo por meio dos DAOs; `src/api/mockApi.ts` permanece apenas como material da Sprint 5.

## Executar localmente

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Abra o endereço mostrado pelo Vite no terminal. As URLs públicas dos Webhooks estão em `.env.example`; confira-as em `.env.local` e reinicie o Vite após qualquer alteração. Para validar a compilação, execute `npm run build`; para verificar o código, `npm run lint`. Para testar os DAOs contra a API publicada, execute `npm run demo:dao`.

## Organização

- `src/estilos.css`: estilos básicos da aplicação.
- `src/tema-modernizado.css`: visual modernizado aprovado, consolidado em uma folha.
- `src/componentes/` e `src/paginas/`: layout e três telas.
- `src/objetos/estacoes/`, `src/objetos/observacoes/` e `src/objetos/dao/`: modelos encapsulados e DAOs de backend.
- `src/api/mockApi.ts`: mock histórico da Sprint 5, sem uso nas telas atuais.
- `CONTRATO_API_back.md`, `CONTRATO_API_front.md` e `MODELO_DE_DADOS.md`: contratos e modelo de dados.
- `docs/arquivo/modernizacao-historico.zip`: cópias das etapas de modernização anteriores.

## Equipe

Maria Júlia, Thalita e Samantha.

## Sprint 5 — histórico dos modelos e DAOs

Na Sprint 5, a camada de domínio foi acrescentada sem alterar as três telas, a navegação ou os gráficos. Naquele momento, as telas ainda consumiam `src/api/api.ts`; a migração para os DAOs foi feita na Sprint 6.

| Pasta/arquivo | Responsabilidade |
| --- | --- |
| `src/objetos/estacoes/Estacao.mjs` | Identidade da estação com atributos privados, getters e validação. |
| `src/objetos/observacoes/Observacao.mjs` | Leitura de nível ou chuva, com validação de métrica, unidade, valor e timestamp UTC. |
| `src/objetos/dao/EstacaoDAOBackEnd.mjs` | `listar()` e `obterResumo(stationId)` assíncronos, com `fetch`. |
| `src/objetos/dao/ObservacaoDAOBackEnd.mjs` | `listarSerie(stationId, metric = 'level', hours = 24)` assíncrono, com `fetch`. |
| `src/api/mockApi.ts` | Fonte local histórica com três estações fictícias, fora do fluxo atual. |

Na Sprint 5, o mock de `src/api/mockApi.ts` era a fonte canônica para os DAOs. Os arquivos antigos em `src/dados/` e `src/dadosEstacoes.json` foram mantidos como material anterior. Na Sprint 6, os DAOs consultam os Webhooks HTTP.

### Conversão do contrato

- `stations[]` vira uma lista de instâncias `Estacao`, ordenada por `name`. O JSON de listagem informa `updated_at`, exposto pelo getter `updatedAt`. O endpoint não informa `active`; nesse caso o getter permanece `undefined`.
- `summary.station` vira `Estacao`. Os quatro campos de `summary.latest` viram duas instâncias `Observacao`: `level` em `m` e `rain` em `mm/h`, cada uma com seu próprio valor e horário. Ambos podem ser `null`. `data_mode` e `message` continuam no objeto de resultado do DAO.
- `series.points[]` vira uma lista de `Observacao`. O contexto da série fornece `stationId`, `metric` e `unit`; cada ponto fornece somente `timestamp` e `value`. Por isso os getters `id` e `source` permanecem `null`: o endpoint não os envia. `from`, `to`, `interval_minutes` e `data_mode` permanecem no resultado da série, sem serem calculados novamente a partir dos pontos.
- Um registro persistido da tabela `observations`, descrita em `MODELO_DE_DADOS.md`, pode fornecer `id` e `source` para uma `Observacao`; esse registro completo não é retornado pelo endpoint de série.

Os métodos de consulta rejeitam estação desconhecida com `code: station_not_found` e `status: 404`; métrica inválida e janelas diferentes de 12, 24 ou 48 horas geram `invalid_metric` ou `invalid_hours` com `status: 400`. Na Sprint 5, esses códigos eram propriedades do erro no mock. Na Sprint 6, os erros HTTP são convertidos para o mesmo formato no cliente.

### Exemplo de uso

```js
import EstacaoDAO from './src/objetos/dao/EstacaoDAOBackEnd.mjs';
import ObservacaoDAO from './src/objetos/dao/ObservacaoDAOBackEnd.mjs';
import Estacao from './src/objetos/estacoes/Estacao.mjs';
import Observacao from './src/objetos/observacoes/Observacao.mjs';

const estacoesDAO = new EstacaoDAO();
const observacoesDAO = new ObservacaoDAO();
const estacoes = await estacoesDAO.listar();
console.log(estacoes[0] instanceof Estacao); // true

const resumo = await estacoesDAO.obterResumo(estacoes[0].id);
console.log(resumo.latest.level instanceof Observacao); // true

const serie = await observacoesDAO.listarSerie(estacoes[0].id, 'rain', 12);
console.log(serie.metric, serie.unit, serie.points.length); // quantidade dinâmica

try {
  await estacoesDAO.obterResumo('INEXISTENTE');
} catch (erro) {
  console.log(erro.code, erro.status); // station_not_found 404
}
```

O projeto usa Vite para carregar os módulos TypeScript. Para executar uma demonstração dos DAOs contra a API publicada:

```bash
npm run demo:dao
```

Na Sprint 6, esse comando consulta os Webhooks publicados e verifica as três estações, as duas métricas, janelas de 12, 24 e 48 horas, modelos, ordenação e erros. Requer conexão com a API. Os cenários `VITE_DEMO_CENARIO=empty`, `slow` e `error` pertencem somente ao mock antigo e não afetam a aplicação integrada.

## Sprint 6 — integração HTTP

As três telas usam `EstacaoDAOBackEnd` e `ObservacaoDAOBackEnd` em `src/objetos/dao/`, seguindo a organização do [exemplo de DAOs de backend no StackBlitz](https://stackblitz.com/edit/vitejs-vite-hpf5jncu?file=src%2Fobjetos%2Fdao%2FPFDAOBackEnd.mjs). Cada classe faz as requisições com `fetch` e trata erros HTTP, de rede e de JSON. A API Cogmo oferece somente GET; os dados são simulados e não devem ser usados para decisões de segurança.

| Endpoint | URL de produção |
| --- | --- |
| Health | `https://n8n.incluc0de.com.br/webhook/cogmo/api/health` |
| Stations | `https://n8n.incluc0de.com.br/webhook/cogmo/api/stations` |
| Summary (exemplo EST-01) | `https://n8n.incluc0de.com.br/webhook/ca01b8a8-6b9c-42ab-b126-3bc5bc27bcb3/cogmo/api/stations/EST-01/summary` |
| Series (exemplo chuva, 24 h) | `https://n8n.incluc0de.com.br/webhook/2ee3441c-7147-401d-a504-73eedb917573/cogmo/api/stations/EST-01/series?metric=rain&hours=24` |

`VITE_COGMO_SUMMARY_BASE_URL` e `VITE_COGMO_SERIES_BASE_URL` terminam em `/stations`; os DAOs acrescentam a estação e a rota. As variáveis `VITE_` são públicas no navegador e não devem conter segredos. O detalhamento da implementação e das verificações está em [EXPLICACAO_SPRINT_6.md](EXPLICACAO_SPRINT_6.md).
