precision highp float;

uniform sampler2D u_map;
varying vec2 v_uv;

void main() {
     vec4 tex = texture2D(u_map, v_uv.xy);
     gl_FragColor = tex;
}