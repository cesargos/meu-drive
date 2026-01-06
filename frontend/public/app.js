import AppController from "./src/AppController.js";
import ConnectionManager from "./src/ConnectionManager.js";
import ViewManager from "./src/ViewManager.js";

const API_URL = 'https://localhost:3000';

const appController = new AppController({
  connectionManager: new ConnectionManager({
    apiUrl: API_URL,
  }),
  viewManager: new ViewManager()
})

try{
  appController.initialize();

}catch(error){
  console.log("AppController Initialize Error: ", error);
}
