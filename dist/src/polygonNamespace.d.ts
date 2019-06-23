import { MyPolygon } from './MyPolygon';
import { lp, point } from './utils';
declare type loop = lp;
/**
 * Returns Distance betweeen a point and a line
 *
 * @param {[Number,Number]} origin Point
 * @param {[Number,Number]} first line vertice
 * @param {[Number,Number]} second line vertice
 * @returns {Number} Distance
 */
export declare function distToSegment(p: point, v: point, w: point): number;
/**
 * Returns the minimum distance between the centroid of a polygon and an edge
 *
 * @param {[Number, Number][]} poly polygon
 *
 */
export declare function getMinDist(poly: point[]): number;
export declare function smoothBSpline(polygon: loop, order: number, resolution: number): [number, number][];
export declare function smoothPolygon<T extends loop | MyPolygon>(polygon: T, order: number, resolution: number): T;
export {};
