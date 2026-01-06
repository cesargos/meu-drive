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

  async onProgress(msg){
    const { processedAlready, filename } = msg;
    const file = this.uploadFiles.get(filename);
    const percentProcessed = Math.ceil(processedAlready/file.size*100);
    file.percent = percentProcessed;
    file.processedAlready = processedAlready;

    this.updateProgress();

    if(percentProcessed < 98 ) return;
    file.processed = true;

    return await this.updateCurrentFiles(); 
  }

  updateProgress(){
    const uploadFiles = [...this.uploadFiles.values()].filter(file=> !file.processed);
    const {totalProcessed, totalSize } = uploadFiles
      .reduce((total, current)=>{
        total.totalProcessed += current.processedAlready;
        total.totalSize += current.size;
        return total;
      }, {totalProcessed: 0, totalSize: 0});

    const percent = Math.ceil(totalProcessed/totalSize*100);
    this.viewManager.updateStatus(percent);
  }

  async onFileChange(files){
    this.viewManager.openModal();
    this.viewManager.updateStatus(0);
    await Promise.all([...files].map((file)=>{
      const fileInfo = {percent: 0, processedAlready: 0, processed: false, size: file.size};
      this.uploadFiles.set(file.name, fileInfo);
      
      return this.connectionManager.uploadFile(file);
    }));
    this.viewManager.updateStatus(100);
    setTimeout(()=> this.viewManager.closeModal(),2000);
    this.updateCurrentFiles();
  }

  async updateCurrentFiles(){
    const files = await this.connectionManager.currentFiles();
    this.viewManager.updateCurrentFiles(files);
  }
}