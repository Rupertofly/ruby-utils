import * as cl from 'js-clipper';
import MyPolygon from './MyPolygon';
import { lp } from './utils';
export declare function cleanPolygon(polygon: lp, ammount: number): [number, number][];
export declare function joinPolygons<T extends Array<lp | MyPolygon>>(polygons: T): any;
export declare function offsetPolygon(poly: lp, ammount: number, jType?: cl.JoinType): lp;
export declare function fromClipperFormat(polygon: cl.IntPoint[]): lp;
export declare function toClipperFormat(polygon: lp): {
    X: number;
    Y: number;
}[];
/**
 * clip polygons using js-clipper
 *
 * @export
 * @param {cl.ClipType} clipFunc clip type to use
 * @param {MyPolygon[]} subPoly subject polygons
 * @param {MyPolygon[]} clipPoly clipping polygons, use empty array for union
 * @param {boolean} [clean] clean and simplify before clipping
 * @param {number} [cleanLen] amount to clean by
 * @returns {MyPolygon[]} result
 */
export declare function clipPolygons(clipFunc: cl.ClipType, subPoly: MyPolygon[], clipPoly: MyPolygon[], clean?: boolean, cleanLen?: number): MyPolygon[];
