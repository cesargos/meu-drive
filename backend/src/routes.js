import { logger } from "./logger.js";
import { parse }  from 'url';
import { pipeline } from 'stream/promises';
import UploadHandler from "./UploadHandler.js";

export default class Routes {
  io;
  constructor(defaultDownloadsFolder, fileHelper) {
    this.downloadsFolder = defaultDownloadsFolder;
    this.fileHelper = fileHelper;
  }
  
  setSocketInstance(io){
    this.io = io;
  }
 
  async defaultRoute(request, response) {
    response.writeHead(404);
    response.end('Not found!!!\n');
  }
  
  async options(request, response) {
    response.writeHead(204);
    response.end();
  }

  async post(request, response) {
    const { headers } = request;
    const {query: { socketId }} = parse(request.url, true);
    const uploadHandler = new UploadHandler({
      io: this.io,
      socketId,
      downloadsFolder: this.downloadsFolder,
    });

    const onFinish = ( response )=>{
      logger.info('Request post received');
      response.writeHead(200);
      response.end(JSON.stringify({ result: 'File Updated With Success!'}));
    }
    const busboyInstance = uploadHandler.registerEvents(headers,()=> onFinish(response));
    await pipeline(
      request,
      busboyInstance
    );
    logger.info('Request Finished with success!');
  }

  async get(request, response) {
    const files = await this.fileHelper.getFilesStatus(this.downloadsFolder);
    response.writeHead(200);
    response.end(JSON.stringify(files, null, 2));
  }

  handler(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const route = this[request.method.toLowerCase()] || this.defaultRoute;
    
    return route.apply(this, [request, response]); // usamos o apply para manter o contexto do "this"

  } 
}