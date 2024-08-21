const assert = require("assert");

function* calculation(arg1, arg2) {
  yield arg1 * arg2;
}

function* main() {
  yield "Hello";
  yield "-";
  yield "World";

  /**
   * Para delegar a execução da função, devemos usar o * na chamada yield.
   */
  yield* calculation(20, 10);
}

const generator = main();
// console.log(generator.next());
// console.log(generator.next());
// console.log(generator.next());
// console.log(generator.next());

const expectedGeneratorNext = [
  { value: "Hello", done: false },
  { value: "-", done: false },
  { value: "World", done: false },
  { value: 200, done: false },
];

for (const object of expectedGeneratorNext) {
  assert.deepStrictEqual(generator.next(), object);
}

/**
 * Ao criar uma array a partir do nosso generator, teremos como resultado uma
 * array contendo todos os values (onde done === false), do nosso generator.
 */
assert.deepStrictEqual(Array.from(main()), ["Hello", "-", "World", 200]);
assert.deepStrictEqual([...main()], ["Hello", "-", "World", 200]);

const { readFile, stat, readdir } = require("fs/promises");

function* promisified() {
  yield readFile(__filename);
  yield Promise.resolve("Hey Dude");
}

// Promise.all([...promisified()]).then((result) =>
//   console.log("Promise.all", result)
// );

// (async () => {
//   for await (const item of promisified()) {
//     console.log("for await", item.toString());
//   }
// })();

async function* systemInfo() {
  const file = await readFile(__filename);
  yield { file: file.toString() };

  const { size } = await stat(__filename);
  yield { size };

  const dir = await readdir(__dirname);
  yield { dir };
}

(async () => {
  for await (const item of systemInfo()) {
    console.log("systemInfo", item);
  }
})();
