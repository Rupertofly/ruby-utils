interface CapOpts extends ICCaptureOptions {
    len: number;
    target: HTMLCanvasElement | HTMLElement;
}
export default class Capturer extends CCapture {
    len: number;
    isFinite: boolean;
    isStarted: boolean;
    target: HTMLElement;
    complete: boolean;
    frameNum: number;
    constructor(opts: CapOpts);
    saveFrame(): void;
    saveFinalFrame(): void;
    stopCapture(): void;
}
export {};
