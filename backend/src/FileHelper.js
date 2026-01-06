import fs from 'fs';
import prettyBytes from 'pretty-bytes';

export default class FileHelper{
  static async getFilesStatus(downloadsFolder){
    const currentFiles = await fs.promises.readdir(downloadsFolder);
    const statuses = await Promise.all( 
      currentFiles.map( file => fs.promises.stat(`${downloadsFolder}/${file}`))
    );
    return statuses.map(({birthtime, size }, index) => ({
      size: prettyBytes(size),
      filename: currentFiles[index],
      lastModified: birthtime,
      owner: process.env.USER
    }));
  }
}