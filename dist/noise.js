"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simplex_noise_1 = __importDefault(require("simplex-noise"));
let p5 = new simplex_noise_1.default();
class Noise {
    constructor(...args) {
        if (typeof args[0] !== 'function') {
            this.thisFunc = (x, y) => p5.noise2D(x, y);
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
    get isSN() {
        return this._isSn;
    }
    get(t) {
        let a = t * Math.PI * 2;
        let x = this.xCen + this.diam * Math.cos(a);
        let y = this.yCen + this.diam * Math.sin(a);
        return this.thisFunc(x, y);
    }
}
exports.default = Noise;
