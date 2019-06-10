"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cl = require("js-clipper");
var lodash_1 = require("lodash");
var JSC = require("./JSClipperHelper");
var PGN = require("./polygonNamespace");
var MyPolygon = /** @class */ (function () {
    function MyPolygon(polygon, contour) {
        var _this = this;
        this.polygon = [];
        this.contours = [];
        if (!polygon)
            return this;
        if (polygon instanceof cl.ExPolygon) {
            this.polygon =
                JSC.fromClipperFormat(polygon.outer || []) || [];
            polygon = polygon;
            if (polygon.holes !== null && polygon.holes.length > 0) {
                polygon.holes.forEach(function (hole) {
                    _this.contours.push(JSC.fromClipperFormat(hole));
                });
            }
        }
        else if (polygon instanceof cl.PolyTree) {
            var ex = cl.JS.PolyTreeToExPolygons(polygon)[0];
            this.polygon = JSC.fromClipperFormat(ex.outer);
            if (ex.holes !== null && ex.holes.length > 0) {
                ex.holes.forEach(function (hole) {
                    _this.contours.push(JSC.fromClipperFormat(hole));
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
    MyPolygon.prototype.isComplex = function () {
        return this.contours.length > 0;
    };
    MyPolygon.prototype.smooth = function (order, resolution) {
        var wk = PGN.smoothPolygon(this, order, resolution);
        this.polygon = wk.polygon;
        this.contours = wk.contours;
        return this;
    };
    MyPolygon.prototype.offset = function (ammount, jointype) {
        if (!this.isComplex()) {
            this.polygon = JSC.offsetPolygon(this.polygon, ammount, jointype);
            return this;
        }
        else {
            var working = { outer: null, holes: null };
            working.outer = JSC.toClipperFormat(this.polygon);
            working.holes = this.contours.map(function (ctr) { return JSC.toClipperFormat(ctr); });
            var amt = 1000 * ammount;
            var offset = new cl.ClipperOffset();
            var result = new cl.PolyTree();
            offset.AddPaths(cl.JS.ExPolygonsToPaths([working]), jointype || cl.JoinType.jtMiter, cl.EndType.etClosedPolygon);
            var success = offset.Execute(result, amt);
            var resEx = cl.JS.PolyTreeToExPolygons(result);
            if (!resEx[0]) {
                return [this];
            }
            else {
                var wkEx = this.FromJSExPoly(resEx[0]);
                this.polygon = wkEx.polygon;
                this.contours = wkEx.contours;
                var op = [];
                if (resEx.length > 1) {
                    for (var i = 1; i < resEx.length; i++) {
                        op.push(new MyPolygon(resEx[i]));
                    }
                }
                return [this].concat(op);
            }
        }
        return this;
    };
    MyPolygon.prototype.draw = function (arg1, arg2) {
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
    };
    MyPolygon.prototype.toJSPaths = function () {
        var out = [];
        out.push(JSC.toClipperFormat(this.polygon));
        out.push.apply(out, this.contours.map(function (ctr) { return JSC.toClipperFormat(ctr); }));
        return out;
    };
    MyPolygon.prototype.FromJSExPoly = function (ExPoly) {
        var output = { polygon: [], contours: [] };
        output.polygon = JSC.fromClipperFormat(ExPoly.outer);
        output.contours = (ExPoly.holes || []).map(function (hl) {
            return JSC.fromClipperFormat(hl);
        });
        return output;
    };
    MyPolygon.prototype._drawP5 = function (c) {
        c.beginPath();
        c.moveTo(this.polygon[0][0], this.polygon[0][1]);
        this.polygon.forEach(function (pt) { return c.lineTo(pt[0], pt[1]); });
        c.lineTo(this.polygon[0][0], this.polygon[0][1]);
        if (this.isComplex()) {
            this.contours.forEach(function (contour) {
                c.moveTo(contour[0][0], contour[0][1]);
                contour.forEach(function (pt) { return c.lineTo(pt[0], pt[1]); });
                c.lineTo(contour[0][0], contour[0][1]);
            });
        }
    };
    MyPolygon.prototype._drawF = function (oFunc, cFunc) {
        this.polygon.forEach(function (pt) { return oFunc(pt[0], pt[1]); });
        if (this.isComplex() && cFunc) {
            this.contours.forEach(function (contour) {
                contour.forEach(function (pt) { return cFunc.apply(void 0, pt); });
            });
        }
    };
    return MyPolygon;
}());
exports.default = MyPolygon;
