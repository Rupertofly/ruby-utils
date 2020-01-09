declare type inputPoint = {
    x: number;
    y: number;
    radius?: number;
};
export declare function roundedPoly(ctx: CanvasRenderingContext2D, points: inputPoint[], radiusAll: number): void;
export {};
