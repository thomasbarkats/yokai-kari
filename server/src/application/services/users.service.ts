import { ConfigService, HttpStatus, Injectable } from 'yasui';
import { HttpException, ISpawn, IUser, IYokai, Spawn, Point } from '../../domain';
import { UserRepository, YokaiRepository } from '../../infrastructure';
import { MailerService } from './mailer.service';
import { AuthService } from './auth.service';
import moment from 'moment';
import { random, toNumber } from 'lodash';
import { distance } from './utils/geo.service';


@Injectable()
export class UsersService {

    constructor(
        private authService: AuthService,
        private mailerService: MailerService,
        private userRepository: UserRepository,
        private yokaiRepository: YokaiRepository,
    ) {}


    public async register(user: IUser): Promise<IUser> {
        const saved: IUser = await this.userRepository.save(user);
        /** (data validation managed at mongo level) */

        if (!saved || !saved.id) {
            throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, 'Registration failure');
        }
        const validationCode: string = await this.authService.generateTempCode(saved.id);
        await this.mailerService.send(
            saved.email,
            'Confirm registration',
            validationCode
        );
        return saved;
    }

    public async get(username: string): Promise<IUser> {
        const user: IUser = await this.userRepository.getByUsername(username);

        if (!user || !user.id) {
            throw new HttpException(HttpStatus.NOT_FOUND, 'User not found');
        }
        return user;
    }

    public async genSpawns(uid: string): Promise<ISpawn[]> {
        const user: IUser = await this.userRepository.getById(uid);
        const spawns: ISpawn[] = [];

        // Keep non-expired spawns
        const validSpawns: ISpawn[] = user.spawns.filter((spawn: ISpawn) => {
            const randLifetime: number = random(
                toNumber(ConfigService.get('MIN_SPAWN_LIFETIME')),
                toNumber(ConfigService.get('MAX_SPAWN_LIFETIME'))
            ); // hours
            const expiration: Date = moment(spawn.date).add(randLifetime, 'h').toDate();
            return new Date() < expiration;
        });
        spawns.push(...validSpawns);

        // Generate new spawns if needed
        const gap: number = toNumber(ConfigService.get('MAX_GEN_SPAWNS')) - spawns.length;
        if (gap > 0) {
            const min: number = toNumber(ConfigService.get('MIN_GEN_SPAWNS'));
            const rand: number = random(gap - min < 0 ? 0 : min, gap);

            const mockupYokai: IYokai = await this.yokaiRepository.getById('61697e9483118085e78a9286');

            new Array(rand).fill(0).forEach(() => {
                const randYokai: IYokai = mockupYokai; // TODO: Call Yokai service to get random one
                spawns.push(new Spawn(randYokai, user.location));
            });
        }

        await this.userRepository.updateField(uid, 'spawns', spawns);
        return spawns;
    }

    public setLocation(uid: string, pos: Point): Promise<void> {
        return this.userRepository.updateField(uid, 'location', pos);
    }

    public async getCloseSpawns(uid: string): Promise<ISpawn[]> {
        const user: IUser = await this.userRepository.getById(uid);
        return user.spawns.filter((spawn: ISpawn) =>
            distance(spawn.location, user.location) <= toNumber(ConfigService.get('GEO_SENSIBILITY'))
        );
    }
}
