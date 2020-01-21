"use strict";
exports.__esModule = true;
var d3_1 = require("d3");
/**
 * Draws a polygon with rounded corners
 * @param {CanvasRenderingContext2D} ctx The canvas context
 * @param {Array} points A list of `{x, y}` points
 * @radius {number} how much to round the corners
 */
function myRoundPolly(ctx, points, radius) {
    var distance = function (p1, p2) {
        return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
    };
    var lerp = function (a, b, x) { return a + (b - a) * x; };
    var lerp2D = function (p1, p2, t) {
        return ({
            x: lerp(p1.x, p2.x, t),
            y: lerp(p1.y, p2.y, t)
        });
    };
    var numPoints = points.length;
    var corners = [];
    for (var _i = 0, _a = d3_1.range(numPoints); _i < _a.length; _i++) {
        var i = _a[_i];
        var lastPoint = points[i];
        var thisPoint = points[(i + 1) % numPoints];
        var nextPoint = points[(i + 2) % numPoints];
        var lastEdgeLength = distance(lastPoint, thisPoint);
        var lastOffsetDistance = Math.min(lastEdgeLength / 2, radius);
        var start = lerp2D(thisPoint, lastPoint, lastOffsetDistance / lastEdgeLength);
        var nextEdgeLength = distance(nextPoint, thisPoint);
        var nextOffsetDistance = Math.min(nextEdgeLength / 2, radius);
        var end = lerp2D(thisPoint, nextPoint, nextOffsetDistance / nextEdgeLength);
        corners.push([start, thisPoint, end]);
    }
    ctx.moveTo(corners[0][0].x, corners[0][0].y);
    for (var _b = 0, corners_1 = corners; _b < corners_1.length; _b++) {
        var _c = corners_1[_b], start = _c[0], ctrl = _c[1], end = _c[2];
        ctx.lineTo(start.x, start.y);
        ctx.quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y);
    }
    ctx.closePath();
}
exports.myRoundPolly = myRoundPolly;
