const { error } = require("./src/constants");
const { rejects, deepStrictEqual } = require("assert");
const File = require("./src/file");

(async () => {
  /*
   * Separando por chaves estamos estabelecendo contextos diferentes, portanto,
   * não recebemos erro ao declarar variáveis com o mesmo nome.
   */
  {
    const filePath = "./mocks/emptyFile-invalid.csv";
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);

    await rejects(result, rejection);
  }
  {
    const filePath = "./mocks/fourItems-invalid.csv";
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);

    await rejects(result, rejection);
  }
  {
    const filePath = "./mocks/threeItems-valid.csv";
    const result = await File.csvToJson(filePath);
    const expected = [
      {
        id: 123,
        name: "Jeferson Souza",
        profession: "Software Developer",
        birthDay: 2003,
      },
      {
        id: 321,
        name: "Erick Wendel",
        profession: "Javascript Specialist",
        birthDay: 1999,
      },
      {
        id: 231,
        name: "Joãozinho",
        profession: "Java Developer",
        birthDay: 1994,
      },
    ];

    /*
     * Além de verificar o valor, verifica também a referência.
     */
    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
  }
})();
