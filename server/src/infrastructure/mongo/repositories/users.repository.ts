import { Model } from 'mongoose';
import { Inject, Injectable } from 'yasui';
import { IUser } from '../../../domain';
import { Point } from '../../../domain/models/domain.model';
import { IUserDocument } from '../documents.provider';
import { DomainRepository } from './domain.repository';


@Injectable()
export class UserRepository extends DomainRepository<IUserDocument, IUser> {

    constructor(
        @Inject('USER_DOCUMENT') private userDocument: Model<IUserDocument>,
    ) {
        super(userDocument);
    }


    public async getByUsername(username: string): Promise<IUser> {
        const doc: IUserDocument | null = await this.userDocument
            .findOne({
                $or: [
                    { username },
                    { email: username }
                ]
            })
            .exec();
        return doc as IUser;
    }

    public async getByAuthKey(id: string, authKey: string): Promise<IUser> {
        const doc: IUserDocument | null = await this.userDocument
            .findOne({
                _id: id,
                authKey,
            })
            .exec();
        return doc as IUser;
    }
}
