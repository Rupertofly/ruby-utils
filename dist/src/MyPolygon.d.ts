import * as cl from 'js-clipper';
declare type vecFunc = (x: number, y: number) => void;
declare type point = [number, number];
declare type loop = point[];
export default class MyPolygon {
    polygon: Array<[number, number]>;
    contours: Array<Array<[number, number]>>;
    constructor(polygon?: loop | cl.ExPolygon | cl.PolyTree, contour?: loop[]);
    isComplex(): boolean;
    smooth(order: number, resolution: number): this;
    offset(ammount: number, jointype?: cl.JoinType): this | MyPolygon[];
    draw(context: CanvasRenderingContext2D): this;
    draw(oFunc: vecFunc, cFunc?: vecFunc): this;
    toJSPaths(): any;
    FromJSExPoly(ExPoly: cl.ExPolygon): {
        polygon: [number, number][];
        contours: [number, number][][];
    };
    private _drawP5;
    private _drawF;
}
export {};
