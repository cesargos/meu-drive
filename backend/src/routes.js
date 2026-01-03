import { logger } from "./logger.js";

export default class Routes {
  io;
  constructor(app) {  }
  
  setSocketInstance(io){
    this.io = io;
  }
 
  async defaultRoute(request, response) {
    response.writeHead(404);
    response.end('Not found!!!\n');
  }
  
  async options(request, response) {
    response.writeHead(204);
    response.end('Hello, Secure World!\n');
  }

  async post(request, response) {
    logger.info('Request post received');
    response.writeHead(200);
    response.end('Hello, Secure World!\n');
  }

  async get(request, response) {
    logger.info('Request get received');
    response.writeHead(200);
    response.end('Hello, Secure World!\n');
  }

  handler(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const route = this[request.method.toLowerCase()] || this.defaultRoute;
    
    return route.apply(this, [request, response]); // usamos o apply para manter o contexto do "this"

  } 
}