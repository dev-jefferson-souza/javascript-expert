const http = require("http");
const DEFAULT_USER = { username: "Jefferson Souza", password: "123" };

const routes = {
  "/contact:get": (request, response) => {
    response.write("Contact us page.");
    return response.end();
  },
  "/login:post": async (request, response) => {
    // Response é um iterator.
    for await (const data of request) {
      const user = JSON.parse(data);
      if (
        user.username !== DEFAULT_USER.username ||
        user.password !== DEFAULT_USER.password
      ) {
        response.writeHead(401);
        response.write("Loggin failed!");

        return response.end();
      }

      response.write("Loggin has succeeded!");
      return response.end();
    }
  },
  default: (request, response) => {
    response.write("Hello World!");
    return response.end();
  },
};

const handler = function (request, response) {
  const { url, method } = request;
  const routeKey = `${url.toLowerCase()}:${method.toLowerCase()}`;
  const chosen = routes[routeKey] || routes.default;

  /**
   * Durante o curso foi utilizado o método:
   * response.writeHead(200, { "Content-Type": "text/html" });
   *
   * Com o objetivo de definir um header padrão para todas as requisições, no entanto isso estava fazendo com que o
   * código quebrasse ao fazer a validação de login, se o usuário passasse credênciais inválidas nos deveriamos alterar
   * o status da requisição para 401, e o Node nos avisa que estavamos tentando alterar uma response que já havia sido
   * enviada para o cliente.
   *
   * Isso acontecia pois o método response.writeHead enviava a resposta para o cliente, e na própria documentação é
   * dito que esse método só deve ser chaamdo uma vez por mensagem.
   *
   * Possivelmente tive esse problema por estar utilizando a versão 20 do Node, o Erick Wendel utilizou a versão 14.
   *
   * Referência: https://nodejs.org/docs/latest/api/http.html#responsewriteheadstatuscode-statusmessage-headers
   */

  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html");

  return chosen(request, response);
};

const app = http
  .createServer(handler)
  .listen(3000, () => console.log("app running at", 3000));

module.exports = app;
