import { trim } from 'lodash';


export interface IYokai {
    id?: string;
    name: string;
    description: string;
    occurrence: number;
    value: number;
}

export class Yokai implements IYokai {
    public id?: string;
    public name: string;
    public description: string;
    public occurrence: number;
    public value: number;

    constructor(yokai: IYokai) {
        this.name = trim(yokai.name);
        this.description = trim(yokai.description);
        this.occurrence = yokai.occurrence;
        this.value = yokai.value;
    }
}
