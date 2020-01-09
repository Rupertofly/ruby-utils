declare type ipt = {
    x: number;
    y: number;
};
/**
 * Draws a polygon with rounded corners
 * @param {CanvasRenderingContext2D} ctx The canvas context
 * @param {Array} points A list of `{x, y}` points
 * @radius {number} how much to round the corners
 */
export declare function myRoundPolly(ctx: CanvasRenderingContext2D, points: ipt[], radius: number): void;
export {};
