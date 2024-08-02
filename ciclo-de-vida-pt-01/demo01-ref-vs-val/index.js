const { deepStrictEqual } = require("assert");

/**
 * Ao fazer counter2 = counter, estamos dizendoq ue counter2 receberá uma cópia
 * do valor armazenado na variável counter, não sua referência, portanto, manipular
 * uma variável não afetará a outra.
 *
 * Isso só ocorre pois estamos trabalhando com tipos primitivos, que são
 * armazenados na memória stack.
 */
let counter = 0;
let counter2 = counter;
counter2++; //output: counter = 0 e counter2 = 1

deepStrictEqual(counter, 0);
deepStrictEqual(counter2, 1);

/**
 * Ao fazer item2 = item, estamos passando a refêrencia em memória, sendo assim,
 * ao alterar alguma das variáveis afetaremos a outra, na prática existe apenas
 * um objeto em memória, porém com duas formas de acessá-lo.
 *
 * Podemos pensar na refêrencia da instância como um bairro, e as variáveis item
 * e item2 como ônibus que vão para esse bairro, independente do "ônibus", que
 * embarcarmos, iremos para o mesmo destino.
 */
const item = { counter: 0 };
const item2 = item;
item2.counter++; //output item.counter = 1 e item2.counter = 2

deepStrictEqual(item, { counter: 1 });
item.counter++;
deepStrictEqual(item2, { counter: 2 });

/**
 * Para clonarmos um objeto com seus atributos, podemos utilizar o spread operator
 * ou o método Object.create(), dessa forma iremos clonar o objeto atual e
 * armazená-lo em um novo espaço de memória, portanto podemos manipular livremente
 * um objeto sem afetar o outro.
 */
const obj = { name: "Jefferson", idade: 21 };
const obj2 = { ...obj };

obj2.idade++;
deepStrictEqual(obj, { name: "Jefferson", idade: 21 });
deepStrictEqual(obj2, { name: "Jefferson", idade: 22 });
