export interface IError {
    /**
     * error code from MongoDB e.g. 11000 for duplicate key
     */
    code: number;
    /**
     * error message
     */
    errorMessage: string;
    /**
     * What type error is it e.g. MongoError
     */
    typeError?: string;

    /**
     * which method / function fires the error
     */
    method: string;

    /**
     * which class fires the error
     */
    inClass: string;
}
