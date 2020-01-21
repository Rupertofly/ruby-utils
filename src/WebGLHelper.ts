import * as regl from 'regl';
type glPrim = string | number | number[] | number[][] | regl.Texture2D;
type propFunc<T> = (p: T) => glPrim;
interface newActionOptions<Props> {
  uniforms?: { [uf: string]: glPrim | propFunc<Props> };
  attributes?: { [uf: string]: glPrim | propFunc<Props> };
  framebuffer?: { [uf: string]: glPrim | propFunc<Props> };
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
  ) => regl.DrawCommand<regl.DefaultContext, Props> = (opts, frag, vert) => {
    return reglInstance({});
  };
}
