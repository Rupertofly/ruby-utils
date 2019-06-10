"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("d3");
var cl = require("js-clipper");
var MyPolygon_1 = require("./MyPolygon");
function cleanPolygon(polygon, ammount) {
    var adjPoly = toClipperFormat(polygon);
    return fromClipperFormat(cl.JS.Clean(adjPoly, ammount * 10000));
}
exports.cleanPolygon = cleanPolygon;
function joinPolygons(polygons) {
    var procPoly = [];
    var isLoop = true;
    if (polygons[0].offset) {
        isLoop = false;
        polygons.forEach(function (pg) {
            procPoly.push.apply(procPoly, pg.toJSPaths());
        });
    }
    else {
        // Prepare Polygons for Joining
        procPoly.push.apply(procPoly, polygons.map(function (poly) {
            return toClipperFormat(poly);
        }));
    }
    // Create new Clipper
    var clipper = new cl.Clipper();
    var solution = new cl.PolyTree();
    clipper.AddPaths(procPoly, cl.PolyType.ptSubject, true);
    clipper.Execute(cl.ClipType.ctUnion, solution, cl.PolyFillType.pftEvenOdd, cl.PolyFillType.pftEvenOdd);
    var result = cl.JS.PolyTreeToExPolygons(solution);
    if (!result[0])
        return new MyPolygon_1.default(fromClipperFormat(procPoly[0]));
    else if (result.length < 2)
        return new MyPolygon_1.default(result[0]);
    else {
        return result
            .map(function (pl) { return new MyPolygon_1.default(pl); })
            .sort(function (a, b) { return d3.polygonArea(a.polygon) - d3.polygonArea(b.polygon); })[0];
    }
}
exports.joinPolygons = joinPolygons;
function offsetPolygon(poly, ammount, jType) {
    var adjustedPoly = toClipperFormat(poly);
    var amt = 1000 * ammount;
    var offset = new cl.ClipperOffset();
    var result = [];
    offset.AddPath(adjustedPoly, jType || cl.JoinType.jtMiter, cl.EndType.etClosedPolygon);
    var success = offset.Execute(result, amt);
    if (!result[0])
        return fromClipperFormat(adjustedPoly);
    else if (result.length < 2)
        return fromClipperFormat(result[0]);
    else {
        return result
            .map(function (pl) { return fromClipperFormat(pl); })
            .sort(function (a, b) { return d3.polygonArea(a) - d3.polygonArea(b); })[0];
    }
}
exports.offsetPolygon = offsetPolygon;
function fromClipperFormat(polygon) {
    return polygon.map(function (pt) {
        return [pt.X / 10000, pt.Y / 10000];
    });
}
exports.fromClipperFormat = fromClipperFormat;
function toClipperFormat(polygon) {
    var thePoly = polygon.map(function (pt) {
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
    var wSub = subPoly.flatMap(function (pol) { return pol.toJSPaths(); });
    var wClip = clipPoly.flatMap(function (p) { return p.toJSPaths(); });
    if (clean) {
        wSub = subPoly.flatMap(function (pg) {
            var wP = cl.Clipper.CleanPolygons(pg.toJSPaths(), (cleanLen || 1.5) * 10000);
            wP = cl.Clipper.SimplifyPolygons(wP, cl.PolyFillType.pftEvenOdd);
            return wP;
        });
        wClip = subPoly.flatMap(function (pg) {
            var wP = cl.Clipper.CleanPolygons(pg.toJSPaths(), (cleanLen || 1.5) * 10000);
            wP = cl.Clipper.SimplifyPolygons(wP, cl.PolyFillType.pftEvenOdd);
            return wP;
        });
    }
    var Clip = new cl.Clipper();
    Clip.AddPaths(wSub, cl.PolyType.ptSubject, true);
    if (wClip.length)
        Clip.AddPaths(wClip, cl.PolyType.ptClip, true);
    var solution = new cl.PolyTree();
    Clip.Execute(clipFunc, solution, cl.PolyFillType.pftEvenOdd, cl.PolyFillType.pftEvenOdd);
    var result = cl.JS.PolyTreeToExPolygons(solution).map(function (ep) { return new MyPolygon_1.default(ep); });
    return result;
}
exports.clipPolygons = clipPolygons;
