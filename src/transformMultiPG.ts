type point = [number, number];
type loop = point[];
type loops = loop[];
type callbackfunction = (
  value: number,
  vecIndex: number,
  loopIndex: number,
  loopsIndex?: number
) => number;
type loopy = loop | loops;
function isLoop(pg: loopy): pg is loop {
  if (typeof pg[0][0] === 'number') {
    return true;
  } else {
    return false;
  }
}
export function transformMultiPG(pg: loop, callback: callbackfunction): loop;
export function transformMultiPG(pg: loops, callback: callbackfunction): loops;
export function transformMultiPG(
  pg: loop | loops,
  callback: callbackfunction
): loop | loops {
  if (isLoop(pg)) {
    return pg.map(
      (vector, vecIndex) =>
        vector.map((value, valueIndex) =>
          callback(value, valueIndex, vecIndex)
        ) as point
    ) as loop;
  } else {
    return pg.map((loop, loopIndex) =>
      loop.map((vector, vecIndex) =>
        vector.map((value, valueIndex) =>
          callback(value, valueIndex, vecIndex, loopIndex)
        )
      )
    ) as loops;
  }
}
