import { randomCirclePoint } from '../../application/services/utils/geo.service';
import { Point } from './domain.model';
import { IYokai } from './yokai.model';
import { toString } from 'lodash';


export interface ISpawn {
    date: Date;
    location: Point;
    yokai: IYokai;
}

export class Spawn implements ISpawn {
    public date: Date;
    public location: Point;
    public yokai: IYokai;

    constructor(yokai: IYokai, pos: Point, radius: number) {
        this.date = new Date();
        this.location = randomCirclePoint(pos, radius); // meters
        this.yokai = yokai;
    }

    public static copy(spawn: ISpawn): Spawn {
        const sp: Spawn = new this(spawn.yokai, new Point(), 0);
        sp.date = spawn.date;
        sp.location = spawn.location;
        return sp;
    }

    public isEqual(spawn: ISpawn): boolean {
        return (
            this.date.getTime() === spawn.date.getTime() &&
            this.location.lat === spawn.location.lat &&
            this.location.lon === spawn.location.lon &&
            toString(this.yokai.id) === toString(spawn.yokai.id)
        );
    }
}
