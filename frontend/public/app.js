import AppController from "./src/AppController.js";
import ConnectionManager from "./src/ConnectionManager.js";
import ViewManager from "./src/ViewManager.js";
import DragAndDropManager from "./src/DragAndDropManager.js";

const API_URL = 'https://localhost:3000';

const appController = new AppController({
  connectionManager: new ConnectionManager({
    apiUrl: API_URL,
  }),
  viewManager: new ViewManager(),
  dragAndDropManager: new DragAndDropManager(),
})

try{
  appController.initialize();

}catch(error){
  console.log("AppController Initialize Error: ", error);
}
