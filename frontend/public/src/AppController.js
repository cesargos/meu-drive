export default class AppController {  
  constructor({ connectionManager, viewManager }){
    this.connectionManager = connectionManager;
    this.viewManager = viewManager;

    this.uploadFiles = new Map();
  }
  async initialize(){
    this.viewManager.configureFileBtnClick();
    this.viewManager.configureModal();
    this.viewManager.configureOnFileChange(this.onFileChange.bind(this));
    this.viewManager.updateStatus(0);
    this.connectionManager.consfigureEvents({
      onProgress: this.onProgress.bind(this)
    });
    await this.updateCurrentFiles();
  }

  async onProgress({ processedAlready, filename }){
    const file = this.uploadFiles.get(filename);
    const percentProcessed = Math.ceil(processedAlready/file.size*100);

    // this.updateProgress(file, percentProcessed, processedAlready);

    if(percentProcessed < 98 ) return;

    return await this.updateCurrentFiles(); 
  }

  updateProgress(file, percent, processedAlready){
    const uploadFiles = [...this.uploadFiles.values()];
    const totalProgress = uploadFiles
      .map(({ percent = 0 , size }) => ({ percent, size }))
      .reduce((total, current)=>{

      }, {size: 0, })
  }

   renameIfAlreadyHasFilenameUploaded(filename, attempts = 0){
    if(!this.uploadFiles.has(filename)){
      return filename;
    }
    attempts++;
    return this.renameIfAlreadyHasFilenameUploaded(`${filename}(${attempts})`, attempts);
  }

  async onFileChange(files){
    this.viewManager.openModal();
    this.viewManager.updateStatus(0);
    await Promise.all([...files].map((file)=>{
      const name = this.renameIfAlreadyHasFilenameUploaded(file.name.trim());
      this.uploadFiles.set(name, {...file, name, percent: 0, processedAlready: 0, processed: false});
      return this.connectionManager.uploadFile(file);
    }));
    this.viewManager.updateStatus(100);
    setTimeout(()=> this.viewManager.closeModal(),1000);
    this.updateCurrentFiles();
  }

  async updateCurrentFiles(){
    const files = await this.connectionManager.currentFiles();
    this.viewManager.updateCurrentFiles(files);
  }
}