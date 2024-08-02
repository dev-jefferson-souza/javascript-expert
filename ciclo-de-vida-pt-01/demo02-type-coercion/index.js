9999999999999999; // 16 casas decimais / output: 10000000000000000

true + 2; // output: 3

"21" + true; // output: 21true

"21" - true; // output: 20

"21" - -1; // output: 22

0.1 + 0.2 === 0.3; // output: false

"B" + "a" + +"a" + "a"; // output: 'BaNaNa

// -----------------------------------------------------------------------------

console.assert(String(123) === "123", "explicit convertion to string");
console.assert(123 + "" === "123", "implicit convertion to string");

/**
 * Ao utilizarmos os operadores de comparação || e &&, não retornamos um boolean
 * o if faz essa coerção. Esses operadores de fato retornam valores, como podemos
 * ver nas asserções abaixo.
 */
console.assert(
  "hello" || 123 === "hello",
  "returns the first element if both elements are true"
);

console.assert(
  null || 321 === 321,
  "returns the last element if the first element is false"
);

console.assert(
  456 && 789 === 789,
  "returns the last element if both values are true"
);

// -----------------------------------------------------------------------------

const item = {
  name: "Jefferson Souza",
  age: 21,

  // conversão implicita para string: chama 1° e se não for primitivo chama o valueOf
  toString() {
    return `Name: ${this.name}, Age: ${this.age}`;
  },

  // conversão implicita para number: chama 1° e se não for primitivo chama o toString
  valueOf() {
    return { hey: "dude" };
    // return 7;
  },

  [Symbol.toPrimitive](coercionType) {
    // console.log("trying to converto to", coercionType);

    const types = {
      string: JSON.stringify(this),
      number: "0007",
    };

    return types[coercionType] || types.string;
  },
};

// console.log("toString", String(item));
// console.log("valueOf", Number(item)); // vai retornar NaN pois o toString retornou a string

// depois de adicionar o toPrimitive
// console.log("String", String(item));
// console.log("Number", Number(item));

// console.log("Date", new Date(item)); // chama a conversão default

console.assert(item + 0 === '{"name":"Jefferson Souza","age":21}0'); // asserção implicita para boolean, portanto chama o default
// console.log("!!item is true?", !!item);
console.assert(!!item);

// console.log("string.concat", "Ae".concat(item));
console.assert("Ae".concat(item), 'Ae{"name":"Jefferson Souza","age":21}');

// console.log("implicit + explicit coercion (using ==)", item == String(item));
console.assert(item == String(item));

const item2 = { ...item, name: "Zézin", age: 16 };
// console.log("New Object", item2);
console.assert(item2.name === "Zézin" && item2.age === 16);
