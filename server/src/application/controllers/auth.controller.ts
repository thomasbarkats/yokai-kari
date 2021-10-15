import { Controller, Get, HttpStatus, Query, Res, Response } from 'yasui';
import { AuthService } from '../services';


@Controller('/auth')
export class AuthController {

    constructor(
        private authService: AuthService,
    ) {}


    @Get('/')
    private async login(
        @Query('username') username: string,
        @Query('password') password: string,
        @Query('otp') twoFactorCode: string | undefined,
        @Res() res: Response
    ): Promise<void> {
        const token: string = await this.authService.getLoginToken(username, password, twoFactorCode);
        res.status(HttpStatus.OK).json({ token });
    }
}
