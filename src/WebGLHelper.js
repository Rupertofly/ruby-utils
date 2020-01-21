"use strict";
exports.__esModule = true;
var regl = require("regl");
function useRegl(instance) {
    var isCanvas = false;
    if (instance.tagName !== undefined) {
        isCanvas = true;
    }
    var reglInstance = isCanvas
        ? regl["default"](instance)
        : instance;
    var newAction = function (opts, frag, vert) {
        var _a, _b, _c;
        var hasAttr = opts.attributes !== undefined;
        var hasUnif = opts.uniforms !== undefined;
        var hasFb = opts.framebuffer !== undefined;
        var attrIsF = typeof opts.attributes === 'function'
            ? opts.attributes.height !== undefined
                ? true
                : false
            : false;
        var workingUnif = {
            resolution: function (c) { return [c.drawingBufferWidth, c.drawingBufferHeight]; }
        };
        if (hasUnif) {
            Object.keys(opts.uniforms).map(function (key) {
                workingUnif[key] = opts.uniforms[key];
            });
        }
        var workingFunc = reglInstance({
            attributes: {
                position: hasAttr
                    ? attrIsF
                        ? opts.attributes
                        : reglInstance.buffer(opts.attributes)
                    : reglInstance.buffer([
                        [-1, -1],
                        [1, -1],
                        [-1, 1],
                        [1, 1],
                    ])
            },
            primitive: (_a = opts.primitive, (_a !== null && _a !== void 0 ? _a : 'triangle strip')),
            count: (_b = opts.count, (_b !== null && _b !== void 0 ? _b : 4)),
            vert: vert ||
                "precision mediump float;\n            attribute vec2 position;\n            varying vec2 adjUV;\n            void main() {\n              gl_Position = vec4(position,0.,1.);\n              vec2 adjustedUV = 0.5 + (position/2.);\n              adjUV = vec2(adjustedUV.x,abs(adjustedUV.y - 1.));\n      }",
            frag: frag,
            uniforms: workingUnif,
            framebuffer: (_c = opts.framebuffer, (_c !== null && _c !== void 0 ? _c : null))
        });
        return workingFunc;
    };
    return { gl: reglInstance, newAction: newAction };
}
exports.useRegl = useRegl;
