import { Middleware, Next, NextFunction, Req, Request } from 'yasui';
import { AuthException, IAuthUser, IUser } from '../../domain';
import { UserRepository } from '../../infrastructure';
import { AuthUser } from '../decorators.provider';
import { set } from 'lodash';


@Middleware()
export class AuthRequiredMiddleware {

    constructor(
        private userRepository: UserRepository,
    ) {}


    async use(
        @Req() req: Request,
        @AuthUser() userFromToken: IAuthUser,
        @Next() next: NextFunction,
    ): Promise<void> {
        if (!userFromToken || !userFromToken.id || !userFromToken.authKey) {
            return next(new AuthException());
        }
        const user: IUser = await this.userRepository.getByAuthKey(
            userFromToken.id,
            userFromToken.authKey
        );
        if (!user) {
            return next(new AuthException());
        }
        set(req, 'user', user);
        next();
    }
}
