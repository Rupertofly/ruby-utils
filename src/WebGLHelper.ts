import * as regl from 'regl';
type glPrim =
  | string
  | number
  | number[]
  | number[][]
  | regl.Texture2D
  | regl.Framebuffer2D;
type propFunc<T> = (c: regl.DefaultContext, p: T) => glPrim;
interface newActionOptions<Props> {
  uniforms?: { [uf: string]: glPrim | propFunc<Props> };
  attributes?: { [uf: string]: glPrim | propFunc<Props> };
  framebuffer?: glPrim | propFunc<Props>;
  primitive?: regl.PrimitiveType;
  count?: number;
}
interface ReglUtilities {
  gl: regl.Regl;
  newAction: <Props>(
    options: newActionOptions<Props>,
    frag: string
  ) => regl.DrawCommand<regl.DefaultContext, Props>;
}

export function useRegl(
  instance: regl.Regl | HTMLCanvasElement
): ReglUtilities {
  let isCanvas = false;
  if ((instance as HTMLCanvasElement).tagName !== undefined) {
    isCanvas = true;
  }
  const reglInstance = isCanvas
    ? regl.default(instance as HTMLCanvasElement)
    : (instance as regl.Regl);
  const newAction: <Props>(
    options: newActionOptions<Props>,
    frag: string,
    vert?: string
  ) => regl.DrawCommand<regl.DefaultContext, Props> = <Props>(
    opts: newActionOptions<Props>,
    frag,
    vert
  ) => {
    const hasAttr = opts.attributes !== undefined;
    const hasUnif = opts.uniforms !== undefined;
    const hasFb = opts.framebuffer !== undefined;
    const attrIsF =
      typeof opts.attributes === 'function'
        ? (opts.attributes as regl.Texture2D).height !== undefined
          ? true
          : false
        : false;
    const workingUnif: { [u: string]: glPrim | propFunc<Props> } = {
      resolution: c => [c.drawingBufferWidth, c.drawingBufferHeight],
    };
    if (hasUnif) {
      Object.keys(opts.uniforms!).map(key => {
        workingUnif[key] = opts.uniforms![key];
      });
    }

    const workingFunc = reglInstance({
      attributes: {
        position: hasAttr
          ? attrIsF
            ? opts.attributes
            : reglInstance.buffer(opts.attributes as any)
          : reglInstance.buffer([
              [-1, -1],
              [1, -1],
              [-1, 1],
              [1, 1],
            ]),
      },
      primitive: opts.primitive ?? 'triangle strip',
      count: opts.count ?? 4,
      vert:
        vert ||
        `precision mediump float;
            attribute vec2 position;
            varying vec2 adjUV;
            void main() {
              gl_Position = vec4(position,0.,1.);
              vec2 adjustedUV = 0.5 + (position/2.);
              adjUV = vec2(adjustedUV.x,abs(adjustedUV.y - 1.));
      }`,
      frag: frag,
      uniforms: workingUnif as any,
      framebuffer: (opts.framebuffer as any) ?? null,
    });
    return workingFunc as any;
  };
  return { gl: reglInstance, newAction };
}
