export class Point {
    lon: number;
    lat: number;

    constructor(lon?: number, lat?: number) {
        this.lat = lat || 0;
        this.lon = lon || 0;
    }
}
