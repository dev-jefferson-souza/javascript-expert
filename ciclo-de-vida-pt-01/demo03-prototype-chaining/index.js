console.clear()
const dividerFunc = () => console.log('\n------------------------------------------------------------\n');


const assert = require("assert");

const obj = {};
const arr = [];
const fn = () => {};

/**
 * Internamente, objetos literais viram funções explicitas.
 *
 * O uso do __proto__ está deprecado, e a documentação da Mozila recomenda o uso
 * do Object.getPrototypeOf().
 *
 * Referência: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto
 */
console.log("new Objecet is {}?", new Object().__proto__ === {}.__proto__);
assert.deepStrictEqual(new Object().__proto__, {}.__proto__);

// __proto__ é a referência do objeto que possui as propriedades nele
console.log("obj.__proto__ === Object.prototype",obj.__proto__ === Object.prototype);
assert.deepStrictEqual(obj.__proto__, Object.prototype);

console.log("arr.__proto__ === Array.prototype",arr.__proto__ === Array.prototype);
assert.deepStrictEqual(arr.__proto__, Array.prototype);

console.log("fn.__proto__ === Function.prototype",fn.__proto__ === Function.prototype);
assert.deepStrictEqual(fn.__proto__, Function.prototype);

dividerFunc();
/**
 * A forma implmentada abaixo era como era feito a herança no ES5, antes de
 * existir as palavras chaves 'class' e 'extends'.
 */

// Tudo no Javascript herda de Object, e o prototype de Object é null.
console.log('obj.__proto__.__proto__ === null', obj.__proto__.__proto__ === null);
assert.deepStrictEqual(obj.__proto__.__proto__, null);

function Employee(){};
Employee.prototype.salary = () => "salary**";

function Supervior(){}
Supervior.prototype = Object.create(Employee.prototype);
Supervior.prototype.profitShare = () => "profitShare**";

function Manager(){}
Manager.prototype = Object.create(Supervior.prototype);
Manager.prototype.moonthlyBonuses = () => "moonthlyBonuses**";

// Podemos chamar via prototype, mas se tentar chamar direto dá erro!
console.log('Manager.prototype.salary()', Manager.prototype.salary());
// console.log('Manager.salary()', Manager.salary());

/**
 * Se não chamar o 'new', o primeiro __proto__ vai ser sempre a instância de
 * Function, sem herdar nossas classes.
 * Para acessar as classes sem o new, pode acessar direto via prototype.
 */
console.log('Manager.prototype.__proto__ === Supervior.prototype', Manager.prototype.__proto__ === Supervior.prototype);
assert.deepStrictEqual(Manager.prototype.__proto__, Supervior.prototype);

dividerFunc();

// Quando chamamos o 'new', o primeiro __proto__ recebe o prototype da própria função.
console.log('manager.__proto__: %s, manager.salary(): %s', new Manager().__proto__, new Manager().salary());
console.log('Supervior.prototype === new Manager().__proto__.__proto__', Supervior.prototype === new Manager().__proto__.__proto__);
assert.deepStrictEqual(Supervior.prototype, new Manager().__proto__.__proto__)

dividerFunc();

const manager = new Manager();
console.log('manager.salary()', manager.salary());
console.log('manager.profitShare()', manager.profitShare());
console.log('manager.moonthlyBonuses()', manager.moonthlyBonuses());

assert.deepStrictEqual(manager.__proto__, Manager.prototype);
assert.deepStrictEqual(manager.__proto__.__proto__, Supervior.prototype);
assert.deepStrictEqual(manager.__proto__.__proto__.__proto__, Employee.prototype);
assert.deepStrictEqual(manager.__proto__.__proto__.__proto__.__proto__, Object.prototype);
assert.deepStrictEqual(manager.__proto__.__proto__.__proto__.__proto__.__proto__, null);

dividerFunc();

/**
 * Atualmente, possuímos as palavras chave 'class' e 'extends', que facilitam a
 * implementação de herança.
 */

class T1 {
  ping() { return 'ping' };
}
class T2 extends T1 {
  pong() { return 'pong' };
}
class T3 extends T2 {
  shoot() { return 'shoot' };
}

const t3 = new T3();

console.log('t3 inhertis null?', t3.__proto__.__proto__.__proto__.__proto__.__proto__ === null);
console.log('t3.ping()', t3.ping());
console.log('t3.pong()', t3.pong());
console.log('t3.shoot()', t3.shoot());


assert.deepStrictEqual(t3.__proto__, T3.prototype);
assert.deepStrictEqual(t3.__proto__.__proto__, T2.prototype);
assert.deepStrictEqual(t3.__proto__.__proto__.__proto__, T1.prototype);
assert.deepStrictEqual(t3.__proto__.__proto__.__proto__.__proto__, Object.prototype);
assert.deepStrictEqual(t3.__proto__.__proto__.__proto__.__proto__.__proto__, null);

console.log(t3.s)

/**
 * Resumindo, a herança no Javascript funciona da seguinte forma, ao chamar um
 * método ou tentar acessar um método (ou atributo) do objeto atual, ele busca 
 * em seu próprio prototype, caso não encontre nada, busca no prototype do pai e
 * assim sucessivamente até que o método seja encontrado.
 * 
 * Esse processo vai se repetir subindo até o último membro da cadeia, ou seja,
 * o prototype de Object, e caso o método não seja encontrado lançará uma exceção.
 * Já em casos de atributos não encontrados, retornará undefined.
 * 
 * Fluxo seguido pelo encadeamento de prototype:
 * 
 * const number = 7.toFixed(2) 
 *                 -> busca em Number.__proto__
 *                   -> executa a função, pois ela existe no __proto__ de Number.
 * 
 * const string = 'string'.randomize() 
 *                  -> busca em String.__proto__
 *                    -> busca em {}.__proto__ 
 *                      -> busca em Object.__proto__ 
 *                        -> lança uma Exception pois o método não foi encontrado em nenhum nível da cadeia.
 */

