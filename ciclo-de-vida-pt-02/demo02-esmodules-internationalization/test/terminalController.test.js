import chai from 'chai';
import chalkTable from 'chalk-table';
import mocha from 'mocha';
import readline from 'readline';
import sinon from 'sinon';
import { clear, save } from '../src/repository.js';
import TerminalController from '../src/terminalController.js';
import databaseTest from "./../database.test.json" assert { type: "json" };

const { describe, it, beforeEach } = mocha
const { expect } = chai;

const DEFAULT_LANGUAGE = 'pt-BR'
const INITIAL_DATABASE = {
    from: '2002-04-01',
    to: '2002-05-01',
    vehicles: ['Bike', 'Carro'],
    kmTraveled: '12',
    id: '1',
  }



describe('TerminalController', () => {

  let sandbox = {};
  let terminalController = new TerminalController();

  beforeEach(async () => {
    /**
     * Limpando o banco de testes e armazenando um objeto inicial antes de executar
     * cada caso de testes.
     */
    await clear('./../database.test.json');
    await save(INITIAL_DATABASE, './../database.test.json');

    /**
     * Resetando sandbox e limpando a instância do nosso terminalController.
     */
    sandbox = sinon.createSandbox();
    terminalController = new TerminalController();
  });
  
  afterEach(() => sandbox.restore());

  
  it('should initialize the terminal calling the initializeTable method with correct values' , () => {
    sandbox
      .stub(readline, readline.createInterface.name)
      .returns({ 
        input: sandbox.stub(),
        output: sandbox.stub()
      });
    
    sandbox
      .stub(terminalController, terminalController.initializeTable.name)
      .returns();

    terminalController.initializeTerminal(databaseTest, DEFAULT_LANGUAGE);

    expect(readline.createInterface.calledOnce).to.be.true;
    expect(terminalController.initializeTable.calledOnce).to.be.true;  
    expect(terminalController.initializeTable.calledWithExactly(INITIAL_DATABASE, DEFAULT_LANGUAGE));                  
  })

  it('should initialize the table using the provided params and format the output', () => {
    
    const expected = [
      {
        id: 1,
        vehicles: 'Bike e Carro',
        kmTraveled: '12 km',
        from: '01 de abril de 2002',
        to: '01 de maio de 2002'
      }
    ]
    
    terminalController.initializeTable(databaseTest, DEFAULT_LANGUAGE);
    sandbox.spy(terminalController, terminalController.initializeTable.name);
    
    expect(terminalController.initializeTable.calledWithExactly(INITIAL_DATABASE, DEFAULT_LANGUAGE));
    expect(terminalController.data).to.be.deep.equal(expected);
    
  })

  it('should add the item to the data and call print with the updated table', () => {

    const newItem = {
      id: 2,
      vehicles: 'Moto',
      kmTraveled: '15 km',
      from: '01 de junho de 2002',
      to: '01 de julho de 2002'
    };

    /**
     * Como iniciamos nossa variável print como um objeto vazio e o stub só pode
     * ser utilizado em métodos, devemos transformar print em um método antes de
     * fazer seu stub (ou poderiamos iniciar ele no construtor com uma função que retorne null).
     */
    terminalController.print = () => null;
    sandbox.stub(terminalController, 'print').returns()
    terminalController.updateTableItem(newItem);
    
    const tableOptions = terminalController.getTableOptions();
    const expectedOutput = chalkTable(tableOptions, terminalController.data);
    
    expect(terminalController.data).to.include(newItem);
    expect(terminalController.print.calledWithExactly(expectedOutput)).to.be.true;
  });

  it('should ask a question and resolve with the answer', async () => {

    /**
     * Para evitar o erro de TypeError: Cannot stub non-existent property question
     */
    terminalController.terminal.question = (msg) => msg
    sandbox
      .stub(terminalController, 'terminal')
      .returns();
    
    sandbox
      .stub(terminalController.terminal, 'question')
      .callsFake((msg, callback) => callback("Yes, I'm."));
    
    
    terminalController.initializeTable(databaseTest, DEFAULT_LANGUAGE);
    const answer = await terminalController.question('Are you sure?');
    
    /**
     * Por algum motivo o uso do calledOnceWithExactly não funcionou corretamente,
     * e a asserção estava retornando false.
     * 
     * Sendo assim obtive diretamente o parâmetro da primeira chamada e fiz a 
     * asserção com equal, para garantir que o método foi chamado somente uma
     * vez utilizei o calledOnce.
     */
    const firstArgumentFromQuestionStub = terminalController.terminal.question.getCall(0).firstArg
    
    expect(firstArgumentFromQuestionStub).to.be.equal('Are you sure?');
    expect(terminalController.terminal.question.calledOnce).to.be.true;
    expect(answer).to.equal("Yes, I'm.");
  });

  it('should call the terminal.close() and finalize the terminal', () => {
    /**
     * Para evitar o erro de TypeError: Cannot stub non-existent property close
     */
    terminalController.terminal.close = () => null

    sandbox.stub(terminalController.terminal, 'close');
    sandbox.spy(terminalController, terminalController.closeTerminal.name);
    
    terminalController.closeTerminal();

    expect(terminalController.closeTerminal.calledOnce).to.be.true;
    expect(terminalController.terminal.close.calledOnce).to.be.true;
  })
})