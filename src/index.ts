import * as expressImport from 'express';
const express = require('express');

import { Server } from 'http';
import * as http from 'http';

import * as bodyParser from 'body-parser';

export class NuServer {
    private app: expressImport.Application;
    private PORT = 14100;
    private httpServer: Server;
    private URL = '/shoppinglist/api';

    constructor() {
        this.app = express();
        this.middleware();

        this.routes();

        this.httpServer = http.createServer(this.app);
        this.listen();
    }

    private middleware() {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
    }

    private routes() {}

    private listen() {
        this.httpServer.listen(this.PORT);
        this.httpServer.on('error', (error: any) => {
            if (error.syscall !== 'listen') {
                throw error;
            }
            var bind =
                typeof this.PORT === 'string'
                    ? 'Pipe ' + this.PORT
                    : 'Port ' + this.PORT;
            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });
        this.httpServer.on('listening', () => {
            var addr = this.httpServer.address();
            var bind =
                typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
            console.log('Listening on ' + bind);
        });
    }
}

new NuServer();
