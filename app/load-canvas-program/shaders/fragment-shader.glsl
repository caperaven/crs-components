precision highp float;

uniform sampler2D u_map;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
varying vec2 v_uv;

void main() {
     vec3 color = mix(u_colorA, u_colorB, v_uv.x);
     gl_FragColor = vec4(vec3(color), 1.0);
}