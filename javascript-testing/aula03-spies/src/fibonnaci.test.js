const Fibonnaci = require("./fibonnaci");
const sinon = require("sinon");
const assert = require("assert");

/**
 * Fibonnaci: o próximo valor corresponde à soma dos dois anteriores.
 * Dado 3: 0, 1, 1
 * Dado 5: 0, 1, 1, 2, 3
 */
(async () => {
  {
    const fibonnaci = new Fibonnaci();
    const spy = sinon.spy(fibonnaci, fibonnaci.execute.name);

    /**
     * Generators retornam iterators, (.next)
     * Existem 3 formas de ler os dados: Usando as funções .next, for await e rest/spread.
     */

    for await (const i of fibonnaci.execute(3)) {
    }

    // Nosso algoritmo sempre vai começar no zero.
    const expectedCallCount = 4;
    assert.deepStrictEqual(spy.callCount, expectedCallCount);
  }

  {
    /**
     * Checando os parâmetros fornecidos e o retorno em uma iteração aleatória.
     */
    const fibonnaci = new Fibonnaci();
    const spy = sinon.spy(fibonnaci, fibonnaci.execute.name);

    /**
     * Array de resultados retornado pelo yield.
     */
    const [...results] = fibonnaci.execute(5);

    /**
     * [0] input = 5, current = 0, next = 1;
     * [1] input = 4, current = 1, next = 1;
     * [2] input = 3, current = 1, next = 2;
     * [3] input = 2, current = 2, next = 3;
     * [4] input = 1, current = 3, next = 5;
     * [5] input = 0 -> PARA.
     */

    const { args } = spy.getCall(2);
    /**
     * Estamos checando o valor de current chamado no yield na função
     */
    const expectedResult = [0, 1, 1, 2, 3];

    /**
     * O Object.values() vai retornar uma array na ordem com os valores, estamos
     * utilizando um objeto e não uma array diretamente para melhorar a legibilidade.
     */
    const expectedParams = Object.values({
      input: 3,
      current: 1,
      next: 2,
    });

    assert.deepStrictEqual(args, expectedParams);
    assert.deepStrictEqual(results, expectedResult);
  }

  {
    /**
     * Checando os parâmetros fornecidos em cada iteração da função e verificando
     * se os parâmetros fornecidos e o retorno estão corretos.
     */
    const fibonnaci = new Fibonnaci();
    const spy = sinon.spy(fibonnaci, fibonnaci.execute.name);

    const expectedForEachIteration = [
      { yield: 0, args: { input: 5 } },
      { yield: 1, args: { input: 4, current: 1, next: 1 } },
      { yield: 1, args: { input: 3, current: 1, next: 2 } },
      { yield: 2, args: { input: 2, current: 2, next: 3 } },
      { yield: 3, args: { input: 1, current: 3, next: 5 } },
    ];

    let iterationIndex = 0;

    for await (const yieldValue of fibonnaci.execute(5)) {
      const { args } = spy.getCall(iterationIndex);

      const expected = expectedForEachIteration[iterationIndex];
      assert.deepStrictEqual(args, Object.values(expected.args));
      assert.deepStrictEqual(yieldValue, expected.yield);

      iterationIndex++;
    }
  }
})();
