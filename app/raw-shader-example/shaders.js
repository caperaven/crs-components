export const fragmentShader = [
"precision highp float;",
"precision highp int;",
"varying vec2 vUv;",
"",
"void main() {",
"    gl_FragColor = vec4(vUv.x, 0.0, 1.0, 1.0);",
"}"].join("\n");

export const vertexShader = [
"uniform mat4 modelViewMatrix;",
"uniform mat4 projectionMatrix;",
"attribute vec3 position;",
"attribute vec2 uv;",
"varying vec2 vUv;",
"",
"void main() {",
"    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
"    vUv = uv;",
"}"].join("\n");