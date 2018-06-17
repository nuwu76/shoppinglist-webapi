import * as expressImport from 'express';
const express = require('express');

import { Server } from 'http';
const config = require('./config/config.json');

import * as http from 'http';

import * as bodyParser from 'body-parser';
import { AuthenticationRoute } from './route/authentication.route';

export class NuServer {
    private _app: expressImport.Application;
    private _PORT = 14100;
    private _httpServer: Server;
    private _URL = config.apiUrls.api;
    private _authRoute: AuthenticationRoute;

    constructor() {
        this._app = express();
        this._authRoute = new AuthenticationRoute();
        this.middleware();

        this.routes();

        this._httpServer = http.createServer(this._app);
        this.listen();
    }

    private middleware() {
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(bodyParser.json());
    }

    private routes() {
        this._app.use(
            this._URL + config.apiUrls.auth,
            this._authRoute.getRouter()
        );
    }

    private listen() {
        this._httpServer.listen(this._PORT);
        this._httpServer.on('error', (error: any) => {
            if (error.syscall !== 'listen') {
                throw error;
            }
            var bind =
                typeof this._PORT === 'string'
                    ? 'Pipe ' + this._PORT
                    : 'Port ' + this._PORT;
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
        this._httpServer.on('listening', () => {
            var addr = this._httpServer.address();
            var bind =
                typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
            console.log('Listening on ' + bind);
        });
    }
}

new NuServer();
