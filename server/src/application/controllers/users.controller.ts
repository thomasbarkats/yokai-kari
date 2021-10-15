import { Body, Controller, Get, HttpStatus, Param, Post, Res, Response } from 'yasui';
import { IUser, User } from '../../domain';
import { UserResource } from '../resources';
import { UsersService } from '../services';


@Controller('/users')
export class UsersController {

    constructor(
        private userService: UsersService,
    ) { }


    @Post('/')
    private async register(
        @Body() input: IUser,
        @Res() res: Response
    ): Promise<void> {
        /** cast input to ensure data formatting & domain level validation */
        const user: IUser = new User(input);

        await this.userService.register(user);
        res.sendStatus(HttpStatus.CREATED);
    }


    @Get('/:username')
    private async getPublicProfile(
        @Param('username') username: string,
        @Res() res: Response
    ): Promise<void> {
        const user: IUser = await this.userService.get(username);
        res.status(HttpStatus.OK).json(
            new UserResource(user)
        );
    }
}
