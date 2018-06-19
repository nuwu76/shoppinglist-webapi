const express = require('express');
const moment = require('moment');
const jwt = require('jsonwebtoken');

import * as crypt from 'bcrypt';

import { IRouter } from './contracts/irouter';
import { Router, Request, Response } from 'express';
import { IUser } from '../contracts/iuser';
import { MongoDBDataAccess } from '../data-access/mongodb.data-access';
import { IResponse } from './contracts/iresponse';
import { IReturn } from '../data-access/contracts/ireturn';

export class AuthenticationRoute implements IRouter {
    private _router: Router;
    private _mongoDB: MongoDBDataAccess;
    private _response: IResponse;
    private _token: string;

    constructor() {
        this._router = express.Router();
        this._mongoDB = new MongoDBDataAccess('shoppinglist');
        this._token = '';

        this._response = {
            ok: false
        };
        this.registerRoute();
        this.loginRoute();
        this.logoutRouter();
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

            this.response(result, res);
        });
    }

    /**
     * login route
     */
    private loginRoute() {
        this._router.post('/login', async (req: Request, res: Response) => {
            const body = req.body;
            const username: string = body.username;
            const password: string = body.password;

            /**
             * search for the username
             */
            await this._mongoDB.connect();
            const result = await this._mongoDB.findOne(
                { username: username },
                'users'
            );
            /**
             * Username not found
             */
            if (!result.document) {
                result.errorMessage = 'Username and/or password wrong!';
                result.ok = false;
            } else {
                /**
                 * check password
                 */

                const passwordHashTemp = await crypt.hash(
                    password,
                    result.document.passwordSalt
                );
                if (passwordHashTemp === result.document.passwordHash) {
                    /**
                     * Password matches
                     */

                    const saltJwt = await crypt.genSalt(10);
                    const payload = {
                        username: username,
                        appname: 'shoppinglist'
                    };

                    const token = jwt.sign(
                        {
                            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
                            data: payload
                        },
                        saltJwt
                    );

                    const resultUpdate = await this._mongoDB.updateCollection(
                        'users',
                        { username: username },
                        {
                            lastLogin: moment().format('YYYY-MM-DD HH:mm:ss'),
                            saltJwt: saltJwt
                        }
                    );

                    this.response(resultUpdate, res, token);
                } else {
                    this.response(result, res);
                }
            }
        });
    }

    /**
     * logout router
     */
    private logoutRouter() {
        this._router.post('/logout', async (req: Request, res: Response) => {
            const body = req.body;

            const username = body.username;

            await this._mongoDB.connect();
            const result = await this._mongoDB.updateCollection(
                'users',
                { username: username },
                { saltJwt: '' }
            );

            this.response(result, res);
        });
    }

    private response(result: IReturn, res: Response, token?: string) {
        this._response = {
            ok: result.ok,
            document: result.document,
            error: result.errorMessage,
            token: token
        };

        res.status(result.status).send(this._response);
    }
}
