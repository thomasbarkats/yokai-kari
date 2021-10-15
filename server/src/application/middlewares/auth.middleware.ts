import { set, split } from 'lodash';
import { verify } from 'jsonwebtoken';
import { ConfigService, Header, Middleware, Next, NextFunction, Req, Request } from 'yasui';


@Middleware()
export class AuthMiddleware {

    /** enrich query with user infos from provided token */
    use(
        @Header('authorization') auth: string,
        @Req() req: Request,
        @Next() next: NextFunction,
    ): void {
        const authInfo: string[] = split(auth, ' ');
        try {
            if (authInfo[0] === 'JWT') {
                set(req, 'user', verify(authInfo[1], ConfigService.get('AUTH_KEY')));
            }
        } catch (err) {
            set(req, 'user', undefined);
        }
        next();
    }
}
