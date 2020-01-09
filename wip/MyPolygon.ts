import { curveStep } from 'd3';
import * as cl from 'js-clipper';
import * as JSC from './JSClipperHelper';
import * as PGN from './polygonNamespace';
type vecFunc = (x: number, y: number) => void;
type point = [number, number];
type loop = point[];
type lp = loop;
type ctx = CanvasRenderingContext2D;
interface cmdLst {
  vertex: (x: number, y: number) => any;
  cubic: (
    c1x: number,
    c1y: number,
    c2x: number,
    c2y: number,
    x: number,
    y: number
  ) => any;
  close: () => void;
}
export class MyPolygon {
  public polygon: Array<[number, number]> = [];
  public contours: Array<Array<[number, number]>> = [];

  constructor(polygon?: loop | cl.ExPolygon | cl.PolyTree, contour?: loop[]) {
    if (!polygon) return this;
    if (polygon instanceof cl.ExPolygon) {
      this.polygon =
        JSC.fromClipperFormat((polygon as cl.ExPolygon).outer || []) || [];
      polygon = polygon as cl.ExPolygon;
      if (polygon.holes !== null && polygon.holes.length > 0) {
        polygon.holes.forEach(hole => {
          this.contours.push(JSC.fromClipperFormat(hole));
        });
      }
    } else if (polygon instanceof cl.PolyTree) {
      let ex = cl.JS.PolyTreeToExPolygons(polygon)[0];
      this.polygon = JSC.fromClipperFormat(ex.outer as cl.IntPoint[]);
      if (ex.holes !== null && ex.holes.length > 0) {
        ex.holes.forEach(hole => {
          this.contours.push(JSC.fromClipperFormat(hole));
        });
      }
    } else if ((polygon as loop).length != undefined) {
      this.polygon = polygon as loop;
    } else {
      throw new Error('Wrong Type');
    }
  }
  public isComplex() {
    return this.contours.length > 0;
  }
  public smooth(order: number, resolution: number) {
    let wk = PGN.smoothPolygon(this, order, resolution);
    this.polygon = wk.polygon;
    this.contours = wk.contours;
    return this;
  }
  public offset(ammount: number, jointype?: cl.JoinType) {
    if (!this.isComplex()) {
      this.polygon = JSC.offsetPolygon(this.polygon, ammount, jointype);
      return [this] as MyPolygon[];
    } else {
      let working: cl.ExPolygon = { outer: null, holes: null };
      working.outer = JSC.toClipperFormat(this.polygon);
      working.holes = this.contours.map(ctr => JSC.toClipperFormat(ctr));
      let amt = 1000 * ammount;
      const offset = new cl.ClipperOffset();
      let result = new cl.PolyTree();
      offset.AddPaths(
        cl.JS.ExPolygonsToPaths([working]),
        jointype || cl.JoinType.jtMiter,
        cl.EndType.etClosedPolygon
      );
      let success = offset.Execute(result, amt);
      let resEx = cl.JS.PolyTreeToExPolygons(result);
      if (!resEx[0]) {
        return [this] as MyPolygon[];
      } else {
        let wkEx = this.FromJSExPoly(resEx[0]);
        this.polygon = wkEx.polygon;
        this.contours = wkEx.contours;
        let op: MyPolygon[] = [];
        if (resEx.length > 1) {
          for (let i = 1; i < resEx.length; i++) {
            op.push(new MyPolygon(resEx[i]));
          }
        }
        return [this, ...op] as MyPolygon[];
      }
    }

    return [this];
  }
  public offsetOne(ammount: number, JoinType?: cl.JoinType) {
    return this.offset(ammount, JoinType)[0] as MyPolygon;
  }
  public draw(context: CanvasRenderingContext2D): this;
  public draw(oFunc: vecFunc, cFunc?: vecFunc): this;
  public draw(arg1: CanvasRenderingContext2D | vecFunc, arg2?: vecFunc) {
    if (typeof arg1 === 'object') {
      this._drawP5(arg1);
    } else {
      if (arg1) {
        this._drawF(arg1, arg2 as vecFunc);
      } else this._drawF(arg1 as vecFunc);
    }
    return this;
  }
  public toJSPaths() {
    let out: cl.paths = [];
    out.push(JSC.toClipperFormat(this.polygon));
    out.push(...this.contours.map(ctr => JSC.toClipperFormat(ctr)));
    return out;
  }
  public FromJSExPoly(ExPoly: cl.ExPolygon) {
    let output: { polygon: lp; contours: lp[] } = { polygon: [], contours: [] };
    output.polygon = JSC.fromClipperFormat(ExPoly.outer as cl.IntPoint[]);
    output.contours = (ExPoly.holes || []).map(hl => {
      return JSC.fromClipperFormat(hl);
    });
    return output;
  }
  private _drawP5(c: ctx) {
    c.beginPath();
    c.moveTo(this.polygon[0][0], this.polygon[0][1]);
    this.polygon.forEach(pt => c.lineTo(pt[0], pt[1]));
    c.lineTo(this.polygon[0][0], this.polygon[0][1]);
    if (this.isComplex()) {
      this.contours.forEach(contour => {
        c.moveTo(contour[0][0], contour[0][1]);

        contour.forEach(pt => c.lineTo(pt[0], pt[1]));
        c.lineTo(contour[0][0], contour[0][1]);
      });
    }
  }
  private _drawF(oFunc: vecFunc, cFunc?: vecFunc) {
    this.polygon.forEach(pt => oFunc(pt[0], pt[1]));
    if (this.isComplex() && cFunc) {
      this.contours.forEach(contour => {
        contour.forEach(pt => cFunc(...pt));
      });
    }
  }
}
