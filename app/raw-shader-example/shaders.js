export const fragmentShader = [
"precision highp float;",
"precision highp int;",
"uniform vec3 colorA;",
"uniform vec3 colorB;",
"uniform float time;",
"uniform sampler2D map;",
"varying vec2 vUv;",
"",
"void main() {",
"    vec3 color = mix(colorA, colorB, vUv.x);",
"    gl_FragColor = vec4(vec3(color), 1.0);",
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