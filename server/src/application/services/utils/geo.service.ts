/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/typedef */

import { Point } from '../../../domain/models/domain.model';


const EARTH_RADIUS = 6371000; // meters
const DEG_TO_RAD = Math.PI / 180.0;
const THREE_PI = Math.PI * 3;
const TWO_PI = Math.PI * 2;

const toRadians = (deg: number) => deg * DEG_TO_RAD;
const toDegrees = (rad: number) => rad / DEG_TO_RAD;


// Returns a random point that is on the circumference defined by C and R.
const randomCircumferencePoint = (
    centerPoint: Point,
    radius: number,
    randomFn = Math.random
): Point => {
    const sinLat = Math.sin(toRadians(centerPoint.lat));
    const cosLat = Math.cos(toRadians(centerPoint.lat));

    // Random bearing (direction out 360 degrees)
    const bearing = randomFn() * TWO_PI;
    const sinBearing = Math.sin(bearing);
    const cosBearing = Math.cos(bearing);

    // Theta is the approximated angular distance
    const theta = radius / EARTH_RADIUS;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    let rLatitude, rLongitude;
    // eslint-disable-next-line prefer-const
    rLatitude = Math.asin(sinLat * cosTheta + cosLat * sinTheta * cosBearing);

    rLongitude =
        toRadians(centerPoint.lon) +
        Math.atan2(
            sinBearing * sinTheta * cosLat,
            cosTheta - sinLat * Math.sin(rLatitude)
        );

    // Normalize longitude L such that -PI < L < +PI
    rLongitude = ((rLongitude + THREE_PI) % TWO_PI) - Math.PI;

    return { lat: toDegrees(rLatitude), lon: toDegrees(rLongitude) };
};

// Returns a random point that is inside the circle defined by C and R
export const randomCirclePoint = (
    centerPoint: Point,
    radius: number,
    randomFn = Math.random
): Point => {
    return randomCircumferencePoint(
        centerPoint,
        Math.sqrt(randomFn()) * radius,
        randomFn
    );
};

// Returns the distance in meters between two points P1 and P2
export const distance = (P1: Point, P2: Point): number => {
    const rP1 = {
        latitude: toRadians(P1.lat),
        longitude: toRadians(P1.lon),
    };
    const rP2 = {
        latitude: toRadians(P2.lat),
        longitude: toRadians(P2.lon),
    };

    const D = {
        latitude: Math.sin((rP2.latitude - rP1.latitude) / 2),
        longitude: Math.sin((rP2.longitude - rP1.longitude) / 2),
    };

    const A =
        D.latitude * D.latitude +
        D.longitude * D.longitude * Math.cos(rP1.latitude) * Math.cos(rP2.latitude);

    const C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));

    return EARTH_RADIUS * C;
};
