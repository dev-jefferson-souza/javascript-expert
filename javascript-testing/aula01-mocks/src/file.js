const { readFile } = require("fs/promises");
const { error } = require("./constants");
const User = require("./user");

const DEFAULT_OPTIONS = {
  maxLines: 3,
  fields: ["id", "name", "profession", "age"],
};

class File {
  static async csvToJson(filePath) {
    const content = await File.getFileContent(filePath);
    const validation = File.isValid(content);
    if (!validation.valid) throw new Error(validation.error);

    const json = File.parseCSVToJson(content);
    return json;
  }

  static async getFileContent(filePath) {
    const fileContent = await readFile(filePath, { encoding: "utf8" });

    /*
     * Removendo as quebras de linha com \r
     */
    const normalizedContent = fileContent.replace(/\r/g, "");

    return normalizedContent;
  }

  static isValid(csvString, options = DEFAULT_OPTIONS) {
    const [header, ...fileWithoutHeader] = csvString.split("\n");

    /*
     * Checando se o header é exatamente como deveria ser no CSV, ou seja, uma
     * array de strings na ordem esperada dividida por vírgulas.
     */
    const isHeaderValid = header === options.fields.join(",");
    if (!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false,
      };
    }

    const isContentLengthAccepted =
      fileWithoutHeader.length > 0 &&
      fileWithoutHeader.length <= options.maxLines;

    if (!isContentLengthAccepted) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false,
      };
    }

    return { valid: true };
  }

  static parseCSVToJson(csvString) {
    const lines = csvString.split("\n");

    /*
     * Remove o primeiro item do array e armazena ele na variável.
     */
    const firstLine = lines.shift();
    const header = firstLine.split(",");
    const users = lines.map((line) => {
      const columns = line.split(",");

      let user = {};

      for (const index in columns) {
        user[header[index]] = columns[index];
      }

      return new User(user);
    });

    return users;
  }
}

module.exports = File;
