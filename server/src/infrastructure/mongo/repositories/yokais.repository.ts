import { Model } from 'mongoose';
import { Inject, Injectable } from 'yasui';
import { IYokai } from '../../../domain';
import { IYokaiDocument } from '../documents.provider';
import { DomainRepository } from './domain.repository';


@Injectable()
export class YokaiRepository extends DomainRepository<IYokaiDocument, IYokai> {

    constructor(
        @Inject('YOKAI_DOCUMENT') private yokaiDocument: Model<IYokaiDocument>,
    ) {
        super(yokaiDocument);
    }
}
