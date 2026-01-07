import https from 'https';
import http from 'http';
import fs from 'fs';
import { logger } from './logger.js';
import { Server } from 'socket.io';
import Routes from './routes.js';
import FileHelper from "./FileHelper.js";
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultDownloadsFolder = resolve(__dirname, '../', 'downloads');

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
process.env.USER = process.env.USER ?? "system_user"; 

const localHostSSL = isProduction ? {} : {
  key: fs.readFileSync('./certificates/key.pem'),
  cert: fs.readFileSync('./certificates/cert.pem'),
};

const protocol = isProduction ? http : https;
const routes = new Routes(defaultDownloadsFolder, FileHelper);
const server = protocol.createServer(localHostSSL, routes.handler.bind(routes));

const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: false,
  },
});

routes.setSocketInstance(io);

io.on('connection', (socket) => logger.info(`New client connected: ${socket.id}`));

const startServer = ()=>{
  const { address, port } = server.address();
  logger.info(`Server running at http${isProduction ? "": "s"}://${address}:${port}/`);
}

server.listen(PORT, startServer);