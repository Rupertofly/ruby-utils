"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cl = require("js-clipper");
const lodash_1 = require("lodash");
const JSC = require("./JSClipperHelper");
const PGN = require("./polygonNamespace");
class MyPolygon {
    constructor(polygon, contour) {
        this.polygon = [];
        this.contours = [];
        if (!polygon)
            return this;
        if (polygon instanceof cl.ExPolygon) {
            this.polygon =
                JSC.fromClipperFormat(polygon.outer || []) || [];
            polygon = polygon;
            if (polygon.holes !== null && polygon.holes.length > 0) {
                polygon.holes.forEach(hole => {
                    this.contours.push(JSC.fromClipperFormat(hole));
                });
            }
        }
        else if (polygon instanceof cl.PolyTree) {
            let ex = cl.JS.PolyTreeToExPolygons(polygon)[0];
            this.polygon = JSC.fromClipperFormat(ex.outer);
            if (ex.holes !== null && ex.holes.length > 0) {
                ex.holes.forEach(hole => {
                    this.contours.push(JSC.fromClipperFormat(hole));
                });
            }
        }
        else if (lodash_1.default.isArray(polygon)) {
            this.polygon = polygon;
        }
        else {
            throw new Error('Wrong Type');
        }
    }
    isComplex() {
        return this.contours.length > 0;
    }
    smooth(order, resolution) {
        let wk = PGN.smoothPolygon(this, order, resolution);
        this.polygon = wk.polygon;
        this.contours = wk.contours;
        return this;
    }
    offset(ammount, jointype) {
        if (!this.isComplex()) {
            this.polygon = JSC.offsetPolygon(this.polygon, ammount, jointype);
            return this;
        }
        else {
            let working = { outer: null, holes: null };
            working.outer = JSC.toClipperFormat(this.polygon);
            working.holes = this.contours.map(ctr => JSC.toClipperFormat(ctr));
            let amt = 1000 * ammount;
            const offset = new cl.ClipperOffset();
            let result = new cl.PolyTree();
            offset.AddPaths(cl.JS.ExPolygonsToPaths([working]), jointype || cl.JoinType.jtMiter, cl.EndType.etClosedPolygon);
            let success = offset.Execute(result, amt);
            let resEx = cl.JS.PolyTreeToExPolygons(result);
            if (!resEx[0]) {
                return [this];
            }
            else {
                let wkEx = this.FromJSExPoly(resEx[0]);
                this.polygon = wkEx.polygon;
                this.contours = wkEx.contours;
                let op = [];
                if (resEx.length > 1) {
                    for (let i = 1; i < resEx.length; i++) {
                        op.push(new MyPolygon(resEx[i]));
                    }
                }
                return [this, ...op];
            }
        }
        return this;
    }
    draw(arg1, arg2) {
        if (typeof arg1 === 'object') {
            this._drawP5(arg1);
        }
        else {
            if (arg1) {
                this._drawF(arg1, arg2);
            }
            else
                this._drawF(arg1);
        }
        return this;
    }
    toJSPaths() {
        let out = [];
        out.push(JSC.toClipperFormat(this.polygon));
        out.push(...this.contours.map(ctr => JSC.toClipperFormat(ctr)));
        return out;
    }
    FromJSExPoly(ExPoly) {
        let output = { polygon: [], contours: [] };
        output.polygon = JSC.fromClipperFormat(ExPoly.outer);
        output.contours = (ExPoly.holes || []).map(hl => {
            return JSC.fromClipperFormat(hl);
        });
        return output;
    }
    _drawP5(c) {
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
    _drawF(oFunc, cFunc) {
        this.polygon.forEach(pt => oFunc(pt[0], pt[1]));
        if (this.isComplex() && cFunc) {
            this.contours.forEach(contour => {
                contour.forEach(pt => cFunc(...pt));
            });
        }
    }
}
exports.default = MyPolygon;
//# sourceMappingURL=MyPolygon.js.map