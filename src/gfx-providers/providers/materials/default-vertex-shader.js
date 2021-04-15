export const defaultVertexShader = [
"attribute vec2 uv;",
"attribute vec4 position;",
"uniform mat4 projectionMatrix;",
"uniform mat4 modelViewMatrix;",
"varying vec2 texCoord;",
"",
"void main() {",
"    texCoord = uv;",
"    gl_Position = projectionMatrix * modelViewMatrix * position;",
"}"
].join("\n");

export const defaultVertexShader3 = [
    "in vec2 uv;",
    "in vec4 position;",
    "uniform mat4 projectionMatrix;",
    "uniform mat4 modelViewMatrix;",
    "out vec2 texCoord;",
    "",
    "void main() {",
    "    texCoord = uv;",
    "    gl_Position = projectionMatrix * modelViewMatrix * position;",
    "}"
].join("\n");