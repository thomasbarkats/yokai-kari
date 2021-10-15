import { IUser } from '../../domain';


export interface IUserResource {
    email: string;
    username: string;
    date?: Date;
}

export class UserResource implements IUserResource {
    public email: string;
    public username: string;
    public date?: Date;

    constructor(user: IUser) {
        this.email = user.email;
        this.username = user.username;
        this.date = user.date;
    }
}
