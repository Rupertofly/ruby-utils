"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Capturer = /** @class */ (function (_super) {
    __extends(Capturer, _super);
    function Capturer(opts) {
        var _this = _super.call(this, opts) || this;
        _this.isStarted = false;
        _this.complete = false;
        _this.frameNum = 0;
        if (!CCapture)
            throw new Error('No CCapture detected');
        _this.len = opts.len;
        _this.isFinite = opts.len > 0;
        _this.target = opts.target;
        return _this;
    }
    Capturer.prototype.saveFrame = function () {
        if (this.complete)
            return;
        if (!this.isStarted) {
            this.start();
            this.isStarted = true;
        }
        this.capture(this.target);
        if (this.isFinite && this.frameNum === this.len) {
            this.stopCapture();
            return;
        }
        this.frameNum++;
        return;
    };
    Capturer.prototype.saveFinalFrame = function () {
        if (this.complete)
            return;
        this.saveFrame();
        this.stopCapture();
    };
    Capturer.prototype.stopCapture = function () {
        if (this.complete)
            return;
    };
    return Capturer;
}(CCapture));
exports.default = Capturer;
