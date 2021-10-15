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
        this.location = { lon: 0, lat: 0 }; // TODO: Generate random location from pos;
        this.yokai = yokai;
    }
}
