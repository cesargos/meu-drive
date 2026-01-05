import Busboy from 'busboy';
import fs from 'fs';
import { pipeline } from 'stream/promises';
import { logger } from './logger.js'

export default class UploadHandler{
  constructor({ io, socketId, donwloadsFolder, messageTimeDelay = 200 }){
    this.io = io;
    this.socketId = socketId;
    this.donwloadsFolder = donwloadsFolder;
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
    async function* handleData(source){
      for await(const chunk of data){
        yield chunk;
        processedAlready += chunk.length;
        if (!this.canExecute()){
          continue;
        }
        this.io.to(this.socketId).emit(this.ON_UPLOAD_EVENT, { processedAlready, filename });
        logger.info(`File [${filename}] got ${processedAlready} bytes to ${this.socketId}`)
        this.lastMessageSent = Date.now();
      }
    }
    return handleData.bind(this);
  }

  async onFile(fieldname, file, filename){
    const saveTo = `${this.donwloadsFolder}/${filename}`

    await pipeline(
      // 1. Pegar um readable sream
      file,
      // 2. filtrar, converter, filtrar dados, notificar front
      this.handleFileBytes.apply(this, [ fieldname ]),
      // 3. saida do processo, writable stream 
      fs.createWriteStream(saveTo),
      
    )

  }
  registerEvents(headers, onFinish){
    const busboy = new Busboy({ headers });
    busboy.on('file', this.onFile.bind(this));
    busboy.on('finish', onFinish);

    return busboy;
  }
}