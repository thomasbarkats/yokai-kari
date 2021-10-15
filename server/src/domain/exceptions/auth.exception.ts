import { HttpStatus } from 'yasui';
import { HttpException } from './http.exception';

export class AuthException extends HttpException {
    constructor() {
        super(HttpStatus.UNAUTHORIZED, 'Authentication failure: invalid token');
    }
}
