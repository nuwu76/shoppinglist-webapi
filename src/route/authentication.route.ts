const express = require('express');
const moment = require('moment');

import * as crypt from 'bcrypt';

import { IRouter } from './contracts/irouter';
import { Router, Request, Response } from 'express';
import { IUser } from './contracts/iuser';
import { MongoDBDataAccess } from '../data-access/mongodb.data-access';
import { IResponse } from './contracts/iresponse';

export class AuthenticationRoute implements IRouter {
    private _router: Router;
    private _mongoDB: MongoDBDataAccess;

    constructor() {
        this._router = express.Router();
        this._mongoDB = new MongoDBDataAccess('shoppinglist');
        this.registerRoute();
    }

    getRouter(): Router {
        return this._router;
    }

    /**
     * Register a user
     */
    private registerRoute() {
        this._router.post('/register', async (req: Request, res: Response) => {
            const body = req.body;

            const passwordSalt = await crypt.genSalt(10);
            const passwordHash = await crypt.hash(body.password, passwordSalt);

            /**
             * create the user
             */
            const user: IUser = {
                email: body.email,
                username: body.username,
                passwordHash: passwordHash,
                passwordSalt: passwordSalt,
                created: moment().format('YYYY-MM-DD HH:mm:ss')
            };

            /**
             * stores the user in the database
             */
            await this._mongoDB.connect();
            const result = await this._mongoDB.insertOne('users', user);

            res.status(result.ok ? 200 : 401).send({ result });
        });
    }
}
