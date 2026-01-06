import Busboy from 'busboy';
import fs from 'fs';
import { pipeline } from 'stream/promises';
import { logger } from './logger.js'

export default class UploadHandler{
  constructor({ io, socketId, downloadsFolder, messageTimeDelay = 200 }){
    this.io = io;
    this.socketId = socketId;
    this.downloadsFolder = downloadsFolder;
    this.ON_UPLOAD_EVENT = 'file-upload';
    this.messageTimeDelay = messageTimeDelay;
  }

  // usado para tratar backpressure => só vai enviar msg socket io para o cliente se ele deixar
  canExecute(){
    return (Date.now() - this.lastMessageSent) >= this.messageTimeDelay;
  }

  handleFileBytes(filename){
    this.lastMessageSent = Date.now();
    let processedAlready = 0;
    async function* handleData(data){
      for await(const chunk of data){        
        processedAlready += chunk.length;
        if (this.canExecute()){
          this.io.to(this.socketId).emit(this.ON_UPLOAD_EVENT, { processedAlready, filename });
          logger.info(`File [${filename}] got ${processedAlready} bytes to ${this.socketId}`)
          this.lastMessageSent = Date.now();
        }
        yield chunk;
      }
    }
    return handleData.bind(this);
  }

  async onFile(_fieldname, file, fileInfo){
  
    const saveTo = `${this.downloadsFolder}/${fileInfo.filename}`
    await pipeline(
      // 1. Pegar um readable sream
      file,
      // 2. filtrar, converter, filtrar dados, notificar front
      this.handleFileBytes.apply(this, [ fileInfo.filename ]),
      // 3. saida do processo, writable stream 
      fs.createWriteStream(saveTo),
      
    )

  }
  registerEvents(headers, onFinish){
    const busboy = Busboy({ headers });
    busboy.on('file', this.onFile.bind(this));
    busboy.on('finish', onFinish);

    return busboy;
  }
}