import * as glh from '../src/WebGLHelper';
const cv = document.getElementById('cv') as HTMLCanvasElement;
const g = cv.getContext('webgl')!;
let glH = glh.useRegl(cv);
// const myRegl = regl.default(g);
const draw = glH.newAction<{ time: number }>(
  {
    uniforms: {
      time: (c, p) => p.time,
    },
  },
  `precision mediump float;
varying vec2 adjUV;
uniform float time;
void main() {
  gl_FragColor = vec4(mod(time,60.)/60.,0.5,mod(gl_FragCoord.w,16.)/16.,1.);
}
`
);
// const f = myRegl({
//   attributes: {
//     position: myRegl.buffer([
//       [-1, -1],
//       [1, -1],
//       [-1, 1],
//       [1, 1],
//     ]),
//   },
//   primitive: 'triangle strip',
//   count: 4,
//   vert: `precision mediump float;
//         attribute vec2 position;
//         varying vec2 adjUV;
//         void main() {
//           gl_Position = vec4(position,0.,1.);
//           vec2 adjustedUV = 0.5 + (position/2.);
//           adjUV = vec2(adjustedUV.x,abs(adjustedUV.y - 1.));
//   }`,
//   frag: `precision mediump float;
//             varying vec2 uv;
//             void main() {
//               gl_FragColor = vec4(abs(atan((uv.y-0.5),(uv.x-0.5))/1.),0.5,mod(gl_FragCoord.w,16.)/16.,1.);
//             }
//   `,
// });
// f();
let t = 0;
const render = () => {
  draw({ time: t });
  t++;
  requestAnimationFrame(render);
};
requestAnimationFrame(render);
