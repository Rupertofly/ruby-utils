"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var simplex_noise_1 = __importDefault(require("simplex-noise"));
var p5 = new simplex_noise_1.default();
var Noise = /** @class */ (function () {
    function Noise() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (typeof args[0] !== 'function') {
            this.thisFunc = function (x, y) { return p5.noise2D(x, y); };
            this._isSn = true;
        }
        else {
            this.thisFunc = args[0];
            this._isSn = false;
        }
        this.diam = args[1];
        this.xCen = Math.floor(Math.random() * 1000);
        this.yCen = Math.floor(Math.random() * 1000);
    }
    Object.defineProperty(Noise.prototype, "isSN", {
        get: function () {
            return this._isSn;
        },
        enumerable: true,
        configurable: true
    });
    Noise.prototype.get = function (t) {
        var a = t * Math.PI * 2;
        var x = this.xCen + this.diam * Math.cos(a);
        var y = this.yCen + this.diam * Math.sin(a);
        return this.thisFunc(x, y);
    };
    return Noise;
}());
exports.default = Noise;
