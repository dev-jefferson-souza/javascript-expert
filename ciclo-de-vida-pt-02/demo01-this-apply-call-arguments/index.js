'use strict';

const { watch, promises: { readFile } } = require("fs");

class File {
  watch(event, filename){
    console.log('this', this);

    /**
     * Chamando o método slice com o call, para passar como contexto o objeto arguments.
     * Uma forma mais simples e moderna seria Array.from(arguments);
     */
    console.log('arguments', Array.prototype.slice.call(arguments));

    this.showContent(filename);
  }

  async showContent(filename){
    console.log((await readFile(filename)).toString());
  }
}

const file = new File();

// Dessa forma ele ignora o this da classe File e herda o this do watch.
// watch(__filename, file.watch);

// alternativa para não herdar o this da função, mas fica feio
// watch(__filename, (event, filename) => file.watch(event, filename));


/**
 * Podemos deixar explicito qual é o contexto que a função deve seguir, o bind 
 * retorna uma função com o 'this' de file, ignorando o watch
 */
// watch(__filename, file.watch.bind(file));

/**
 * Quando o o método watch chamar o showContent, retornaremos o console.log,
 * os parâmeros após o fechamento do objeto são os parâmetros que a função que
 * está sendo observada espera (watch nesse caso).
 * 
 * Dessa forma, conseguimos substituír o contexto this, de watch nesse caso em
 * específico, e é possível até mesmo alterar o comportamento de um método.
 */
file.watch.call({ showContent: () => console.log('call: hey sinon!') }, null, __filename);

/**
 * Faz a mesma coisa que o call, no entanto ao invés de passarmos os argumentos
 * separados por vírgula após o objeto com o retorno da funnção, passamos como uma array.
 */
file.watch.apply({ showContent: () => console.log('apply: hey sinon!') }, [null, __filename]);

