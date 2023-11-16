const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const httpErrorHandler = require("@middy/http-error-handler");

function createMiddlewareWrappedHandler(handlerFunction) {
  return middy(handlerFunction).use([
    httpJsonBodyParser(),
    httpErrorHandler()
  ]);
}

module.exports = createMiddlewareWrappedHandler;