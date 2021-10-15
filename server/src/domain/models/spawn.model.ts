import { randomCirclePoint } from '../../application/services/utils/geo.service';
import { Point } from './domain.model';
import { IYokai } from './yokai.model';


export interface ISpawn {
    date: Date;
    location: Point;
    yokai: IYokai;
}

export class Spawn implements ISpawn {
    public date: Date;
    public location: Point;
    public yokai: IYokai;

    constructor(yokai: IYokai, pos: Point) {
        this.date = new Date();
        this.location = randomCirclePoint(pos, 20); // meters
        this.yokai = yokai;
    }
}
