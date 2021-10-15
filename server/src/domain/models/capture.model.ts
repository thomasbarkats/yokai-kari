import { Point } from './domain.model';
import { ISpawn } from './spawn.model';
import { IYokai } from './yokai.model';


export interface ICapture {
    yokai: IYokai;
    number: number;
    dates: Date[];
    locations: Point[];
}

export class Capture implements ICapture {
    public yokai: IYokai;
    public number: number;
    public dates: Date[];
    public locations: Point[];

    constructor(spawn: ISpawn) {
        this.yokai = spawn.yokai;
        this.number = 1;
        this.dates = [new Date()];
        this.locations = [spawn.location];
    }
}
