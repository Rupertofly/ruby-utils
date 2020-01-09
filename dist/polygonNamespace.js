"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __importStar(require("d3"));
const lodash_1 = __importDefault(require("lodash"));
const bSpline_1 = require("./bSpline");
const MyPolygon_1 = require("./MyPolygon");
const bSpline = bSpline_1.interpolate;
function sqr(x) {
    return x * x;
}
function dist2(v, w) {
    return sqr(v[0] - w[0]) + sqr(v[1] - w[1]);
}
function distToSegmentSquared(p, v, w) {
    const l2 = dist2(v, w);
    if (l2 === 0)
        return dist2(p, v);
    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]);
}
/**
 * Returns Distance betweeen a point and a line
 *
 * @param {[Number,Number]} origin Point
 * @param {[Number,Number]} first line vertice
 * @param {[Number,Number]} second line vertice
 * @returns {Number} Distance
 */
function distToSegment(p, v, w) {
    return Math.sqrt(distToSegmentSquared(p, v, w));
}
exports.distToSegment = distToSegment;
/**
 * Returns the minimum distance between the centroid of a polygon and an edge
 *
 * @param {[Number, Number][]} poly polygon
 *
 */
function getMinDist(poly) {
    const c = d3.polygonCentroid(poly);
    const r = lodash_1.default.range(poly.length).map(i => {
        const thisP = poly[i];
        const nextP = poly[(i + 1) % poly.length];
        return distToSegment(c, thisP, nextP);
    });
    return Math.min(...r);
}
exports.getMinDist = getMinDist;
function smoothBSpline(polygon, order, resolution) {
    let output = [];
    let polygonAdjusted = [
        ...polygon,
        ...polygon.slice(0, Math.min(order, polygon.length - 1))
    ];
    for (let t = 0; t < 1; t += 1 / resolution) {
        output.push(bSpline(t, Math.min(order, polygon.length - 1), polygonAdjusted));
    }
    return output;
}
exports.smoothBSpline = smoothBSpline;
function smoothPolygon(polygon, order, resolution) {
    if (lodash_1.default.isArray(polygon[0])) {
        return smoothBSpline(polygon, order, resolution);
    }
    else if (polygon.isComplex) {
        let outPoly = new MyPolygon_1.MyPolygon();
        outPoly.polygon = smoothBSpline(polygon.polygon, order, resolution);
        outPoly.contours = polygon.contours.map(ctr => {
            return smoothBSpline(ctr, order, resolution);
        });
        return outPoly;
    }
    else {
        throw new Error('wat');
    }
}
exports.smoothPolygon = smoothPolygon;
