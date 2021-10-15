import { HttpStatus } from 'yasui';
import { HttpException } from './http.exception';

export class FormException extends HttpException {
    public fields: string[];

    constructor(
        fields: string[],
        conflict?: boolean,
    ) {
        super(
            conflict ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST,
            'Missing or invalid field(s)'
        );
        this.fields = fields;
    }
}
