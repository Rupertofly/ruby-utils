export default class Noise {
    xCen: number;
    yCen: number;
    diam: number;
    thisFunc: (x: number, y: number) => number;
    private _isSn;
    constructor(func: (x: number, y: number) => number, diam: number);
    constructor(diam: number);
    readonly isSN: boolean;
    get(t: number): number;
}
