import { hashSync } from 'bcryptjs';
import { toLower, trim } from 'lodash';
import { FormException } from '../exceptions';
import { ICapture } from './capture.model';
import { Point } from './domain.model';
import { ISpawn } from './spawn.model';


export interface IUser {
    id?: string;
    authKey?: string;
    tempCode?: {
        hash: string;
        date: Date;
    };
    date?: Date;
    email: string;
    password: string,
    username: string;
    '2FA': boolean;
    location: Point;
    bestiary: ICapture[];
    spawns: ISpawn[];
}

export interface IAuthUser extends IUser {
    id: string;
}

export class User implements IUser {
    public id?: string;
    public authKey?: string;
    public tempCode?: {
        hash: string;
        date: Date;
    };
    public date?: Date;
    public email: string;
    public password: string;
    public username: string;
    public '2FA': boolean;
    public location: Point;
    public bestiary: ICapture[];
    public spawns: ISpawn[];

    constructor(user: IUser) {
        if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(user.password)) {
            throw new FormException(['password']);
        }
        this.email = trim(toLower(user.email));
        this.password = hashSync(user.password, 10);
        this.username = trim(toLower(user.username));
        this.location = { lon: 0, lat: 0 };
        this.bestiary = [];
        this.spawns = [];
    }
}
