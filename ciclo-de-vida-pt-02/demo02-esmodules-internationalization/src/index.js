import chalk from 'chalk';
import chalkTable from 'chalk-table';
import DraftLog from 'draftlog';
import readline from 'readline';

/**
 * Ao importar arquivos JSON, precisamos necessariamente usar o 'with' sinalizando o tipo de arquivo
 */
import database from "./../database.json" with { type: "json" };

/**
 * Trabalhando com ECMAScript modules precisamos necessariamente passar a 
 * extensão do arquivo se não estivermos trabalhando com arquivos .mjs 
 */
import Person from './person.js';

/**
 * Injetando os métodos da biblioteca DraftLog em nosso console
 */
DraftLog(console).addLineListener(process.stdin);
const DEFAULT_LANG = "pt-BR"

const options = {
  leftPad:2,
  columns: [
    { field : "id", name: chalk.cyan("ID")},
    { field : "vehicles", name: chalk.magenta("Vehicles")},
    { field : "kmTraveled", name: chalk.cyan("Km Traveled")},
    { field : "from", name: chalk.cyan("From")},
    { field : "to", name: chalk.cyan("To")}
  ]
}

const table = chalkTable(options, database.map(item => new Person(item).formatted(DEFAULT_LANG)));
const print = console.draft(table);

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

terminal.question('Qual é o seu nome?' , msg  => {
  console.log('msg', msg.toString())
})
