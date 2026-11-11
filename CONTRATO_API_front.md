# Contrato HTTP compartilhado

Use este contrato para o mock e para a integração com a trilha backend. O mock é sintético e roda no navegador; não requer serviço externo.

- Prefixo: /api
- JSON UTF-8; horários ISO 8601 em UTC com Z.
- Métricas: level (metros, m) ou rain (milímetros por hora, mm/h).
- Janela inteira de 1 a 72 horas.
- As séries podem conter lacunas; não invente pontos.
- data_mode deve aparecer como simulation.

Endpoints, exemplos completos e erros: consulte [contrato detalhado da trilha backend](../../back/docs/CONTRATO_API.md).

## Endpoints consumidos

- GET /api/stations
- GET /api/stations/{station_id}/summary
- GET /api/stations/{station_id}/series?metric=level&hours=24
- GET /api/stations/{station_id}/series?metric=rain&hours=24
