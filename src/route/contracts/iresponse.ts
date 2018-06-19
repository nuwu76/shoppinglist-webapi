import { ObjectID } from 'bson';

export interface IResponse {
    /**
     * ok => false error
     * ok => true  no error
     */
    ok: boolean;
    /**
     * error Message
     *
     */
    error?: string;

    /**
     * Json Web Token
     */
    token?: string;

    /**
     * a returned document from Database
     */
    document?: object;
}
