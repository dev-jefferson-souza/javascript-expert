const { describe, it, before, beforeEach, afterEach } = require("mocha");
const CarService = require("../../src/service/carService");

const { join } = require("path");
const { expect } = require("chai");

const sinon = require("sinon");

const carsDatabase = join(__dirname, "./../../database", "cars.json");

const mocks = {
  validCarCategory: require("../mocks/valid-carCategory.json"),
  validCar: require("../mocks/valid-car.json"),
  validCustomer: require("../mocks/valid-customer.json"),
};

describe("CarService Suite Tests", () => {
  let carService = {};
  let sandbox = {};

  before(() => {
    carService = new CarService({ cars: carsDatabase });
  });

  /**
   * Garantindo que nossa sandbox sempre estará pura a cada teste.
   */
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should retrieve a random position from an array.", () => {
    const data = [0, 1, 2, 3, 4];
    const result = carService.getRandomPositionFromArray(data);

    expect(result).to.be.lte(data.length).and.be.gte(0);
  });

  it("should choose the ir id from carIds in carCategory", () => {
    const carCategory = mocks.validCarCategory;
    const carIdIndex = 0;

    /**
     * Mockando o resultado do método getRandomPositionFromArray() pois como o
     * retorno dessa função é aleatória, só conseguimos checar um valor esperado
     * dessa forma.
     *
     * Esse teste não é um teste viciado, o objetivo dele é testar se o método
     * chooseRandomCar() esta funcionando corretamente, não testar novamente o
     * método getRandomPositionFromArray(), como o teste da função que estamos
     * utilizando já existe, podemos mockar e garantir um retorno esperado.
     */
    sandbox
      .stub(carService, carService.getRandomPositionFromArray.name)
      .returns(carIdIndex);

    const result = carService.chooseRandomCar(carCategory);
    const expected = carCategory.carIds[carIdIndex];

    expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok;
    expect(result).to.be.equal(expected);
  });

  it("given a carCategory it should return an available car", async () => {
    const car = mocks.validCar;

    /**
     * Criando uma instância imutavel de carCategory e garantindo que nosso car
     * esteja na lista carIds.
     */
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.carIds = [car.id];

    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car);

    sandbox.spy(carService, carService.chooseRandomCar.name);

    const result = await carService.getAvailableCar(carCategory);
    const expected = car;

    expect(carService.chooseRandomCar.calledOnce).to.be.ok;
    expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok;
    expect(result).to.be.deep.equal(expected);
  });
});
