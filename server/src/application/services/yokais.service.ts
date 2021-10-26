import { sortBy } from 'lodash';
import { HttpStatus, Injectable } from 'yasui';
import { HttpException, IYokai } from '../../domain';
import { YokaiRepository } from '../../infrastructure';


@Injectable()
export class YokaisService {

    constructor(
        private yokaiRepository: YokaiRepository,
    ) {}


    public async get(id: string): Promise<IYokai> {
        const yokai: IYokai = await this.yokaiRepository.getById(id);

        if (!yokai || !yokai.id) {
            throw new HttpException(HttpStatus.NOT_FOUND, 'Yōkai not found');
        }
        return yokai;
    }

    public async getRandomOne(): Promise<IYokai> {
        const yokais: IYokai[] = sortBy(await this.yokaiRepository.getAll(), 'occurrence');
        const weights: number[] = [];

        // eslint-disable-next-line @typescript-eslint/no-inferrable-types
        for (let i: number = 0; i < yokais.length; i++) {
            weights[i] = yokais[i].occurrence + (weights[i - 1] || 0);
        }

        const rand: number = Math.random() * weights[weights.length - 1];
        return yokais[weights.findIndex((w: number) => w > rand)];
    }
}
