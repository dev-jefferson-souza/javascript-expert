const sinon = require("sinon");
const {
  deepStrictEqual,
  notDeepStrictEqual,
  rejects,
  doesNotReject,
} = require("assert");

const { error, information } = require("./constants");
const Service = require("./service");

const mock = {
  callOfDutyWarzone: {
    url: "https://www.freetogame.com/api/game?id=452",
    id: 452,
    data: require("./mocks/call-of-duty-warzone.json"),
  },

  gothanCityImpostors: {
    url: "https://www.freetogame.com/api/game?id=453",
    id: 453,
    data: require("./mocks/gothan-city-impostors.json"),
  },
};

(async () => {

  /*
   * Dessa forma não estamos utilizando stubs, portanto ficamos dependentes da
   * API externa e caso ela tenha algum problema, todos os testes que esperam
   * um retorno dela irão falhar.
   *
   * const service = new Service();
   * const withoutStub = await service.getGameMinimumRequirement(452);
   * console.log(withoutStub);
   */
  const service = new Service();
  const stub = sinon.stub(service, service.makeRequest.name);

  stub
    .withArgs(mock.callOfDutyWarzone.url)
    .resolves(mock.callOfDutyWarzone.data);

  stub
    .withArgs(mock.gothanCityImpostors.url)
    .resolves(mock.gothanCityImpostors.data);

  {
    /**
     * Checando se o game retornado é o correto.
     */
    const response = await service.makeRequest(mock.callOfDutyWarzone.url);
    deepStrictEqual(response, mock.callOfDutyWarzone.data);
  }

  {
    /**
     * Checando se o game retornado é diferente de outro game existente na base.
     */
    const response = await service.makeRequest(mock.gothanCityImpostors.url);
    notDeepStrictEqual(response, mock.callOfDutyWarzone.data);
  }

  {
    /**
     * Checando se a recomendações mínimas são as referentes ao game fornecido.
     */
    const { id } = mock.callOfDutyWarzone;
    const response = await service.getGameMinimumRequirement(id);
    const expect = {
      id: 452,
      title: "Call Of Duty: Warzone",
      os: "Windows 7 64-Bit (SP1) or Windows 10 64-Bit",
      processor: "Intel Core i3-4340 or AMD FX-6300",
      memory: "8GB RAM",
      graphics: "NVIDIA GeForce GTX 670 / GeForce GTX 1650 or Radeon HD 7950",
      storage: "175GB HD space",
    };

    deepStrictEqual(response, expect);
  }

  {
    /**
     * Checando se as recomendações mínimas são as mesmas do game fornecido e,
     * se a mensagem de "No information provided" está sendo retornada quando não
     * temos informação sobre aquele requisito.
     */
    const { id } = mock.gothanCityImpostors;
    const response = await service.getGameMinimumRequirement(id);
    const expect = {
      id: 453,
      title: "Gotham City Impostors",
      os: information.NO_INFORMATION_PROVIDED,
      processor: information.NO_INFORMATION_PROVIDED,
      memory: information.NO_INFORMATION_PROVIDED,
      graphics: information.NO_INFORMATION_PROVIDED,
      storage: information.NO_INFORMATION_PROVIDED,
    };

    deepStrictEqual(response, expect);
  }

  {
    /**
     * Checando o erro lançado caso nenhum id seja fornecido.
     */
    const response = service.getGameMinimumRequirement();
    const rejection = new Error(error.ID_NOT_PROVIDED);

    await rejects(response, rejection);
  }

  {
    /**
     * Checando o erro lançado caso o id não seja um número.
     */
    const response = service.getGameMinimumRequirement("string");
    const rejection = new Error(error.ID_IS_NOT_NUMBER);

    await rejects(response, rejection);
  }

  {
    /**
     * Checando se não será lançado nenhum erro ao passar o id com um valor
     * númerico do tipo string.
     */
    const { id } = mock.callOfDutyWarzone;
    const response = service.getGameMinimumRequirement(id.toString());

    await doesNotReject(response);
  }
})();
