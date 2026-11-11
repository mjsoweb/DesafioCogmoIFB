function texto(valor, campo) {
  if (typeof valor !== 'string' || !valor.trim()) throw new TypeError(`${campo} é obrigatório.`);
  return valor;
}

export default class Estacao {
  #id; #name; #river; #municipality; #active; #updatedAt;

  constructor({ id, name, river, municipality, active, updated_at: updatedAt = null }) {
    this.#id = texto(id, 'id');
    this.#name = texto(name, 'name');
    this.#river = texto(river, 'river');
    this.#municipality = texto(municipality, 'municipality');
    if (active !== undefined && typeof active !== 'boolean') throw new TypeError('active deve ser booleano.');
    if (updatedAt !== null && (typeof updatedAt !== 'string' || Number.isNaN(Date.parse(updatedAt)))) {
      throw new TypeError('updated_at deve ser uma data válida.');
    }
    this.#active = active;
    this.#updatedAt = updatedAt;
  }

  get id() { return this.#id; }
  get name() { return this.#name; }
  get river() { return this.#river; }
  get municipality() { return this.#municipality; }
  get active() { return this.#active; }
  get updatedAt() { return this.#updatedAt; }
}
