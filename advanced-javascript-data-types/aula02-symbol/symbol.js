const assert = require("assert");

// --- keys
const uniqueKey = Symbol("userName");
const user = {};

user["userName"] = "value for normal Objects";
user[uniqueKey] = "value for normal symbol";

console.log("getting normal Objects", user.userName);

/**
 * O Symbol é sempre único em endereço de memória, então utilizar um Symbol(),
 * passando o mesmo valor vai resultar em outro objeto, e portanto ao acessar o
 * atributo dinâmicamente no objeto, iremos obter undefined, pois ele tentará
 * acessar um endereço de memória diferente.
 */
// console.log("getting symbol Objects", user[Symbol("userName")]); // output: undefined
// console.log("getting symbol Objects", user[uniqueKey]); // output: acessa o valor corretamente

assert.deepStrictEqual(user.userName, "value for normal Objects");
assert.deepStrictEqual(user[Symbol("userName")], undefined);
assert.deepStrictEqual(user[uniqueKey], "value for normal symbol");

/**
 * É mais difícil acessar diretamente o dado, no entanto ele não é privado e ainda
 * está lá, qualquer pessoa consegue visualizar o valor ao debugar o código e
 * portanto não é a melhor forma de guardar dados sensíveis.
 *
 * Sendo assim é mais difícil acessa para manipular o dado, mas ainda é possível
 * visualizar facilmente.
 */
assert.deepStrictEqual(Object.getOwnPropertySymbols(user)[0], uniqueKey);

/**
 * byPass - má prática (não tem no codebase do node)
 * Retorna a refêrencia do symbol que bater com a chave recebida por parâmetro.
 */
user[Symbol.for("password")] = 123;
assert.deepStrictEqual(user[Symbol.for("password")], 123);

// Well Known Symbols
const obj = {
  [Symbol.iterator]: () => ({
    items: ["c", "b", "a"],
    next() {
      return {
        done: this.items.length === 0,
        // Remove o último item e retorna
        value: this.items.pop(),
      };
    },
  }),
};

// for (const item of obj) {
//   console.log("item", item);
// }

assert.deepStrictEqual([...obj], ["a", "b", "c"]);

/**
 * Criando um metadado privado, somente o MyDate tem acesso a ele, e quem quiser
 * acessar ele, deverá acessar por alguma propriedade da nossa classe.
 */
const kItems = Symbol("kItems");
class MyDate {
  constructor(...args) {
    this[kItems] = args.map((arg) => new Date(...arg));
  }

  [Symbol.toPrimitive](coercionTtpe) {
    if (coercionTtpe !== "string") throw new TypeError();

    const items = this[kItems].map((item) =>
      Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(item)
    );

    return new Intl.ListFormat("pt-BR", {
      style: "long",
      type: "conjunction",
    }).format(items);
  }

  /**
   * O * no início é importante para validar que ele vai ser o iterador e podermos
   * utilizar o yield.
   */
  *[Symbol.iterator]() {
    for (const item of this[kItems]) {
      yield item;
    }
  }

  /**
   * Criando um iterador assíncrono para nossa classe
   */
  async *[Symbol.asyncIterator]() {
    const timeout = (ms) => new Promise((r) => setTimeout(r, ms));

    for (const item of this[kItems]) {
      await timeout(100);
      yield item.toISOString();
    }
  }

  /**
   * Subsituindo o texto de [object, Object], por [object, What???]
   */
  get [Symbol.toStringTag]() {
    return "What???";
  }
}

const myDate = new MyDate([2022, 11, 21], [2023, 10, 11]);
const expectedDates = [new Date(2022, 11, 21), new Date(2023, 10, 11)];

assert.deepStrictEqual(
  Object.prototype.toString.call(myDate),
  "[object What???]"
);
assert.throws(() => myDate + 1);

// Coerção expliícita para chamar o toPrimitive
assert.deepStrictEqual(
  String(myDate),
  "21 de dezembro de 2022 e 11 de novembro de 2023"
);

// implementar o iterator!
assert.deepStrictEqual([...myDate], expectedDates);

// (async () => {
//   for await (const item of myDate) {
//     console.log("asyncIterator: ", item);
//   }
// })();

(async () => {
  const dates = await Promise.all([...myDate]);
  assert.deepStrictEqual(dates, expectedDates);
})();
