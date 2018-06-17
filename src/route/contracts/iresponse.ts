import { ObjectID } from 'bson';

export interface IResponse {
    /**
     * result => -1 error
     * result => 1 no error
     */
    result: number;
    /**
     * error Message
     * Hint: The type could get a change
     */
    error: string;

    /**
     * ObjectID from the database by an insertone command
     */
    insertedId?: ObjectID;
    /**
     * count of the inserted document
     */
    insertedCount?: number;

    /**
     * Json Web Token
     */
    token?: string;
}
