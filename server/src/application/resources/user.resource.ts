import { map, sum } from 'lodash';
import { ICapture, IUser } from '../../domain';


export interface IUserResource {
    email: string;
    username: string;
    date?: Date;
    score: number;
}

export class UserResource implements IUserResource {
    public email: string;
    public username: string;
    public date?: Date;
    public score: number;

    constructor(user: IUser, bestiary?: ICapture[]) {
        this.email = user.email;
        this.username = user.username;
        this.date = user.date;
        this.score = sum(map(bestiary, (capture: ICapture) => capture.yokai.value * capture.number)) || 0;
    }
}
