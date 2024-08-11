export default class Person {
  constructor({id, vehicles, kmTraveled, from, to,}){
    this.id = id;
    this.vehicles = vehicles;
    this.kmTraveled = kmTraveled;
    this.from = from;
    this.to = to;
  }

  formatted(language = 'en-US'){
    const mapDate = (date) => {
      const [year, month, day ] = date.split('-').map(Number);

      // Datas em JS começam do zero!
      return new Date(year, (month - 1), day)
    }

    return {
      id: Number(this.id),
      /**
       * Formatando as conjunções para o idioma recebido, exemplo:
       * 
       * en-US: Motocicleta, Carro, and Caminhão
       * pt-BR  Motocicleta, Carro, e Caminhão 
       * 
       * Também funciona no navegador.
       */
      vehicles: new Intl
          .ListFormat(language, {style: "long", type: "conjunction"}) 
          .format(this.vehicles),
      kmTraveled: new Intl
          .NumberFormat(language, { style: "unit", unit: "kilometer"})
          .format(this.kmTraveled),
      from: new Intl
          .DateTimeFormat(language, {month: "long", day: "2-digit", year: "numeric"})
          .format(mapDate(this.from)),
      to: new Intl
          .DateTimeFormat(language, {month: "long", day: "2-digit", year: "numeric"})
          .format(mapDate(this.to)),
    }
  }

  static generateInstanceFromString(text){
    const EMPTY_SPACE = ' ';
    const TOTAL_PARAMS = 5;

    const parametersReceived = text.split(EMPTY_SPACE)

    if (parametersReceived.length < TOTAL_PARAMS) {
      throw new Error(`Insufficient parameters provided. Expected ${TOTAL_PARAMS}, but received ${parametersReceived.length}.`);
    }

    if (parametersReceived.length > TOTAL_PARAMS) {
      throw new Error(`Too many parameters provided. Expected ${TOTAL_PARAMS}, but received ${parametersReceived.length}.`);
    }

    const [id, vehicles, kmTraveled, from, to] = parametersReceived;
    const person = new Person({
      id,
      kmTraveled,
      from,
      to,
      vehicles: vehicles.split(',')
    })
    
    return person;
  }
}
