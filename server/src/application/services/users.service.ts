import { HttpStatus, Injectable } from 'yasui';
import { HttpException, IUser } from '../../domain';
import { UserRepository } from '../../infrastructure';
import { MailerService } from './mailer.service';
import { AuthService } from './auth.service';


@Injectable()
export class UsersService {

    constructor(
        private authService: AuthService,
        private mailerService: MailerService,
        private userRepository: UserRepository,
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
}
