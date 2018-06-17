import * as nodemailer from 'nodemailer';
import { IError } from '../contracts/ierror';
const config = require('../config/config.json');

export class ErrorLog {
    public _isError: boolean;

    private _error: IError;

    private _transporter: any;

    constructor() {
        this._isError = false;

        this._error = {
            code: -1,
            errorMessage: '',
            method: '',
            inClass: ''
        };

        this._transporter = nodemailer.createTransport(config.mail.smtp);
    }

    setError(error: IError) {
        this._error = error;
        this._isError = true;

        this.sendMail();
    }

    private async sendMail() {
        const mailOptions = config.mail.mailOptions;
        mailOptions.html = `
        <table>
            <tr>
                <td> Class </td>
                <td>&nbsp;</td>
                <td> ${this._error.inClass} - </td>
            </tr>
            <tr>
                <td> Function </td>
                <td>&nbsp;</td>
                <td> ${this._error.method} - </td>
            </tr>
            <tr>
                <td> name </td>
                <td>&nbsp;</td>
                <td> ${this._error.typeError} </td>
            </tr>
            <tr>
                <td> code </td>
                <td>&nbsp;</td>
                <td> ${this._error.code} </td>
            </tr>
            <tr>
                <td> errorMessage </td>
                <td>&nbsp;</td>
                <td> ${this._error.errorMessage} </td>
            </tr>
        </table>                       
            `;

        const result = await this._transporter.sendMail(mailOptions);
        if (result.error) {
            console.error(result.error);
        }
    }

    /**
     * get the error message for response in a readable spelling
     */
    getErrorMessageResponse(): string {
        let errorMessage: string = '';
        if (this._isError) {
            switch (this._error.code) {
                case 11000:
                    errorMessage = 'Username and / or E-Mail exists';
                    break;

                default:
                    errorMessage = 'Unknown Error';
            }
        }

        return errorMessage;
    }
}
