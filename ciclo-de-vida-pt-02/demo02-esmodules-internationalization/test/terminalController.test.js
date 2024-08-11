import chai from 'chai';
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

})