"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Capturer extends CCapture {
    constructor(opts) {
        super(opts);
        this.isStarted = false;
        this.complete = false;
        this.frameNum = 0;
        if (!CCapture)
            throw new Error('No CCapture detected');
        this.len = opts.len;
        this.isFinite = opts.len > 0;
        this.target = opts.target;
    }
    saveFrame() {
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
    }
    saveFinalFrame() {
        if (this.complete)
            return;
        this.saveFrame();
        this.stopCapture();
    }
    stopCapture() {
        if (this.complete)
            return;
    }
}
exports.default = Capturer;
//# sourceMappingURL=CCapture.js.map