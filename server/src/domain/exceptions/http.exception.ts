export class HttpException extends Error {
    constructor(
        public status: number,
        message?: string,
    ) {
        super(message);
    }
}
