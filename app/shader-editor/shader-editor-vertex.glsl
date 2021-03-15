varying vec2 uva;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    uva = uv;
}