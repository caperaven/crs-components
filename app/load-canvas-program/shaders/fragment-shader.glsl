precision highp float;

uniform sampler2D u_map;
uniform vec3 u_fgColor;
uniform vec3 u_bgColor;
in vec2 v_uv;
out vec4 color;

void main() {
     float a = fwidth(1.0);
     color = vec4(1.0, 0.0, 0.0, 1.0);
}