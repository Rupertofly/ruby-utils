"use strict";
exports.__esModule = true;
function _drawPG(pg, context, closed) {
    if (closed === void 0) { closed = true; }
    context.moveTo.apply(context, pg[0]);
    for (var i = 1; i < pg.length; i++) {
        context.lineTo.apply(context, pg[i]);
    }
    closed && context.closePath();
}
function drawPG(pg, context, closed) {
    if (closed === void 0) { closed = true; }
    context.beginPath();
    _drawPG(pg, context, closed);
}
exports.drawPG = drawPG;
function drawMultiPG(pg, context) {
    context.beginPath();
    pg.map(function (lp) { return _drawPG(lp, context, true); });
}
exports.drawMultiPG = drawMultiPG;
