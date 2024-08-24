const assert = require("assert");
const myMap = new Map();

// Pode ter qualquer coisa como chave
myMap
  .set(1, "One")
  .set("Jefferson", { text: "two" })
  .set(true, () => "hello");

const myMapWithConstructor = new Map([
  ["1", "str1"],
  [1, "num1"],
  [true, "boolean1"],
]);

assert.deepStrictEqual(myMap.get(1), "One");
assert.deepStrictEqual(myMap.get("Jefferson"), { text: "two" });
assert.deepStrictEqual(myMap.get(true)(), "hello");

/**
 * Em Objects a chave só pode ser string ou Symbol, caso passemos um number ele
 * será convertido para String
 */
const onlyReferenceWorks = { id: 1 };
myMap.set(onlyReferenceWorks, { name: "Jefferson Souza" });

assert.deepStrictEqual(myMap.get({id: 1}), undefined);
assert.deepStrictEqual(myMap.get(onlyReferenceWorks), { name: "Jefferson Souza" });

/**
 * Utilitários
 * - No Object seria Object.keys({a: 1}).length
 */
assert.deepStrictEqual(myMap.size, 4);

/**
 * Para verificar se um item existe no objeto
 * - item.key = se não existe = undefined
 * if() = coerção implícita para boolean e retorna false
 * 
 * O jeito certo em Object é ({name: 'Jefferson'}).hasOwnProperty('name');
 */ 
assert.ok(myMap.has(onlyReferenceWorks));

/**
 * Para remover um item do objeto
 * - delete item.id
 * imperformático para o Javascript
 */
assert.ok(myMap.delete(onlyReferenceWorks));

/**
 * Não dá para iterar em Objects diretamente
 * tem que transformar com o Object.entries(item)
 */
assert.deepStrictEqual(
  JSON.stringify([...myMap]),
  JSON.stringify( [
    [ 1, 'One' ],
    [ 'Jefferson', { text: 'two' } ],
    [ true, () => {}]
  ])
);

// for(const [key, value] of myMap){
//   console.log(key, value)
// }

/**
 * O object é inseguro, pois dependendo do nome da chave, pode substituir algum comportamento padrão.
 * ({}).toString() => '[object, Object]'
 * 
 * Caso o usuário envie um objeto contendo alguma propriedade padrão do Object, ele vai
 * substituir a implementação e por conta disso não é seguro ({ toString: () => 'Hey' }).toString() === 'Hey'
 * 
 * Qualquer chave pode colidir com as propriedades herdadas do Object, como:
 * constructor, toString, valueOf e etc.
 */
const actor = {
  name: 'Xuxa da Silva',
  toString: 'Queen: Xuxa da Silva '
}

// Não tem restrição de nome de chave
myMap.set(actor)

assert.ok(myMap.has(actor), null)
assert.throws(() => myMap.get(actor).toString, TypeError)

// Não da para limpar um Objecto sem reassina-lo
myMap.clear()
assert.deepStrictEqual([...myMap.keys()], [])

/**
 * WeakMap - pode ser coletado após perder as referências
 * usado em casos bem específicos.
 * 
 * Tem a maioria dos benecíficos do Map, mas não é iterável e as chaves só
 * trabalham com refêrencias, então é necessário ter armazenada essa chave.
 *
 * Ele é mais leve e previne o vazamento de memória, no momento que o garbage
 * collector coletar os objetos sem refêrencia, ele sairá de dentro do nosso WeakMap.
 */
const weakMap = new WeakMap();
const hero = {name: 'Flash'};

 weakMap.set(hero)
 weakMap.get(hero)
 weakMap.delete (hero)
 
