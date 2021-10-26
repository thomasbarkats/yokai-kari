import { HttpStatus, Middleware, Next, NextFunction, Param, Req, Request } from 'yasui';
import { HttpException, IAuthUser } from '../../domain';
import { AuthUser } from '../decorators.provider';


@Middleware()
export class IsUserMiddleware {

    use(
        @Req() req: Request,
        @AuthUser() user: IAuthUser,
        @Param('username') username: string,
        @Next() next: NextFunction,
    ): void {
        if (user.username !== username) {
            return next(new HttpException(HttpStatus.FORBIDDEN, 'Data are private'));
        }
        next();
    }
}
