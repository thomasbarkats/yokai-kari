import { Document, Model, model } from 'mongoose';
import { Injection } from 'yasui';
import { IUser, IYokai } from '../../domain';
import { UserSchema } from './schemas/user.schema';
import { YokaiSchema } from './schemas/yokai.schema';


/** fix mongoose Document id type */
export interface IDocument extends Document { id?: string }

/** documents definitions */
export interface IUserDocument extends IDocument, IUser {}
export interface IYokaiDocument extends IDocument, IYokai {}


export const provideDocuments: Injection<Model<IDocument>>[] = [
    {
        token: 'USER_DOCUMENT',
        provide: model('User', UserSchema),
    },
    {
        token: 'YOKAI_DOCUMENT',
        provide: model('Yokai', YokaiSchema),
    },
];
