precision highp float;

uniform float u_opacity;
uniform sampler2D u_msdf;
uniform vec3 u_fgColor;
uniform vec3 u_bgColor;
varying vec2 texCoord;

float median(float r, float g, float b) {
     return max(min(r, g), min(max(r, g), b));
}

void main() {
     vec3 msd = texture2D(u_msdf, texCoord).rgb;
     gl_FragColor = vec4(msd, 1.0);
}