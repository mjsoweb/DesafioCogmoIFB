export default class Observacao {
  #id; #stationId; #metric; #observedAt; #value; #unit; #source;

  constructor({ id = null, stationId, metric, observedAt = null, value = null, unit, source = null }) {
    if (id !== null && !(typeof id === 'string' || Number.isInteger(id))) throw new TypeError('id inválido.');
    if (typeof stationId !== 'string' || !stationId.trim()) throw new TypeError('stationId é obrigatório.');
    if (metric !== 'level' && metric !== 'rain') throw new TypeError('metric inválida.');
    if (unit !== (metric === 'level' ? 'm' : 'mm/h')) throw new TypeError('unit incompatível com metric.');
    if (observedAt !== null && (typeof observedAt !== 'string' || !/^\d{4}-\d\d-\d\dT.*Z$/.test(observedAt) || Number.isNaN(Date.parse(observedAt)))) {
      throw new TypeError('observedAt deve ser ISO 8601 em UTC.');
    }
    if (value !== null && (typeof value !== 'number' || !Number.isFinite(value))) throw new TypeError('value deve ser numérico ou null.');
    if (source !== null && (typeof source !== 'string' || !source.trim())) throw new TypeError('source inválida.');
    this.#id = id;
    this.#stationId = stationId;
    this.#metric = metric;
    this.#observedAt = observedAt;
    this.#value = value;
    this.#unit = unit;
    this.#source = source;
  }

  get id() { return this.#id; }
  get stationId() { return this.#stationId; }
  get metric() { return this.#metric; }
  get observedAt() { return this.#observedAt; }
  get value() { return this.#value; }
  get unit() { return this.#unit; }
  get source() { return this.#source; }
}
