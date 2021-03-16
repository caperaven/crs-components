in vec2 uv;
in vec4 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
out vec2 texCoord;

void main() {
    texCoord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * position;
}