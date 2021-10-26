import { Body, Controller, Get, HttpStatus, Param, Post, Put, Query, Res, Response } from 'yasui';
import { AuthRequiredMiddleware, IsUserMiddleware } from '../middlewares';
import { IAuthUser, ICapture, ISpawn, IUser, User } from '../../domain';
import { UserResource } from '../resources';
import { UsersService } from '../services';
import { AuthUser } from '../decorators.provider';
import { sortBy } from 'lodash';


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
        const bestiary: ICapture[] = user.id ? await this.userService.getBestiary(user.id) : [];
        res.status(HttpStatus.OK).json(new UserResource(user, bestiary));
    }

    @Get('/:username/bestiary')
    private async getCaptures(
        @Param('username') username: string,
        @Res() res: Response
    ): Promise<void> {
        const user: IUser = await this.userService.get(username);
        const bestiary: ICapture[] = user.id ? await this.userService.getBestiary(user.id) : [];
        res.status(HttpStatus.OK).json(bestiary);
    }

    @Get('/:username/spawns', AuthRequiredMiddleware, IsUserMiddleware)
    private async genSpawns(
        @AuthUser() user: IAuthUser,
        @Res() res: Response
    ): Promise<void> {
        const spawns: ISpawn[] = await this.userService.genSpawns(user.id);
        res.status(HttpStatus.OK).json(sortBy(spawns, (spawn: ISpawn) => spawn.yokai.occurrence));
    }

    @Put('/:username/location', AuthRequiredMiddleware, IsUserMiddleware)
    private async updateLocation(
        @AuthUser() user: IAuthUser,
        @Query('lon') lon: number,
        @Query('lat') lat: number,
        @Res() res: Response
    ): Promise<void> {
        await this.userService.setLocation(user.id, { lon, lat });
        const reachedSpawns: ISpawn[] = await this.userService.getNearbySpawns(user.id);
        res.status(HttpStatus.OK).json(reachedSpawns);
    }

    @Put('/:username/bestiary', AuthRequiredMiddleware, IsUserMiddleware)
    private async capture(
        @AuthUser() user: IAuthUser,
        @Res() res: Response
    ): Promise<void> {
        const reachedSpawns: ISpawn[] = await this.userService.getNearbySpawns(user.id);
        const captures: ICapture[] = await this.userService.addInBestiary(user.id, reachedSpawns);
        res.status(HttpStatus.CREATED).json(captures);
    }
}
