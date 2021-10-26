import { ConfigService, HttpStatus, Injectable } from 'yasui';
import { HttpException, ISpawn, IUser, IYokai, Spawn, Point, ICapture, Capture } from '../../domain';
import { UserRepository } from '../../infrastructure';
import { MailerService } from './mailer.service';
import { AuthService } from './auth.service';
import moment from 'moment';
import { cloneDeep, random, remove, toNumber, toString, uniqBy } from 'lodash';
import { distance } from './utils/geo.service';
import { YokaisService } from './yokais.service';


@Injectable()
export class UsersService {

    constructor(
        private authService: AuthService,
        private mailerService: MailerService,
        private userRepository: UserRepository,
        private yokaiService: YokaisService,
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

    public async getBestiary(uid: string): Promise<ICapture[]> {
        const user: IUser = await this.userRepository.getById(uid, ['bestiary.yokai']);
        return user.bestiary;
    }

    public async genSpawns(uid: string): Promise<ISpawn[]> {
        const user: IUser = await this.userRepository.getById(uid, ['spawns.yokai']);
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

            // eslint-disable-next-line @typescript-eslint/no-inferrable-types
            for (let i: number = 0; i < rand; i++) {
                const randYokai: IYokai = await this.yokaiService.getRandomOne();
                const genRadius: number = toNumber(ConfigService.get('GEO_RADIUS'));
                spawns.push(new Spawn(randYokai, user.location, genRadius));
            }
        }

        await this.userRepository.updateField(uid, 'spawns', spawns);
        return spawns;
    }

    public setLocation(uid: string, pos: Point): Promise<void> {
        return this.userRepository.updateField(uid, 'location', pos);
    }

    public async getNearbySpawns(uid: string): Promise<ISpawn[]> {
        const user: IUser = await this.userRepository.getById(uid, ['spawns.yokai']);
        return user.spawns.filter((spawn: ISpawn) =>
            distance(spawn.location, user.location) <= toNumber(ConfigService.get('GEO_SENSIBILITY'))
        );
    }

    public async addInBestiary(uid: string, spawns: ISpawn[]): Promise<ICapture[]> {
        const user: IUser = await this.userRepository.getById(uid, ['spawns.yokai', 'bestiary.yokai']);
        const remainingSpawns: ISpawn[] = cloneDeep(user.spawns);

        const newCaptures: ICapture[] = [];
        spawns.forEach((spawn: ISpawn) => {
            const capture: ICapture | undefined = user.bestiary.find((cap: ICapture) =>
                toString(cap.yokai.id) === toString(spawn.yokai.id)
            );
            if (capture) {
                capture.number++;
                capture.dates.push(new Date());
                capture.locations.push(spawn.location);
                newCaptures.push(capture);
            } else {
                newCaptures.push(new Capture(spawn));
            }
            remove(remainingSpawns, (sp: ISpawn) => Spawn.copy(sp).isEqual(spawn));
        });

        await this.userRepository.updateField(uid, 'spawns', remainingSpawns);
        await this.userRepository.updateField(uid, 'bestiary', uniqBy(
            [...user.bestiary, ...newCaptures],
            (cpt: ICapture) => toString(cpt.yokai),
        ));
        return newCaptures;
    }
}
