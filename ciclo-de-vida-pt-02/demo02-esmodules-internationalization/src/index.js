/**
 * Ao importar arquivos JSON, precisamos necessariamente usar o 'with' sinalizando o tipo de arquivo
 */
import database from "./../database.json" with { type: "json" };
import Person from "./person.js";
import TerminalController from "./terminalController.js";



const DEFAULT_LANG = "pt-BR";
const STOP_TERM = ":q";

const terminalController = new TerminalController();
terminalController.initializeTerminal(database, DEFAULT_LANG);

async function mainLoop(){
  try{
    const answer = await terminalController.question('What??');
    console.log('answer:', answer)

    if(answer === STOP_TERM){
      terminalController.closeTerminal();
      console.log('Process finished!');
      
      return;
    }

    const person = Person.generateInstanceFromString(answer);
    console.log(person.formatted(DEFAULT_LANG));

    return mainLoop();

  }catch(error){
    console.error('An unexpected error occurred: ', error);
    return mainLoop();
  }
}

await mainLoop();