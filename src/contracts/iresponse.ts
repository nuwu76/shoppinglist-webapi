export interface IResponse {
    ok: boolean;
    /**
     * How many documents were stored, updated or deleted
     */
    countDocument?: number;
    /**
     * a readable spelling error message
     */
    errorMessage?: string;
    /**
     * a single Object
     */
    document?: Object;

    /**
     * many objects
     */
    documents?: Array<Object>;

    /**
     * JWT
     */
    token?: string;
}
