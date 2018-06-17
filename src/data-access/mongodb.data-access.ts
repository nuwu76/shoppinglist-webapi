import { MongoClient, Db, Server } from 'mongodb';
import { ErrorLog } from '../helper-class/errorlog';
import { IResponse } from '../contracts/iresponse';
import { IError } from '../contracts/ierror';

export class MongoDBDataAccess {
    private _mongo: MongoClient;
    private _db: Db;
    private _database: string;
    private _error: ErrorLog;
    private _response: IResponse;

    /**
     * Initialize to connect to MongoDB
     * @param _database the database to connect
     */
    constructor(database: string) {
        this._error = new ErrorLog();
        this._response = {
            ok: false
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

            this._response = {
                ok: result.result.ok === 1 ? true : false,
                countDocument: result.result.n
            };
        } catch (err) {
            const error: IError = {
                code: err.code,
                errorMessage: err.errmsg,
                typeError: err.name,
                method: 'insertOne',
                inClass: 'MongoDBDataAccess'
            };
            this._error.setError(error);
            this._response = {
                ok: false,
                errorMessage: this._error.getErrorMessageResponse()
            };
        } finally {
            return this._response;
        }
    }
}
