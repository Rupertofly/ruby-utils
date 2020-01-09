"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3_1 = require("d3");
/**
 * Draws a polygon with rounded corners
 * @param {CanvasRenderingContext2D} ctx The canvas context
 * @param {Array} points A list of `{x, y}` points
 * @radius {number} how much to round the corners
 */
function myRoundPolly(ctx, points, radius) {
    const distance = (p1, p2) => Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
    const lerp = (a, b, x) => a + (b - a) * x;
    const lerp2D = (p1, p2, t) => ({
        x: lerp(p1.x, p2.x, t),
        y: lerp(p1.y, p2.y, t),
    });
    const numPoints = points.length;
    let corners = [];
    for (let i of d3_1.range(numPoints)) {
        let lastPoint = points[i];
        let thisPoint = points[(i + 1) % numPoints];
        let nextPoint = points[(i + 2) % numPoints];
        let lastEdgeLength = distance(lastPoint, thisPoint);
        let lastOffsetDistance = Math.min(lastEdgeLength / 2, radius);
        let start = lerp2D(thisPoint, lastPoint, lastOffsetDistance / lastEdgeLength);
        let nextEdgeLength = distance(nextPoint, thisPoint);
        let nextOffsetDistance = Math.min(nextEdgeLength / 2, radius);
        let end = lerp2D(thisPoint, nextPoint, nextOffsetDistance / nextEdgeLength);
        corners.push([start, thisPoint, end]);
    }
    ctx.moveTo(corners[0][0].x, corners[0][0].y);
    for (let [start, ctrl, end] of corners) {
        ctx.lineTo(start.x, start.y);
        ctx.quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y);
    }
    ctx.closePath();
}
exports.myRoundPolly = myRoundPolly;
