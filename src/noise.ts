import sm from 'simplex-noise';
let p5 = new sm();

export default class Noise {
  xCen: number;
  yCen: number;
  diam: number;
  thisFunc: (x: number, y: number) => number;
  private _isSn: boolean;
  constructor(func: (x: number, y: number) => number, diam: number);
  constructor(diam: number);
  constructor(...args: any[]) {
    if (typeof args[0] !== 'function') {
      this.thisFunc = (x: number, y: number) => p5.noise2D(x, y);
      this._isSn = true;
    } else {
      this.thisFunc = args[0];
      this._isSn = false;
    }
    this.diam = args[1];
    this.xCen = Math.floor(Math.random() * 1000);
    this.yCen = Math.floor(Math.random() * 1000);
  }
  get isSN() {
    return this._isSn;
  }
  public get(t: number) {
    let a = t * Math.PI * 2;
    let x = this.xCen + this.diam * Math.cos(a);
    let y = this.yCen + this.diam * Math.sin(a);
    return this.thisFunc(x, y);
  }
}
