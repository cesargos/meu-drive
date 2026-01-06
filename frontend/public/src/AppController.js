export default class AppController {  
  constructor({ connectionManager, viewManager }){
    this.connectionManager = connectionManager;
    this.viewManager = viewManager;

    this.uploadFiles = new Map();
  }
  async initialize(){
    this.viewManager.configureFileBtnClick();
    this.viewManager.configureOnFileChange(this.onFileChange.bind(this));
    this.connectionManager.consfigureEvents(()=>{});
    await this.updateCurrentFiles();
  }

  async onFileChange(files){
    await Promise.all([...files].map((file)=>{
      this.uploadFiles.set(file.name, file);
      return this.connectionManager.uploadFile(file);
    }));
    this.updateCurrentFiles();
  }

  async updateCurrentFiles(){
    const files = await this.connectionManager.currentFiles();
    this.viewManager.updateCurrentFiles(files);
  }
}