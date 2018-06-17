export interface IUser {
    username: string;
    passwordSalt: string;
    passwordHash: string;
    email: string;
    // String dates which will be stored in the yyyy-mm-dd hh:mm:ss format
    created?: string;
    updated?: string;
    lastLogin?: string;
}
