import chalk from 'chalk';
import chalkTable from 'chalk-table';
import DraftLog from 'draftlog';
import readline from 'readline';

/**
 * Trabalhando com ECMAScript modules precisamos necessariamente passar a
 * extensão do arquivo se não estivermos trabalhando com arquivos .mjs
 */
import Person from './person.js';

export default class TerminalController {
  constructor(){
    this.print = {};
    this.data = [];
    this.terminal = {};
  }

  initializeTerminal(database, language){
    /**
     * Injetando os métodos da biblioteca DraftLog em nosso console
     */
    DraftLog(console).addLineListener(process.stdin);
    this.terminal = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    this.initializeTable(database, language);
  }

  closeTerminal(){
    this.terminal.close();
  }

  initializeTable(database, language){
    const data = database.map(item => new Person(item).formatted(language));
    const table = chalkTable(this.getTableOptions(), data);

    this.print = console.draft(table);
    this.data = data;
  }

  updateTableItem(item){
    this.data.push(item);
    this.print(chalkTable(this.getTableOptions(), this.data));
  }

  question(msg = ''){
    return new Promise(resolve => this.terminal.question(msg, resolve))
  }

  getTableOptions(){
    return {
      leftPad:2,
      columns: [
        { field: "id", name: chalk.cyan("ID") },
        { field: "vehicles", name: chalk.magenta("Vehicles") },
        { field: "kmTraveled", name: chalk.cyan("Km Traveled") },
        { field: "from", name: chalk.cyan("From") },
        { field: "to", name: chalk.cyan("To") },
      ]
    }
  }
}