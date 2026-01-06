export default class ViewManager {
  constructor(){
    this.tbody = document.getElementById('tbody');
    this.newFileBtn = document.getElementById('newFileBtn');
    this.fileElem = document.getElementById('fileElem');
    this.progressModal = document.getElementById('progressModal');
    this.progressBar = document.getElementById('progressBar');
    this.output = document.getElementById('output');

    this.formatterDate = new Intl.DateTimeFormat('pt',{
      locale: 'pt-br',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    this.modalInstance = {};
  } 

  configureModal(){
    // "M" é uma variável global que foi instanciada e atribuida ao usar o <script> materialize.min.js no index.js
    this.modalInstance = M.Modal.init(this.progressModal,{
      opacity: 0,
      dismissable: false,

      // Perminte clicar na tela mesmo com o modal aberto
      onOpenEnd(){
        this.$overlay[0].remove()
      }
    })
  }

  openModal(){
    this.modalInstance.open();
  }

  closeModal(){
    this.modalInstance.close();
  }

  updateStatus(size){
    this.output.innerHTML = `Uploading in <b>${Math.floor(size)}</b>%`;
    this.progressBar.value = size;
  }

  configureOnFileChange(fn){
    this.fileElem.onchange = (e) => fn(e.target.files);  
  }
  
  
  
  configureFileBtnClick(){
    this.newFileBtn.onclick= () => this.fileElem.click();
  }

  getTypeFile(fileName){
    return fileName.match(/\.mp4/i) ? 'movie'
      : fileName.match(/\.(jp|png)/i) ? 'image' : 'content_copy';
  }
  getIcon(fileName){
    const typeFile = this.getTypeFile(fileName);
    const colors = {
      image: 'yellow600',
      movie: 'red600',
      file: '',
      content_copy: ''
    }
    return`
    <i class="material-icons ${colors[typeFile]} left" >${typeFile}</i>
    `
  }
  updateCurrentFiles(files){
    const getTemplate = (item)=>`
      <tr>
        <td>${this.getIcon(item.file)} ${item.file}</td>
        <td>${item.owner}</td>
        <td>${this.formatterDate.format(new Date(item.lastModified))}</td>
        <td>${item.size}</td>
      </tr>
    `;
    this.tbody.innerHTML = files.map(getTemplate).join('');
  }
}