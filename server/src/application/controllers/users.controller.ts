import { Body, Controller, Get, HttpStatus, Param, Post, Put, Query, Res, Response } from 'yasui';
import { AuthRequiredMiddleware } from '../middlewares/auth-required.middleware';
import { IAuthUser, ICapture, ISpawn, IUser, User } from '../../domain';
import { UserResource } from '../resources';
import { UsersService } from '../services';
import { AuthUser } from '../decorators.provider';


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
    private async getProfile(
        @Param('username') username: string,
        @Res() res: Response
    ): Promise<void> {
        const user: IUser = await this.userService.get(username);
        res.status(HttpStatus.OK).json(
            new UserResource(user)
        );
    }

    @Get('/:username/bestiary')
    private async getCaptures(
        @Param('username') username: string,
        @Res() res: Response
    ): Promise<void> {
        const user: IUser = await this.userService.get(username);
        res.status(HttpStatus.OK).json(user.bestiary);
    }

    @Get('/:username/spawns', AuthRequiredMiddleware)
    private async genSpawns(
        @AuthUser() user: IAuthUser,
        @Param('username') username: string,
        @Res() res: Response
    ): Promise<void> {
        if (user.username !== username) {
            res.status(HttpStatus.FORBIDDEN);
        }
        const spawns: ISpawn[] = await this.userService.genSpawns(user.id);
        res.status(HttpStatus.OK).json(spawns);
    }

    @Put('/:username/location', AuthRequiredMiddleware)
    private async updateLocation(
        @AuthUser() user: IAuthUser,
        @Param('username') username: string,
        @Query('lon') lon: number,
        @Query('lat') lat: number,
        @Res() res: Response
    ): Promise<void> {
        if (user.username !== username) {
            res.status(HttpStatus.FORBIDDEN);
        }
        await this.userService.setLocation(user.id, { lon, lat });
        const reachedSpawns: ISpawn[] = await this.userService.getNearbySpawns(user.id);
        res.status(HttpStatus.OK).json(reachedSpawns);
    }

    @Put('/:username/bestiary', AuthRequiredMiddleware)
    private async capture(
        @AuthUser() user: IAuthUser,
        @Param('username') username: string,
        @Res() res: Response
    ): Promise<void> {
        if (user.username !== username) {
            res.status(HttpStatus.FORBIDDEN);
        }
        const reachedSpawns: ISpawn[] = await this.userService.getNearbySpawns(user.id);
        const captures: ICapture[] = await this.userService.addInBestiary(user.id, reachedSpawns);
        res.status(HttpStatus.CREATED).json(captures);
    }
}
