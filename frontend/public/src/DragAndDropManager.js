export default class DragAndDropManager {
  constructor(){
    this.dropArea = document.getElementById('drop-area');
    this.onDropHandler = ()=>{};
  }
  initialize({ onDropHandler}){
    this.onDropHandler = onDropHandler;
    // desabilitar drag e drop padrão do navegador
    this.disableDragAndDropEvent();

    // deixar colorido o drop area ao arrastar arquivos
    this.enableHighLightOnDrag();
  }

  disableDragAndDropEvent(){
    const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
    const preventDefault = (e) => {
      e.preventDefault();
      e.stopPropagation();
    }
    events.forEach(eventName => {
      this.dropArea.addEventListener(eventName, preventDefault, false);
      document.body.addEventListener(eventName, preventDefault, false);
    });
  }

  enableHighLightOnDrag(){
    const eventName = ['dragenter', 'dragover'];
    const hightlight = (el) => {
      this.dropArea.classList.add('highlight');
      this.dropArea.classList.add('drop-area');
    }
    eventName.forEach(event => {
      this.dropArea.addEventListener(event, hightlight, false);
    });
  }

  enableDrop(e){
    const drop = (e) => {
      this.dropArea.classList.remove('drop-area');
      const files = e.dataTransfer.files;
      this.onDropHandler(files);
    }
    this.dropArea.addEventListener('drop', drop, false);
  }
}