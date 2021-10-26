import { get, isObject, map } from 'lodash';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Injectable } from 'yasui';
import { FormException } from '../../../domain';
import { IDocument } from '../documents.provider';


/**
 * @param D mongoose Document
 * @param M model of domain object
*/
@Injectable()
export class DomainRepository<D extends IDocument & M, M> {

    constructor(
        private document: Model<D>,
    ) {}

    public async getById(id: string, populate?: string[]): Promise<M> {
        const doc: D | null = await this.document
            .findById(id)
            .populate(populate)
            .exec();

        return doc as M;
    }

    public async getAll(populate?: string[]): Promise<M[]> {
        const docs: D[] = await this.document
            .find()
            .populate(populate)
            .exec();

        return map(docs, (doc: D) => doc as M);
    }

    public async save(model: M): Promise<M> {
        try {
            const doc: D = await new this.document(model).save() as D;
            return doc as M;
        } catch (err) {
            if (err.code === 11000) {
                /** mongo duplicate key error */
                throw new FormException(Object.keys(err.keyPattern), true);
            }
            if (isObject(err.errors)) {
                /** mongoose schema format validation failed */
                throw new FormException(Object.keys(err.errors));
            }
            throw err;
        }
    }

    public async updateField<T>(
        id: string,
        field: string,
        value: T
    ): Promise<void> {
        const filter: FilterQuery<D> = { _id: id } as FilterQuery<D>;
        const query: UpdateQuery<D> = { $set: { [field]: value }} as UpdateQuery<D>;

        await this.document
            .updateOne(filter, query)
            .exec();
    }

    public async getRelation<T>(id: string, field: string, isMap?: boolean): Promise<T> {
        const document: D | null = await this.document
            .findById(id, { [field]: 1 })
            .populate(field + (isMap ? '.$*' : ''))
            .exec();

        return get(document, field);
    }

    public async update(id: string, updateQuery: UpdateQuery<D>): Promise<void> {
        try {
            const filter: FilterQuery<D> = { _id: id } as FilterQuery<D>;
            await this.document
                .updateOne(
                    filter,
                    updateQuery, 
                    { runValidators: true }
                )
                .exec();

        } catch (err) {
            if (err.code === 11000) {
                /** mongo duplicate key error */
                throw new FormException(Object.keys(err.keyPattern), true);
            }
            if (isObject(err.errors)) {
                /** mongoose schema format validation failed */
                throw new FormException(Object.keys(err.errors));
            }
            throw err;
        }
    }
}
