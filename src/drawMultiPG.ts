type point = [number, number];
type loop = point[];
type loops = loop[];
function _drawPG(
  pg: loop,
  context: CanvasRenderingContext2D,
  closed: boolean = true
) {
  context.moveTo(...pg[0]);
  for (let i = 1; i < pg.length; i++) {
    context.lineTo(...pg[1]);
  }
  closed && context.closePath();
}
export function drawPG(
  pg: loop,
  context: CanvasRenderingContext2D,
  closed: boolean = true
) {
  context.beginPath();
  _drawPG(pg, context, closed);
}
export function drawMultiPG(pg: loops, context: CanvasRenderingContext2D) {
  context.beginPath();
  pg.map(lp => _drawPG(lp, context, true));
}
