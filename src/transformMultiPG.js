"use strict";
exports.__esModule = true;
function isLoop(pg) {
    if (typeof pg[0][0] === 'number') {
        return true;
    }
    else {
        return false;
    }
}
function transformMultiPG(pg, callback) {
    if (isLoop(pg)) {
        return pg.map(function (vector, vecIndex) {
            return vector.map(function (value, valueIndex) {
                return callback(value, valueIndex, vecIndex);
            });
        });
    }
    else {
        return pg.map(function (loop, loopIndex) {
            return loop.map(function (vector, vecIndex) {
                return vector.map(function (value, valueIndex) {
                    return callback(value, valueIndex, vecIndex, loopIndex);
                });
            });
        });
    }
}
exports.transformMultiPG = transformMultiPG;
