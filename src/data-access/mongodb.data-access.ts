import { MongoClient, Db, Server } from 'mongodb';
import { ErrorLog } from '../helper-class/errorlog';
import { IResponse } from '../contracts/iresponse';
import { IError } from '../contracts/ierror';
import { IReturn } from './contracts/ireturn';
import { IUser } from '../contracts/iuser';

export class MongoDBDataAccess {
    private _mongo: MongoClient;
    private _db: Db;
    private _database: string;
    private _error: ErrorLog;
    // private _response: IResponse;
    private _return: IReturn;

    /**
     * Initialize to connect to MongoDB
     * @param _database the database to connect
     */
    constructor(database: string) {
        this._error = new ErrorLog();

        this._return = {
            ok: false,
            status: 404,
            errorMessage: ''
        };

        this._database = database;
        this._mongo = new MongoClient('mongodb://localhost:27017/');
        this._db = new Db(this._database, new Server('', 0));
    }

    /**
     * connect to the MongoDB Database
     */
    async connect() {
        await this._mongo.connect();
        this._db = await this._mongo.db(this._database);
    }

    /**
     * Insert one document to the collection
     * @param collection the collection to store the document
     * @param document the data to store
     */
    async insertOne(collection: string, document: Object) {
        try {
            const result = await this._db
                .collection(collection)
                .insertOne(document);

            this._return = {
                ok: result.result.ok === 1 ? true : false,
                status: result.result.ok === 1 ? 500 : 200
            };
        } catch (err) {
            this.setError(err, 'insertOne');
        } finally {
            // return this._response;
            return this._return;
        }
    }

    /**
     * find one document in the database
     * @param find the query to search for
     * @param collection the collection of the document
     */
    async findOne(find: Object, collection: string) {
        try {
            const result = await this._db.collection(collection).findOne(find);
            let resultDocument: any;
            switch (collection) {
                case 'users':
                    resultDocument = result as IUser;
                    break;
            }

            this._return = {
                ok: true,
                document: resultDocument,
                status: 200
            };

            // return result;
        } catch (err) {
            this.setError(err, 'findOne');
        } finally {
            // return this._response;
            return this._return;
        }
    }

    /**
     * Updates one document in the collection
     * @param collection the collection where the document is in
     * @param find searchstring
     * @param update date to update
     */
    async updateCollection(collection: string, find: Object, update: Object) {
        try {
            const result = await this._db
                .collection(collection)
                .updateOne(find, { $set: update });

            this._return = {
                ok: result.result.ok === 1 ? true : false,
                status: 200
            };
        } catch (err) {
            this.setError(err, 'updateCollection');
        } finally {
            // return this._response;
            return this._return;
        }
    }

    private setError(err: any, fncName: string) {
        const error: IError = {
            code: err.code,
            errorMessage: err.errmsg,
            inClass: 'MongoDBDataAccess',
            method: fncName,
            typeError: err.name
        };
        this._error.setError(error);

        this._return = {
            ok: false,
            status: 500,
            errorMessage: this._error.getErrorMessageResponse()
        };
    }
}
