import * as d3 from 'd3';
import _ from 'lodash';
import bSpline from './bSpline';
import MyPolygon from './MyPolygon';
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
export function distToSegment(p, v, w) {
    return Math.sqrt(distToSegmentSquared(p, v, w));
}
/**
 * Returns the minimum distance between the centroid of a polygon and an edge
 *
 * @param {[Number, Number][]} poly polygon
 *
 */
export function getMinDist(poly) {
    const c = d3.polygonCentroid(poly);
    const r = _.range(poly.length).map(i => {
        const thisP = poly[i];
        const nextP = poly[(i + 1) % poly.length];
        return distToSegment(c, thisP, nextP);
    });
    return Math.min(...r);
}
export function smoothBSpline(polygon, order, resolution) {
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
export function smoothPolygon(polygon, order, resolution) {
    if (_.isArray(polygon[0])) {
        return smoothBSpline(polygon, order, resolution);
    }
    else if (polygon.isComplex) {
        let outPoly = new MyPolygon();
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
//# sourceMappingURL=polygonNamespace.js.map