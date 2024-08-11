### Comandos básicos
`npm run test`: roda todos os testes da nossa aplicação.
`npm run test:cov`: roda todos os testes e exibe a cobertura de código 

****

### Problemas ao utilizar `Reify` e `NYC` com ES Modules
Durante o curso foram utilizados esses dois pacotes, sendo o Reify para transpilar o código para que o NYC conseguisse interpetá-lo, e o NYC para medir a cobertura de código.

Até a última aula desse módulo consegui utilizar essas duas bibliotecas, no entato ao ir mais a fundo e praticar implementando mais testes, me deparei com o seguinte problema, o NYC não suportava o ES Modules, e o Reify aparentemente não estava sendo o suficiente para resolver isso.

A causa dos meus problemas foi o trecho de código abaixo:
```
import databaseTest from "./../database.test.json" with { type: "json" };
```
A sintaxe não estava sendo reconhecida, portanto a cobertura de testes quebrava e lançava o seguinte erro:

```
1) Uncaught error outside test suite:
   Uncaught SyntaxError: Unexpected token (7:51) while processing file: C:\GitHub\Study\JavaScript\javascript-expert\ciclo-de-vida-pt-02\demo02-esmodules-internationalization\test\terminalController.test.js
    at pp$4.raise (node_modules\acorn\dist\acorn.js:2825:15)
    at pp.unexpected (node_modules\acorn\dist\acorn.js:689:10)
    at pp.semicolon (node_modules\acorn\dist\acorn.js:666:66)
    at pp$1.parseImport (node_modules\acorn\dist\acorn.js:1555:10)
    at pp$1.parseStatement (node_modules\acorn\dist\acorn.js:863:49)
    at _class.parseStatement (node_modules\acorn-dynamic-import\lib\index.js:63:118)
    at pp$1.parseTopLevel (node_modules\acorn\dist\acorn.js:746:23)
    at _class.parse (node_modules\acorn\dist\acorn.js:553:17)
    at Object.parse (node_modules\reify\lib\parsers\acorn.js:20:17)
    at parse (node_modules\reify\lib\options.js:19:26)
```

### Alternativa para cobertura de testes com ES Modules
A solução encontrada foi utilizar o pacote `c8`, que tem como função fazer a cobertura de código e já possui suporte nativo ao ES Modules. Sendo assim, só foi necessário alterar o comado `npm run test:cov` para:
```
"test:cov": "npx c8 npx mocha --parallel test/*.test.js"
```
Após isso, removi o `Reify` e o `nyc` já que não precisaremos mais deles, e nosso problema foi solucionado.
