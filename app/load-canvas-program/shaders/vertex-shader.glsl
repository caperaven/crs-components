attribute vec2 uv;
attribute vec4 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
varying vec2 texCoord;

void main() {
    texCoord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * position;
}