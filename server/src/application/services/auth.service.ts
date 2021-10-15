import { ConfigService, HttpStatus, Injectable } from 'yasui';
import { FormException, HttpException, IUser } from '../../domain';
import { UserRepository } from '../../infrastructure';
import { MailerService } from './mailer.service';
import { sign } from 'jsonwebtoken';
import { generate } from 'randomstring';
import { compareSync, hashSync } from 'bcrypt';
import moment from 'moment';
import { replace, toNumber } from 'lodash';


@Injectable()
export class AuthService {

    constructor(
        private mailerService: MailerService,
        private userRepository: UserRepository,
    ) {}


    public async getLoginToken(
        username: string,
        password: string,
        twoFactorCode?: string
    ): Promise<string> {
        const user: IUser = await this.userRepository.getByUsername(username);
        if (!user || !user.id) {
            throw new FormException(['username']);
        }
        twoFactorCode
            ? await this.handleLoginConfirmation(user.id, user, twoFactorCode)
            : await this.handleLogin(user.id, user, password);

        return this.generateToken(user.id, user.authKey);
    }

    public async generateTempCode(uid: string): Promise<string> {
        const tempCode: string = generate({
            length: 6,
            charset: 'numeric',
        });

        /** save an hash version of generated temp-code */ 
        const hash: string = hashSync(tempCode, 8);
        await this.userRepository.updateField(uid, 'tempCode', {
            hash,
            date: moment.utc().toDate()
        });

        /** return ux-readable version of temp-code */
        return `${tempCode.slice(0, 3)} ${tempCode.slice(3)}`;
    }


    private async handleLogin(
        uid: string,
        user: IUser,
        password: string,
    ): Promise<void> {
        if (!password || !compareSync(password, user.password)) {
            throw new FormException(['password']);
        }
        if (!user.authKey) {
            throw new HttpException(HttpStatus.FORBIDDEN, 'Unconfirmed account');
        }
        if (user['2FA']) {
            const tempCode: string = await this.generateTempCode(uid);
            await this.mailerService.send(
                user.email,
                'Login (2FA)',
                tempCode
            );
            throw new HttpException(HttpStatus.UNAUTHORIZED, '2FA code required');
        }
    }

    private async handleLoginConfirmation(
        uid: string,
        user: IUser,
        twoFactorCode: string
    ): Promise<void> {
        if (!user.tempCode || !user.tempCode.hash) {
            throw new HttpException(HttpStatus.FORBIDDEN, 'No temp-code');
        }
        if (toNumber(moment.utc()) - user.tempCode.date.getTime() > 300000) {
            /** (code expire and reset after 5 minutes) */
            this.userRepository.updateField(uid, 'tempCode', null);
            throw new HttpException(HttpStatus.FORBIDDEN, 'Expired code');
        }
        if (!compareSync(
            twoFactorCode,
            replace(user.tempCode.hash, ' ', '')
        )) {
            throw new FormException(['code']);
        }
        /** reset temp-code */
        await this.userRepository.updateField(uid, 'tempCode', null);
    }

    private async generateToken(
        uid: string,
        authKey?: string
    ): Promise<string> {
        /** renew auth-key if non-specified, or empty for registration */
        if (!authKey) {
            authKey = generate(16);
            await this.userRepository.updateField(uid, 'authKey', authKey);
        }
        return sign(
            { id: uid, authKey },
            ConfigService.get('AUTH_KEY')
        );
    }
}
