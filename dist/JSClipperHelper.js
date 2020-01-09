"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __importStar(require("d3"));
const cl = __importStar(require("js-clipper"));
const MyPolygon_1 = require("./MyPolygon");
function cleanPolygon(polygon, ammount) {
    let adjPoly = toClipperFormat(polygon);
    return fromClipperFormat(cl.JS.Clean(adjPoly, ammount * 10000));
}
exports.cleanPolygon = cleanPolygon;
function joinPolygons(polygons) {
    let procPoly = [];
    let isLoop = true;
    if (polygons[0].offset) {
        isLoop = false;
        polygons.forEach(pg => {
            procPoly.push(...pg.toJSPaths());
        });
    }
    else {
        // Prepare Polygons for Joining
        procPoly.push(...polygons.map(poly => {
            return toClipperFormat(poly);
        }));
    }
    // Create new Clipper
    const clipper = new cl.Clipper();
    let solution = new cl.PolyTree();
    clipper.AddPaths(procPoly, cl.PolyType.ptSubject, true);
    clipper.Execute(cl.ClipType.ctUnion, solution, cl.PolyFillType.pftEvenOdd, cl.PolyFillType.pftEvenOdd);
    let result = cl.JS.PolyTreeToExPolygons(solution);
    if (!result[0])
        return new MyPolygon_1.MyPolygon(fromClipperFormat(procPoly[0]));
    else if (result.length < 2)
        return new MyPolygon_1.MyPolygon(result[0]);
    else {
        return result
            .map(pl => new MyPolygon_1.MyPolygon(pl))
            .sort((a, b) => d3.polygonArea(a.polygon) - d3.polygonArea(b.polygon))[0];
    }
}
exports.joinPolygons = joinPolygons;
function offsetPolygon(poly, ammount, jType) {
    let adjustedPoly = toClipperFormat(poly);
    let amt = 1000 * ammount;
    const offset = new cl.ClipperOffset();
    let result = [];
    offset.AddPath(adjustedPoly, jType || cl.JoinType.jtMiter, cl.EndType.etClosedPolygon);
    let success = offset.Execute(result, amt);
    if (!result[0])
        return fromClipperFormat(adjustedPoly);
    else if (result.length < 2)
        return fromClipperFormat(result[0]);
    else {
        return result
            .map(pl => fromClipperFormat(pl))
            .sort((a, b) => d3.polygonArea(a) - d3.polygonArea(b))[0];
    }
}
exports.offsetPolygon = offsetPolygon;
function fromClipperFormat(polygon) {
    return polygon.map(pt => {
        return [pt.X / 10000, pt.Y / 10000];
    });
}
exports.fromClipperFormat = fromClipperFormat;
function toClipperFormat(polygon) {
    let thePoly = polygon.map(pt => {
        return {
            X: Math.floor(pt[0] * 10000),
            Y: Math.floor(pt[1] * 10000)
        };
    });
    return thePoly;
}
exports.toClipperFormat = toClipperFormat;
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
function clipPolygons(clipFunc, subPoly, clipPoly, clean, cleanLen) {
    let wSub = subPoly.flatMap(pol => pol.toJSPaths());
    let wClip = clipPoly.flatMap(p => p.toJSPaths());
    if (clean) {
        wSub = subPoly.flatMap(pg => {
            let wP = cl.Clipper.CleanPolygons(pg.toJSPaths(), (cleanLen || 1.5) * 10000);
            wP = cl.Clipper.SimplifyPolygons(wP, cl.PolyFillType.pftEvenOdd);
            return wP;
        });
        wClip = subPoly.flatMap(pg => {
            let wP = cl.Clipper.CleanPolygons(pg.toJSPaths(), (cleanLen || 1.5) * 10000);
            wP = cl.Clipper.SimplifyPolygons(wP, cl.PolyFillType.pftEvenOdd);
            return wP;
        });
    }
    let Clip = new cl.Clipper();
    Clip.AddPaths(wSub, cl.PolyType.ptSubject, true);
    if (wClip.length)
        Clip.AddPaths(wClip, cl.PolyType.ptClip, true);
    let solution = new cl.PolyTree();
    Clip.Execute(clipFunc, solution, cl.PolyFillType.pftEvenOdd, cl.PolyFillType.pftEvenOdd);
    let result = cl.JS.PolyTreeToExPolygons(solution).map(ep => new MyPolygon_1.MyPolygon(ep));
    return result;
}
exports.clipPolygons = clipPolygons;
