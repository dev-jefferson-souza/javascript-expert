import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export const save = async (data) => {
  /**
   * No ESModules não tem __filename, __dirname.
   * 
   * Sendo assim, para acessar o arquivo precisamos seguir a seguinte abordagem:
   * 
   * 1. usar o método fileURLToPath(import.meta.url), para obter o caminho completo do arquivo atual.
   * 2. buscar o nome do diretório do arquivo atual, utilizando o método paht.dirname().
   * 3. construir a url para o nosso arquivo JSON fazendo um join com o __dirname e o caminho relativo para o arquivo desejado.
   */
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const databaseFile = path.join(__dirname, './../database.json');

  const currentData = JSON.parse((await readFile(databaseFile)))
  currentData.push(data);

  await writeFile(databaseFile, JSON.stringify(currentData));
}